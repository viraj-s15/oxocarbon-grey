import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

const yaml = Object.fromEntries(
  read('terminalthemes/Oxocarbon Grey.yml')
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const match = line.match(/^([a-z_0-9]+): "(.+)"$/);
      assert.ok(match, `not a 'key: "value"' line: ${line}`);
      return [match[1], match[2]];
    }),
);
const ghostty = Object.fromEntries(
  [...read('ghostty/oxocarbon-grey').matchAll(/^(?:palette = )?([\w-]+)(?: =|=) ?(#[0-9a-f]{6})$/gm)].map((m) => [m[1], m[2]]),
);

test('the file has the name, 16 ANSI colours and the 6 core colours', () => {
  const expected = [
    'name',
    ...Array.from({ length: 16 }, (_, i) => `color_${String(i + 1).padStart(2, '0')}`),
    'cursor', 'cursor_text', 'foreground', 'background', 'selection', 'selection_text',
  ];
  assert.deepEqual(Object.keys(yaml), expected);
  for (const [key, value] of Object.entries(yaml)) {
    if (key !== 'name') assert.match(value, /^#[0-9a-f]{6}$/, `${key}: ${value}`);
  }
});

test('the colours match the Ghostty theme', () => {
  for (let i = 0; i < 16; i++) {
    assert.equal(yaml[`color_${String(i + 1).padStart(2, '0')}`], ghostty[String(i)], `ANSI ${i}`);
  }
  assert.equal(yaml.background, ghostty.background);
  assert.equal(yaml.foreground, ghostty.foreground);
  assert.equal(yaml.cursor, ghostty['cursor-color']);
  assert.equal(yaml.cursor_text, ghostty['cursor-text']);
  assert.equal(yaml.selection, ghostty['selection-background']);
  assert.equal(yaml.selection_text, ghostty['selection-foreground']);
});
