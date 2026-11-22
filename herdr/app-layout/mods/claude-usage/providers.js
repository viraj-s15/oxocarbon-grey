// Each provider reports its usage windows. To add an agent, add one entry here
// with its icon from ~/.config/herdr-app/icons and a load() that returns windows.

import { exec, home } from "herdr";

// "Current session: 16% used · resets Nov 22 at 3:29am (America/New_York)"
export function windowFrom(text, label) {
  const m = text.match(new RegExp(`${label}[^:]*:\\s*(\\d+)% used(?:\\s*·\\s*resets\\s*([^(\\n]+))?`));
  return m ? { percent: Math.min(100, Number(m[1])), resets: m[2]?.trim() ?? null } : null;
}

async function claudeUsage() {
  const args = ["-p", "--no-session-persistence", "/usage"];
  let r;
  try {
    r = await exec("claude", args, { cwd: home(), timeout: 60000 });
  } catch {
    // A GUI app's PATH often lacks ~/.local/bin, where the installer puts claude.
    r = await exec(`${home()}/.local/bin/claude`, args, { cwd: home(), timeout: 60000 });
  }
  const text = r.stdout ?? "";
  const windows = [
    { short: "5h", name: "5-hour", ...windowFrom(text, "Current session") },
    { short: "wk", name: "Week", ...windowFrom(text, "Current week") },
  ];
  if (windows.every((w) => w.percent === undefined)) throw new Error("claude /usage printed no usage");
  return windows;
}

export const providers = [{ id: "claude", name: "Claude", icon: "icons/claude.svg", load: claudeUsage }];
