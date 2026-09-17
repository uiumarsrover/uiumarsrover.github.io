import { neon, neonConfig } from '@neondatabase/serverless';

// Default connection string fallback
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5ryfmk4YAxKR@ep-damp-pine-ayign3qd-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Initialize Neon serverless SQL client
export const sql = neon(connectionString);

export default sql;
