import { grey, accent, ansi } from '../palette.mjs';
import { mix } from '../zed/color.mjs';

// Ghostty palette indices 0 to 15, in ANSI order.
export const order = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'brightBlack',
  'brightRed',
  'brightGreen',
  'brightYellow',
  'brightBlue',
  'brightMagenta',
  'brightCyan',
  'brightWhite',
];

// The same terminal colours as the VS Code theme. Ghostty colours have no alpha,
// so its 20% blue selection is mixed into the background.
export const colors = {
  background: grey.bg,
  foreground: grey.fg,
  'cursor-color': grey.fg,
  'cursor-text': grey.bg,
  'selection-background': mix(accent.blue, grey.bg, 0.2),
  'selection-foreground': grey.white,
};

export const render = (palette = ansi) =>
  [
    '# Oxocarbon Grey for Ghostty: https://github.com/viraj-s15/oxocarbon-grey',
    '# Generated from src/palette.mjs by `npm run build:ghostty`. Do not edit.',
    '',
    ...Object.entries(colors).map(([key, hex]) => `${key} = ${hex}`),
    '',
    '# Oxocarbon has no yellow, so 3 and 11 are purple.',
    ...order.map((name, i) => `palette = ${i}=${palette[name]}`),
    '',
  ].join('\n');
