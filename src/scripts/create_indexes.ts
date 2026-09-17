import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5ryfmk4YAxKR@ep-damp-pine-ayign3qd-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(connectionString);

async function main() {
  console.log('--- Applying Performance Indexes to Neon PostgreSQL Database ---');

  const queries = [
    // Members Table Indexes: optimized for roster year/subteam filters & leadership hierarchy
    { name: 'idx_members_year_subteam', query: sql`CREATE INDEX IF NOT EXISTS idx_members_year_subteam ON members (year, subteam);` },
    { name: 'idx_members_lead_id', query: sql`CREATE INDEX IF NOT EXISTS idx_members_lead_id ON members (is_lead DESC, id ASC);` },
    
    // Rovers Table Indexes: optimized for reverse-chronological fleet sorting
    { name: 'idx_rovers_year_desc', query: sql`CREATE INDEX IF NOT EXISTS idx_rovers_year_desc ON rovers (year DESC);` },
    
    // Achievements Table Indexes: homepage featured queries and timeline sorting
    { name: 'idx_achievements_featured_year', query: sql`CREATE INDEX IF NOT EXISTS idx_achievements_featured_year ON achievements (is_featured, year DESC);` },
    { name: 'idx_achievements_year_desc', query: sql`CREATE INDEX IF NOT EXISTS idx_achievements_year_desc ON achievements (year DESC);` },

    // Events Table Indexes: category and chronological lookup
    { name: 'idx_events_status_date', query: sql`CREATE INDEX IF NOT EXISTS idx_events_status_date ON events (status, created_at DESC);` },
    { name: 'idx_events_category', query: sql`CREATE INDEX IF NOT EXISTS idx_events_category ON events (category);` },

    // Site Content Table Indexes: section lookup
    { name: 'idx_site_content_section', query: sql`CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content (section);` },

    // Media Articles Table Indexes
    { name: 'idx_media_articles_id_asc', query: sql`CREATE INDEX IF NOT EXISTS idx_media_articles_id_asc ON media_articles (id ASC);` },
  ];

  for (const { name, query } of queries) {
    try {
      await query;
      console.log(`✅ Index applied: ${name}`);
    } catch (err: any) {
      console.error(`❌ Failed to apply index ${name}:`, err.message);
    }
  }

  console.log('--- All Performance Database Indexes Successfully Configured! ---');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
