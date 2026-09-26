# BUGS

## Open
- Chromium/WebGL runtime smoke has not yet been executed in an available browser runner; instrumentation is not a runtime pass.
- Historical event log contains duplicate ID EVT-2026-0003. Preserve the rows but allocate new IDs from EVT-2026-0005 onward.
- Browser runtime and performance have not yet been independently verified by AI-C on the deployed URL.
- Persistent save is not implemented by design.

## Closed
- Debug seeded runs used an unseeded upgrade-card shuffle. AI-C corrected the shuffle to use the seeded RNG on experimental; real-browser verification remains pending.
