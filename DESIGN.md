# DESIGN.md - wrong-answer.ai Design System

이 문서는 `wrong-answer.ai` 프로젝트의 타이포그래피, 색상, 공간, 모션 및 미학(Aesthetics)에 대한 **단일 진실 공급원(Single Source of Truth)**입니다. 모든 UI 컴포넌트 개발 시 이 원칙을 준수해야 합니다.

## 1. Aesthetic (미학)
**Utilitarian Minimal (실용주의적 미니멀리즘)**
- 알록달록한 '애들 앱' 느낌을 완전히 배제합니다.
- 고등학생을 존중하는 캘리포니아 스타트업 느낌의 깔끔한 노트(Notebook) 메타포를 가집니다.
- 장식적 요소(물결무늬, 떠다니는 원 등)는 배제하고, 핵심 콘텐츠(문제 이미지, AI Socratic 채팅, 수식)가 돋보이게 합니다.

## 2. Color Palette (색상)
- **Primary:** `Deep Blue (#1E3A8A)`
  - 앱의 신뢰감을 주고 구조를 잡는 주요 색상 (헤더, 주요 강조 텍스트).
  - 업계(에듀테크, 핀테크)에서 '지적이고 산뜻한' 느낌을 줄 때 사용하는 표준 안전 자산.
- **Secondary (Accent):** `Teal/Mint (#0D9488 ~ #14B8A6)`
  - 학생이 매일 누르는 인터랙션(CTA, 스트릭 활성화, 완료 상태)에 사용하여 산뜻한 보상감 제공.
- **Background:** `Slate 50 (#F8FAFC)`
  - 완전한 눈부신 흰색 대신 눈이 편안한 페이퍼 톤.
- **Surface:** `White (#FFFFFF)`
  - 카드, 모달 등 배경과 분리할 표면.

## 3. Typography (서체)
- **UI & Body:** `Pretendard`
  - 기본 폰트. 어떤 모바일 기기에서도 뛰어난 가독성을 보장하는 가장 안전하고 중립적인 서체.
- **Data & Numbers:** `JetBrains Mono` 또는 `Geist Mono` (Tailwind `font-mono`)
  - 스트릭 누적일수, 날짜, 기타 수치 데이터 및 수학 기호 등 정밀함이 필요한 곳.

## 4. Spacing & Layout (여백 & 레이아웃)
- **Grid System:**
  - 철저한 `8px` 그리드를 사용.
- **Density:**
  - `Generous (여유로움)`. 고등학생의 인지 부하를 줄이기 위해 여백을 크게 가져갑니다 (일반적인 밀도의 1.5배).
- **Shadows vs Borders:**
  - **그림자(Shadow) 사용 최소화:** 대신 1px의 은은한 Border(예: `border-slate-200`)를 사용하여 입체감보다 평면적인 깔끔함을 추구합니다. 모바일에서 시원하고 정돈된 룩앤필 제공.

## 5. Components & Iconography (장식과 컴포넌트)
- **아이콘:**
  - 이모지(Emoji)를 남발하지 않습니다. 대신 정교하고 얇은 선 아이콘(Lucide React 아이콘 등)을 사용합니다.
- **상태와 네비게이션:**
  - Socratic AI 등 복잡한 상호작용에서는 상단에 명확한 진행률(Phase Bar)이나 상태를 시각화합니다.
  - 앱의 글로벌 네비게이션은 핵심 액션(카메라 업로드)을 상시 유지하는 **하단 탭 바(Bottom Nav)**를 기준으로 합니다.
- **Touch Targets:**
  - 접근성(A11y) 기준에 따라 모든 터치형 인터랙션(버튼, 칩, 탭)은 최소 `44x44px`을 보장합니다.

## 6. Motion (모션)
- **Intentional (의도적 모션):**
  - 화려한 바운스 애니메이션은 금지.
  - 사용자 액션에 대한 피드백(업로드 완료, 스트릭 달성 시 스케일 변화 등)에만 짧고 명확한 마이크로 인터랙션을 사용합니다.

---
> 이 문서는 `/design-consultation` 및 `/plan-design-review` 합의의 결과물입니다.
