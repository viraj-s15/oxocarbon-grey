import { ansi } from '../palette.mjs';
import { order, colors } from '../ghostty/theme.mjs';

// The terminalthemes.com catalog numbers its ANSI colours from 1, not 0.
export const keys = {
  cursor: 'cursor-color',
  cursor_text: 'cursor-text',
  foreground: 'foreground',
  background: 'background',
  selection: 'selection-background',
  selection_text: 'selection-foreground',
};

export const render = (palette = ansi) =>
  [
    '# Oxocarbon Grey for terminalthemes.com: https://github.com/viraj-s15/oxocarbon-grey',
    '# Generated from src/palette.mjs by `npm run build:terminalthemes`. Do not edit.',
    '',
    'name: "Oxocarbon Grey"',
    ...order.map((name, i) => `color_${String(i + 1).padStart(2, '0')}: "${palette[name]}"`),
    ...Object.entries(keys).map(([key, ghostty]) => `${key}: "${colors[ghostty]}"`),
    '',
  ].join('\n');
