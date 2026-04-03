import { Router } from "express";
import { isAuthenticated } from "../sessionAuth";
import { storage } from "../storage";
import { PLAN_LIMITS, DAILY_FREE_LIMIT } from "../plans";

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

        // 크레딧 등 유저 정보 조회
        const userRow = (req.user as any);

        res.json({
            subscription: subscription || { plan: "free" },
            usage: {
                credits: userRow?.credits ?? 0,
            },
            limits: {
                dailyFreeLimit: DAILY_FREE_LIMIT,
            },
        });
    } catch (error) {
        console.error("Error fetching subscription:", error);
        res.status(500).json({ error: "Failed to fetch subscription" });
    }
});

// Cancel subscription (schedule downgrade to free at end of billing cycle)
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

        // If billing cycle end exists, schedule the change for end of cycle
        if (subscription.billingCycleEnd && new Date() < new Date(subscription.billingCycleEnd)) {
            await storage.updateSubscription(userId, {
                pendingPlan: "free",
            });
            res.json({
                success: true,
                scheduled: true,
                pendingPlan: "free",
                effectiveDate: subscription.billingCycleEnd,
            });
        } else {
            // No active billing cycle, apply immediately
            await storage.updateSubscription(userId, {
                plan: "free",
                billingCycleStart: new Date(),
                billingCycleEnd: null,
                pendingPlan: null,
            });
            res.json({ success: true, plan: "free" });
        }
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        res.status(500).json({ error: "Failed to cancel subscription" });
    }
});

// Cancel pending plan change
router.post("/subscription/cancel-pending", isAuthenticated, async (req, res) => {
    try {
        const user = req.user as any;
        const userId = user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        await storage.updateSubscription(userId, {
            pendingPlan: null,
        });

        res.json({ success: true });
    } catch (error) {
        console.error("Error cancelling pending change:", error);
        res.status(500).json({ error: "Failed to cancel pending change" });
    }
});

// Downgrade subscription (schedule for end of billing cycle)
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

        // If billing cycle end exists, schedule the change
        if (subscription?.billingCycleEnd && new Date() < new Date(subscription.billingCycleEnd)) {
            await storage.updateSubscription(userId, {
                pendingPlan: targetPlan,
            });
            res.json({
                success: true,
                scheduled: true,
                pendingPlan: targetPlan,
                effectiveDate: subscription.billingCycleEnd,
            });
        } else {
            // No active billing cycle, apply immediately
            await storage.updateSubscription(userId, {
                plan: targetPlan,
                billingCycleStart: new Date(),
                billingCycleEnd: null,
                pendingPlan: null,
            });
            res.json({ success: true, plan: targetPlan });
        }
    } catch (error) {
        console.error("Error downgrading subscription:", error);
        res.status(500).json({ error: "Failed to downgrade subscription" });
    }
});

// Apply promotion code
const PROMO_CODES: Record<string, { plan: string; durationDays: number }> = {
    "오답노트 Open Beta": { plan: "pro", durationDays: 30 },
};

router.post("/subscription/promo", isAuthenticated, async (req, res) => {
    try {
        const user = req.user as any;
        const userId = user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const { code } = req.body;
        if (!code || typeof code !== "string") {
            return res.status(400).json({ error: "Promotion code is required" });
        }

        const promo = PROMO_CODES[code.trim()];
        if (!promo) {
            return res.status(400).json({ error: "INVALID_CODE" });
        }

        const subscription = await storage.getSubscription(userId);
        const currentPlan = subscription?.plan || "free";
        const planOrder: Record<string, number> = { free: 0, basic: 1, pro: 2, custom: 3 };

        if ((planOrder[currentPlan] ?? 0) >= (planOrder[promo.plan] ?? 0)) {
            return res.status(400).json({ error: "ALREADY_HIGHER" });
        }

        const billingStart = new Date();
        const billingEnd = new Date(billingStart.getTime() + promo.durationDays * 24 * 60 * 60 * 1000);

        await storage.updateSubscription(userId, {
            plan: promo.plan,
            billingCycleStart: billingStart,
            billingCycleEnd: billingEnd,
            pendingPlan: "free",
        });

        res.json({
            success: true,
            plan: promo.plan,
            billingCycleStart: billingStart,
            billingCycleEnd: billingEnd,
        });
    } catch (error) {
        console.error("Error applying promo code:", error);
        res.status(500).json({ error: "Failed to apply promotion code" });
    }
});

export default router;
