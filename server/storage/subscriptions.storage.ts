import { BaseStorage, schema, eq, and, isNull } from "./base";
import type { Subscription, InsertSubscription } from "@shared/schema";
import { PLAN_LIMITS, DAILY_FREE_LIMIT } from "../plans";

/** 두 Date가 같은 날(로컬 기준)인지 확인 */
function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

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
        const payload = Object.assign({}, insertSubscription, { userId });
        const results = await this.db
            .insert(schema.subscriptions)
            .values(payload as any)
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
}
