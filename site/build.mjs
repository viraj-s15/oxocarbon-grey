import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { accent, ansi, grey, syntax } from '../src/palette.mjs';
import { colors as terminal, order } from '../src/ghostty/theme.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = join(root, 'site');
const at = process.argv.indexOf('--out');
const out = at > 0 ? resolve(process.argv[at + 1]) : join(root, '_site');

const roles = {
  keyword: 'keywords',
  storage: 'declarations',
  operator: 'operators',
  function: 'functions',
  method: 'methods',
  type: 'types',
  string: 'strings',
  escape: 'escapes',
  regex: 'regular expressions',
  number: 'numbers',
  constant: 'constants',
  builtin: 'built-ins',
  property: 'properties',
  propertyDeclaration: 'keys and fields',
  variable: 'variables',
  parameter: 'parameters',
  self: 'self and this',
  decorator: 'decorators',
  namespace: 'namespaces',
  macro: 'macros',
  interpolation: 'interpolation',
  lifetime: 'lifetimes',
  unsafe: 'unsafe',
  label: 'labels',
  punctuation: 'punctuation',
  comment: 'comments',
  docComment: 'doc comments',
  todo: 'todos',
  tag: 'tags',
  attribute: 'attributes',
};
const markup = ['heading', 'bold', 'link', 'inserted', 'deleted', 'changed', 'invalid'];

const colours = { ...accent, fg: grey.fg, fgMuted: grey.fgMuted, fgSubtle: grey.fgSubtle };
const nameOf = Object.fromEntries(Object.entries(colours).reverse().map(([name, hex]) => [hex, name]));

const legend = new Map();
for (const [key, hex] of Object.entries(syntax)) {
  if (markup.includes(key)) continue;
  if (!roles[key]) throw new Error(`site/build.mjs has no label for syntax.${key}`);
  const name = nameOf[hex];
  if (!name) throw new Error(`syntax.${key} (${hex}) is not a named palette colour`);
  legend.set(name, [...(legend.get(name) ?? []), roles[key]]);
}

const { source, specimens } = JSON.parse(readFileSync(join(site, 'specimens.json'), 'utf8'));

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function token(entry) {
  if (typeof entry === 'string') return escape(entry);
  const [text, style] = entry;
  const [name, ...flags] = style.split(' ');
  if (!legend.has(name)) throw new Error(`specimens.json uses ${name}, which the legend does not list`);
  return `<span class="t c-${name}${flags.map((f) => ` ${f}`).join('')}">${escape(text)}</span>`;
}

const tabs = specimens
  .map(
    (s, i) =>
      `<button type="button" role="tab" id="tab-${s.id}" aria-controls="code-${s.id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}>${s.name}</button>`,
  )
  .join('\n          ');

const panels = specimens
  .map((s, i) => {
    const lines = s.lines
      .map((line, n) => `<span class="l" data-n="${s.line + n}" style="--i:${n}">${line.map(token).join('')}</span>`)
      .join('');
    const last = s.line + s.lines.length - 1;
    return `<figure class="panel" id="code-${s.id}" role="tabpanel" aria-labelledby="tab-${s.id}"${i ? ' hidden' : ''}>
          <pre class="code" tabindex="0"><code>${lines}</code></pre>
          <figcaption><a href="https://github.com/viraj-s15/oxocarbon-grey/blob/main/fixtures/${s.file}#L${s.line}-L${last}">fixtures/${s.file}</a>, lines ${s.line} to ${last}</figcaption>
        </figure>`;
  })
  .join('\n        ');

const legendItems = [...legend]
  .map(
    ([name, list]) =>
      `<li><button type="button" data-colour="${name}" aria-pressed="false" aria-describedby="legend-hint"><span class="role c-${name}">${list.join(', ')}</span><span class="hex">${colours[name]}</span></button></li>`,
  )
  .join('\n            ');

const ansiItems = order
  .map((name, i) => {
    const label = name.replace(/^bright([A-Z])/, (_, c) => `bright ${c.toLowerCase()}`);
    return `<li style="--swatch:var(--ansi${i})"><span class="n">${i}</span> ${label} <code>${ansi[name]}</code></li>`;
  })
  .join('\n            ');

const vars = Object.entries({ ...grey, ...accent, ...terminal, ...Object.fromEntries(order.map((name, i) => [`ansi${i}`, ansi[name]])) })
  .map(([name, hex]) => `--${name}:${hex};`)
  .join('');
const css = [
  `:root{${vars}}`,
  ...[...legend.keys()].map((name) => `.c-${name}{color:var(--${name})}`),
  [...legend.keys()].map((name) => `.code[data-focus="${name}"] .t:not(.c-${name})`).join(',') + '{opacity:.16}',
  ...order.map((name, i) => `.a${i}{color:var(--ansi${i})}`),
].join('\n');

const page = readFileSync(join(site, 'index.html'), 'utf8')
  .replace('/* palette */', css)
  .replace('<!-- tabs -->', tabs)
  .replace('<!-- panels -->', panels)
  .replace('<!-- legend -->', legendItems)
  .replace('<!-- ansi -->', ansiItems)
  .replace('<!-- source -->', escape(source.replace(/ ([0-9a-f]{7})[0-9a-f]+$/, ' $1')))
  .replace(/\{\{([\w-]+)\}\}/g, (match, name) => ({ ...grey, ...terminal })[name] ?? match);
const left = page.match(/<!-- \w+ -->|\/\* palette \*\/|\{\{[\w-]+\}\}/);
if (left) throw new Error(`site/index.html still contains ${left[0]}`);

if (process.argv.includes('--check')) {
  console.log(`site builds: ${specimens.length} specimens, ${legend.size} colours`);
} else {
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out);
  writeFileSync(join(out, 'index.html'), page);
  for (const file of ['style.css', 'main.js']) copyFileSync(join(site, file), join(out, file));
  copyFileSync(join(root, 'images/icon.png'), join(out, 'icon.png'));
  mkdirSync(join(out, 'ghostty'));
  copyFileSync(join(root, 'ghostty/oxocarbon-grey'), join(out, 'ghostty/oxocarbon-grey'));
  writeFileSync(join(out, '.nojekyll'), '');
  console.log(`wrote ${out} with ${specimens.length} specimens`);
}
