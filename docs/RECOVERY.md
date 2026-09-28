# SELF-HEALING OPERATIONS

## Objective
The project must keep moving without a human having to wake a stopped agent.

## Recovery state machine
DETECTED → DIAGNOSING → RECOVERING → RERUNNING → VERIFYING → RESOLVED → RESUMED

If diagnosis is not conclusive, record `cause: UNCONFIRMED` and separate observed facts from hypotheses.

## Recovery Queue
Source of truth: `data/ai/recovery_queue.json`.

Each item contains:
- recovery_id
- detected_at
- component
- task
- last_known_good
- current_status
- symptoms
- confirmed_facts
- suspected_causes
- attempted_methods
- next_method
- recheck_condition
- resolution
- resolved_at

Resolved incidents remain in the file as historical evidence.

## Retry discipline
- First failure: diagnose and retry after a targeted correction.
- Second same-class failure: modify the recovery strategy or system.
- Repeated identical retries are forbidden.
- Use fallback/isolation/rollback when the primary path is unhealthy.
- Never forge success by editing only timestamps/status labels.

## Resume discipline
Recovery is not the project goal. Once verified, immediately return to the unfinished task identified by the latest valid task/handoff/commit.

## Ownership
A/B/C mutually preflight and recover interrupted peers before primary work. The agent that detects an interrupted peer owns the immediate diagnose → repair/fallback → rerun → verify loop for that cycle. AI-C additionally owns structural runtime reliability, browser/runtime verification, CI architecture, recurring recovery-system defects, and cross-agent recovery design. There is no separate Recovery agent or scheduled Recovery Supervisor.

## Cross-agent watchdog
Every A/B/C cycle checks the other two agents' automation state, recent execution/progress, handoff, leases, recovery queue, and relevant GitHub Actions. A peer is recovered only after a real rerun produces verifiable output; changing a status or enabled flag alone is insufficient. Repeated failure classes require a different recovery strategy or a structural prevention improvement rather than identical retries.
