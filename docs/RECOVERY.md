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

## Cross-agent watchdog
AI-A, AI-B and AI-C all check one another's observable progress. A separate Recovery Supervisor also performs a periodic liveness pass. No single core agent is a single point of failure.
