import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

// In a real deployment, this comes strictly from process.env
// We default to the provided connection string for the context of this exercise if env is missing
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for many hosted Postgres services (like Render)
  },
});

export const query = (text: string, params?: any[]) => pool.query(text, params);