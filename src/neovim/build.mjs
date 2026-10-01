import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from './palette.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const path = 'lua/oxocarbon_grey/palette.lua';
const out = join(root, path);
const lua = render();

if (process.argv.includes('--check')) {
  let current;
  try {
    current = readFileSync(out, 'utf8').replace(/\r\n/g, '\n');
  } catch {
    console.error(`${path} is missing. Run \`npm run build:neovim\`.`);
    process.exit(1);
  }
  if (current !== lua) {
    console.error(`${path} is out of date. Run \`npm run build:neovim\`.`);
    process.exit(1);
  }
  console.log(`${path} is up to date`);
} else {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, lua);
  console.log(`wrote ${path}`);
}
