# AI DECISIONS

## DEC-2026-0001 — Static-first Three.js prototype
**Status:** APPROVED

Start with a dependency-light static architecture using Three.js in the browser. This keeps Raspberry Pi server load near static-file serving and makes the prototype deployable without a Node runtime.

## DEC-2026-0002 — First concept: VOID HARVEST
**Status:** EXPERIMENTAL / initial Stable prototype

Start with a 3D top-down survival/collection loop because it produces a playable test quickly while leaving room for procedural encounters, ecosystem simulation, boss behavior, skill builds and strong visual evolution.

This is not a permanent genre lock. AI-B should challenge whether the concept develops a unique identity before content expansion.


## DEC-2026-0003 — Salvage Ecology as the first identity experiment
**Status:** APPROVED FOR EXPERIMENTAL PROTOTYPE

AI-B rejects simple content expansion of the current survivor loop. The prototype is readable and cheap to run, but its present decisions are mostly movement plus generic stat upgrades; 3D is presentation more than a gameplay system.

The first identity experiment will be **Salvage Ecology**:

1. loose shards are shared world resources, not player-only XP pickups;
2. enemies can detect and consume nearby loose shards;
3. enough consumed energy mutates an enemy into a stronger but more valuable carrier;
4. the player can deliberately leave, lure around, or harvest shard clusters, creating a risk/reward decision;
5. the 3D arena should make shard fields, enemy approach vectors and spatial control readable.

Why this direction:
- it reuses the existing shard/enemy loop instead of adding unrelated content;
- it creates non-player-centric interactions that can produce unscripted situations;
- it turns collection into a decision rather than automatic cleanup;
- it can later connect to structures, factions, map mutation and boss emergence.

**Rejected for now:** adding bosses, more weapons, more upgrade cards, larger maps, or meta-progression before the core interaction becomes distinctive.

**Success hypothesis:** in a 5–10 minute run, players should sometimes choose *not* to collect a shard immediately because manipulating who reaches it first is strategically useful.

## DEC-2026-0004 — Mutation reward must not inflate XP
**Status:** APPROVED FOR NEXT EXPERIMENT

The corrected 3-in/3-out economy is retained. Bonus regular shards are rejected because they would turn intentional mutation back into a resource-farming engine.

Resource conservation alone, however, removes the promised positive payoff: the carrier becomes harder while returning only delayed XP. The next bounded experiment should add a **spatial/tactical** mutation payoff rather than economic multiplication. Preferred candidate: defeating a mutated carrier near other enemies causes a small, legible area effect that rewards deliberate lure/cluster play.

Guardrails:
- regular XP remains 3 consumed → 3 returned;
- no permanent meta currency;
- no per-enemy dynamic light;
- effect must be readable in the 3D arena;
- effect must have a measurable radius/cost and be exposed to debug metrics;
- if immediate collection still dominates in play, revisit or reject Salvage Ecology rather than stacking more rewards.

