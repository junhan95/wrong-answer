import { Router } from "express";
import { storage } from "../storage";
import { insertFamilyLinkSchema, type User } from "@shared/schema";

const router = Router();

router.get("/family", async (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        // Assuming student role for standard fetch, or pass role in query
        const role = req.query.role === "parent" ? "parent" : "student";
        const records = await storage.getFamilyLinks((req.user as User).id, role);
        res.json(records);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/family", async (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const parsed = insertFamilyLinkSchema.parse(req.body);
        const record = await storage.createFamilyLink(parsed);
        res.json(record);
    } catch (e) {
        res.status(400).json({ error: "Invalid payload" });
    }
});

export default router;
