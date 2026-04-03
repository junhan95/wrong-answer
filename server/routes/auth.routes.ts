import { Router } from "express";
import { isAuthenticated } from "../sessionAuth";
import { storage } from "../storage";

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
        const { firstName, lastName, role } = req.body;

        const updateData: Record<string, any> = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (role !== undefined) updateData.role = role;

        const updated = await storage.updateUser(userId, updateData);

        if (!updated) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
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
