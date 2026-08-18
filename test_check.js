const { neon } = require('@neondatabase/serverless');

const connectionString = 'postgresql://neondb_owner:npg_5ryfmk4YAxKR@ep-damp-pine-ayign3qd-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(connectionString);

async function main() {
  const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'site_content';`;
  console.log('SITE_CONTENT COLUMNS:', columns);

  const rows = await sql`SELECT * FROM site_content;`;
  console.log('SITE_CONTENT ROWS count:', rows.length);
  console.log('SITE_CONTENT SAMPLE:', rows.slice(0, 5));
}

main().catch(console.error);
