import * as palette from '../palette.mjs';
import { mix } from '../zed/color.mjs';

const identifier = /^[A-Za-z_][A-Za-z0-9_]*$/;
const reserved = new Set('and break do else elseif end false for function goto if in local nil not or repeat return then true until while'.split(' '));
const rgb = /^#[0-9a-f]{6}$/i;
const rgba = /^#[0-9a-f]{8}$/i;

// Neovim has no alpha, so translucent palette colours are composited onto the editor background.
export const opaque = (hex, bg = palette.grey.bg) => {
  if (rgb.test(hex)) return hex.toLowerCase();
  if (rgba.test(hex)) return mix(hex.slice(0, 7), bg, parseInt(hex.slice(7), 16) / 255);
  throw new Error(`not a #rrggbb or #rrggbbaa colour: ${hex}`);
};

const key = (name) => {
  if (!identifier.test(name)) throw new Error(`not a Lua identifier: ${name}`);
  return reserved.has(name) ? `["${name}"]` : name;
};

const table = (name, colors) => {
  const rows = Object.entries(colors).map(([k, hex]) => `    ${key(k)} = "${opaque(hex)}",`);
  return `  ${key(name)} = {\n${rows.join('\n')}\n  },`;
};

export const render = ({ grey, accent, syntax, ansi } = palette) =>
  [
    '-- Generated from src/palette.mjs by `npm run build:neovim`. Do not edit.',
    'return {',
    table('grey', grey),
    table('accent', accent),
    table('syntax', syntax),
    table('ansi', ansi),
    '}',
    '',
  ].join('\n');
