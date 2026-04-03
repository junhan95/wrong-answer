import { Router } from "express";
import { storage } from "../storage";
import { insertTutorSessionSchema, insertTutorMessageSchema, type User } from "@shared/schema";
import { z } from "zod";
import { generateTutorResponse } from "../openai";

const router = Router();

router.get("/tutor/sessions", async (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const records = await storage.getTutorSessions((req.user as User).id);
        res.json(records);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch tutor sessions" });
    }
});

router.post("/tutor/sessions", async (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const parsed = insertTutorSessionSchema.parse(req.body);
        const record = await storage.createTutorSession(parsed, (req.user as User).id);
        res.json(record);
    } catch (e) {
        res.status(400).json({ error: "Invalid payload or server error" });
    }
});

router.get("/tutor/sessions/:sessionId/messages", async (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        // Verify session belongs to user
        const session = await storage.getTutorSessionById(req.params.sessionId, (req.user as User).id);
        if (!session) return res.status(404).json({ error: "Session not found" });
        
        const records = await storage.getTutorMessages(req.params.sessionId);
        res.json(records);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

router.post("/tutor/sessions/:sessionId/messages", async (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const session = await storage.getTutorSessionById(req.params.sessionId, (req.user as User).id);
        if (!session) return res.status(404).json({ error: "Session not found" });

        // 1. Save user message
        const parsed = insertTutorMessageSchema.parse({ ...req.body, sessionId: req.params.sessionId });
        const userMsg = await storage.createTutorMessage(parsed);

        // 2. Fetch history and context (limit to last 10 messages to prevent context window explosion)
        const sessionMessages = await storage.getTutorMessages(session.id);
        const wrongAnswer = session.wrongAnswerId ? await storage.getWrongAnswerById(session.wrongAnswerId, (req.user as User).id) : null;
        
        const sessionHistory = sessionMessages.slice(-10).map(m => ({
            role: m.role as "user" | "assistant" | "system",
            content: m.content
        }));

        // 3. Generate AI response
        const aiContent = await generateTutorResponse(sessionHistory, wrongAnswer?.extractedText || null);
        
        // 4. Save AI response
        const aiMsg = await storage.createTutorMessage({
            sessionId: session.id,
            role: "assistant",
            content: aiContent,
        });

        // Update phase logic can be added here if needed based on AI content analysis

        res.json(aiMsg);
    } catch (e) {
        console.error("Tutor chat error:", e);
        res.status(400).json({ error: "Invalid payload or server error" });
    }
});

export default router;
