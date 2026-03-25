import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function enableVector() {
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS vector;');
    console.log('pgvector extension enabled successfully!');
  } catch (err) {
    console.error('Failed to enable pgvector:', err);
  } finally {
    await pool.end();
  }
}

enableVector();
