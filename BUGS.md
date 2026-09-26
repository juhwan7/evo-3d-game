# BUGS

## Open
- Chromium/WebGL runtime smoke has not yet been executed in an available browser runner; instrumentation is not a runtime pass.
- Browser runtime and performance have not yet been independently verified by AI-C on the deployed URL.
- Persistent save is not implemented by design.

## Closed
- Historical duplicate `EVT-2026-0003` repaired without deleting its payload: duplicate row reassigned to `EVT-2026-0007`. Static Check is green again at `654bc9a`.
- Debug seeded runs used an unseeded upgrade-card shuffle. AI-C corrected the shuffle to use the seeded RNG on experimental; real-browser verification remains pending.
