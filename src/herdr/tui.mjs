import { grey, accent, ansi } from '../palette.mjs';
import { colors as terminal } from '../ghostty/theme.mjs';

// herdr colours only its own UI. Panes keep the host terminal's colours, so use
// the Ghostty port there. Every token is set, so the base theme name has no effect.
export const colors = {
  accent: accent.blue,
  // One flat surface, as in the editor themes. Oxocarbon pink also needs it for 4.5:1.
  panel_bg: grey.bg,
  // reset keeps the host terminal background, the same as herdr's built-in themes.
  sidebar_bg: 'reset',
  active_row_bg: grey.bgSelection,
  selection_bg: terminal['selection-background'],
  surface0: grey.bgSelection,
  surface1: grey.lineNr,
  surface_dim: grey.guide,
  overlay0: grey.fgSubtle,
  overlay1: grey.fgMuted,
  text: grey.fg,
  subtext0: ansi.white,
  mauve: accent.purple,
  green: accent.green,
  // Oxocarbon has no yellow or orange, so purple stands in, as in the ANSI palette.
  yellow: ansi.yellow,
  red: accent.pink,
  blue: accent.blue,
  teal: accent.teal,
  peach: ansi.yellow,
};

export const render = (theme = colors) =>
  [
    '# Oxocarbon Grey for herdr: https://github.com/viraj-s15/oxocarbon-grey',
    '# Generated from src/palette.mjs by `npm run build:herdr`. Do not edit.',
    '# Paste this table into ~/.config/herdr/config.toml, replacing any [theme.custom] table.',
    '',
    '[theme.custom]',
    ...Object.entries(theme).map(([key, value]) => `${key} = "${value}"`),
    '',
  ].join('\n');
