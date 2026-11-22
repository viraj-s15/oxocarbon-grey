#!/bin/sh
# Links the herdr-app layout and mods to this repo, so the repo stays the one source.
set -eu

repo="$(cd "$(dirname "$0")/.." && pwd)/herdr/app-layout"
home="${HERDR_APP_HOME:-$HOME/.config/herdr-app}"
backup="$home/.backup-$(date +%Y%m%d%H%M%S)"

link() {
  src="$repo/$1"
  dest="$home/$1"
  mkdir -p "$(dirname "$dest")"
  if [ -L "$dest" ] && [ "$(readlink "$dest")" = "$src" ]; then
    echo "ok      $dest"
    return
  fi
  if [ -e "$dest" ] || [ -L "$dest" ]; then
    mkdir -p "$backup/$(dirname "$1")"
    mv "$dest" "$backup/$1"
    echo "backup  $dest -> $backup/$1"
  fi
  ln -s "$src" "$dest"
  echo "linked  $dest -> $src"
}

link layouts/oxocarbon-grey.json
link mods/claude-usage
link mods/oxocarbon-spaces
