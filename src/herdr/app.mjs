import { grey, accent, ansi } from '../palette.mjs';
import { mix } from '../zed/color.mjs';
import { order, colors as terminal } from '../ghostty/theme.mjs';

// herdr-app theme files take only #rrggbb, so the 5% white hairline is mixed into the background.
const hairline = mix(grey.white, grey.bg, 0.05);

// The same terminal as the Ghostty port, and the VS Code workbench for the panels:
// one flat surface and lighter widgets.
export const theme = {
  background: terminal.background,
  foreground: terminal.foreground,
  selection: terminal['selection-background'],
  cursor: terminal['cursor-color'],
  ansi: order.map((name) => ansi[name]),
  colors: {
    canvas: grey.bg,
    chrome: grey.bg,
    surface: grey.bg,
    popover: grey.bgFloat,
    raised: grey.bgFloat,
    hover: grey.bgFloat,
    selected: grey.bgSelection,
    border: hairline,
    input: grey.lineNr,
    foreground: grey.fg,
    muted: grey.fgMuted,
    dim: grey.fgSubtle,
    accent: accent.blue,
    accent_foreground: grey.bg,
    solid: accent.blue,
    solid_foreground: grey.bg,
    // Purple stands in for yellow, as in the ANSI palette and the herdr TUI theme.
    working: accent.purple,
    blocked: accent.pink,
    done: accent.green,
    idle: grey.fgSubtle,
    unknown: grey.fgMuted,
  },
};

export const render = (value = theme) => JSON.stringify(value, null, 2) + '\n';
