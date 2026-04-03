import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, index, customType, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Custom pgvector type for embedding vectors
export const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return "vector(1536)";
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: string): number[] {
    const cleaned = value.replace(/[\[\]]/g, "");
    return cleaned ? cleaned.split(",").map(Number) : [];
  },
});

export interface Attachment {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

// ----------------------------------------------------------------------------
// Core User & Auth (Retained from WiseQuery, adapted for credit system)
// ----------------------------------------------------------------------------
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  authProvider: varchar("auth_provider").default("oauth"),
  role: varchar("role").default("user"), // "user" | "admin" | "parent"
  credits: integer("credits").notNull().default(100),
  dailyFreeQueriesUsed: integer("daily_free_queries_used").notNull().default(0),
  lastFreeQueryResetAt: timestamp("last_free_query_reset_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const creditTransactions = pgTable(
  "credit_transactions",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(), // 양수: 충전, 음수: 차감
    reason: varchar("reason").notNull(), // ex: "signup_bonus", "ai_analysis", "tutor_chat"
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("IDX_credit_tx_user_id").on(table.userId),
  ],
);

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  plan: varchar("plan").notNull().default("free"), // free, plus, premium
  billingCycleStart: timestamp("billing_cycle_start").notNull().defaultNow(),
  billingCycleEnd: timestamp("billing_cycle_end"),
  pendingPlan: varchar("pending_plan"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


// ----------------------------------------------------------------------------
// wrong-answer.ai Domain Entities
// ----------------------------------------------------------------------------

export const wrongAnswers = pgTable(
  "wrong_answers",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    subject: varchar("subject"), // e.g., "수학", "영어"
    conceptTags: jsonb("concept_tags").$type<string[]>(), // e.g., ["수열", "등차수열"]
    errorCategory: varchar("error_category"), // "개념미숙지", "계산실수", "시간부족", "문제이해오류"
    originalImageUrl: text("original_image_url"),
    extractedText: text("extracted_text"),
    solutionText: text("solution_text"),
    embeddingVector: vector("embedding_vector"), // For Hybrid RAG search
    archivedAt: timestamp("archived_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("IDX_wrong_answers_user_id").on(table.userId),
    index("IDX_wrong_answers_subject").on(table.subject),
  ]
);

export const spacedRepetition = pgTable(
  "spaced_repetition",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    wrongAnswerId: varchar("wrong_answer_id").notNull().unique().references(() => wrongAnswers.id, { onDelete: "cascade" }),
    userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    interval: integer("interval").notNull().default(1), // Days until next review
    repetition: integer("repetition").notNull().default(0), // Number of times reviewed
    easeFactor: real("ease_factor").notNull().default(2.5), // SM-2 ease factor
    nextReviewDate: timestamp("next_review_date").notNull().defaultNow(),
    lastReviewedAt: timestamp("last_reviewed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("IDX_sr_user_id").on(table.userId),
    index("IDX_sr_next_review").on(table.nextReviewDate),
  ]
);

export const tutorSessions = pgTable(
  "tutor_sessions",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    wrongAnswerId: varchar("wrong_answer_id").references(() => wrongAnswers.id, { onDelete: "set null" }),
    phase: varchar("phase").notNull().default("exploring"), // "exploring" -> "hinting" -> "revealing" -> "complete"
    title: text("title"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("IDX_tutor_session_user_id").on(table.userId),
    index("IDX_tutor_session_wrong_answer").on(table.wrongAnswerId),
  ]
);

export const tutorMessages = pgTable(
  "tutor_messages",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    sessionId: varchar("session_id").notNull().references(() => tutorSessions.id, { onDelete: "cascade" }),
    role: varchar("role").notNull(), // "user" | "assistant" | "system"
    content: text("content").notNull(),
    attachments: jsonb("attachments").$type<Attachment[] | null>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("IDX_tutor_messages_session_id").on(table.sessionId),
  ]
);

export const familyLinks = pgTable(
  "family_links",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    studentId: varchar("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    parentId: varchar("parent_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    status: varchar("status").notNull().default("pending"), // "pending" | "active"
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("IDX_family_links_student").on(table.studentId),
    index("IDX_family_links_parent").on(table.parentId),
  ]
);

export const weeklyReports = pgTable(
  "weekly_reports",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    familyLinkId: varchar("family_link_id").notNull().references(() => familyLinks.id, { onDelete: "cascade" }),
    reportData: jsonb("report_data").notNull(),
    sentAt: timestamp("sent_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("IDX_weekly_reports_family_link").on(table.familyLinkId),
  ]
);

// ----------------------------------------------------------------------------
// Zod Schemas
// ----------------------------------------------------------------------------

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastFreeQueryResetAt: true,
});
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  createdAt: true,
});
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;
export type CreditTransaction = typeof creditTransactions.$inferSelect;

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export const insertWrongAnswerSchema = createInsertSchema(wrongAnswers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  embeddingVector: true,
});
export type InsertWrongAnswer = z.infer<typeof insertWrongAnswerSchema>;
export type WrongAnswer = typeof wrongAnswers.$inferSelect;

export const insertSpacedRepetitionSchema = createInsertSchema(spacedRepetition).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSpacedRepetition = z.infer<typeof insertSpacedRepetitionSchema>;
export type SpacedRepetition = typeof spacedRepetition.$inferSelect;

export const insertTutorSessionSchema = createInsertSchema(tutorSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTutorSession = z.infer<typeof insertTutorSessionSchema>;
export type TutorSession = typeof tutorSessions.$inferSelect;

export const attachmentSchema = z.object({
  filename: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string(),
});

export const insertTutorMessageSchema = createInsertSchema(tutorMessages).omit({
  id: true,
  createdAt: true,
}).extend({
  attachments: z.array(attachmentSchema).optional(),
});
export type InsertTutorMessage = z.infer<typeof insertTutorMessageSchema>;
export type TutorMessage = typeof tutorMessages.$inferSelect;

export const insertFamilyLinkSchema = createInsertSchema(familyLinks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertFamilyLink = z.infer<typeof insertFamilyLinkSchema>;
export type FamilyLink = typeof familyLinks.$inferSelect;

export const insertWeeklyReportSchema = createInsertSchema(weeklyReports).omit({
  id: true,
  createdAt: true,
});
export type InsertWeeklyReport = z.infer<typeof insertWeeklyReportSchema>;
export type WeeklyReport = typeof weeklyReports.$inferSelect;
