import { BaseStorage } from "./base";
import { eq, and, desc, asc } from "drizzle-orm";
import { 
    tutorSessions, 
    tutorMessages,
    type TutorSession, 
    type InsertTutorSession,
    type TutorMessage,
    type InsertTutorMessage 
} from "@shared/schema";
import { randomUUID } from "crypto";

export class TutorSessionMixin extends BaseStorage {
    async getTutorSessions(userId: string): Promise<TutorSession[]> {
        return await this.db
            .select()
            .from(tutorSessions)
            .where(eq(tutorSessions.userId, userId))
            .orderBy(desc(tutorSessions.createdAt));
    }

    async getTutorSessionById(id: string, userId: string): Promise<TutorSession | undefined> {
        const [result] = await this.db
            .select()
            .from(tutorSessions)
            .where(and(eq(tutorSessions.id, id), eq(tutorSessions.userId, userId)))
            .limit(1);
        return result;
    }

    async createTutorSession(data: InsertTutorSession, userId: string): Promise<TutorSession> {
        const id = randomUUID();
        const [result] = await this.db
            .insert(tutorSessions)
            .values({ ...data, id, userId })
            .returning();
        return result;
    }

    async updateTutorSession(id: string, userId: string, data: Partial<Omit<TutorSession, 'id' | 'createdAt' | 'updatedAt'>>): Promise<TutorSession | undefined> {
        const [result] = await this.db
            .update(tutorSessions)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(tutorSessions.id, id), eq(tutorSessions.userId, userId)))
            .returning();
        return result;
    }

    async deleteTutorSession(id: string, userId: string): Promise<boolean> {
        const [result] = await this.db
            .delete(tutorSessions)
            .where(and(eq(tutorSessions.id, id), eq(tutorSessions.userId, userId)))
            .returning();
        return !!result;
    }

    async getTutorMessages(sessionId: string): Promise<TutorMessage[]> {
        return await this.db
            .select()
            .from(tutorMessages)
            .where(eq(tutorMessages.sessionId, sessionId))
            .orderBy(asc(tutorMessages.createdAt));
    }

    async createTutorMessage(data: InsertTutorMessage): Promise<TutorMessage> {
        const id = randomUUID();
        const [result] = await this.db
            .insert(tutorMessages)
            .values({ ...data, id })
            .returning();
        return result;
    }
}
