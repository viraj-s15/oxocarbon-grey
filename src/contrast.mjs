// WCAG 2 contrast checks for the palette.
import { grey, syntax, ansi } from './palette.mjs';

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (fg, bg) => {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.055) / (b + 0.055);
};

// Minimum ratio per syntax role. Everything read as code text needs 4.5:1;
// comments are deliberately dimmer and need 3:1.
const minimum = (role) => (role === 'comment' ? 3 : 4.5);

// Checked on the editor background and on the current line highlight.
const backgrounds = { editor: grey.bg, 'line highlight': grey.bgLine };

export const checkContrast = () => {
  const rows = [];
  for (const [role, fg] of Object.entries(syntax)) {
    for (const [where, bg] of Object.entries(backgrounds)) {
      const ratio = contrast(fg, bg);
      rows.push({ role, fg, where, ratio, min: minimum(role), ok: ratio >= minimum(role) });
    }
  }
  // UI text on the workbench and widget backgrounds.
  const ui = [
    ['muted text on workbench', grey.fgMuted, grey.bg, 4.5],
    ['fg on widgets', grey.fg, grey.bgFloat, 4.5],
    ['muted text on widgets', grey.fgMuted, grey.bgFloat, 4.5],
    ['fg on selection', grey.fg, grey.bgSelection, 4.5],
    ['placeholder on inputs', grey.fgSubtle, grey.bgFloat, 3],
  ];
  // ANSI colours as text on the terminal background.
  for (const [name, fg] of Object.entries(ansi)) {
    if (name === 'black') continue;
    const min = name === 'brightBlack' ? 3 : 4.5;
    const ratio = contrast(fg, grey.bg);
    rows.push({ role: `ansi ${name}`, fg, where: 'terminal', ratio, min, ok: ratio >= min });
  }
  for (const [role, fg, bg, min] of ui) {
    const ratio = contrast(fg, bg);
    rows.push({ role, fg, where: bg, ratio, min, ok: ratio >= min });
  }
  return rows;
};
