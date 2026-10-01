export const alpha = (hex, opacity) =>
  hex +
  Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');

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
