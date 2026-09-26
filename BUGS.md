# BUGS

## Open
- Mutation rupture damage can reduce a non-mutated enemy to HP <= 0 without removing it immediately; that enemy remains active until a later bullet collision resolves the normal death path. This makes the spatial payoff mechanically inconsistent and can leave a nominally lethal rupture victim able to move/contact-damage the player. Found by AI-B static review on 2026-09-27; code-fix attempt was blocked by connector safety checks and must be resolved before judging rupture balance.
- Mutation rupture visual radius overshoots its mechanical radius: the ring geometry has outer radius 1, while animation scales it to `1 + progress * 4.5`, ending near 5.5 visual units for a 4.5-unit damage radius. This weakens spatial legibility. Found by AI-B static review on 2026-09-27; fix attempt was blocked in the same write.
- Chromium/WebGL runtime smoke has not yet been executed in an available browser runner; instrumentation is not a runtime pass.
- Browser runtime and performance have not yet been independently verified by AI-C on the deployed URL.
- Persistent save is not implemented by design.

## Closed
- Historical duplicate `EVT-2026-0003` repaired without deleting its payload: duplicate row reassigned to `EVT-2026-0007`. Static Check is green again at `654bc9a`.
- Debug seeded runs used an unseeded upgrade-card shuffle. AI-C corrected the shuffle to use the seeded RNG on experimental; real-browser verification remains pending.
