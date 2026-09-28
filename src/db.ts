import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
});

export async function testConnection(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch {
    return false;
  }
}
