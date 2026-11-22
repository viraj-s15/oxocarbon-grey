#!/usr/bin/env python3
"""Claude Code hook: writes the current turn's output tokens per second for this herdr terminal."""
import json
import os
import sys
from datetime import datetime

# A turn rarely writes more than this, and reading only the end keeps each run cheap.
TAIL_BYTES = 512 * 1024


def parse_time(stamp):
    return datetime.fromisoformat(stamp.replace("Z", "+00:00")).timestamp()


def read_tail(path):
    with open(path, "rb") as f:
        f.seek(0, os.SEEK_END)
        size = f.tell()
        f.seek(max(0, size - TAIL_BYTES))
        lines = f.read().split(b"\n")
    # The first line can start mid-entry when the read began inside the file.
    if size > TAIL_BYTES:
        lines = lines[1:]
    entries = []
    for line in lines:
        try:
            entry = json.loads(line)
        except ValueError:
            continue
        if isinstance(entry, dict) and "timestamp" in entry and not entry.get("isSidechain"):
            entries.append(entry)
    return entries


def is_prompt(entry):
    if entry.get("type") != "user" or entry.get("isMeta"):
        return False
    content = entry.get("message", {}).get("content")
    if isinstance(content, str):
        return True
    return any(isinstance(c, dict) and c.get("type") != "tool_result" for c in content or [])


def turn_rate(entries):
    start = max((i for i, e in enumerate(entries) if is_prompt(e)), default=0)
    tokens, seconds = 0, 0.0
    # Claude Code writes one entry per content block, and all blocks of a response share its id.
    responses = {}
    before = None
    for entry in entries[start:]:
        if entry.get("type") != "assistant":
            before = entry
            continue
        message = entry.get("message", {})
        key = message.get("id") or entry.get("requestId")
        if key is None or before is None:
            continue
        r = responses.setdefault(key, {"start": parse_time(before["timestamp"]), "tokens": 0})
        r["end"] = parse_time(entry["timestamp"])
        r["tokens"] = max(r["tokens"], message.get("usage", {}).get("output_tokens") or 0)
    for r in responses.values():
        if r["end"] > r["start"] and r["tokens"]:
            tokens += r["tokens"]
            seconds += r["end"] - r["start"]
    return (tokens / seconds, tokens) if seconds else (None, 0)


def main():
    terminal = os.environ.get("HC_TERMINAL_ID")
    if not terminal:
        return
    transcript = json.load(sys.stdin).get("transcript_path")
    if not transcript or not os.path.exists(transcript):
        return
    tps, tokens = turn_rate(read_tail(transcript))
    if tps is None:
        return
    app = os.environ.get("HERDR_APP_HOME") or os.path.expanduser("~/.config/herdr-app")
    folder = os.path.join(app, "data", "claude-tps", "terminals")
    os.makedirs(folder, exist_ok=True)
    out = os.path.join(folder, f"{terminal}.json")
    tmp = f"{out}.tmp"
    with open(tmp, "w") as f:
        json.dump({"tps": round(tps, 1), "tokens": tokens}, f)
    os.replace(tmp, out)


if __name__ == "__main__":
    main()
