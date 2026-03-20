import { Router } from "express";
import { storage } from "../storage";
import { generateChatCompletionStream, generateEmbedding } from "../openai";
import { type SearchResult } from "@shared/schema";
import path from "path";
import { promises as fs } from "fs";
import { isAuthenticated } from "../sessionAuth";

const router = Router();

const uploadDir = path.join(process.cwd(), "uploads");

// Chat with streaming - OPTIMIZED for low latency
router.post("/chat", isAuthenticated, async (req, res) => {
  const startTime = Date.now();
  try {
    const user = req.user as any;
    const userId = user.id;
    const { conversationId, message, attachments } = req.body;

    if (!conversationId || (!message && !attachments)) {
      res.status(400).json({ error: "Missing conversationId or message" });
      return;
    }

    // Set up SSE headers immediately
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("Content-Encoding", "identity");
    res.flushHeaders();

    if (res.socket) {
      res.socket.setNoDelay(true);
    }

    // PARALLEL PHASE 1: Fetch conversation + history + files simultaneously
    const [conversation, conversationHistory, files] = await Promise.all([
      storage.getConversation(conversationId, userId),
      storage.getMessages(conversationId, userId),
      storage.getFilesByConversation(conversationId, userId),
    ]);

    if (!conversation) {
      res.write(`data: ${JSON.stringify({ type: "error", error: "Conversation not found" })}\n\n`);
      res.end();
      return;
    }

    // Create user message (fast DB operation)
    const userMessage = await storage.createMessage({
      conversationId,
      role: "user",
      content: message || "",
      attachments,
    }, userId);

    // Build chat messages for OpenAI (process attachments in parallel)
    const chatMessages = await Promise.all(conversationHistory.map(async (m) => {
      if (m.attachments && Array.isArray(m.attachments) && m.attachments.length > 0) {
        const contentParts: Array<{ type: "text" | "image_url"; text?: string; image_url?: { url: string } }> = [];

        for (const attachment of m.attachments as any[]) {
          if (attachment.mimeType?.startsWith("image/")) {
            const imagePath = path.join(uploadDir, attachment.filename);
            try {
              const imageBuffer = await fs.readFile(imagePath);
              const base64Image = imageBuffer.toString('base64');
              const dataUrl = `data:${attachment.mimeType};base64,${base64Image}`;
              contentParts.push({
                type: "image_url",
                image_url: { url: dataUrl },
              });
            } catch (error) {
              console.error(`Failed to read image ${imagePath}:`, error);
            }
          }
        }

        if (m.content) {
          contentParts.push({ type: "text", text: m.content });
        }

        return { role: m.role, content: contentParts.length > 0 ? contentParts : m.content };
      }
      return { role: m.role, content: m.content };
    }));

    // Build base system prompt (fast, no async)
    const markdownInstructions = `

FORMAT INSTRUCTIONS:
- Always format responses using Markdown for better readability
- Use headers (## or ###) to organize sections  
- Use bullet points (-) or numbered lists (1. 2. 3.) for multiple items
- Use **bold** for emphasis on important terms
- Use \`code\` for technical terms, commands, or code snippets
- Use code blocks with language specification for multi-line code
- Use > for quotes or important callouts
- Break long responses into clear sections with headers
- Keep paragraphs concise and well-spaced
`;
    let systemPrompt = (conversation.instructions || "You are a helpful AI assistant.") + markdownInstructions;

    // Add knowledge base files
    const filesWithContent = files.filter(f => f.content);
    if (filesWithContent.length > 0) {
      const knowledgeBase = filesWithContent
        .map((file, idx) => `File ${idx + 1} (${file.originalName}):\n${file.content}`)
        .join("\n\n---\n\n");
      systemPrompt += `\n\nYou have access to the following knowledge base files:\n\n${knowledgeBase}\n\nUse this information to provide accurate and relevant answers.`;
    }

    // START STREAMING IMMEDIATELY - RAG processing happens in background
    console.log(`[Chat API] Starting stream after ${Date.now() - startTime}ms`);

    let fullResponse = "";

    // OPTIMIZATION: Start RAG search and OpenAI streaming in parallel
    const ragPromise = (async () => {
      if (!message) return [];

      try {
        const userEmbedding = await generateEmbedding(message);

        // Save user embedding in background (don't await)
        storage.updateMessageEmbedding(userMessage.id, userId, JSON.stringify(userEmbedding), userEmbedding).catch(
          err => console.error("Background embedding save failed:", err)
        );

        // pgvector 기반 시맨틱 검색 (현재 대화 제외, threshold 0.35)
        const vectorMessages = await storage.searchMessagesByVector(
          userId, userEmbedding, 20, conversationId
        );

        const relevantContexts: SearchResult[] = [];
        const conversationMap = new Map<string, any>();
        const projectMap = new Map<string, any>();

        for (const msg of vectorMessages) {
          if (msg.id === userMessage.id || msg.similarity < 0.35) continue;

          // Batch fetch conversation (캐시 활용)
          if (!conversationMap.has(msg.conversationId)) {
            const conv = await storage.getConversation(msg.conversationId, userId);
            if (conv) conversationMap.set(msg.conversationId, conv);
          }
          const msgConversation = conversationMap.get(msg.conversationId);
          if (!msgConversation) continue;

          // Batch fetch project (캐시 활용)
          if (!projectMap.has(msgConversation.projectId)) {
            const proj = await storage.getProject(msgConversation.projectId, userId);
            if (proj) projectMap.set(msgConversation.projectId, proj);
          }
          const project = projectMap.get(msgConversation.projectId);
          if (!project) continue;

          relevantContexts.push({
            messageId: msg.id,
            conversationId: msg.conversationId,
            conversationName: msgConversation.name,
            projectName: project.name,
            role: msg.role,
            messageContent: msg.content,
            similarity: msg.similarity,
            createdAt: new Date(msg.createdAt).toISOString(),
            matchType: 'semantic',
          });
        }

        relevantContexts.sort((a, b) => b.similarity - a.similarity);
        return relevantContexts.slice(0, 5);
      } catch (err) {
        console.error("RAG search error:", err);
        return [];
      }
    })();

    // Start OpenAI streaming immediately
    for await (const chunk of generateChatCompletionStream([
      { role: "system", content: systemPrompt },
      ...chatMessages,
    ])) {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ type: "content", content: chunk })}\n\n`);
      if (typeof (res as any).flush === 'function') {
        (res as any).flush();
      }
    }

    // Wait for RAG and send context (after streaming, for future reference)
    const topContexts = await ragPromise;
    if (topContexts.length > 0) {
      console.log(`[RAG API] Found ${topContexts.length} contexts (processed in background)`);
      res.write(`data: ${JSON.stringify({ type: "context", sources: topContexts })}\n\n`);
      if (typeof (res as any).flush === 'function') {
        (res as any).flush();
      }
    }

    // Save AI message
    const aiMessage = await storage.createMessage({
      conversationId,
      role: "assistant",
      content: fullResponse,
    }, userId);

    // Background: Generate AI response embedding (don't block response)
    generateEmbedding(fullResponse)
      .then(embedding => storage.updateMessageEmbedding(aiMessage.id, userId, JSON.stringify(embedding), embedding))
      .catch(err => console.error("Background AI embedding failed:", err));

    console.log(`[Chat API] Total time: ${Date.now() - startTime}ms`);

    res.write(`data: ${JSON.stringify({ type: "done", messageId: aiMessage.id })}\n\n`);
    if (typeof (res as any).flush === 'function') {
      (res as any).flush();
    }
    res.end();
  } catch (error: any) {
    console.error("Chat error:", error);
    let errorMessage = "메시지 처리에 실패했습니다. 잠시 후 다시 시도해주세요.";
    if (error?.status === 429 || error?.code === "rate_limit_exceeded") {
      errorMessage = "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
    } else if (error?.code === "context_length_exceeded" || error?.code === "max_tokens") {
      errorMessage = "메시지가 너무 길어 처리할 수 없습니다. 대화를 나눠서 시도해주세요.";
    } else if (error?.code === "insufficient_quota") {
      errorMessage = "AI 서비스 한도에 도달했습니다. 관리자에게 문의하세요.";
    } else if (error?.code === "invalid_api_key") {
      errorMessage = "AI 서비스 연결에 문제가 있습니다. 관리자에게 문의하세요.";
    }
    res.write(`data: ${JSON.stringify({ type: "error", error: errorMessage })}\n\n`);
    res.end();
  }
});

export default router;

