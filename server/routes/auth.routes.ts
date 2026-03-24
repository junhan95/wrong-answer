import { Router } from "express";
import { isAuthenticated } from "../sessionAuth";
import { storage } from "../storage";
import { upload } from "../utils/uploadConfig";

const router = Router();

// Get current user
router.get("/auth/user", isAuthenticated, async (req, res) => {
    try {
        const user = req.user as any;
        const userId = user.id;
        const userInfo = await storage.getUser(userId);
        res.json(userInfo);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user info" });
    }
});

// Update profile
router.patch("/auth/profile", isAuthenticated, async (req, res) => {
    try {
        const user = req.user as any;
        const userId = user.id;
        const { firstName, lastName, department, jobTitle, phone } = req.body;

        const updateData: Record<string, any> = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (department !== undefined) updateData.department = department;
        if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
        if (phone !== undefined) updateData.phone = phone;

        const updated = await storage.updateUser(userId, updateData);

        if (!updated) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
    }
});

// Upload profile image
router.post("/auth/profile/image", isAuthenticated, upload.single("file"), async (req, res) => {
    try {
        const user = req.user as any;
        const userId = user.id;

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const profileImageUrl = `/uploads/${req.file.filename}`;
        const updated = await storage.updateUser(userId, { profileImageUrl });

        if (!updated) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ profileImageUrl, user: updated });
    } catch (error) {
        res.status(500).json({ error: "Failed to upload profile image" });
    }
});

// Export user data (backup before account deletion)
router.get("/auth/export", isAuthenticated, async (req, res) => {
    try {
        const user = req.user as any;
        const userId = user.id;

        const userInfo = await storage.getUser(userId);
        const projects = await storage.getProjects(userId);
        const conversations = await storage.getConversations(userId);
        const files = await storage.getFilesByUser(userId);

        // Fetch messages for each conversation
        const conversationsWithMessages = await Promise.all(
            conversations.map(async (conv) => {
                const messages = await storage.getMessages(conv.id, userId);
                return { ...conv, messages };
            })
        );

        const exportData = {
            exportedAt: new Date().toISOString(),
            user: {
                email: userInfo?.email,
                firstName: userInfo?.firstName,
                lastName: userInfo?.lastName,
                createdAt: userInfo?.createdAt,
            },
            projects: projects.map((p) => ({
                name: p.name,
                description: p.description,
                createdAt: p.createdAt,
            })),
            conversations: conversationsWithMessages.map((c) => ({
                title: c.title,
                projectId: c.projectId,
                createdAt: c.createdAt,
                messages: c.messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                    createdAt: m.createdAt,
                })),
            })),
            files: files.map((f) => ({
                originalName: f.originalName,
                mimeType: f.mimeType,
                size: f.size,
                createdAt: f.createdAt,
            })),
        };

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename="wisequery-backup-${new Date().toISOString().slice(0, 10)}.json"`);
        res.json(exportData);
    } catch (error) {
        console.error("Error exporting user data:", error);
        res.status(500).json({ error: "Failed to export user data" });
    }
});

// Delete user account
router.delete("/auth/account", isAuthenticated, async (req, res) => {
    try {
        const user = req.user as any;
        const userId = user.id;

        const { confirmation } = req.body;
        if (confirmation !== "DELETE_MY_ACCOUNT") {
            return res.status(400).json({ error: "Invalid confirmation" });
        }

        // Delete user (cascades to all related data)
        const deleted = await storage.deleteUser(userId);
        if (!deleted) {
            return res.status(404).json({ error: "User not found" });
        }

        // Destroy session
        req.logout((err) => {
            if (err) console.error("Logout error during account deletion:", err);
            req.session.destroy((err) => {
                if (err) console.error("Session destroy error:", err);
                res.clearCookie("connect.sid");
                res.json({ success: true });
            });
        });
    } catch (error) {
        console.error("Error deleting user account:", error);
        res.status(500).json({ error: "Failed to delete account" });
    }
});

// Logout
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ error: "Failed to logout" });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Session destroy error:", err);
            }
            res.clearCookie("connect.sid");
            res.redirect("/");
        });
    });
});

export default router;

