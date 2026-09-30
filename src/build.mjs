// Generates themes/oxocarbon-grey-color-theme.json from src/palette.mjs.
//
//   node src/build.mjs          write the theme and report contrast
//   node src/build.mjs --check  fail if the committed theme is out of date
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import colors from './ui.mjs';
import tokenColors from './tokens.mjs';
import semanticTokenColors from './semantic.mjs';
import { checkContrast } from './contrast.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'themes', 'oxocarbon-grey-color-theme.json');

const theme = {
  $schema: 'vscode://schemas/color-theme',
  name: 'Oxocarbon Grey',
  type: 'dark',
  semanticHighlighting: true,
  colors,
  tokenColors,
  semanticTokenColors,
};

// Every colour must be #rrggbb or #rrggbbaa.
const hex = /^#[0-9a-f]{6}([0-9a-f]{2})?$/i;
const bad = [];
const walk = (value, path) => {
  if (typeof value === 'string') {
    if (!path.endsWith('.fontStyle') && !hex.test(value)) bad.push(`${path}: ${value}`);
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
  }
};
walk(colors, 'colors');
tokenColors.forEach((r, i) => walk(r.settings, `tokenColors[${i}].settings`));
for (const [k, v] of Object.entries(semanticTokenColors)) walk(typeof v === 'string' ? { foreground: v } : v, `semanticTokenColors.${k}`);
if (bad.length) {
  console.error('Invalid colours:\n  ' + bad.join('\n  '));
  process.exit(1);
}

const json = JSON.stringify(theme, null, 2) + '\n';

if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = readFileSync(out, 'utf8');
  } catch {}
  if (current !== json) {
    console.error('themes/oxocarbon-grey-color-theme.json is out of date. Run `npm run build`.');
    process.exit(1);
  }
} else {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, json);
  console.log(`wrote ${Object.keys(colors).length} UI colours, ${tokenColors.length} token rules, ${Object.keys(semanticTokenColors).length} semantic rules`);
}

const rows = checkContrast();
const failures = rows.filter((r) => !r.ok);
const worst = [...rows].sort((a, b) => a.ratio - b.ratio).slice(0, 5);
console.log('lowest contrast: ' + worst.map((r) => `${r.role} ${r.fg} on ${r.where} ${r.ratio.toFixed(2)}:1`).join(', '));
if (failures.length) {
  console.error('Contrast failures:\n  ' + failures.map((r) => `${r.role} ${r.fg} on ${r.where}: ${r.ratio.toFixed(2)} < ${r.min}`).join('\n  '));
  process.exit(1);
}
