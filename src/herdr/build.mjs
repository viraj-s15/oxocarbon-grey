import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as tui from './tui.mjs';
import * as app from './app.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outputs = [
  ['herdr/oxocarbon-grey.toml', tui.render()],
  ['herdr/oxocarbon-grey.json', app.render()],
];
const check = process.argv.includes('--check');
let failed = false;

for (const [path, theme] of outputs) {
  const out = join(root, path);
  if (!check) {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, theme);
    console.log(`wrote ${path}`);
    continue;
  }
  let current;
  try {
    current = readFileSync(out, 'utf8').replace(/\r\n/g, '\n');
  } catch {
    console.error(`${path} is missing. Run \`npm run build:herdr\`.`);
    failed = true;
    continue;
  }
  if (current !== theme) {
    console.error(`${path} is out of date. Run \`npm run build:herdr\`.`);
    failed = true;
  } else {
    console.log(`${path} is up to date`);
  }
}

if (failed) process.exit(1);
