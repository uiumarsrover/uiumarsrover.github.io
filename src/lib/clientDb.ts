import { neon } from '@neondatabase/serverless';

const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL || 'postgresql://neondb_owner:npg_5ryfmk4YAxKR@ep-damp-pine-ayign3qd-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Direct Neon client for serverless and browser environments
export const clientSql = neon(connectionString);

export default clientSql;
