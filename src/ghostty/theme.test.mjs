import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { grey, accent, ansi } from '../palette.mjs';
import { order, render } from './theme.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const committed = readFileSync(join(root, 'ghostty/oxocarbon-grey'), 'utf8');
const allowed = ['background', 'foreground', 'cursor-color', 'cursor-text', 'selection-background', 'selection-foreground', 'palette'];

const parse = (text) =>
  text
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const match = line.match(/^([a-z-]+) = (.+)$/);
      assert.ok(match, `not a "key = value" line: ${line}`);
      return [match[1], match[2]];
    });

test('the theme sets only colour keys, each once, as #rrggbb', () => {
  const entries = parse(committed);
  for (const [key, value] of entries) {
    assert.ok(allowed.includes(key), `unexpected key ${key}`);
    assert.match(value, key === 'palette' ? /^\d+=#[0-9a-f]{6}$/ : /^#[0-9a-f]{6}$/, `${key} = ${value}`);
  }
  const single = entries.filter(([key]) => key !== 'palette').map(([key]) => key);
  assert.deepEqual(single.toSorted(), allowed.filter((key) => key !== 'palette').toSorted());
});

test('the palette has exactly 16 entries, 0 to 15, in ANSI order', () => {
  const palette = parse(committed)
    .filter(([key]) => key === 'palette')
    .map(([, value]) => value.split('='));
  assert.deepEqual(
    palette.map(([i]) => Number(i)),
    [...Array(16).keys()],
  );
  assert.deepEqual(
    palette.map(([, hex]) => hex),
    order.map((name) => ansi[name]),
  );
  assert.deepEqual(order.slice(0, 8), ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']);
  assert.deepEqual(order.slice(8), order.slice(0, 8).map((name) => `bright${name[0].toUpperCase()}${name.slice(1)}`));
  assert.equal(palette[3][1], accent.purple);
  assert.equal(palette[11][1], accent.purple);
});

test('cursor and selection follow the VS Code terminal colours', () => {
  const values = Object.fromEntries(parse(committed).filter(([key]) => key !== 'palette'));
  assert.equal(values.background, grey.bg);
  assert.equal(values.foreground, grey.fg);
  assert.equal(values['cursor-color'], grey.fg);
  assert.equal(values['cursor-text'], grey.bg);
  assert.equal(values['selection-background'], '#2e384c');
  assert.equal(values['selection-foreground'], grey.white);
});

test('the output is deterministic and matches the committed file', () => {
  assert.equal(render(), render());
  assert.equal(committed, render());
});

test('--check fails when the committed file is stale or missing', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ghostty-'));
  try {
    cpSync(join(root, 'src'), join(dir, 'src'), { recursive: true });
    cpSync(join(root, 'ghostty'), join(dir, 'ghostty'), { recursive: true });
    const check = () => spawnSync(process.execPath, [join(dir, 'src/ghostty/build.mjs'), '--check'], { encoding: 'utf8' });
    assert.equal(check().status, 0);
    writeFileSync(join(dir, 'ghostty/oxocarbon-grey'), committed.replace(accent.purple, '#ffff00'));
    let result = check();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /out of date/);
    rmSync(join(dir, 'ghostty/oxocarbon-grey'));
    result = check();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /missing/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
