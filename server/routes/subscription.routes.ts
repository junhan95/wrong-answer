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
        const aiQueryCount = await storage.getAIQueryCount(userId);

        const files = await storage.getFilesByUser(userId);
        const storageUsedBytes = files.reduce((total, file) => total + (file.size || 0), 0);
        const storageUsedMB = storageUsedBytes / (1024 * 1024);

        res.json({
            subscription: subscription || { plan: "free" },
            usage: {
                projects: projectCount,
                conversations: conversationCount,
                aiQueries: aiQueryCount,
                storageMB: Math.round(storageUsedMB * 100) / 100,
            },
            limits: {
                projects: planLimits.projects,
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

export default router;
