<p align="center">
  <img src="https://img.shields.io/badge/Wrong%20Answer%20AI-Personalized%20Learning-10b981?style=for-the-badge&logoColor=white" alt="Wrong Answer AI" />
</p>

<h1 align="center">📝 오답노트 (Wrong Answer AI)</h1>

<p align="center">
  <strong>"틀린 이유 속에 정답이 있습니다."</strong><br/>
  단순히 정답만 외우는 양치기 공부는 이제 그만!<br/>
  AI 전담 선생님과 함께 진짜 내 실력을 키우는 오답 분석 솔루션.
</p>

<p align="center">
  <a href="https://wrong-answer.ai">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-wrong--answer.ai-10b981?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white" />
</p>

<p align="center">
  <img src="https://via.placeholder.com/800x400/10b981/ffffff?text=Wrong+Answer+AI+Dashboard" alt="Hero Interface" style="border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />
</p>

---

## ✨ Overview

**오답노트 (Wrong Answer AI)**는 학생의 시험지나 문제집에서 틀린 문제를 사진으로 찍어 올리면, AI가 문제와 프리 과정을 분석해 **'오답의 진짜 원인'**을 찾아주고 맞춤형 유사 문제를 통해 취약점을 완벽히 보완해주는 AI 학습 플랫폼입니다.

---

## 🎯 Key Features

### 📸 똑똑한 문제 스캔 및 분석
- **AI 비전 인식**: 스마트폰으로 수학/과학 등 틀린 문제와 내 풀이과정을 찍어 올리면 텍스트와 수식을 추출합니다.
- **다양한 포맷 지원**: 이미지(png, jpeg) 외에도 PDF, Word 구조까지 완벽히 파악합니다.

### 🤖 1:1 AI 튜터 챗봇
- 단순히 해설을 뱉어내는 AI가 아닙니다. 학생과 대화하며 **단계적 힌트**를 제공하여 스스로 생각하는 힘을 길러줍니다.
- **원인 정밀 진단**: 단순 연산 실수인지, 개념의 부재인지, 출제 의도 파악 오류인지 AI가 패턴을 분석합니다.

### 🎯 무제한 유사 문제 (RAG)
- **변형 문제 자동 생성**: 벡터 스토어에 축적된 지식을 기반으로, 학생이 틀렸던 난이도와 개념 요소가 일치하는 유사/변형 문제를 즉시 제공합니다.
- "이해한 것이 맞는지 다시 한 번 확인해 볼까요?"

### 📊 취약점 대시보드
- 최근 학습 기록 및 과목별/단원별 정답률 추이를 시각적 차트(Recharts)로 제공합니다.
- 약점이 강점으로 바뀌는 과정을 직관적으로 확인할 수 있습니다.

---

## 🏗️ Architecture & Stack

### Frontend
- **React 18 + Vite** 기반의 초고속 SPA
- **Tailwind CSS & shadcn/ui**를 활용한 깔끔하고 미니멀한 UI
- **i18next** (한국어/영어 지원), **next-themes** (다크/라이트 모드)

### Backend
- **Express + TypeScript** 구조의 안정적인 API 서버
- **Drizzle ORM**을 통한 타입 안전 데이터베이스 접근
- **Passport.js** 세션 및 OAuth 기반 소셜 로그인(구글, 카카오, 네이버) 호환

### AI & Data
- **OpenAI API**: `gpt-4o` 기반 챗봇, `text-embedding-3-small` 활용 벡터 변환
- **PostgreSQL (pgvector)**: 업로드된 문서나 텍스트 데이터의 시맨틱 검색 엔진 역할 담당 (Neon / Supabase 연동)
- **Stripe** 연동을 통한 유료 구독 결제 시스템 내장

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** 20+ 
- **PostgreSQL** 15+ (with `pgvector` extension)

### 2. Installation
```bash
git clone https://github.com/junhan95/wrong-answer.git
cd wrong-answer
npm install
```

### 3. Environment Variables
프로젝트 루트(`.env`)에 환경변수를 설정합니다. (`.env.example` 포맷 참고)
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=your_secret
OPENAI_API_KEY=sk-...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
# OAuth (Google, Kakao, Naver) etc...
```

### 4. Database Setup & Run
```bash
npm run db:push     # Drizzle schema 동기화
npm run dev         # 로컬 개발 서버 실행 (http://localhost:5000)
```

---

## 📄 License
This project is licensed under the **MIT License**.

<p align="center">
  <sub>Built with ❤️ by <a href="https://github.com/junhan95">junhan95</a></sub>
</p>
