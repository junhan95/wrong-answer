import { Router } from "express";
import { storage } from "../storage";
import { insertFamilyLinkSchema, type User } from "@shared/schema";
import { isAuthenticated } from "../sessionAuth";

const router = Router();

router.get("/family", isAuthenticated, async (req, res) => {
    try {
        // Assuming student role for standard fetch, or pass role in query
        const role = req.query.role === "parent" ? "parent" : "student";
        const records = await storage.getFamilyLinks((req.user as User).id, role);
        res.json(records);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/family", isAuthenticated, async (req, res) => {
    try {
        const userId = (req.user as User).id;
        const parsed = insertFamilyLinkSchema.parse(req.body);
        if (parsed.parentId !== userId && parsed.studentId !== userId) {
            return res.status(403).json({ error: "Forbidden: you must be part of the family link" });
        }
        const record = await storage.createFamilyLink(parsed);
        res.json(record);
    } catch (e) {
        res.status(400).json({ error: "Invalid payload" });
    }
});

export default router;
