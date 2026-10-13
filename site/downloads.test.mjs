import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createDownloadCounter } from './downloads.mjs';

const day = 24 * 60 * 60 * 1000;
const now = 1_800_000_000_000;
const openCount = (count) => new Response(JSON.stringify({ namespace: 'viraj-s15', name: 'oxocarbon-grey', downloadCount: count }), { status: 200 });
const marketplaceCount = (count, install = 999) => new Response(JSON.stringify({ results: [{ extensions: [{ extensionName: 'oxocarbon-grey', publisher: { publisherName: 'viraj-s15' }, statistics: [{ statisticName: 'install', value: install }, { statisticName: 'downloadCount', value: count }] }] }] }), { status: 200 });

function storage(entries = {}) {
  const values = new Map(Object.entries(entries));
  return { values, getItem(key) { return values.get(key) ?? null; }, setItem(key, value) { values.set(key, value); } };
}
function responseFor(registry, count) { return registry === 'openvsx' ? openCount(count) : marketplaceCount(count); }

test('fetches both independent registry counts once, including zero, and persists successes', async () => {
  const store = storage();
  const calls = [];
  const counter = createDownloadCounter({ storage: store, now: () => now, fetch: async (url, options) => { calls.push([url, options]); return responseFor(url.includes('open-vsx') ? 'openvsx' : 'marketplace', 0); } });
  assert.deepEqual(await Promise.all(['openvsx', 'marketplace'].map((registry) => counter.getCount(registry))), [0, 0]);
  assert.equal(calls.length, 2);
  assert.deepEqual(JSON.parse(store.getItem('oxocarbon-grey:downloads:v1:openvsx')), { count: 0, fetchedAt: now });
  assert.deepEqual(JSON.parse(store.getItem('oxocarbon-grey:downloads:v1:marketplace')), { count: 0, fetchedAt: now });
});

test('fresh cache survives a new counter instance without requests; expiry is exact', async () => {
  const store = storage({ 'oxocarbon-grey:downloads:v1:openvsx': JSON.stringify({ count: 42, fetchedAt: now }) });
  let calls = 0;
  const fetch = async () => { calls++; return openCount(43); };
  assert.equal(await createDownloadCounter({ storage: store, now: () => now + day - 1, fetch }).getCount('openvsx'), 42);
  assert.equal(calls, 0);
  assert.equal(await createDownloadCounter({ storage: store, now: () => now + day, fetch }).getCount('openvsx'), 43);
  assert.equal(calls, 1);
});

test('an expired successful value is not returned after a failed refresh and is not retried', async () => {
  const store = storage({ 'oxocarbon-grey:downloads:v1:openvsx': JSON.stringify({ count: 42, fetchedAt: now - day }) });
  let calls = 0;
  const counter = createDownloadCounter({ storage: store, now: () => now, fetch: async () => { calls++; throw new Error('offline'); } });
  assert.equal(await counter.getCount('openvsx'), null);
  assert.equal(await counter.getCount('openvsx'), null);
  assert.equal(calls, 1);
});

test('validates corrupt/future cache data and safely falls back when storage throws', async () => {
  for (const cached of ['{bad', JSON.stringify({ count: -1, fetchedAt: now }), JSON.stringify({ count: 2, fetchedAt: now + 1 }), JSON.stringify({ count: 1.5, fetchedAt: now })]) {
    const store = storage({ 'oxocarbon-grey:downloads:v1:openvsx': cached });
    let calls = 0;
    assert.equal(await createDownloadCounter({ storage: store, now: () => now, fetch: async () => { calls++; return openCount(7); } }).getCount('openvsx'), 7);
    assert.equal(calls, 1);
  }
  let calls = 0;
  const brokenStorage = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  const counter = createDownloadCounter({ storage: brokenStorage, now: () => now, fetch: async () => { calls++; return openCount(8); } });
  assert.equal(await counter.getCount('openvsx'), 8);
  assert.equal(await counter.getCount('openvsx'), 8);
  assert.equal(calls, 1);
});

test('rejects bad HTTP, JSON, counts, and registry identity without retry', async (t) => {
  const invalid = [
    () => new Response('{}', { status: 503 }),
    () => new Response('{bad', { status: 200 }),
    () => openCount(-1), () => openCount(1.5), () => openCount(Number.MAX_SAFE_INTEGER + 1),
    () => new Response(JSON.stringify({ namespace: 'someone-else', name: 'oxocarbon-grey', downloadCount: 2 }), { status: 200 }),
    () => new Response(JSON.stringify({ namespace: 'viraj-s15', name: 'other', downloadCount: 2 }), { status: 200 }),
  ];
  for (const makeResponse of invalid) await t.test(String(invalid.indexOf(makeResponse)), async () => {
    let calls = 0;
    const counter = createDownloadCounter({ storage: storage(), now: () => now, fetch: async () => { calls++; return makeResponse(); } });
    assert.equal(await counter.getCount('openvsx'), null);
    assert.equal(await counter.getCount('openvsx'), null);
    assert.equal(calls, 1);
  });
  for (const bad of [-1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    const counter = createDownloadCounter({ storage: storage(), now: () => now, fetch: async () => marketplaceCount(bad) });
    assert.equal(await counter.getCount('marketplace'), null);
  }
  const wrong = createDownloadCounter({ storage: storage(), now: () => now, fetch: async () => new Response(JSON.stringify({ results: [{ extensions: [{ extensionName: 'other', publisher: { publisherName: 'viraj-s15' }, statistics: [{ statisticName: 'downloadCount', value: 4 }] }] }] })) });
  assert.equal(await wrong.getCount('marketplace'), null);
});

test('Marketplace request uses the API contract and chooses downloadCount, not install', async () => {
  let request;
  const counter = createDownloadCounter({ storage: storage(), now: () => now, fetch: async (url, options) => { request = [url, options]; return marketplaceCount(123, 9876); } });
  assert.equal(await counter.getCount('marketplace'), 123);
  assert.equal(request[0], 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery');
  assert.equal(request[1].method, 'POST');
  assert.equal(request[1].headers['Content-Type'], 'application/json');
  assert.equal(request[1].headers.Accept, 'application/json;api-version=7.2-preview.1');
  assert.deepEqual(JSON.parse(request[1].body), { filters: [{ criteria: [{ filterType: 7, value: 'viraj-s15.oxocarbon-grey' }] }], flags: 256 });
});

test('request and response-body failures return null; timeout signal is provided and timer cleared', async () => {
  let calls = 0;
  const timeout = createDownloadCounter({ storage: storage(), now: () => now, timeoutMs: 10, fetch: async (_url, options) => { calls++; assert.ok(options.signal); throw Error('network'); } });
  assert.equal(await timeout.getCount('openvsx'), null);
  assert.equal(calls, 1);
  const badBody = createDownloadCounter({ storage: storage(), now: () => now, fetch: async () => ({ ok: true, json: async () => { throw Error('body'); } }) });
  assert.equal(await badBody.getCount('openvsx'), null);
});

test('aborts an unresolved request at its timeout', async () => {
  let signal;
  const counter = createDownloadCounter({ storage: storage(), now: () => now, timeoutMs: 5, fetch: async (_url, options) => {
    signal = options.signal;
    return new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true }));
  } });
  assert.equal(await counter.getCount('openvsx'), null);
  assert.equal(signal.aborted, true);
});

test('aborts a hung response body at its timeout', async () => {
  let signal;
  const counter = createDownloadCounter({ storage: storage(), now: () => now, timeoutMs: 5, fetch: async (_url, options) => {
    signal = options.signal;
    return { ok: true, json: () => new Promise(() => {}) };
  } });
  assert.equal(await counter.getCount('openvsx'), null);
  assert.equal(signal.aborted, true);
});

test('rejects missing, string, null, and non-finite response counts without caching failures', async (t) => {
  const invalidValues = [undefined, '12', null, Number.NaN];
  for (const value of invalidValues) await t.test(String(value), async () => {
    const store = storage();
    const counter = createDownloadCounter({ storage: store, now: () => now, fetch: async () => ({ ok: true, json: async () => ({ namespace: 'viraj-s15', name: 'oxocarbon-grey', downloadCount: value }) }) });
    assert.equal(await counter.getCount('openvsx'), null);
    assert.deepEqual([...store.values], []);
  });
});

test('rejects cache entries with missing or invalid fetchedAt and fetches again', async (t) => {
  for (const value of [{ count: 5 }, { count: 5, fetchedAt: '1800000000000' }, { count: 5, fetchedAt: null }, { count: 5, fetchedAt: Number.NaN }]) {
    await t.test(JSON.stringify(value), async () => {
      const key = 'oxocarbon-grey:downloads:v1:openvsx';
      const store = storage({ [key]: JSON.stringify(value) });
      let calls = 0;
      assert.equal(await createDownloadCounter({ storage: store, now: () => now, fetch: async () => { calls++; return openCount(9); } }).getCount('openvsx'), 9);
      assert.equal(calls, 1);
      assert.deepEqual(JSON.parse(store.getItem(key)), { count: 9, fetchedAt: now });
    });
  }
});

test('Marketplace rejects a mismatched publisher', async () => {
  const counter = createDownloadCounter({ storage: storage(), now: () => now, fetch: async () => new Response(JSON.stringify({ results: [{ extensions: [{ extensionName: 'oxocarbon-grey', publisher: { publisherName: 'someone-else' }, statistics: [{ statisticName: 'downloadCount', value: 4 }] }] }] })) });
  assert.equal(await counter.getCount('marketplace'), null);
});

test('failed refresh does not alter expired storage and independent registries settle separately', async () => {
  const openKey = 'oxocarbon-grey:downloads:v1:openvsx';
  const store = storage({ [openKey]: JSON.stringify({ count: 42, fetchedAt: now - day }) });
  const original = store.getItem(openKey);
  const counter = createDownloadCounter({ storage: store, now: () => now, fetch: async (url) => {
    if (url.includes('open-vsx')) throw new Error('offline');
    return marketplaceCount(7);
  } });
  assert.deepEqual(await Promise.all([counter.getCount('openvsx'), counter.getCount('marketplace')]), [null, 7]);
  assert.equal(store.getItem(openKey), original);
  assert.equal(store.getItem('oxocarbon-grey:downloads:v1:marketplace'), JSON.stringify({ count: 7, fetchedAt: now }));
});

async function runEntry({ cached = {}, fetchImpl, localStorage = storage(cached), throwLocalStorage = false, elementValues = {} }) {
  const elements = Object.fromEntries(['openvsx', 'marketplace'].map((name) => [name, { hidden: false, textContent: 'original', ...elementValues[name] }]));
  const descriptors = new Map(['window', 'document', 'fetch'].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const source = (await readFile(new URL('./downloads.js', import.meta.url), 'utf8'))
    .replace("'./downloads.mjs'", JSON.stringify(pathToFileURL(new URL('./downloads.mjs', import.meta.url).pathname).href));
  try {
    const windowStub = {};
    Object.defineProperty(windowStub, 'localStorage', { get() { if (throwLocalStorage) throw new Error('blocked'); return localStorage; } });
    Object.defineProperty(globalThis, 'window', { configurable: true, value: windowStub });
    Object.defineProperty(globalThis, 'document', { configurable: true, value: { querySelector: (selector) => elements[selector.match(/data-downloads="([^"]+)/)?.[1]] ?? null } });
    Object.defineProperty(globalThis, 'fetch', { configurable: true, value: fetchImpl });
    await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}#${Math.random()}`);
    await new Promise((resolve) => setTimeout(resolve, 0));
    return elements;
  } finally {
    for (const [key, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
}

test('actual browser entry renders successful and zero counts and skips fresh cached fetches', async () => {
  const values = {
    'oxocarbon-grey:downloads:v1:openvsx': JSON.stringify({ count: 1234, fetchedAt: Date.now() }),
    'oxocarbon-grey:downloads:v1:marketplace': JSON.stringify({ count: 0, fetchedAt: Date.now() }),
  };
  let calls = 0;
  const elements = await runEntry({ cached: values, fetchImpl: async () => { calls++; throw new Error('should use fresh cache'); } });
  assert.equal(calls, 0);
  assert.deepEqual(elements.openvsx, { hidden: false, textContent: ' · 1,234 downloads' });
  assert.deepEqual(elements.marketplace, { hidden: false, textContent: ' · 0 downloads' });
});

test('actual browser entry hides expired values while refreshing and after failure', async () => {
  const expired = JSON.stringify({ count: 22, fetchedAt: now - day });
  let resolveFetch;
  const elements = await runEntry({ cached: { 'oxocarbon-grey:downloads:v1:openvsx': expired }, elementValues: { openvsx: { hidden: true } }, fetchImpl: (url) => url.includes('open-vsx') ? new Promise((resolve) => { resolveFetch = resolve; }) : Promise.reject(new Error('offline')) });
  assert.equal(elements.openvsx.hidden, true);
  assert.equal(elements.openvsx.textContent, 'original');
  resolveFetch({ ok: false, status: 503 });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(elements.openvsx.hidden, true);
});

test('actual browser entry updates marketplace independently when Open VSX fails', async () => {
  const elements = await runEntry({ fetchImpl: async (url) => url.includes('open-vsx') ? { ok: false, status: 503 } : marketplaceCount(8) });
  assert.equal(elements.openvsx.hidden, true);
  assert.equal(elements.marketplace.textContent, ' · 8 downloads');
  assert.equal(elements.marketplace.hidden, false);
});

test('actual browser entry survives a throwing localStorage property getter', async () => {
  const elements = await runEntry({ throwLocalStorage: true, fetchImpl: async () => openCount(3) });
  assert.equal(elements.openvsx.textContent, ' · 3 downloads');
});

test('rejects unsupported registries', async () => {
  const counter = createDownloadCounter({ fetch: async () => openCount(1) });
  await assert.rejects(counter.getCount('other'), /registry/);
});
