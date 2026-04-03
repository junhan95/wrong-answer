import type {
    User,
    UpsertUser,
    Subscription,
    InsertSubscription,
    CreditTransaction,
    InsertCreditTransaction,
    WrongAnswer,
    InsertWrongAnswer,
    SpacedRepetition,
    InsertSpacedRepetition,
    TutorSession,
    InsertTutorSession,
    TutorMessage,
    InsertTutorMessage,
    FamilyLink,
    InsertFamilyLink,
    WeeklyReport,
    InsertWeeklyReport,
} from "@shared/schema";

export interface IStorage {
    // User operations
    getUser(id: string): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    createUser(user: UpsertUser): Promise<User>;
    upsertUser(user: UpsertUser): Promise<User>;
    updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
    deleteUser(id: string): Promise<boolean>;

    // Credit operations
    addCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction>;
    getCreditTransactions(userId: string): Promise<CreditTransaction[]>;

    // Subscription operations
    getSubscription(userId: string): Promise<Subscription | undefined>;
    createSubscription(subscription: InsertSubscription, userId: string): Promise<Subscription>;
    updateSubscription(userId: string, data: Partial<InsertSubscription>): Promise<Subscription | undefined>;

    // Wrong Answer operations
    getWrongAnswers(userId: string): Promise<WrongAnswer[]>;
    getWrongAnswerById(id: string, userId: string): Promise<WrongAnswer | undefined>;
    createWrongAnswer(data: InsertWrongAnswer, userId: string): Promise<WrongAnswer>;
    updateWrongAnswer(id: string, userId: string, data: Partial<Omit<WrongAnswer, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>): Promise<WrongAnswer | undefined>;
    deleteWrongAnswer(id: string, userId: string): Promise<boolean>;
    searchWrongAnswersByVector(userId: string, queryEmbedding: number[], limit?: number): Promise<Array<WrongAnswer & { similarity: number }>>;

    // Spaced Repetition operations
    getSpacedRepetitionByWrongAnswer(wrongAnswerId: string, userId: string): Promise<SpacedRepetition | undefined>;
    createSpacedRepetition(data: InsertSpacedRepetition, userId: string): Promise<SpacedRepetition>;
    updateSpacedRepetition(id: string, userId: string, data: Partial<Omit<SpacedRepetition, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SpacedRepetition | undefined>;
    getDueReviews(userId: string, maxItems?: number): Promise<Array<{ repetition: SpacedRepetition; wrongAnswer: WrongAnswer }>>;

    // Tutor Session operations
    getTutorSessions(userId: string): Promise<TutorSession[]>;
    getTutorSessionById(id: string, userId: string): Promise<TutorSession | undefined>;
    createTutorSession(data: InsertTutorSession, userId: string): Promise<TutorSession>;
    updateTutorSession(id: string, userId: string, data: Partial<Omit<TutorSession, 'id' | 'createdAt' | 'updatedAt'>>): Promise<TutorSession | undefined>;
    deleteTutorSession(id: string, userId: string): Promise<boolean>;

    // Tutor Message operations
    getTutorMessages(sessionId: string): Promise<TutorMessage[]>;
    createTutorMessage(data: InsertTutorMessage): Promise<TutorMessage>;

    // Family Link operations
    getFamilyLinks(userId: string, role: "parent" | "student"): Promise<FamilyLink[]>;
    createFamilyLink(data: InsertFamilyLink): Promise<FamilyLink>;
    updateFamilyLink(id: string, data: Partial<Omit<FamilyLink, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FamilyLink | undefined>;
    deleteFamilyLink(id: string): Promise<boolean>;

    // Weekly Report operations
    getWeeklyReports(familyLinkId: string): Promise<WeeklyReport[]>;
    createWeeklyReport(data: InsertWeeklyReport): Promise<WeeklyReport>;
}
