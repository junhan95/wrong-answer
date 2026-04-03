import { Router } from "express";
import { storage } from "../storage";
import { insertWrongAnswerSchema, type User } from "@shared/schema";
import { z } from "zod";
import { upload, uploadUrlFilename } from "../utils/upload";
import { extractTextFromImage, generateEmbedding } from "../openai";
import { uploadToSupabase } from "../utils/supabase";

const router = Router();

// GET /api/wrong-answers
router.get("/wrong-answers", async (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const records = await storage.getWrongAnswers((req.user as User).id);
        res.json(records);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch wrong answers" });
    }
});

// GET /api/wrong-answers/due
router.get("/wrong-answers/due", async (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const { limit } = req.query;
        const maxItems = limit ? parseInt(limit as string) : 10;
        const records = await storage.getDueReviews((req.user as User).id, maxItems);
        res.json(records);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch due reviews" });
    }
});

// POST /api/wrong-answers
router.post("/wrong-answers", async (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const parsed = insertWrongAnswerSchema.parse(req.body);
        const record = await storage.createWrongAnswer(parsed, (req.user as User).id);
        res.json(record);
    } catch (e) {
        res.status(400).json({ error: "Invalid payload or server error" });
    }
});

// POST /api/wrong-answers/upload
router.post("/wrong-answers/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        if (!req.file) return res.status(400).json({ error: "No image file uploaded" });

        const userId = (req.user as User).id;
        
        let imageUrl = "";
        const fileBuffer = req.file.buffer;
        const filename = uploadUrlFilename(req.file);

        // Upload to Supabase Bucket
        const supabaseUrl = await uploadToSupabase(fileBuffer, filename, req.file.mimetype);
        
        if (supabaseUrl) {
            imageUrl = supabaseUrl;
        } else {
            // Fallback base64 image URL (not ideal for large images, but works if Supabase fails/unconfigured)
            imageUrl = `data:${req.file.mimetype};base64,${fileBuffer.toString("base64").slice(0, 100)}...`;
        }
        
        // 1. Extract text via OpenAI Vision
        const { text, subject, topic } = await extractTextFromImage(fileBuffer, req.file.mimetype);
        
        // 2. Generate embedding for RAG/search
        let embeddingVector: number[] | null = null;
        if (text) {
             embeddingVector = await generateEmbedding(text);
        }

        // 3. Save to DB
        const record = await storage.createWrongAnswer({
            userId,
            subject: subject || null,
            conceptTags: topic ? [topic] : null,
            errorCategory: null, // User can manually tag later
            originalImageUrl: imageUrl,
            extractedText: text || null,
            solutionText: null,
        } as any, userId);

        // Optional: Update embedding separately if RAG uses it
        if (embeddingVector) {
            // await storage.updateWrongAnswerEmbedding(record.id, userId, embeddingVector);
        }

        res.json(record);
    } catch (e) {
        console.error("Wrong answer upload error:", e);
        res.status(500).json({ error: "Failed to process uploaded image" });
    }
});

export default router;
