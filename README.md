# Evo 3D Game

AI-A / AI-B / AI-C가 장기간 협업하며 **연구 → 설계 → 구현 → 비판 → QA → 복구 → 재검증**을 반복하는 자율진화 3D 웹게임 프로젝트입니다.

현재 플레이어블 프로토타입은 **VOID HARVEST**이며, 서버는 정적 파일 제공에 집중하고 실제 3D 렌더링과 시뮬레이션은 접속한 PC 브라우저 GPU에서 수행합니다.

> 현재 개발 기준 브랜치: `experimental`  
> Stable 기준: `main`  
> 현재 단계: **STAGE 1 · 핵심 루프와 고유 시스템 검증**

## Web

GitHub Pages 배포 대상:

- Game: https://juhwan7.github.io/evo-3d-game/
- Evolution: https://juhwan7.github.io/evo-3d-game/evolution.html
- Status: https://juhwan7.github.io/evo-3d-game/status.html
- Debug run: https://juhwan7.github.io/evo-3d-game/?debug=1&seed=1337

Pages는 `experimental` 브랜치의 정적 사이트를 GitHub Actions로 배포합니다. `experimental`의 Static Check가 성공하면 `main`의 Pages workflow가 해당 브랜치를 checkout해 자동 배포합니다. 최초 Pages deployment도 성공했습니다.

## Current prototype

**VOID HARVEST** — Three.js 기반 3D 탑다운 생존 / 수집 프로토타입.

기본 루프:

`이동 → 자동 전투 → 파편 회수 → 강화 → 압박 증가 → 생존 기록`

현재는 단순 survivor 구조에서 벗어나기 위해 **Salvage Ecology**를 핵심 실험으로 검증 중입니다.

### Salvage Ecology

파편은 플레이어 전용 XP가 아니라 **경쟁 자원**입니다.

- 플레이어가 파편을 즉시 회수할 수 있음
- 일반 적도 가까운 파편을 탐색하고 소비함
- 적이 파편 3개를 먹으면 황금 변이체로 변함
- 변이체는 더 위험해짐
- 변이체를 적 무리 근처에서 처치하면 반경 4.5의 rupture가 발생함
- rupture는 주변 일반 적에게 피해를 주지만 변이 적 연쇄 폭발은 금지
- mutation은 3-in / 3-out으로 XP를 복제하지 않음

핵심 디자인 질문은 단순합니다.

> **파편을 지금 먹는 것과 일부러 미끼로 남기는 것 사이에 실제로 의미 있는 선택이 생기는가?**

이 가설이 5~10분 플레이에서도 성립하지 않으면 시스템을 다시 설계합니다.

## Implemented

### Gameplay
- WASD / 방향키 이동
- 자동 타게팅 / 자동 사격
- 적 추적 / 접촉 피해
- shard XP와 레벨업
- 3개 선택형 업그레이드
- 점진적인 spawn pressure
- HP / 사망 / 재시작
- 일시정지
- Salvage Ecology
- 황금 mutation
- mutation rupture
- WebGL2 미지원 fallback 안내

### Deterministic debug mode

```
?debug=1&seed=1337
```

동일 seed 재현을 위한 seeded RNG와 `window.__VOID_HARVEST_DEBUG__.snapshot`을 제공합니다.

현재 snapshot에는 다음 계측이 있습니다.

- FPS
- enemy / bullet / shard 수
- player shard collects
- enemy shard consumes
- contested share
- mutations
- mutation ruptures
- rupture enemy hits / kills
- rupture hits per mutation
- rupture kills per mutation
- renderer draw calls
- triangles
- geometry / texture count

주의: 현재 `mutationConversionRate`와 전체 `carriedSalvage`는 전략 성과를 그대로 의미하지 않습니다. 미완료 mutation과 완료된 mutation 보유량이 섞일 수 있어 후속 계측 정리가 필요합니다.

### Runtime QA tooling

`scripts/runtime_smoke.mjs`에는 Playwright/Chromium 기반 지속 smoke가 준비되어 있습니다.

- 약 10초 지속 실행
- 2초 간격 5개 샘플
- simulation time 전진 확인
- FPS 숫자 확인
- draw call > 0 확인
- triangle / geometry / texture 수집
- canvas drawing-buffer 확인
- console/page error 감지

단, **실제 Chromium runner에서 이 테스트를 실행한 증거는 아직 확보되지 않았습니다.** Static Check 성공과 브라우저 runtime 통과는 별개로 취급합니다.

## Autonomous AI development

### AI-A · Builder / Lead Developer
실제 게임 구현을 담당합니다.

- gameplay / system 개발
- prototype 구현
- instrumentation
- 코드 수정과 실험
- AI-B에 HANDOFF

### AI-B · Game Director / Critic / Researcher
AI-A의 결론을 그대로 받아들이지 않고 독립적으로 비판합니다.

- 재미와 선택 품질
- 독창성
- UX / 온보딩
- 3D 활용 가치
- 반복 플레이
- 외부 사례 / 공식 문서 / GDC 조사
- AI-C에 HANDOFF

### AI-C · Reliability / QA / Architecture
검증과 구조적 안정성을 담당합니다.

- static / runtime QA
- WebGL/WebGPU 호환성
- FPS / frame time / Draw Call / memory
- 회귀 버그
- 배포 / 보안 / fallback
- Stable 승격 gate

### Mutual recovery

세 AI는 작업 시작 전에 나머지 두 AI의 상태를 확인합니다.

`A → B/C 복구`  
`B → C/A 복구`  
`C → A/B 복구`

`paused / disabled / failed / timeout / stale / 비정상 waiting`은 정상 종료로 취급하지 않습니다.

복구 완료 기준:

`원인 조사 → 수정/fallback → 재활성화 → 실제 재실행 → 결과 생성 → 검증 → 원래 작업 복귀`

한 파일이나 외부 경로가 막혀도 AI 전체를 중지하지 않습니다.

`한 작업 blocked ≠ 프로젝트 stopped`

## Current status

현재 확인된 상태:

| 영역 | 상태 |
|---|---|
| 기본 3D 게임 루프 | 구현됨 |
| Salvage Ecology | Experimental |
| Mutation rupture | Experimental |
| 플레이어 온보딩 | 구현됨 |
| deterministic debug | 구현됨 |
| Static Check | 운영 중 |
| 실제 Chromium/WebGL QA | **미검증** |
| 5~10분 collect-vs-bait 비교 | **미검증** |
| Persistent save | 미구현 |
| Stable 승격 | 보류 |

`experimental`은 현재 `main`보다 많은 실험 커밋이 앞서 있으며, 실제 브라우저 runtime 및 선택 품질 검증 전에는 자동으로 Stable로 승격하지 않습니다.

## Known work in progress

우선순위가 높은 미완료 작업:

1. 실제 Chromium/WebGL runner 확보 및 runtime smoke 실행
2. 동일 seed에서 **collect-now vs intentional-bait** 5~10분 비교
3. `mutationConversionRate` / partial salvage 계측 의미 정리
4. `state.json ↔ handoff.json ↔ tasks.json ↔ recovery_queue.json` 상태 동기화 강화
5. `docs/RECOVERY.md`와 task 문구를 현재 A/B/C 상호복구 정책으로 완전히 정렬
6. governance drift를 Static Check가 자동 탐지하도록 validator 강화
7. 실제 수치가 확보된 뒤에만 성능 최적화와 밸런스 튜닝

## Evolution history

성공뿐 아니라 실패·보류·롤백·재검토도 삭제하지 않고 기록합니다.

- `data/ai/events.jsonl` — 머신이 읽는 immutable 이벤트 로그
- `docs/AI_TIMELINE.md` — 사람이 읽는 개발 타임라인
- `data/ai/state.json` — 현재 canonical 프로젝트 상태
- `data/ai/handoff.json` — 다음 AI에게 넘기는 최신 HANDOFF
- `data/ai/tasks.json` — task / lease 상태
- `data/ai/recovery_queue.json` — 중단·복구 이력
- `AI_DECISIONS.md` — 주요 의사결정
- `FAILED_EXPERIMENTS.md` — 실패와 재도전 조건
- `BUGS.md` — open / closed bug
- `PERFORMANCE.md` — 성능 예산과 실제 측정 근거

웹에서는 `/evolution.html`과 `/status.html`로 프로젝트 상태를 확인할 수 있습니다.

## Local run

정적 웹 서버에서 저장소 루트를 서비스하면 됩니다.

```bash
python3 -m http.server 8080
```

- Game: http://localhost:8080/
- Evolution: http://localhost:8080/evolution.html
- Status: http://localhost:8080/status.html
- Deterministic debug: http://localhost:8080/?debug=1&seed=1337

## Branch policy

- `main` — 검증된 Stable 기준
- `experimental` — 새로운 gameplay / UX / QA 실험

Stable 승격 전 최소 확인 항목:

- Build / Static
- actual Browser Runtime
- Core Gameplay
- WebGL compatibility
- FPS / frame time
- Draw Calls / memory
- Save/state impact
- Regression
- console/runtime errors
- AI-B 독립 game-direction review
- AI-C reliability review

기능 작성자가 자기 변경을 단독으로 Stable 승격하지 않습니다.
