import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from './theme.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const path = 'ghostty/oxocarbon-grey';
const out = join(root, path);
const theme = render();

if (process.argv.includes('--check')) {
  let current;
  try {
    current = readFileSync(out, 'utf8').replace(/\r\n/g, '\n');
  } catch {
    console.error(`${path} is missing. Run \`npm run build:ghostty\`.`);
    process.exit(1);
  }
  if (current !== theme) {
    console.error(`${path} is out of date. Run \`npm run build:ghostty\`.`);
    process.exit(1);
  }
  console.log(`${path} is up to date`);
} else {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, theme);
  console.log(`wrote ${path}`);
}
