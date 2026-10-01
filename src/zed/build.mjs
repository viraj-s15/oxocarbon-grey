// Generates the Zed extension in zed/ from src/palette.mjs.
//
//   node src/zed/build.mjs          write zed/ and validate it
//   node src/zed/build.mjs --check  fail if zed/ is out of date or invalid; writes nothing
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import theme from './theme.mjs';
import manifest from './manifest.mjs';
import { validate } from './validate.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// extension.toml only holds flat strings, integers and string arrays.
const toml = (obj) =>
  Object.entries(obj)
    .map(([key, value]) => `${key} = ${Array.isArray(value) ? `[${value.map((v) => JSON.stringify(v)).join(', ')}]` : JSON.stringify(value)}`)
    .join('\n') + '\n';

// Zed requires the licence inside the extension directory; a licence at the
// repository root does not count when the extension lives in a subdirectory.
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

if (process.argv.includes('--check')) {
  const stale = Object.entries(files).filter(([path, content]) => {
    try {
      return readFileSync(join(root, path), 'utf8') !== content;
    } catch {
      return true;
    }
  });
  if (stale.length) {
    console.error(`Out of date: ${stale.map(([path]) => path).join(', ')}. Run \`npm run build\`.`);
    process.exit(1);
  }
  // Zed packages everything in zed/ and loads every JSON file in zed/themes.
  const present = existsSync(join(root, 'zed')) ? readdirSync(join(root, 'zed'), { recursive: true, withFileTypes: true }) : [];
  const extra = present
    .filter((entry) => entry.isFile())
    .map((entry) => relative(root, join(entry.parentPath, entry.name)).split(sep).join('/'))
    .filter((path) => !(path in files));
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
