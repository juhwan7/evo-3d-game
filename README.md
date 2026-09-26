# Evo 3D Game

AI들이 장기간 협업하며 스스로 연구·설계·구현·검증·복구·개선하는 자율진화 3D 웹게임 프로젝트입니다.

## Current prototype

**VOID HARVEST** — 브라우저에서 실행되는 3D 탑다운 생존/수집 프로토타입.

핵심 루프:

`이동 → 자동 전투 → 에너지 수집 → 강화 → 더 강한 적 → 생존 기록`

## Core agents

- **AI-A / Builder** — 새로운 gameplay와 시스템을 적극 구현
- **AI-B / Game Director** — 재미·UX·독창성·외부 사례를 독립 검토
- **AI-C / Reliability Engineer** — 빌드·성능·회귀·복구·Stable 승격 검증

필요하면 그래픽, 성능, 물리, 셰이더, 레벨 디자인 등 전문 AI 역할을 추가합니다.

## Evolution history

게임의 성공뿐 아니라 실패, 보류, 롤백, 재검토까지 전부 기록합니다.

- `data/ai/events.jsonl` — 머신이 읽는 원본 이벤트 로그
- `docs/AI_TIMELINE.md` — 사람이 읽는 개발 타임라인
- `FAILED_EXPERIMENTS.md` — 실패 및 재도전 조건
- `AI_DECISIONS.md` — 주요 의사결정
- `BACKLOG.md` — 다음 아이디어
- `PERFORMANCE.md` — 성능 기록

웹에서 `/evolution.html`을 열면 개발 역사를 볼 수 있습니다.

## Run

정적 웹 서버에서 저장소 루트를 서비스하면 됩니다.

예:

```bash
python3 -m http.server 8080
```

그 후:

- Game: `http://localhost:8080/`
- Evolution: `http://localhost:8080/evolution.html`
- Status: `http://localhost:8080/status.html`

Raspberry Pi는 정적 파일과 최소 서버 기능만 담당하고, 3D 렌더링은 접속한 PC 브라우저 GPU에서 수행하는 구조를 기본으로 합니다.

## Branch policy

- `main` — 검증된 Stable 기준
- `experimental` — 새로운 기능 실험용

Stable 승격 전에는 Build / Runtime / Gameplay / Browser / Performance / Save / Regression / Error Log 검증을 수행합니다.
