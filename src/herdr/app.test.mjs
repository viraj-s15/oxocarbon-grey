import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { grey, accent } from '../palette.mjs';
import { contrast } from '../contrast.mjs';
import { render as ghostty } from '../ghostty/theme.mjs';
import { render, theme } from './app.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const committed = JSON.parse(readFileSync(join(root, 'herdr/oxocarbon-grey.json'), 'utf8'));
const hex = /^#[0-9a-f]{6}$/;

// The theme colour names in ~/.config/herdr-app/AGENTS.md, without the terminal and ANSI colours.
const names = [
  'canvas', 'chrome', 'surface', 'popover', 'raised', 'hover', 'selected', 'border', 'input', 'foreground',
  'muted', 'dim', 'accent', 'accent_foreground', 'solid', 'solid_foreground', 'working', 'blocked', 'done',
  'idle', 'unknown',
];

test('the file has the herdr-app theme shape, with every colour as #rrggbb', () => {
  assert.deepEqual(Object.keys(committed), ['background', 'foreground', 'selection', 'cursor', 'ansi', 'colors']);
  for (const key of ['background', 'foreground', 'selection', 'cursor']) assert.match(committed[key], hex, key);
  assert.equal(committed.ansi.length, 16);
  for (const color of committed.ansi) assert.match(color, hex);
  assert.deepEqual(Object.keys(committed.colors), names);
  for (const [name, color] of Object.entries(committed.colors)) assert.match(color, hex, name);
});

test('the terminal colours match the Ghostty port', () => {
  const lines = ghostty().split('\n');
  const value = (key) => lines.find((line) => line.startsWith(`${key} = `)).split(' = ')[1];
  assert.equal(theme.background, value('background'));
  assert.equal(theme.foreground, value('foreground'));
  assert.equal(theme.selection, value('selection-background'));
  assert.equal(theme.cursor, value('cursor-color'));
  const palette = lines.filter((line) => line.startsWith('palette = ')).map((line) => line.split('=')[2]);
  assert.deepEqual(theme.ansi, palette);
});

test('the panels follow the VS Code workbench', () => {
  const c = theme.colors;
  assert.equal(c.chrome, grey.bg);
  assert.equal(c.canvas, grey.bg);
  assert.equal(c.popover, grey.bgFloat);
  assert.equal(c.selected, grey.bgSelection);
  assert.equal(c.border, '#26272a');
  assert.equal(c.accent, accent.blue);
  assert.equal(c.working, accent.purple);
});

test('text is readable on every panel surface', () => {
  const c = theme.colors;
  for (const bg of [c.chrome, c.surface, c.popover, c.raised, c.hover, c.selected, theme.selection]) {
    assert.ok(contrast(c.foreground, bg) >= 4.5, `foreground on ${bg}`);
  }
  for (const bg of [c.chrome, c.popover, c.hover]) {
    assert.ok(contrast(c.muted, bg) >= 4.5, `muted on ${bg}: ${contrast(c.muted, bg).toFixed(2)}`);
    assert.ok(contrast(c.dim, bg) >= 3, `dim on ${bg}: ${contrast(c.dim, bg).toFixed(2)}`);
  }
  assert.ok(contrast(c.accent_foreground, c.accent) >= 4.5, 'accent_foreground on accent');
  assert.ok(contrast(c.solid_foreground, c.solid) >= 4.5, 'solid_foreground on solid');
});

// Agent states show as dots and short labels on the sidebar and on selected rows.
test('agent state colours are visible on the sidebar and selected rows', () => {
  const c = theme.colors;
  for (const bg of [c.chrome, c.hover, c.selected]) {
    for (const key of ['working', 'blocked', 'done', 'accent']) {
      assert.ok(contrast(c[key], bg) >= 3, `${key} on ${bg}`);
    }
  }
  for (const key of ['working', 'blocked', 'done']) {
    assert.ok(contrast(c[key], c.chrome) >= 4.5, `${key} on chrome`);
  }
  assert.equal(new Set([c.working, c.blocked, c.done, c.idle]).size, 4, 'each agent state has its own colour');
});

test('the output is deterministic and matches the committed file', () => {
  assert.equal(render(), render());
  assert.equal(readFileSync(join(root, 'herdr/oxocarbon-grey.json'), 'utf8'), render());
});
