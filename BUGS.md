# BUGS

## Open
- Chromium/WebGL runtime smoke has not yet been executed in an available browser runner; instrumentation is not a runtime pass.
- Browser runtime and performance have not yet been independently verified by AI-C on the deployed URL.
- Persistent save is not implemented by design.

## Closed
- Mutation rupture lethal-hit handling fixed at `b4f39fd`: rupture victims at HP <= 0 are removed immediately through a bounded victim pass, drop one normal shard, increment kills, and expose `ruptureKills` telemetry. Static Check run 36280039113 succeeded.
- Mutation rupture visual radius fixed at `b4f39fd`: ring scale now ends at the authoritative 4.5-unit mechanical radius instead of ~5.5. Static Check run 36280039113 succeeded.
- Historical duplicate `EVT-2026-0003` repaired without deleting its payload: duplicate row reassigned to `EVT-2026-0007`. Static Check is green again at `654bc9a`.
- Debug seeded runs used an unseeded upgrade-card shuffle. AI-C corrected the shuffle to use the seeded RNG on experimental; real-browser verification remains pending.
