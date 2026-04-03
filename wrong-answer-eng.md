---
status: ACTIVE
generated: 2026-04-03
skill: /plan-eng-review
branch: main
repo: junhan95/wrong-answer
---

# Eng Plan: wrong-answer.ai — 도메인 모델 & 아키텍처

## 아키텍처 결정 요약

| # | 이슈 | 결정 |
|---|------|------|
| 1 | 데이터 모델 | REDESIGN — wrong-answer.ai 전용 도메인 모델 (WiseQuery 테이블 제거) |
| 2 | RAG 아키텍처 | 구조적 메타데이터 (subject, errorCategory, conceptTags) + 벡터 하이브리드 |
| 3 | SM-2 상태 저장 | 별도 spacedRepetition 테이블 + reviewHistory 로그 |
| 4 | Socratic 상태 | DB에 phase 저장 + system prompt 주입 |
| 5 | 카카오 알림톡 | 비즈니스 채널 사전 등록 + 임시 이메일 대체 |
| 6 | 학부형-자녀 연결 | 별도 familyLinks 테이블 (다대다, 알림 설정 포함) |
| 7 | 사진 분석 | 비동기 큐 + SSE (chunkingQueue.ts 패턴 재사용) |

---

## 데이터 모델 다이어그램

```
users (재사용, WiseQuery 컬럼 정리)
  │
  ├── wrongAnswers (새 핵심 테이블)
  │     ├── subject: enum(수학|국어|영어|과학|사회)
  │     ├── imageUrl: Supabase Storage URL
  │     ├── question: text (Vision으로 추출)
  │     ├── analysis: text (AI 풀이)
  │     ├── errorCategory: enum(calculation|concept|exam_intent)
  │     ├── conceptTags: text[] -- ['수열','등차수열',...]
  │     ├── difficulty: 1-5
  │     ├── embeddingVector: vector(1536) -- for RAG
  │     └── analysisStatus: analyzing|complete|failed
  │           │
  │           ├── spacedRepetition (SM-2 상태)
  │           │     ├── easeFactor: real (초기 2.5)
  │           │     ├── intervalDays: int (초기 1)
  │           │     ├── repetitionCount: int
  │           │     └── nextReviewAt: timestamp
  │           │
  │           ├── reviewHistory (복습 기록 로그)
  │           │     ├── outcome: success|partial|fail
  │           │     ├── quality: 0-5 (SM-2 quality score)
  │           │     └── responseTimeMs: int
  │           │
  │           └── tutorSessions (Socratic 대화)
  │                 ├── mode: direct|socratic
  │                 ├── phase: exploring|hinting|revealing|complete
  │                 ├── hintCount: int
  │                 └── tutorMessages (대화 메시지)
  │                       ├── role: user|assistant
  │                       ├── content: text
  │                       └── phase: (메시지 시점의 phase 스냅샷)
  │
  ├── streaks (스트릭 & 학습 통계)
  │     ├── currentStreak: int
  │     ├── longestStreak: int
  │     ├── lastStudyDate: date
  │     └── totalReviewsDone: int
  │
  ├── familyLinks (학부형-자녀 연결)
  │     ├── parentUserId → users.id
  │     ├── childUserId → users.id
  │     ├── relation: mother|father|guardian
  │     ├── notificationEnabled: boolean
  │     └── reportEmail: varchar (알림 수신 이메일 별도 설정)
  │
  └── reportDeliveries (리포트 발송 로그)
        ├── channel: email|kakao
        ├── status: sent|failed
        ├── weekStart: date
        └── sentAt: timestamp

KEEP (재사용):
  sessions, subscriptions, creditTransactions, auditEvents

REMOVE (WiseQuery 잔재):
  projects, folders, conversations, messages, files, fileChunks,
  retentionPolicies, pendingNotifications, googleDriveTempFiles
```

---

## 데이터 흐름 다이어그램

### Flow 1: 사진 업로드 → 분석 → 히스토리 저장

```
Student (Mobile)          Server                    Background Worker
      │                     │                              │
      │── POST /analyze ──► │                              │
      │                     │ create wrongAnswer           │
      │                     │ (status: analyzing)          │
      │◄── 200 {id} ────── │                              │
      │                     │── enqueue(wrongAnswerId) ──► │
      │── SSE subscribe ──► │                              │
      │                     │                    GPT-4o Vision call
      │                     │                    ↓ (15-30초)
      │                     │                    parse: subject,
      │                     │                    errorCategory,
      │                     │                    conceptTags,
      │                     │                    analysis
      │                     │                    ↓
      │                     │                    embed analysis text
      │                     │                    → embeddingVector
      │                     │                    ↓
      │                     │                    create spacedRepetition
      │                     │                    (easeFactor 2.5, interval 1day)
      │                     │                    ↓
      │                     │◄── status=complete ─────────│
      │◄── SSE event ────── │                              │
      │   (analysis ready)  │                              │
```

### Flow 2: Socratic 복습 세션

```
Student                   Server (routes)           DB
   │                          │                      │
   │── POST /tutor-sessions ─► │                      │
   │   {wrongAnswerId, mode}   │── create session ──► │
   │◄── {sessionId, phase} ── │   (phase: exploring) │
   │                          │                      │
   │── POST /tutor-messages ─► │                      │
   │   {content: "..."}       │── read phase ───────► │
   │                          │◄── exploring ────────│
   │                          │                      │
   │                          │ build system prompt:  │
   │                          │ "Phase: exploring.    │
   │                          │  학생 사고 파악 먼저. │
   │                          │  답 주지 말 것."      │
   │                          │ + RAG: 관련 오답 top-3│
   │                          │                      │
   │◄── SSE stream ────────── │ GPT streams response │
   │   (AI 질문: "어디서      │                      │
   │    막혔어?")             │── update phase ─────► │
   │                          │   (if hintCount >= 2) │
   │                          │   → phase: hinting   │
   │                          │── save message ─────► │
   │                          │── log reviewHistory ─► │
```

### Flow 3: 주간 학부형 리포트 (이메일 → 알림톡)

```
Cron (월 09:00)          Server              DB              Email/Kakao
      │                    │                  │                   │
      │── trigger ────────► │                  │                   │
      │                    │── query ─────────► │                  │
      │                    │   familyLinks      │                  │
      │                    │   (notification=on)│                  │
      │                    │◄── parents list ── │                  │
      │                    │                  │                   │
      │                    │ for each parent:  │                   │
      │                    │── query ─────────► │                  │
      │                    │  child wrongAnswers│                  │
      │                    │  (이번 주)        │                  │
      │                    │◄── aggregated ─── │                  │
      │                    │                  │                   │
      │                    │ render HTML report │                   │
      │                    │── send email ──────────────────────► │
      │                    │   (임시: nodemailer)                  │
      │                    │── log reportDelivery ─► │            │
      │                    │                  │                   │
      │                    │ [알림톡 승인 후]  │                   │
      │                    │── Solapi API ──────────────────────► │
      │                    │   (카카오 BizMessage)                 │
```

---

## SM-2 알고리즘 상태 머신

```
신규 오답 등록
      │
      ▼
[easeFactor=2.5, interval=1, repetitionCount=0]
      │
      ▼ (nextReviewAt 도달 → 복습 시작)
      │
      ├── quality 0-2 (완전 실패)
      │      → interval = 1일
      │      → repetitionCount 유지
      │      → easeFactor 감소 (min 1.3)
      │
      ├── quality 3 (아슬아슬 성공)
      │      → repetitionCount += 1
      │      → interval = interval * easeFactor
      │      → easeFactor 변경 없음
      │
      └── quality 4-5 (성공)
             → repetitionCount += 1
             → interval = interval * easeFactor
             → easeFactor = easeFactor + 0.1 - (5-q)*(0.08+(5-q)*0.02)
             → nextReviewAt = now + interval days
```

---

## 테스트 커버리지 맵

```
wrongAnswers 분석 파이프라인
├── [→E2E] 사진 업로드 → status:analyzing 즉시 반환
├── [unit] Vision API 응답 → 구조화된 레코드 파싱
├── [unit] analysisStatus: analyzing → complete 전환
├── [unit] analysisStatus: failed (Vision API timeout)
├── [unit] errorCategory 분류 정확도 [→EVAL]
└── [→E2E] SSE 이벤트 deliverd on completion

SM-2 알고리즘
├── [unit] 초기값: easeFactor=2.5, interval=1
├── [unit] quality=5: easeFactor 증가, interval 성장
├── [unit] quality=2: interval 리셋, easeFactor 감소
├── [unit] easeFactor 최솟값 1.3 하드캡
├── [unit] nextReviewAt 정확한 날짜 계산
└── [unit] repetitionCount 누적

Socratic 상태 머신
├── [unit] phase: exploring → hinting (hintCount >= 2)
├── [unit] phase: hinting → revealing (hintCount >= 4)
├── [unit] phase: revealing → complete
├── [unit] direct 모드: phase 전환 없음
└── [→E2E] 전체 Socratic 대화 흐름

스트릭 계산
├── [unit] 오늘 복습: streak +1
├── [unit] 오늘 이미 복습: 중복 증가 없음
├── [unit] 어제 미복습: streak 리셋 to 1
├── [unit] 2일 이상 미복습: streak 리셋 to 1
└── [unit] longestStreak 업데이트

familyLinks
├── [unit] 부모-자녀 연결 생성
├── [unit] 동일 쌍 중복 연결 방지 (unique constraint)
├── [unit] 부모의 자녀 오답 조회 (read-only)
└── [→E2E] 주간 리포트 이메일 발송
```

---

## 파일 변경 계획

```
REDESIGN (교체):
  shared/schema.ts          ← 전면 재작성 (WiseQuery → wrong-answer.ai 도메인)

NEW:
  server/wrongAnswers.ts    ← Vision 분석 서비스
  server/spacedRepetition.ts← SM-2 알고리즘 구현
  server/socractic.ts       ← Socratic phase 관리 + prompt builder
  server/streaks.ts         ← 스트릭 계산 로직
  server/reports.ts         ← 주간 리포트 생성 + 이메일 발송
  server/prompts/           ← 과목별 system prompt 템플릿
    math.ts | korean.ts | english.ts | science.ts | social.ts

REPURPOSE:
  server/chunkingQueue.ts   ← Vision 분석 큐로 재사용
  server/scheduler.ts       ← 주간 리포트 cron으로 재사용
  server/openai.ts          ← generateEmbedding 재사용, Vision 함수 추가
  server/supabaseStorage.ts ← 이미지 업로드 재사용

REMOVE (WiseQuery 잔재):
  server/chunking.ts        (파일 청킹, 불필요)
  server/filterParser.ts    (파일 필터, 불필요)
  server/routes/            (WiseQuery API 라우트들)
```

---

## 즉시 실행 액션 (비기술)

| 우선순위 | 작업 | 타임라인 |
|---------|------|---------|
| 🔴 즉시 | 카카오 비즈니스 채널 신청 (https://business.kakao.com) | 오늘 |
| 🔴 즉시 | 사업자등록번호 확인 (없으면 개인사업자 등록 시작) | 이번 주 |
| 🟡 이번 주 | Solapi 계정 생성 + 알림톡 발신번호 등록 | 이번 주 |
| 🟡 이번 주 | 알림톡 템플릿 초안 작성 + 심사 제출 | 이번 주 |

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | /plan-ceo-review | Scope & strategy | 1 | DONE | 6 expansions, 5 accepted |
| Eng Review | /plan-eng-review | Architecture & tests | 1 | DONE | 7 arch decisions locked |
| Design Review | /plan-design-review | UI/UX gaps | 0 | - | - |

VERDICT: ENG REVIEWED — 다음 단계: /plan-design-review 또는 구현 시작.
구현 시작 시 shared/schema.ts 재작성부터.
