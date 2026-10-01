import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import theme from './theme.mjs';
import manifest from './manifest.mjs';
import { validate } from './validate.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const toml = (obj) =>
  Object.entries(obj)
    .map(([key, value]) => `${key} = ${Array.isArray(value) ? `[${value.map((v) => JSON.stringify(v)).join(', ')}]` : JSON.stringify(value)}`)
    .join('\n') + '\n';

// Zed only accepts a licence inside the extension directory, not at the repository root.
const license = readFileSync(join(root, 'LICENSE'), 'utf8');

const files = {
  'zed/extension.toml': toml(manifest),
  'zed/themes/oxocarbon-grey.json': JSON.stringify(theme, null, 2) + '\n',
  'zed/LICENSE': license,
};

const problems = validate({ theme, manifest, license });
if (problems.length) {
  console.error('Zed theme validation failed:\n  ' + problems.join('\n  '));
  process.exit(1);
}

const lf = (text) => text.replace(/\r\n/g, '\n');

if (process.argv.includes('--check')) {
  const stale = Object.entries(files).filter(([path, content]) => {
    try {
      return lf(readFileSync(join(root, path), 'utf8')) !== lf(content);
    } catch {
      return true;
    }
  });
  if (stale.length) {
    console.error(`Out of date: ${stale.map(([path]) => path).join(', ')}. Run \`npm run build\`.`);
    process.exit(1);
  }
  const present = existsSync(join(root, 'zed')) ? readdirSync(join(root, 'zed'), { recursive: true, withFileTypes: true }) : [];
  const extra = present
    .filter((entry) => !entry.isDirectory())
    .map((entry) => relative(root, join(entry.parentPath ?? entry.path, entry.name)).split(sep).join('/'))
    .filter((path) => !Object.hasOwn(files, path));
  if (extra.length) {
    console.error(`Unexpected files in zed/: ${extra.join(', ')}`);
    process.exit(1);
  }
  console.log(`zed/ is up to date (extension ${manifest.id} ${manifest.version})`);
} else {
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  const { style } = theme.themes[0];
  console.log(`wrote zed/: ${Object.keys(style).length - 4} UI and status colours, ${Object.keys(style.syntax).length} syntax styles`);
}
