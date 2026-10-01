import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = mkdtempSync(join(tmpdir(), 'site-'));
const out = join(dir, '_site');
execFileSync(process.execPath, [join(root, 'site/build.mjs'), '--out', out]);
const page = readFileSync(join(out, 'index.html'), 'utf8');
process.on('exit', () => rmSync(dir, { recursive: true, force: true }));

test('the Ghostty download is the committed theme, byte for byte', () => {
  assert.deepEqual(readFileSync(join(out, 'ghostty/oxocarbon-grey')), readFileSync(join(root, 'ghostty/oxocarbon-grey')));
  assert.match(page, /<a href="ghostty\/oxocarbon-grey" download>/);
  assert.match(page, /https:\/\/viraj-s15\.github\.io\/oxocarbon-grey\/ghostty\/oxocarbon-grey/);
});

test('local links and assets are relative and exist, so they work under /oxocarbon-grey/', () => {
  const refs = [...page.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  const local = refs.filter((ref) => !/^(https?:|#)/.test(ref));
  assert.ok(local.length >= 4, local.join(' '));
  for (const ref of local) {
    assert.doesNotMatch(ref, /^\/|\.\./, ref);
    assert.ok(existsSync(join(out, ref)), `${ref} is not in the build`);
  }
  for (const ref of refs.filter((ref) => ref.startsWith('#'))) {
    assert.match(page, new RegExp(`id="${ref.slice(1)}"`), ref);
  }
});

test('the page shows all 16 terminal colours', () => {
  assert.equal([...page.matchAll(/<li style="--swatch:var\(--ansi(\d+)\)">/g)].map((m) => Number(m[1])).join(), [...Array(16).keys()].join());
  for (let i = 0; i < 16; i++) assert.match(page, new RegExp(`--ansi${i}:#[0-9a-f]{6};`));
});
