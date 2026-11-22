// One usage ring: a track, an arc for `percent`, the text in the middle and a label under it.
// claude-tps keeps an exact copy, because herdr does not let a mod import from another mod. Change both.

import { div, svg } from "gpui-kit";
import { v_flex, h_flex } from "gpui-base";

export const SIZE = 32;

export function ring(id, { percent, text, short }, t) {
  const layer = (file, tint) => div().absolute().top(0).left(0).size(SIZE).child(svg(`mods/claude-usage/rings/${file}.svg`).size(SIZE).text_color(tint));
  const known = percent !== undefined;
  return v_flex()
    .flex_none()
    .items_center()
    .gap(2)
    .child(
      div()
        .id(id)
        .relative()
        .size(SIZE)
        .flex_none()
        .children([
          layer("ring-track", t.border),
          layer(`ring-${known ? percent : 0}`, t.accent),
          h_flex()
            .absolute()
            .top(0)
            .left(0)
            .size(SIZE)
            .items_center()
            .justify_center()
            .text_size(10)
            .font_semibold()
            .text_color(known ? t.foreground : t.dim)
            .child(known ? (text ?? String(percent)) : "–"),
        ]),
    )
    .child(div().h(12).text_size(9).line_height("12px").text_color(t.dim).child(short));
}
