// Output tokens per second of the Claude agent in the focused pane, from the
// files that tps-hook.py writes, and the "»" that expands the sidebar rail.

import { View, div } from "gpui-kit";
import { v_flex, h_flex } from "gpui-base";
import { theme, run, layout, shared, setShared, window, focused, appHome, readTextFile, watchFolder } from "herdr";
import { ring } from "./ring.js";

// The speed that fills the ring. A ring needs a maximum, and this is a little above Claude's usual speed.
const FULL_TPS = 150;

function find(node, id) {
  if (node?.id === id) return node;
  for (const child of node?.children ?? []) {
    const found = find(child, id);
    if (found) return found;
  }
  return null;
}

// The same rule and toggle as the shipped agents mod, because the blocks above
// replace it and this block is the last one before the footer.
const narrow = () => (find(layout(), "sidebar")?.size?.px ?? Infinity) < 160;

function toggleSidebar() {
  const width = find(layout(), "sidebar")?.size?.px;
  if (!narrow()) setShared("sidebar.width", width);
  setShared("sidebar.collapsed", !narrow());
  run("layout.resize", { id: "sidebar", px: narrow() ? (shared("sidebar.width") ?? 268) : window()?.platform === "macos" ? 76 : 44 });
}

export default class Tps extends View {
  init(_props, cx) {
    // terminal -> { tps, tokens }, or null when the terminal has no file.
    this.tps = {};
    this.dir = `${appHome()}/data/claude-tps/terminals`;
    this.watch(cx);
  }

  // The hook writes one small file per terminal, so a folder watch costs nothing between turns.
  watch(cx) {
    cx.spawn(async (cx) => {
      for (;;) {
        await Promise.all(Object.keys(this.tps).map((t) => this.load(t)));
        cx.notify();
        let changed;
        try {
          changed = await watchFolder(this.dir);
        } catch {
          return;
        }
        const names = changed.filter((p) => p.endsWith(".json")).map((p) => p.split("/").pop().slice(0, -5));
        await Promise.all(names.map((t) => this.load(t)));
        cx.notify();
      }
    });
  }

  async load(terminal) {
    try {
      const text = await readTextFile(`${this.dir}/${terminal}.json`);
      this.tps[terminal] = text ? JSON.parse(text) : null;
    } catch {
      this.tps[terminal] = null;
    }
  }

  render(cx) {
    const t = theme();
    const terminal = focused()?.terminal;
    if (terminal && !(terminal in this.tps)) {
      this.tps[terminal] = null;
      cx.spawn(async (cx) => { await this.load(terminal); cx.notify(); });
    }
    const data = terminal ? this.tps[terminal] : null;
    const known = typeof data?.tps === "number";
    const tip = known
      ? `Claude in this pane: ${Math.round(data.tps)} output tokens/s over ${data.tokens} tokens in the current turn.`
      : "No Claude turn in the focused pane yet.";
    return v_flex()
      .size_full()
      .items_center()
      .justify_end()
      .gap(10)
      .pb(4)
      .child(
        div()
          .id("tps")
          .tooltip(tip)
          .child(ring("tps-ring", {
            short: "tps",
            percent: known ? Math.min(100, Math.round((data.tps / FULL_TPS) * 100)) : undefined,
            text: known ? String(Math.round(data.tps)) : undefined,
          }, t)),
      )
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
