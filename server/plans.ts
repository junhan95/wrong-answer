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
