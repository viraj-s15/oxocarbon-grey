import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grey, accent, syntax, ansi } from '../palette.mjs';
import { opaque, render } from './palette.mjs';

test('every palette colour is written as opaque lower-case hex', () => {
  const lua = render();
  for (const [section, colors] of Object.entries({ grey, accent, syntax, ansi })) {
    assert.match(lua, new RegExp(`^  ${section} = \\{$`, 'm'));
    for (const [key, hex] of Object.entries(colors)) {
      const name = key === 'function' ? '\\["function"\\]' : key;
      assert.match(lua, new RegExp(`^    ${name} = "${opaque(hex)}",$`, 'm'), `${section}.${key}`);
    }
  }
  assert.doesNotMatch(lua, /"#[0-9a-f]{8}"/i);
});

test('translucent colours are composited onto the editor background', () => {
  assert.equal(opaque(grey.hairline), '#27282a');
  assert.equal(opaque('#00000000'), grey.bg);
  assert.equal(opaque('#78A9FF'), '#78a9ff');
});

test('invalid colours and names are rejected', () => {
  assert.throws(() => opaque('red'), /not a #rrggbb/);
  assert.throws(() => opaque('#fff'), /not a #rrggbb/);
  assert.throws(() => render({ grey: { 'bg-float': '#000000' }, accent: {}, syntax: {}, ansi: {} }), /not a Lua identifier: bg-float/);
});

test('the output is deterministic', () => {
  assert.equal(render(), render());
});
