// Colour helpers for the Zed theme. They only derive colours from the shared
// palette; they never introduce new hues.

// Append a two-digit hex alpha to a #rrggbb colour.
export const alpha = (hex, opacity) =>
  hex +
  Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');

// Opaque mix of two #rrggbb colours: `amount` of `fg` over `bg`. Used where Zed
// expects a solid colour that VS Code has no equivalent for (dim ANSI colours).
export const mix = (fg, bg, amount) => {
  const channel = (hex, i) => parseInt(hex.slice(i, i + 2), 16);
  return (
    '#' +
    [1, 3, 5]
      .map((i) => Math.round(channel(fg, i) * amount + channel(bg, i) * (1 - amount)))
      .map((c) => c.toString(16).padStart(2, '0'))
      .join('')
  );
};

export const transparent = '#00000000';
