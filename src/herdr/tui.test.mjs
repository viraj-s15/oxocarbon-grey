import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { grey, accent } from '../palette.mjs';
import { contrast } from '../contrast.mjs';
import { colors, render } from './tui.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const committed = readFileSync(join(root, 'herdr/oxocarbon-grey.toml'), 'utf8');

// The fields of CustomThemeColors in herdr's src/config/theme.rs, without the light and dark tables.
const tokens = [
  'accent', 'panel_bg', 'sidebar_bg', 'active_row_bg', 'selection_bg', 'surface0', 'surface1', 'surface_dim',
  'overlay0', 'overlay1', 'text', 'subtext0', 'mauve', 'green', 'yellow', 'red', 'blue', 'teal', 'peach',
];

const parse = (text) => {
  const lines = text.split('\n').filter((line) => line && !line.startsWith('#'));
  assert.equal(lines.shift(), '[theme.custom]');
  return lines.map((line) => {
    const match = line.match(/^([a-z0-9_]+) = "([^"]+)"$/);
    assert.ok(match, `not a 'key = "value"' line: ${line}`);
    return [match[1], match[2]];
  });
};

test('the theme sets every herdr colour token once, as #rrggbb or reset', () => {
  const entries = parse(committed);
  assert.deepEqual(entries.map(([key]) => key), tokens);
  for (const [key, value] of entries) {
    if (key === 'sidebar_bg') assert.equal(value, 'reset');
    else assert.match(value, /^#[0-9a-f]{6}$/, `${key} = ${value}`);
  }
});

// herdr requires these of its built-in themes. The sidebar shows the terminal background, so test that too.
test('active and selection rows pass the contrast rules of the herdr built-in themes', () => {
  for (const background of [colors.panel_bg, grey.bg]) {
    for (const row of [colors.active_row_bg, colors.selection_bg]) {
      assert.ok(contrast(background, row) >= 1.05, `${row} on ${background}`);
      assert.ok(contrast(colors.text, row) >= 3, `text on ${row}`);
    }
  }
  assert.notEqual(colors.selection_bg, colors.active_row_bg);
});

test('text is readable on every surface it appears on', () => {
  for (const bg of [grey.bg, colors.panel_bg, colors.surface0, colors.surface1, colors.active_row_bg, colors.selection_bg]) {
    assert.ok(contrast(colors.text, bg) >= 4.5, `text on ${bg}`);
  }
  for (const bg of [colors.surface0, colors.active_row_bg, colors.selection_bg]) {
    assert.ok(contrast(colors.subtext0, bg) >= 4.5, `subtext0 on ${bg}`);
  }
  for (const bg of [grey.bg, colors.panel_bg]) {
    for (const key of ['subtext0', 'overlay1', 'accent', 'mauve', 'green', 'yellow', 'red', 'blue', 'teal']) {
      assert.ok(contrast(colors[key], bg) >= 4.5, `${key} ${colors[key]} on ${bg}: ${contrast(colors[key], bg).toFixed(2)}`);
    }
    assert.ok(contrast(colors.overlay0, bg) >= 3, `overlay0 on ${bg}`);
  }
});

// Status colours on rows are mostly one-glyph markers, so they need the 3:1 of WCAG 1.4.11.
test('status markers are visible on active and selection rows', () => {
  for (const bg of [colors.active_row_bg, colors.selection_bg]) {
    for (const key of ['accent', 'green', 'yellow', 'red', 'blue', 'teal']) {
      assert.ok(contrast(colors[key], bg) >= 3, `${key} on ${bg}`);
    }
  }
});

// herdr draws panel_bg text on accent, mauve, yellow and red chips, such as the mode badge and the confirm button.
test('panel_bg text is readable on filled chips', () => {
  for (const key of ['accent', 'mauve', 'yellow', 'red']) {
    assert.ok(contrast(colors.panel_bg, colors[key]) >= 4.5, `panel_bg on ${key}`);
  }
});

test('the colours follow the editor themes', () => {
  assert.equal(colors.accent, accent.blue);
  assert.equal(colors.text, grey.fg);
  assert.equal(colors.selection_bg, '#2e384c');
  assert.equal(colors.yellow, accent.purple);
});

test('the output is deterministic and matches the committed file', () => {
  assert.equal(render(), render());
  assert.equal(committed, render());
});
