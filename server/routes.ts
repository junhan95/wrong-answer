import type { Express } from "express";
import { createServer, type Server } from "http";
import { promises as fs } from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { setupAuth, isAuthenticated } from "./sessionAuth";
import { setupSocialAuth } from "./socialAuth";
import { expirationScheduler } from "./scheduler";
import { setupWebSocket } from "./routes/websocket";

// Import domain routers
import {
  authRouter,
  projectsRouter,
  foldersRouter,
  conversationsRouter,
  filesRouter,
  searchRouter,
  subscriptionRouter,
  adminRouter,
  trashRouter,
  paymentRouter,
} from "./routes/index";
import chatRouter from "./routes/chat.routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Authentication (session + passport)
  await setupAuth(app);

  // Setup social OAuth login routes (Google, Naver, Kakao)
  setupSocialAuth(app);

  // Health check endpoint for deployment
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Register domain routers
  app.use("/api", authRouter);
  app.use("/api", projectsRouter);
  app.use("/api", foldersRouter);
  app.use("/api", conversationsRouter);
  app.use("/api", filesRouter);
  app.use("/api", searchRouter);
  app.use("/api", subscriptionRouter);
  app.use("/api", adminRouter);
  app.use("/api", trashRouter);
  app.use("/api", paymentRouter);

  // Chat SSE streaming
  app.use("/api", chatRouter);

  // Chrome Extension zip download
  app.get("/api/extensions/chrome/download", async (_req, res) => {
    try {
      const extDir = path.join(process.cwd(), "dist", "public", "extensions", "chrome");
      const files = await fs.readdir(extDir);
      const zip = new AdmZip();
      for (const file of files) {
        const filePath = path.join(extDir, file);
        const stat = await fs.stat(filePath);
        if (stat.isFile()) {
          zip.addLocalFile(filePath);
        }
      }
      const zipBuffer = zip.toBuffer();
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=wisequery-chrome-extension.zip");
      res.send(zipBuffer);
    } catch (error) {
      console.error("Error creating extension zip:", error);
      res.status(500).json({ error: "Failed to download extension" });
    }
  });

  // Serve uploaded files — path traversal 방어
  const uploadDir = path.join(process.cwd(), "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  app.get("/uploads/:filename", isAuthenticated, async (req, res) => {
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

  const httpServer = createServer(app);

  // Start the expiration scheduler
  expirationScheduler.start();

  // Setup WebSocket server for chat streaming
  setupWebSocket(httpServer);

  return httpServer;
}
