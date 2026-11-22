// herdr draws SVGs only from files, so each ring has one file per whole percent.
// Run once with `node make-rings.mjs`. herdr tints the shapes with the text colour.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), 'rings');
const size = 32;
const rings = { ring: { r: 14.25, width: 2.5 } };

const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">${body}</svg>\n`;

mkdirSync(out, { recursive: true });
for (const [name, { r, width }] of Object.entries(rings)) {
  const c = size / 2;
  const length = 2 * Math.PI * r;
  writeFileSync(join(out, `${name}-track.svg`), svg(`<circle cx="${c}" cy="${c}" r="${r}" stroke="#000" stroke-width="${width}"/>`));
  for (let p = 0; p <= 100; p++) {
    const arc = ((length * p) / 100).toFixed(3);
    const opacity = p === 0 ? ' stroke-opacity="0"' : '';
    writeFileSync(
      join(out, `${name}-${p}.svg`),
      svg(`<circle cx="${c}" cy="${c}" r="${r}" stroke="#000" stroke-width="${width}" stroke-linecap="round" stroke-dasharray="${arc} ${length.toFixed(3)}" transform="rotate(-90 ${c} ${c})"${opacity}/>`),
    );
  }
}
