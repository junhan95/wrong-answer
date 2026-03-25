// 크레딧 충전 패키지 — 서버/클라이언트 공용 상수
export const CREDIT_PACKAGES = {
  starter: {
    id: "starter",
    name: "Starter",
    priceKRW: 9900,
    credits: 100,
    bonusCredits: 0,
    get totalCredits() { return this.credits + this.bonusCredits; },
    features: ["100 크레딧 충전", "유효기간 없음", "약 100회 오답 분석"],
  },
  plus: {
    id: "plus",
    name: "Plus",
    priceKRW: 28900,
    credits: 300,
    bonusCredits: 30,
    get totalCredits() { return this.credits + this.bonusCredits; },
    features: ["330 크레딧 (10% 보너스)", "학부모 안심 주간 리포트", "AI 튜터 최우선 답변"],
  },
  premium: {
    id: "premium",
    name: "Premium",
    priceKRW: 47900,
    credits: 500,
    bonusCredits: 100,
    get totalCredits() { return this.credits + this.bonusCredits; },
    features: ["600 크레딧 (20% 보너스)", "취약점 기반 모의고사 3장", "Plus 요금제 혜택 포함"],
  },
} as const;

export type CreditPackageId = keyof typeof CREDIT_PACKAGES;
