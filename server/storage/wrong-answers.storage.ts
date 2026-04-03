import { BaseStorage } from "./base";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { 
    wrongAnswers, 
    spacedRepetition,
    type WrongAnswer, 
    type InsertWrongAnswer,
    type SpacedRepetition,
    type InsertSpacedRepetition 
} from "@shared/schema";
import { randomUUID } from "crypto";

export class WrongAnswersMixin extends BaseStorage {
    async getWrongAnswers(userId: string): Promise<WrongAnswer[]> {
        return await this.db
            .select()
            .from(wrongAnswers)
            .where(eq(wrongAnswers.userId, userId))
            .orderBy(desc(wrongAnswers.createdAt));
    }

    async getWrongAnswerById(id: string, userId: string): Promise<WrongAnswer | undefined> {
        const [result] = await this.db
            .select()
            .from(wrongAnswers)
            .where(and(eq(wrongAnswers.id, id), eq(wrongAnswers.userId, userId)))
            .limit(1);
        return result;
    }

    async createWrongAnswer(data: InsertWrongAnswer, userId: string): Promise<WrongAnswer> {
        const id = randomUUID();
        const [result] = await this.db
            .insert(wrongAnswers)
            .values({ ...data, id, userId } as any)
            .returning();
        return result;
    }

    async updateWrongAnswer(id: string, userId: string, data: Partial<Omit<WrongAnswer, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>): Promise<WrongAnswer | undefined> {
        const [result] = await this.db
            .update(wrongAnswers)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(wrongAnswers.id, id), eq(wrongAnswers.userId, userId)))
            .returning();
        return result;
    }

    async deleteWrongAnswer(id: string, userId: string): Promise<boolean> {
        const [result] = await this.db
            .delete(wrongAnswers)
            .where(and(eq(wrongAnswers.id, id), eq(wrongAnswers.userId, userId)))
            .returning();
        return !!result;
    }

    async searchWrongAnswersByVector(userId: string, queryEmbedding: number[], limit = 5): Promise<Array<WrongAnswer & { similarity: number }>> {
        const embeddingString = `[${queryEmbedding.join(",")}]`;
        const similarityScore = sql`1 - (${wrongAnswers.embeddingVector} <=> ${embeddingString}::vector)`;
        
        const { getTableColumns } = await import("drizzle-orm");
        const results = await this.db
            .select({
                ...getTableColumns(wrongAnswers),
                similarity: similarityScore,
            })
            .from(wrongAnswers)
            .where(and(
                eq(wrongAnswers.userId, userId),
                sql`${wrongAnswers.embeddingVector} IS NOT NULL`
            ))
            .orderBy(sql`${wrongAnswers.embeddingVector} <=> ${embeddingString}::vector`)
            .limit(limit);
            
        return results as Array<WrongAnswer & { similarity: number }>;
    }

    // Spaced Repetition portion
    async getSpacedRepetitionByWrongAnswer(wrongAnswerId: string, userId: string): Promise<SpacedRepetition | undefined> {
        const [result] = await this.db
            .select()
            .from(spacedRepetition)
            .where(and(eq(spacedRepetition.wrongAnswerId, wrongAnswerId), eq(spacedRepetition.userId, userId)))
            .limit(1);
        return result;
    }

    async createSpacedRepetition(data: InsertSpacedRepetition, userId: string): Promise<SpacedRepetition> {
        const id = randomUUID();
        const [result] = await this.db
            .insert(spacedRepetition)
            .values({ ...data, id, userId } as any)
            .returning();
        return result;
    }

    async updateSpacedRepetition(id: string, userId: string, data: Partial<Omit<SpacedRepetition, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SpacedRepetition | undefined> {
        const [result] = await this.db
            .update(spacedRepetition)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(spacedRepetition.id, id), eq(spacedRepetition.userId, userId)))
            .returning();
        return result;
    }

    async getDueReviews(userId: string, maxItems = 10): Promise<Array<{ repetition: SpacedRepetition; wrongAnswer: WrongAnswer }>> {
        const now = new Date();
        const results = await this.db
            .select({
                repetition: spacedRepetition,
                wrongAnswer: wrongAnswers,
            })
            .from(spacedRepetition)
            .innerJoin(wrongAnswers, eq(spacedRepetition.wrongAnswerId, wrongAnswers.id))
            .where(and(
                eq(spacedRepetition.userId, userId),
                sql`${spacedRepetition.nextReviewDate} <= ${now}`
            ))
            .orderBy(asc(spacedRepetition.nextReviewDate))
            .limit(maxItems);
            
        return results;
    }
}
