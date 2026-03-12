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
    conversations: 30,
    storageGB: 10,
    imageGeneration: false,
  },
  [PLANS.BASIC]: {
    projects: 10,
    conversations: -1,
    storageGB: 50,
    imageGeneration: false,
  },
  [PLANS.PRO]: {
    projects: -1,
    conversations: -1,
    storageGB: 100,
    imageGeneration: true,
  },
  [PLANS.CUSTOM]: {
    projects: -1,
    conversations: -1,
    storageGB: -1,
    imageGeneration: true,
  },
} as const;
