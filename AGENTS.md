# Agent notes

## Set up herdr from this repo

When the user asks to set up herdr, the herdr layout or herdr-app from this repo, do these steps:

1. Run `scripts/link-herdr-layout.sh`. It links the oxocarbon-grey layout and its mods into `~/.config/herdr-app`, and adds the Claude Code TPS hook to `~/.claude/settings.json`. If a live file is in the way, the script moves it to `~/.config/herdr-app/.backup-<time>/`.
2. Run `herdr-app do layout.switch '{"name":"oxocarbon-grey"}'`.
3. Tell the user to restart running Claude Code sessions, because a session reads its hooks when it starts.

The script is safe to run again. The README's herdr section has the manual steps, and `herdr/app-layout/RECIPE.md` describes the layout for the herdr.dev gallery.

## herdr gallery folder

`herdr/app-layout` is the folder that the herdr.dev gallery reads. Keep `RECIPE.md`, `preview.png`, `layouts/` and `mods/` at their paths, and update `RECIPE.md` when the layout or a mod changes.
