// Plan usage for each provider in providers.js: its icon, then one ring per
// usage window with the window's own percentage in the middle.

import { View, div, svg, image } from "gpui-kit";
import { v_flex, h_flex } from "gpui-base";
import { theme, run, layout, shared, setShared, window } from "herdr";
import { providers } from "./providers.js";

const REFRESH_MS = 5 * 60 * 1000;
const SIZE = 32;

function find(node, id) {
  if (node?.id === id) return node;
  for (const child of node?.children ?? []) {
    const found = find(child, id);
    if (found) return found;
  }
  return null;
}

// The same rule and toggle as the shipped agents mod, because this mod takes its
// place and its expand button.
const narrow = () => (find(layout(), "sidebar")?.size?.px ?? Infinity) < 160;

function toggleSidebar() {
  const width = find(layout(), "sidebar")?.size?.px;
  if (!narrow()) setShared("sidebar.width", width);
  setShared("sidebar.collapsed", !narrow());
  run("layout.resize", { id: "sidebar", px: narrow() ? (shared("sidebar.width") ?? 268) : window()?.platform === "macos" ? 76 : 44 });
}

const describe = (w) => (w.percent === undefined ? `${w.name}: no data` : `${w.name}: ${w.percent}%${w.resets ? `, resets ${w.resets}` : ""}`);

export default class Usage extends View {
  init(_props, cx) {
    // id -> { windows, error }
    this.state = {};
    this.busy = false;
    cx.timer.every(REFRESH_MS, (cx) => this.refresh(cx));
    this.refresh(cx);
  }

  refresh(cx) {
    if (this.busy) return;
    this.busy = true;
    cx.spawn(async (cx) => {
      await Promise.all(
        providers.map(async (p) => {
          const prev = this.state[p.id];
          try {
            this.state[p.id] = { windows: await p.load(), error: null };
          } catch (e) {
            this.state[p.id] = { windows: prev?.windows ?? null, error: String(e.message ?? e) };
          }
        }),
      );
      this.busy = false;
      cx.notify();
    });
  }

  ring(id, w, t) {
    const layer = (file, tint) => div().absolute().top(0).left(0).size(SIZE).child(svg(`mods/claude-usage/rings/${file}.svg`).size(SIZE).text_color(tint));
    const known = w.percent !== undefined;
    return v_flex()
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
            layer(`ring-${known ? w.percent : 0}`, t.accent),
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
              .child(known ? String(w.percent) : "–"),
          ]),
      )
      .child(div().h(12).text_size(9).line_height("12px").text_color(t.dim).child(w.short));
  }

  provider(p, t) {
    const s = this.state[p.id];
    const windows = s?.windows ?? [{ short: "", name: p.name, percent: undefined }];
    const tip = s?.error && !s.windows
      ? `${p.name} usage unavailable: ${s.error}. Click to retry.`
      : [p.name, ...windows.map(describe), "Click to refresh."].join("\n");
    return v_flex()
      .id(`usage-${p.id}`)
      .items_center()
      .gap(12)
      .tooltip(tip)
      .on_click((_e, cx) => this.refresh(cx))
      .child(image(p.icon).size(16))
      .children(windows.map((w, i) => this.ring(`usage-${p.id}-${i}`, w, t)));
  }

  render() {
    const t = theme();
    return v_flex()
      .size_full()
      .items_center()
      .justify_end()
      .gap(10)
      .pb(4)
      .children(providers.map((p) => this.provider(p, t)))
      .when(narrow(), (el) =>
        el.child(
          h_flex()
            .h(28)
            .items_center()
            .justify_center()
            .child(
              div()
                .id("collapse")
                .text_size(13)
                .text_color(t.dim)
                .hover((s) => s.text_color(t.foreground))
                .on_click(toggleSidebar)
                .child("»"),
            ),
        ),
      );
  }
}
