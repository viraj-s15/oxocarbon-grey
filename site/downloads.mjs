const ttl = 24 * 60 * 60 * 1000;
const prefix = 'oxocarbon-grey:downloads:v1:';
const identity = 'viraj-s15.oxocarbon-grey';
const endpoints = {
  openvsx: 'https://open-vsx.org/api/viraj-s15/oxocarbon-grey',
  marketplace: 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery',
};

function validCount(count) {
  return Number.isSafeInteger(count) && count >= 0;
}

function parseCount(registry, data) {
  if (registry === 'openvsx') {
    if (data?.namespace !== 'viraj-s15' || data?.name !== 'oxocarbon-grey') throw new Error('Open VSX identity mismatch');
    return data.downloadCount;
  }
  const extension = data?.results?.flatMap((result) => result.extensions ?? []).find((item) =>
    item.extensionName === 'oxocarbon-grey' && item.publisher?.publisherName === 'viraj-s15');
  if (!extension) throw new Error('Marketplace identity mismatch');
  return extension.statistics?.find((item) => item.statisticName === 'downloadCount')?.value;
}

async function request(registry, fetch, timeoutMs) {
  const controller = new AbortController();
  let rejectTimeout;
  const timedOut = new Promise((_, reject) => { rejectTimeout = reject; });
  const timer = setTimeout(() => {
    controller.abort();
    rejectTimeout(new Error('Registry request timed out'));
  }, timeoutMs);
  try {
    const options = { signal: controller.signal };
    if (registry === 'marketplace') {
      options.method = 'POST';
      options.headers = { 'Content-Type': 'application/json', Accept: 'application/json;api-version=7.2-preview.1' };
      options.body = JSON.stringify({ filters: [{ criteria: [{ filterType: 7, value: identity }] }], flags: 256 });
    }
    const response = await Promise.race([(async () => {
      const result = await fetch(endpoints[registry], options);
      if (!result.ok) throw new Error(`Registry returned HTTP ${result.status}`);
      const count = parseCount(registry, await result.json());
      if (!validCount(count)) throw new Error('Invalid download count');
      return count;
    })(), timedOut]);
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export function createDownloadCounter({ fetch: fetcher = globalThis.fetch, storage: suppliedStorage, now = Date.now, timeoutMs = 10_000 } = {}) {
  const memory = new Map();
  const results = new Map();
  const storage = () => {
    try { return typeof suppliedStorage === 'function' ? suppliedStorage() : suppliedStorage; } catch { return null; }
  };

  function read(registry) {
    const key = `${prefix}${registry}`;
    try {
      const raw = storage()?.getItem(key);
      if (raw !== null && raw !== undefined) {
        const value = JSON.parse(raw);
        if (validCount(value?.count) && Number.isFinite(value?.fetchedAt) && value.fetchedAt >= 0 && value.fetchedAt <= now()) {
          memory.set(key, value);
          return value;
        }
      }
    } catch {}
    return memory.get(key) ?? null;
  }

  function write(registry, count, fetchedAt) {
    const key = `${prefix}${registry}`;
    const value = { count, fetchedAt };
    memory.set(key, value);
    try { storage()?.setItem(key, JSON.stringify(value)); } catch {}
  }

  function getCount(registry) {
    if (!Object.hasOwn(endpoints, registry)) return Promise.reject(new Error(`Unsupported registry: ${registry}`));
    if (results.has(registry)) return results.get(registry);
    const promise = (async () => {
      const cached = read(registry);
      const timestamp = now();
      if (cached && timestamp - cached.fetchedAt < ttl) return cached.count;
      try {
        const count = await request(registry, fetcher, timeoutMs);
        write(registry, count, now());
        return count;
      } catch {
        return null;
      }
    })();
    results.set(registry, promise);
    return promise;
  }
  return { getCount };
}
