import { BaseStorage, schema, eq, and, isNull } from "./base";
import type { Subscription, InsertSubscription, FileChunk, InsertFileChunk } from "@shared/schema";
import { PLAN_LIMITS } from "../plans";

export class SubscriptionsMixin extends BaseStorage {
    async getSubscription(userId: string): Promise<Subscription | undefined> {
        const [subscription] = await this.db
            .select()
            .from(schema.subscriptions)
            .where(eq(schema.subscriptions.userId, userId));

        if (!subscription) return undefined;

        // Auto-apply pending plan change when billing cycle has ended
        if (subscription.pendingPlan && subscription.billingCycleEnd) {
            const now = new Date();
            if (now >= new Date(subscription.billingCycleEnd)) {
                const targetPlan = subscription.pendingPlan as keyof typeof PLAN_LIMITS;
                const targetLimits = PLAN_LIMITS[targetPlan] ?? PLAN_LIMITS.free;
                const newStart = new Date();
                const newEnd = targetPlan === "free" ? null : new Date(newStart.getTime() + 30 * 24 * 60 * 60 * 1000);

                const [updated] = await this.db
                    .update(schema.subscriptions)
                    .set({
                        plan: subscription.pendingPlan,
                        pendingPlan: null,
                        monthlyAiQueriesAllowed: targetLimits.aiQueries,
                        monthlyAiQueriesUsed: 0,
                        billingCycleStart: newStart,
                        billingCycleEnd: newEnd,
                        updatedAt: newStart,
                    })
                    .where(eq(schema.subscriptions.userId, userId))
                    .returning();
                return updated;
            }
        }

        return subscription;
    }

    async createSubscription(insertSubscription: InsertSubscription, userId: string): Promise<Subscription> {
        const results = await this.db
            .insert(schema.subscriptions)
            .values({ userId, ...insertSubscription })
            .returning();
        return results[0];
    }

    async updateSubscription(userId: string, data: Partial<InsertSubscription>): Promise<Subscription | undefined> {
        const results = await this.db
            .update(schema.subscriptions)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(schema.subscriptions.userId, userId))
            .returning();
        return results[0];
    }

    async checkAiQuota(userId: string): Promise<{ allowed: number; used: number; hasQuota: boolean }> {
        const [user] = await this.db.select().from(schema.users).where(eq(schema.users.id, userId));
        if (!user) return { allowed: 0, used: 0, hasQuota: false };

        const now = new Date();
        const lastReset = user.lastFreeQueryResetAt ? new Date(user.lastFreeQueryResetAt) : new Date(0);
        
        const isSameDay = now.getFullYear() === lastReset.getFullYear() && 
                          now.getMonth() === lastReset.getMonth() && 
                          now.getDate() === lastReset.getDate();

        let dailyUsed = user.dailyFreeQueriesUsed;
        if (!isSameDay) {
            dailyUsed = 0;
        }

        const DAILY_FREE_LIMIT = 3;

        // 1. 무료 쿼터가 남은 경우
        if (dailyUsed < DAILY_FREE_LIMIT) {
            return {
                allowed: DAILY_FREE_LIMIT + user.credits,
                used: dailyUsed,
                hasQuota: true
            };
        }

        // 2. 보유 크레딧이 남은 경우
        if (user.credits >= 1) {
            return {
                allowed: user.credits,
                used: 0,
                hasQuota: true
            };
        }

        return { allowed: 0, used: dailyUsed, hasQuota: false };
    }

    async incrementAiUsage(userId: string): Promise<boolean> {
        const [user] = await this.db.select().from(schema.users).where(eq(schema.users.id, userId));
        if (!user) return false;

        const now = new Date();
        const lastReset = user.lastFreeQueryResetAt ? new Date(user.lastFreeQueryResetAt) : new Date(0);
        
        const isSameDay = now.getFullYear() === lastReset.getFullYear() && 
                          now.getMonth() === lastReset.getMonth() && 
                          now.getDate() === lastReset.getDate();

        let dailyUsed = isSameDay ? user.dailyFreeQueriesUsed : 0;
        const DAILY_FREE_LIMIT = 3;

        // 1. 매일 3회 무료 우선 차감
        if (dailyUsed < DAILY_FREE_LIMIT) {
            await this.db.update(schema.users)
                .set({ 
                    dailyFreeQueriesUsed: dailyUsed + 1, 
                    lastFreeQueryResetAt: now,
                    updatedAt: now 
                })
                .where(eq(schema.users.id, userId));
            return true;
        }

        // 2. 무료 소진 완료 시 보유 크레딧 차감
        if (user.credits >= 1) {
            await this.db.update(schema.users)
                .set({ credits: user.credits - 1, updatedAt: now })
                .where(eq(schema.users.id, userId));
                
            await this.db.insert(schema.creditTransactions)
                .values({
                    userId,
                    amount: -1,
                    reason: "ai_analysis",
                    createdAt: now,
                });
            return true;
        }

        return false;
    }
}

export class FileChunksMixin extends BaseStorage {
    async getFileChunks(fileId: string, userId: string): Promise<FileChunk[]> {
        return await this.db
            .select()
            .from(schema.fileChunks)
            .where(and(eq(schema.fileChunks.fileId, fileId), eq(schema.fileChunks.userId, userId)))
            .orderBy(schema.fileChunks.chunkIndex);
    }

    async getFileChunksByProject(projectId: string, userId: string): Promise<FileChunk[]> {
        // This method depends on getFilesByProject — handled in composed class
        const projectFiles = await this.db
            .select()
            .from(schema.files)
            .where(and(eq(schema.files.projectId, projectId), eq(schema.files.userId, userId), isNull(schema.files.deletedAt)));
        if (projectFiles.length === 0) return [];

        const allChunks: FileChunk[] = [];
        for (const file of projectFiles) {
            const chunks = await this.getFileChunks(file.id, userId);
            allChunks.push(...chunks);
        }
        return allChunks;
    }

    async getAllFileChunks(userId: string, includeArchived = false): Promise<FileChunk[]> {
        if (includeArchived) {
            return await this.db
                .select()
                .from(schema.fileChunks)
                .where(eq(schema.fileChunks.userId, userId))
                .orderBy(schema.fileChunks.chunkIndex);
        }

        // Exclude chunks from archived files
        return await this.db
            .select({
                id: schema.fileChunks.id,
                fileId: schema.fileChunks.fileId,
                userId: schema.fileChunks.userId,
                content: schema.fileChunks.content,
                chunkIndex: schema.fileChunks.chunkIndex,
                tokenCount: schema.fileChunks.tokenCount,
                embedding: schema.fileChunks.embedding,
                embeddingVector: schema.fileChunks.embeddingVector,
                metadata: schema.fileChunks.metadata,
                attributes: schema.fileChunks.attributes,
                createdAt: schema.fileChunks.createdAt,
            })
            .from(schema.fileChunks)
            .innerJoin(schema.files, eq(schema.fileChunks.fileId, schema.files.id))
            .where(and(
                eq(schema.fileChunks.userId, userId),
                isNull(schema.files.archivedAt)
            ))
            .orderBy(schema.fileChunks.chunkIndex);
    }

    async createFileChunk(chunk: InsertFileChunk): Promise<FileChunk> {
        const results = await this.db
            .insert(schema.fileChunks)
            .values(chunk as any)
            .returning();
        return results[0];
    }

    async createFileChunks(chunks: InsertFileChunk[]): Promise<FileChunk[]> {
        if (chunks.length === 0) return [];
        const results = await this.db
            .insert(schema.fileChunks)
            .values(chunks as any)
            .returning();
        return results;
    }

    async deleteFileChunks(fileId: string, userId: string): Promise<boolean> {
        const results = await this.db
            .delete(schema.fileChunks)
            .where(and(eq(schema.fileChunks.fileId, fileId), eq(schema.fileChunks.userId, userId)))
            .returning();
        return results.length > 0;
    }

    async updateFileChunkEmbedding(id: string, embedding: string, embeddingVector?: number[]): Promise<void> {
        const updateData: { embedding: string; embeddingVector?: number[] } = { embedding };
        if (embeddingVector) {
            updateData.embeddingVector = embeddingVector;
        }
        await this.db
            .update(schema.fileChunks)
            .set(updateData)
            .where(eq(schema.fileChunks.id, id));
    }

    async updateFileChunkingStatus(fileId: string, userId: string, status: string): Promise<void> {
        await this.db
            .update(schema.files)
            .set({ chunkingStatus: status, updatedAt: new Date() })
            .where(and(eq(schema.files.id, fileId), eq(schema.files.userId, userId)));
    }
}
