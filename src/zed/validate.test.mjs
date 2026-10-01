import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import theme from './theme.mjs';
import manifest from './manifest.mjs';
import { validate } from './validate.mjs';

const license = readFileSync(new URL('../../LICENSE', import.meta.url), 'utf8');

const problems = (change) => {
  const t = structuredClone(theme);
  const m = structuredClone(manifest);
  const l = change({ style: t.themes[0].style, manifest: m }) ?? license;
  return validate({ theme: t, manifest: m, license: l }).join('\n');
};

test('the generated theme passes', () => {
  assert.equal(problems(() => {}), '');
});

test('misspelt and deprecated properties are rejected', () => {
  assert.match(problems(({ style }) => void (style['editor.backgroud'] = '#000000')), /unknown style property "editor.backgroud"/);
  assert.match(problems(({ style }) => void (style.version_control_conflict_ours_background = '#000000')), /deprecated/);
});

test('a property left to Zed defaults is reported', () => {
  assert.match(problems(({ style }) => void delete style['terminal.ansi.dim_red']), /missing style property "terminal.ansi.dim_red"/);
});

test('invalid colours and font styles are rejected', () => {
  assert.match(problems(({ style }) => void (style.text = 'red')), /text: "red" is not a colour/);
  assert.match(problems(({ style }) => void (style.syntax.comment.font_style = 'bold')), /syntax.comment: invalid font_style/);
});

test('captures and semantic styles must resolve', () => {
  assert.match(problems(({ style }) => void delete style.syntax.keyword), /capture @keyword has no style/);
  assert.match(problems(({ style }) => void delete style.syntax['variable.parameter']), /semantic rule \[variable.parameter\]/);
});

test('unreadable syntax colours are rejected', () => {
  assert.match(problems(({ style }) => void (style.syntax.variable.color = '#33353b')), /syntax.variable #33353b on #1b1c1f/);
});

test('registry rules for the manifest and licence are enforced', () => {
  assert.match(problems(({ manifest }) => void (manifest.id = 'oxocarbon-grey-zed')), /must not contain "zed"/);
  assert.match(problems(({ manifest }) => void (manifest.description = 'Grey')), /description must be longer/);
  assert.match(problems(({ manifest }) => void (manifest.version = 'v0.1')), /major.minor.patch/);
  assert.match(problems(() => 'All rights reserved.'), /not recognised as MIT/);
});

test('keys inherited from Object.prototype do not count as styles', () => {
  assert.match(problems(({ style }) => void delete style.syntax.constructor), /capture @constructor has no style/);
  assert.match(problems(({ style }) => void (style.toString = '#000000')), /unknown style property "toString"/);
});

test('translucent or shorthand syntax colours are rejected', () => {
  assert.match(problems(({ style }) => void (style.syntax.variable.color = '#dde1e620')), /syntax.variable must use opaque/);
  assert.match(problems(({ style }) => void (style.syntax.variable.color = '#fff')), /syntax.variable must use opaque/);
});

test('missing players and accents are reported, not thrown', () => {
  const out = problems(({ style }) => void (delete style.players, delete style.accents));
  assert.match(out, /expected 8 players, got 0/);
  assert.match(out, /missing accents/);
});
