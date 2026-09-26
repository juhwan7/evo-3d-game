import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]

required = [
    "index.html",
    "game.js",
    "evolution.html",
    "status.html",
    "AGENTS.md",
    "GAME_VISION.md",
    "data/ai/events.jsonl",
    "data/ai/state.json",
    "data/ai/handoff.json",
    "data/ai/tasks.json",
]

for rel in required:
    if not (root / rel).is_file():
        raise SystemExit(f"missing required file: {rel}")

events = []
for n, line in enumerate((root / "data/ai/events.jsonl").read_text(encoding="utf-8").splitlines(), 1):
    if not line.strip():
        continue
    event = json.loads(line)
    for key in ("event_id", "timestamp", "agent", "cycle_id", "title", "status"):
        if key not in event:
            raise SystemExit(f"events.jsonl line {n}: missing {key}")
    events.append(event)

for rel in ("data/ai/state.json", "data/ai/handoff.json", "data/ai/tasks.json"):
    json.loads((root / rel).read_text(encoding="utf-8"))

ids = [e["event_id"] for e in events]
if len(ids) != len(set(ids)):
    raise SystemExit("duplicate event_id detected")

print(f"state validation OK ({len(events)} events)")
