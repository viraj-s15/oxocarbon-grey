import { View, div, svg } from "gpui-kit";
import { h_flex, v_flex } from "gpui-base";
import { theme, props, run, exec, notify, closeOverlay } from "herdr";

// `open -a` finds the app without the shell PATH, which a GUI app often lacks.
async function openApp(app, folder) {
  try {
    const r = await exec("/usr/bin/open", ["-a", app, folder]);
    if (r.code !== 0) throw new Error(r.stderr || `open exited with ${r.code}`);
  } catch (e) {
    notify({ title: `Could not open ${app}`, body: String(e?.message ?? e), level: "error" });
  }
}

export default class OpenWith extends View {
  row(id, icon, name, action, enabled = true) {
    const t = theme();
    return h_flex().id(id).h(31).px(9).gap(10).rounded(7).items_center().flex_none()
      .text_color(enabled ? t.foreground : t.dim).when(enabled, el => el.hover(s => s.bg(t.selected)))
      .on_click(() => { if (enabled) { closeOverlay(props().overlay); action(); } })
      .child(svg(icon).size(14)).child(div().flex_1().child(name));
  }
  render() {
    const t = theme();
    const { folder = "", machine = null } = props() ?? {};
    // A remote space's folder is on that machine, so only a terminal there can open it.
    const local = !machine;
    // `v` is the person's zsh alias for nvim, so it needs an interactive shell.
    const nvim = local ? ["zsh", "-ic", "v"] : ["nvim"];
    return v_flex().w_full().bg(t.popover).p(5).text_size(12.8)
      .child(this.row("zed", "mods/oxocarbon-open-with/zed.svg", "Zed", () => openApp("Zed", folder), local))
      .child(this.row("vscode", "mods/oxocarbon-open-with/vscode.svg", "VS Code", () => openApp("Visual Studio Code", folder), local))
      .child(this.row("nvim", "mods/oxocarbon-open-with/nvim.svg", "Neovim pane", () => run("terminal.open", { argv: nvim, folder, place: "right" })));
  }
}
