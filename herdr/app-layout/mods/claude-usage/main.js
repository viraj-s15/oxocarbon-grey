// Plan usage for each provider in providers.js: its icon, then one ring per
// usage window with the window's own percentage in the middle.

import { View, image } from "gpui-kit";
import { v_flex } from "gpui-base";
import { theme } from "herdr";
import { providers } from "./providers.js";
import { ring } from "./ring.js";

const REFRESH_MS = 5 * 60 * 1000;

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
      .children(windows.map((w, i) => ring(`usage-${p.id}-${i}`, w, t)));
  }

  render() {
    const t = theme();
    return v_flex()
      .size_full()
      .items_center()
      .justify_end()
      .gap(10)
      .pb(4)
      .children(providers.map((p) => this.provider(p, t)));
  }
}
