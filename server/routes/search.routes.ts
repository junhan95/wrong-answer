import { Router } from "express";
import { isAuthenticated } from "../sessionAuth";
import { storage } from "../storage";
import { generateEmbedding } from "../openai";
import { type SearchResult, type Message } from "@shared/schema";
import { filterChunksByAttributes, validateFilter, type AttributeFilter } from "../filterParser";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import { decodeFilename } from "../utils/fileProcessing";

const router = Router();

// Messages
router.get("/messages/:conversationId", isAuthenticated, async (req, res) => {
    try {
        const user = req.user as any;
        const userId = user.id;
        const { conversationId } = req.params;
        const messages = await storage.getMessages(conversationId, userId);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

// Image upload configuration (for attachments in messages)
const uploadDir = path.join(process.cwd(), "uploads");

const multerStorage = multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => {
        const uniqueName = `${randomUUID()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const imageUpload = multer({
    storage: multerStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (_req, file, cb) => {
        const allowedMimes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf",
            "text/plain",
            "text/csv",
            "application/json",
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"));
        }
    },
});

// Image upload endpoint
router.post("/upload", isAuthenticated, imageUpload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        const fileInfo = {
            filename: req.file.filename,
            originalName: decodeFilename(req.file.originalname),
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: `/uploads/${req.file.filename}`,
        };

        res.json(fileInfo);
    } catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({ error: "Failed to upload file" });
    }
});

// Serve uploaded files — path traversal 방어
router.get("/uploads/:filename", isAuthenticated, async (req, res) => {
    try {
        const safeFilename = path.basename(req.params.filename);
        const filePath = path.resolve(uploadDir, safeFilename);
        if (!filePath.startsWith(path.resolve(uploadDir))) {
            res.status(400).json({ error: "Invalid file path" });
            return;
        }
        res.sendFile(filePath);
    } catch (error) {
        res.status(404).json({ error: "File not found" });
    }
});

// Search with optional attribute filtering
router.post("/search", isAuthenticated, async (req, res) => {
    try {
        const user = req.user as any;
        const userId = user.id;
        const { query, filter, includeFileChunks = true, maxResults = 10 } = req.body;

        if (!query) {
            res.status(400).json({ error: "Missing query" });
            return;
        }

        let attributeFilter: AttributeFilter | undefined;
        if (filter) {
            if (!validateFilter(filter)) {
                res.status(400).json({ error: "Invalid filter format" });
                return;
            }
            attributeFilter = filter as AttributeFilter;
        }

        const allMessages = await storage.getAllMessages(userId);

        const messagesByConversation = new Map<string, Message[]>();
        for (const msg of allMessages) {
            if (!messagesByConversation.has(msg.conversationId)) {
                messagesByConversation.set(msg.conversationId, []);
            }
            messagesByConversation.get(msg.conversationId)!.push(msg);
        }

        for (const msgs of Array.from(messagesByConversation.values())) {
            msgs.sort((a: Message, b: Message) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }

        const exactResults: SearchResult[] = [];
        const semanticResults: SearchResult[] = [];
        const addedMessageIds = new Set<string>();

        // 캐시 Map — N+1 쿼리 방지: conversation/project를 요청당 1회씩만 조회
        const conversationCache = new Map<string, Awaited<ReturnType<typeof storage.getConversation>>>();
        const projectCache = new Map<string, Awaited<ReturnType<typeof storage.getProject>>>();

        const getConversationCached = async (convId: string) => {
            if (!conversationCache.has(convId)) {
                conversationCache.set(convId, await storage.getConversation(convId, userId));
            }
            return conversationCache.get(convId);
        };

        const getProjectCached = async (projectId: string) => {
            if (!projectCache.has(projectId)) {
                projectCache.set(projectId, await storage.getProject(projectId, userId));
            }
            return projectCache.get(projectId);
        };

        const createSearchResult = async (
            msg: Message,
            matchType: 'exact' | 'semantic',
            similarity: number
        ): Promise<SearchResult | null> => {
            const conversation = await getConversationCached(msg.conversationId);
            if (!conversation) return null;

            const project = await getProjectCached(conversation.projectId);
            if (!project) return null;

            let pairedMessage: { role: string; content: string; createdAt: string } | undefined;
            const conversationMessages = messagesByConversation.get(msg.conversationId) || [];
            const currentIndex = conversationMessages.findIndex(m => m.id === msg.id);

            if (currentIndex !== -1) {
                if (msg.role === "assistant" && currentIndex > 0) {
                    for (let i = currentIndex - 1; i >= 0; i--) {
                        if (conversationMessages[i].role === "user") {
                            pairedMessage = {
                                role: conversationMessages[i].role,
                                content: conversationMessages[i].content,
                                createdAt: new Date(conversationMessages[i].createdAt).toISOString(),
                            };
                            break;
                        }
                    }
                } else if (msg.role === "user" && currentIndex < conversationMessages.length - 1) {
                    for (let i = currentIndex + 1; i < conversationMessages.length; i++) {
                        if (conversationMessages[i].role === "assistant") {
                            pairedMessage = {
                                role: conversationMessages[i].role,
                                content: conversationMessages[i].content,
                                createdAt: new Date(conversationMessages[i].createdAt).toISOString(),
                            };
                            break;
                        }
                    }
                }
            }

            return {
                messageId: msg.id,
                conversationId: msg.conversationId,
                conversationName: conversation.name,
                projectName: project.name,
                role: msg.role,
                messageContent: msg.content,
                similarity,
                createdAt: new Date(msg.createdAt).toISOString(),
                matchType,
                pairedMessage,
            };
        };

        // Exact text matches
        const queryLower = query.toLowerCase();
        for (const msg of allMessages) {
            if (addedMessageIds.has(msg.id)) continue;
            if (msg.content.toLowerCase().includes(queryLower)) {
                const result = await createSearchResult(msg, 'exact', 1.0);
                if (result) {
                    exactResults.push(result);
                    addedMessageIds.add(msg.id);
                }
            }
        }

        // Semantic matches via pgvector
        const queryEmbedding = await generateEmbedding(query);
        const vectorMessages = await storage.searchMessagesByVector(userId, queryEmbedding, 20);
        for (const msg of vectorMessages) {
            if (addedMessageIds.has(msg.id) || msg.similarity < 0.6) continue;
            const result = await createSearchResult(msg, 'semantic', msg.similarity);
            if (result) {
                semanticResults.push(result);
                addedMessageIds.add(msg.id);
            }
        }

        semanticResults.sort((a, b) => b.similarity - a.similarity);

        // File chunk search via pgvector
        const fileChunkResults: SearchResult[] = [];
        if (includeFileChunks) {
            const vectorChunks = await storage.searchFileChunksByVector(userId, queryEmbedding, 20);
            const filteredChunks = attributeFilter
                ? filterChunksByAttributes(vectorChunks, attributeFilter)
                : vectorChunks;

            console.log(`[Search] Found ${filteredChunks.length} file chunks via pgvector (filter: ${attributeFilter ? 'yes' : 'no'})`);

            const fileCache = new Map<string, Awaited<ReturnType<typeof storage.getFileById>>>();
            const projectCache = new Map<string, Awaited<ReturnType<typeof storage.getProject>>>();

            for (const chunk of filteredChunks) {
                if (chunk.similarity < 0.5) continue;
                if (!fileCache.has(chunk.fileId)) {
                    fileCache.set(chunk.fileId, await storage.getFileById(chunk.fileId, userId));
                }
                const file = fileCache.get(chunk.fileId);
                if (file) {
                    if (!projectCache.has(file.projectId)) {
                        projectCache.set(file.projectId, await storage.getProject(file.projectId, userId));
                    }
                    const project = projectCache.get(file.projectId);
                    if (project) {
                        fileChunkResults.push({
                            messageId: chunk.id,
                            conversationId: file.conversationId || '',
                            conversationName: `File: ${file.originalName}`,
                            projectName: project.name,
                            role: 'assistant',
                            messageContent: chunk.content,
                            similarity: chunk.similarity,
                            createdAt: new Date(chunk.createdAt).toISOString(),
                            matchType: 'file_chunk',
                        });
                    }
                }
            }
            fileChunkResults.sort((a, b) => b.similarity - a.similarity);
        }

        const allResults = [...exactResults, ...semanticResults, ...fileChunkResults.slice(0, 5)];
        res.json(allResults.slice(0, maxResults));
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Failed to search messages" });
    }
});

export default router;
