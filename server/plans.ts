// ─── AI 모델 설정 ─────────────────────────────────────────────
export const AI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
export const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
export const AI_MAX_TOKENS = 4096;

// ─── 쿼터 설정 ────────────────────────────────────────────────
export const DAILY_FREE_LIMIT = Number(process.env.DAILY_FREE_LIMIT) || 3;
export const RAG_SIMILARITY_THRESHOLD = 0.35;
export const RAG_MAX_CONTEXTS = 5;

// ─── 구독 플랜 (스토리지 구조 호환용) ──────────────────────────
export const PLANS = {
  FREE: "free",
  BASIC: "basic",
  PRO: "pro",
  CUSTOM: "custom",
} as const;

export type Plan = typeof PLANS[keyof typeof PLANS];

export const PLAN_LIMITS = {
  [PLANS.FREE]: {
    projects: 3,
    conversations: -1,
    aiQueries: 50,
    storageMB: 250,
    maxFileSizeMB: 10,
    imageGeneration: false,
  },
  [PLANS.BASIC]: {
    projects: 10,
    conversations: -1,
    aiQueries: 1000,
    storageMB: 5000,
    maxFileSizeMB: 50,
    imageGeneration: false,
  },
  [PLANS.PRO]: {
    projects: -1,
    conversations: -1,
    aiQueries: 5000,
    storageMB: 20000,
    maxFileSizeMB: 150,
    imageGeneration: true,
  },
  [PLANS.CUSTOM]: {
    projects: -1,
    conversations: -1,
    aiQueries: -1,
    storageMB: -1,
    maxFileSizeMB: -1,
    imageGeneration: true,
  },
} as const;

// ─── 크레딧 충전 패키지 (shared 재사용) ───────────────────────
export { CREDIT_PACKAGES, type CreditPackageId } from "@shared/plans";
