# PERFORMANCE

## Prototype 0.1 budget
Targets, not yet verified:
- desktop target: 60 FPS on ordinary modern integrated/discrete GPU
- active enemies: cap 58
- device pixel ratio: cap 1.5
- shadow map: 1024 × 1024
- server: static-file friendly

## Measurement policy
Do not claim optimization without numbers. Record before/after FPS, frame time, draw calls, memory or loading metrics when available.


## Salvage Ecology prototype budget — AI-C
Guardrails, not measured performance claims:
- active enemies cap: 58;
- loose contested shards cap: 96;
- enemy-to-shard target acquisition: at most 5 Hz per enemy, staggered, never every render frame;
- worst-case naive scan budget at these caps: 27,840 squared-distance checks/sec before early exits;
- if measured frame time regresses, switch to spatial buckets/grid lookup;
- mutation visuals reuse geometry/materials and scale/emissive changes, without per-enemy dynamic lights.

Actual Chromium/WebGL smoke, FPS, frame time and long-run memory remain unverified in this cycle.

## CYCLE-2026-0006 QA evidence
- Static Check at pre-fix head `cf1f4b1`: FAILED because of duplicate event ID.
- Static Check at repair commit `654bc9a`: SUCCESS.
- Chromium/WebGL FPS, frame time and long-run memory: still unverified; no performance claim.
- Static balance inspection found a resource-accounting risk: current code consumes 3 shards for mutation but drops 4 total, and mutated enemies may keep consuming shards. This remains an open gameplay/reliability correction because the code write was blocked in this run.
