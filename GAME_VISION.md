# GAME VISION

## Working title
VOID HARVEST

## Prototype identity
A fast, readable 3D browser survival game where a small autonomous salvage core enters an abandoned orbital mining field, fights converging constructs, collects energy shards and evolves during the run.

## Core loop
Move → auto-fight → collect shards → choose upgrades → survive denser threats → improve the build.

## Why this concept
- immediately playable with minimal tutorial
- genuinely benefits from 3D movement, lighting, silhouettes and spatial threat reading
- procedural encounters and build combinations can expand without a massive hand-authored content burden
- static-first architecture keeps Raspberry Pi server cost low
- easy to benchmark because enemy count, projectiles and effects are measurable

## Long-term identity target
The game should evolve beyond a generic survivor clone through a **living salvage ecosystem**. The first testable expression is contested salvage: enemies and the player compete for loose shards, enemies can mutate by consuming them, and the player can intentionally manipulate resource flow. Later systems may connect structures, factions and map mutation to the same economy.

## Non-goals
- photorealism for its own sake
- server-heavy authoritative simulation in the early project
- huge maps before the core loop is fun
- permanent placeholder visuals
