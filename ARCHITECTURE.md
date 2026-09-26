# ARCHITECTURE

## Current prototype
Static-first browser game.

```
Raspberry Pi / GitHub Pages / static host
        ↓
HTML + CSS + ES modules
        ↓
Player PC browser
        ↓
Three.js WebGL rendering + game simulation
```

## Rendering
- Three.js r187 CDN module
- WebGL renderer
- pixel ratio capped at 1.5
- simple geometry and materials in prototype
- shadow map capped at 1024²

## State
Prototype run state is in browser memory only. Persistent save is intentionally deferred until progression design is validated.

## Evolution observability
- `data/ai/events.jsonl`: structured source of truth for AI activity
- `docs/AI_TIMELINE.md`: readable narrative
- `evolution.html`: timeline UI
- `status.html`: project snapshot

## Branch strategy
- `main`: Stable
- `experimental`: risky/new work
