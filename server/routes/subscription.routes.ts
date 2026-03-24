import { Router } from "express";
import { isAuthenticated } from "../sessionAuth";
import { storage } from "../storage";
import { PLAN_LIMITS } from "../plans";

const router = Router();

// Get subscription info, usage, and plan limits
router.get("/subscription", isAuthenticated, async (req, res) => {
    try {
        const user = req.user as any;
        const userId = user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const subscription = await storage.getSubscription(userId);
        const plan = (subscription?.plan || "free") as keyof typeof PLAN_LIMITS;
        const planLimits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

        const projectCount = (await storage.getProjects(userId)).length;
        const conversationCount = (await storage.getConversations(userId)).length;
        const aiQuota = await storage.checkAiQuota(userId);

        const files = await storage.getFilesByUser(userId);
        const storageUsedBytes = files.reduce((total, file) => total + (file.size || 0), 0);
        const storageUsedMB = storageUsedBytes / (1024 * 1024);

        res.json({
            subscription: subscription || { plan: "free" },
            usage: {
                projects: projectCount,
                conversations: conversationCount,
                aiQueries: aiQuota.used,
                storageMB: Math.round(storageUsedMB * 100) / 100,
            },
            limits: {
                projects: planLimits.projects,
                conversations: planLimits.conversations,
                aiQueries: planLimits.aiQueries,
                storageMB: planLimits.storageMB,
                imageGeneration: planLimits.imageGeneration,
            },
        });
    } catch (error) {
        console.error("Error fetching subscription:", error);
        res.status(500).json({ error: "Failed to fetch subscription" });
    }
});

// Cancel subscription (downgrade to free)
router.post("/subscription/cancel", isAuthenticated, async (req, res) => {
    try {
        const user = req.user as any;
        const userId = user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const subscription = await storage.getSubscription(userId);
        if (!subscription || subscription.plan === "free") {
            return res.status(400).json({ error: "No active paid subscription to cancel" });
        }

        const freeLimits = PLAN_LIMITS.free;
        await storage.updateSubscription(userId, {
            plan: "free",
            monthlyAiQueriesAllowed: freeLimits.aiQueries,
            monthlyAiQueriesUsed: 0,
            billingCycleStart: new Date(),
        });

        res.json({ success: true, plan: "free" });
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        res.status(500).json({ error: "Failed to cancel subscription" });
    }
});

// Downgrade subscription (e.g., pro -> basic)
router.post("/subscription/downgrade", isAuthenticated, async (req, res) => {
    try {
        const user = req.user as any;
        const userId = user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const { targetPlan } = req.body;
        if (!targetPlan || !PLAN_LIMITS[targetPlan as keyof typeof PLAN_LIMITS]) {
            return res.status(400).json({ error: "Invalid target plan" });
        }

        const subscription = await storage.getSubscription(userId);
        const currentPlan = subscription?.plan || "free";

        // Plan hierarchy: free < basic < pro < custom
        const planOrder: Record<string, number> = { free: 0, basic: 1, pro: 2, custom: 3 };
        if ((planOrder[targetPlan] ?? 0) >= (planOrder[currentPlan] ?? 0)) {
            return res.status(400).json({ error: "Target plan must be lower than current plan" });
        }

        const targetLimits = PLAN_LIMITS[targetPlan as keyof typeof PLAN_LIMITS];
        await storage.updateSubscription(userId, {
            plan: targetPlan,
            monthlyAiQueriesAllowed: targetLimits.aiQueries,
            monthlyAiQueriesUsed: 0,
            billingCycleStart: new Date(),
        });

        res.json({ success: true, plan: targetPlan });
    } catch (error) {
        console.error("Error downgrading subscription:", error);
        res.status(500).json({ error: "Failed to downgrade subscription" });
    }
});

export default router;
