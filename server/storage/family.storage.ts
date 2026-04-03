import { BaseStorage } from "./base";
import { eq, and, desc } from "drizzle-orm";
import { 
    familyLinks, 
    weeklyReports,
    type FamilyLink, 
    type InsertFamilyLink,
    type WeeklyReport,
    type InsertWeeklyReport 
} from "@shared/schema";
import { randomUUID } from "crypto";

export class FamilyMixin extends BaseStorage {
    async getFamilyLinks(userId: string, role: "parent" | "student"): Promise<FamilyLink[]> {
        if (role === "parent") {
            return await this.db
                .select()
                .from(familyLinks)
                .where(eq(familyLinks.parentId, userId))
                .orderBy(desc(familyLinks.createdAt));
        } else {
            return await this.db
                .select()
                .from(familyLinks)
                .where(eq(familyLinks.studentId, userId))
                .orderBy(desc(familyLinks.createdAt));
        }
    }

    async createFamilyLink(data: InsertFamilyLink): Promise<FamilyLink> {
        const id = randomUUID();
        const [result] = await this.db
            .insert(familyLinks)
            .values({ ...data, id })
            .returning();
        return result;
    }

    async updateFamilyLink(id: string, data: Partial<Omit<FamilyLink, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FamilyLink | undefined> {
        const [result] = await this.db
            .update(familyLinks)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(familyLinks.id, id))
            .returning();
        return result;
    }

    async deleteFamilyLink(id: string): Promise<boolean> {
        const [result] = await this.db
            .delete(familyLinks)
            .where(eq(familyLinks.id, id))
            .returning();
        return !!result;
    }

    async getWeeklyReports(familyLinkId: string): Promise<WeeklyReport[]> {
        return await this.db
            .select()
            .from(weeklyReports)
            .where(eq(weeklyReports.familyLinkId, familyLinkId))
            .orderBy(desc(weeklyReports.createdAt));
    }

    async createWeeklyReport(data: InsertWeeklyReport): Promise<WeeklyReport> {
        const id = randomUUID();
        const [result] = await this.db
            .insert(weeklyReports)
            .values({ ...data, id })
            .returning();
        return result;
    }
}
