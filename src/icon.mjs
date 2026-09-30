// Draws images/icon.png (256x256) from the palette: a graphene tile with a few
// lines of "code" in the syntax colours. Node stdlib only.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync, crc32 } from 'node:zlib';
import { grey, syntax as s } from './palette.mjs';

const size = 256;
const ss = 4; // supersampling per axis

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

// Shapes are rounded rectangles: [x, y, w, h, radius, colour], painted in order.
const shapes = [[8, 8, 240, 240, 52, grey.bg]];
const lines = [
  // [indent, [[width, colour], ...]]
  [0, [[34, s.storage], [52, s.function], [30, s.punctuation]]],
  [1, [[40, s.keyword], [28, s.self], [48, s.method]]],
  [2, [[30, s.storage], [36, s.variable], [44, s.string]]],
  [2, [[46, s.type], [34, s.number]]],
  [1, [[40, s.keyword], [60, s.property]]],
  [0, [[18, s.punctuation]]],
];
const lineHeight = 14;
const gap = 12;
let y = 56;
for (const [indent, parts] of lines) {
  let x = 44 + indent * 24;
  for (const [w, colour] of parts) {
    shapes.push([x, y, w, lineHeight, lineHeight / 2, colour]);
    x += w + 8;
  }
  y += lineHeight + gap;
}

const inside = (px, py, [x, y, w, h, r]) => {
  if (px < x || py < y || px > x + w || py > y + h) return false;
  const cx = Math.min(Math.max(px, x + r), x + w - r);
  const cy = Math.min(Math.max(py, y + r), y + h - r);
  return (px - cx) ** 2 + (py - cy) ** 2 <= r * r;
};

// RGBA pixels, filter byte per row.
const raw = Buffer.alloc((size * 4 + 1) * size);
for (let py = 0; py < size; py++) {
  raw[py * (size * 4 + 1)] = 0;
  for (let px = 0; px < size; px++) {
    let [r, g, b, a] = [0, 0, 0, 0];
    for (let sy = 0; sy < ss; sy++) {
      for (let sx = 0; sx < ss; sx++) {
        const fx = px + (sx + 0.5) / ss;
        const fy = py + (sy + 0.5) / ss;
        let colour = null;
        for (const shape of shapes) if (inside(fx, fy, shape)) colour = shape[5];
        if (colour) {
          const [cr, cg, cb] = rgb(colour);
          r += cr;
          g += cg;
          b += cb;
          a += 1;
        }
      }
    }
    const o = py * (size * 4 + 1) + 1 + px * 4;
    if (a) {
      raw[o] = Math.round(r / a);
      raw[o + 1] = Math.round(g / a);
      raw[o + 2] = Math.round(b / a);
    }
    raw[o + 3] = Math.round((a / (ss * ss)) * 255);
  }
}

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
const header = Buffer.alloc(13);
header.writeUInt32BE(size, 0);
header.writeUInt32BE(size, 4);
header[8] = 8; // bit depth
header[9] = 6; // RGBA
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', header),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'images', 'icon.png');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, png);
console.log(`wrote images/icon.png (${png.length} bytes)`);
