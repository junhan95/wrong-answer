import { drizzle } from "drizzle-orm/node-postgres";
import pg, { type Pool } from "pg";
const { Pool: PgPool } = pg;
import * as schema from "@shared/schema";

// Singleton Pool for pgvector operations - prevents connection exhaustion
let pgVectorPool: Pool | null = null;

export function getPgVectorPool(): Pool {
    if (!pgVectorPool) {
        pgVectorPool = new PgPool({
            connectionString: process.env.DATABASE_URL,
            max: 10,  // Maximum 10 connections in pool
            idleTimeoutMillis: 30000,  // Close idle connections after 30 seconds
            connectionTimeoutMillis: 10000,  // Timeout after 10 seconds when acquiring connection
            ssl: { rejectUnauthorized: false }
        });

        // Handle pool errors gracefully
        pgVectorPool.on('error', (err: any) => {
            console.error('[PgVector Pool] Unexpected error:', err);
        });
    }
    return pgVectorPool;
}

export type DrizzleDB = ReturnType<typeof drizzle>;

/**
 * DatabaseStorage의 기본 클래스.
 * DB 연결을 초기화하고 하위 mixin들에게 db 인스턴스를 제공합니다.
 */
export class BaseStorage {
    protected db: DrizzleDB;

    constructor() {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error("DATABASE_URL environment variable is not set");
        }
        const pool = new PgPool({ connectionString });
        this.db = drizzle(pool, { schema });
    }
}

// Re-export schema and drizzle utilities for use in mixin files
export { schema };
export { eq, desc, sql, max, and, lt, isNull, isNotNull, or } from "drizzle-orm";
