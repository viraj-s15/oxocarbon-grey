#!/usr/bin/env python3
"""Adds the TPS hook to Claude Code's user settings, or removes it with --remove. Safe to run again."""
import json
import os
import shutil
import sys
import time

HOOK = "tps-hook.py"
EVENTS = ("PostToolUse", "Stop")

settings_path = os.path.expanduser("~/.claude/settings.json")
app = os.environ.get("HERDR_APP_HOME") or os.path.expanduser("~/.config/herdr-app")
# The hook runs from herdr-app's copy, so it keeps working whether the mod is linked or copied there.
script = os.path.join(app, "mods", "claude-tps", HOOK)
remove = "--remove" in sys.argv

settings = {}
if os.path.exists(settings_path):
    with open(settings_path) as f:
        settings = json.load(f)
before = json.dumps(settings, sort_keys=True)

hooks = settings.setdefault("hooks", {})
for event in EVENTS:
    groups = [
        g for g in hooks.get(event, [])
        if not any(HOOK in " ".join([h.get("command", "")] + h.get("args", [])) for h in g.get("hooks", []))
    ]
    if not remove:
        groups.append({"hooks": [{"type": "command", "command": "python3", "args": [script], "async": True}]})
    if groups:
        hooks[event] = groups
    else:
        hooks.pop(event, None)
if not hooks:
    settings.pop("hooks")

# The mod watches this folder, so it has to exist before the first hook run.
os.makedirs(os.path.join(app, "data", "claude-tps", "terminals"), exist_ok=True)
if json.dumps(settings, sort_keys=True) == before:
    print(f"the TPS hook is already {'absent from' if remove else 'in'} {settings_path}")
    sys.exit()
os.makedirs(os.path.dirname(settings_path), exist_ok=True)
if os.path.exists(settings_path):
    shutil.copy2(settings_path, f"{settings_path}.bak-{time.strftime('%Y%m%d%H%M%S')}")
with open(settings_path, "w") as f:
    json.dump(settings, f, indent=2)
    f.write("\n")
print(f"{'removed' if remove else 'installed'} the TPS hook in {settings_path}")
