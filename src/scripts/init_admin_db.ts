import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';
import crypto from 'crypto';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5ryfmk4YAxKR@ep-damp-pine-ayign3qd-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(connectionString);

const SALT = process.env.ADMIN_AUTH_SALT || 'umrt_mars_rover_secret_salt_2026';

function hashPassword(password: string): string {
  return crypto.createHmac('sha256', SALT).update(password).digest('hex');
}

async function main() {
  console.log('--- Initializing Admin Database Tables on Neon PostgreSQL ---');

  // 1. Create admin_users table
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'SUPERADMIN',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('admin_users table verified.');

  // Default superadmin credentials
  const defaultEmail = 'admin@uiumarsrover.org';
  const defaultUser = 'admin';
  const defaultPass = 'MarsRover2026!';
  const defaultPassHash = hashPassword(defaultPass);

  await sql`
    INSERT INTO admin_users (username, email, password_hash, role)
    VALUES (${defaultUser}, ${defaultEmail}, ${defaultPassHash}, 'SUPERADMIN')
    ON CONFLICT (username) DO UPDATE 
    SET password_hash = ${defaultPassHash}, email = ${defaultEmail};
  `;
  console.log(`Default Superadmin active: Username: ${defaultUser} / Email: ${defaultEmail} | Password: ${defaultPass}`);

  // 2. Create site_content table for universal text & image editing
  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      key VARCHAR(150) PRIMARY KEY,
      value TEXT NOT NULL,
      section VARCHAR(100) NOT NULL,
      type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'html'
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('site_content table verified.');

  // Seed default site_content keys if not present
  const defaultContents = [
    { key: 'hero_badge', value: '5TH GENERATION PLANETARY ROVER • URC 2026', section: 'hero', type: 'text' },
    { key: 'hero_headline_1', value: 'Pioneering The Future of', section: 'hero', type: 'text' },
    { key: 'hero_headline_2', value: 'Planetary Exploration', section: 'hero', type: 'text' },
    { key: 'hero_subtitle', value: 'UIU Mars Rover Team engineers next-generation autonomous rovers designed for extreme Martian terrains, subsurface astrobiology, and robotic manipulation.', section: 'hero', type: 'text' },
    { key: 'hero_bg_image', value: '/Hero.PNG', section: 'hero', type: 'image' },
    { key: 'stat_1_val', value: '3rd Place', section: 'stats', type: 'text' },
    { key: 'stat_1_label', value: 'World URC 2026 Record', section: 'stats', type: 'text' },
    { key: 'stat_2_val', value: '1st in Asia', section: 'stats', type: 'text' },
    { key: 'stat_2_label', value: 'URC 2022 Milestone', section: 'stats', type: 'text' },
    { key: 'stat_3_val', value: '5 Generations', section: 'stats', type: 'text' },
    { key: 'stat_3_label', value: 'Planetary Rovers Built', section: 'stats', type: 'text' },
    { key: 'stat_4_val', value: '80+ Engineers', section: 'stats', type: 'text' },
    { key: 'stat_4_label', value: 'Team Members & Alumni', section: 'stats', type: 'text' },
    { key: 'about_mission', value: 'Our mission is to foster multidisciplinary engineering excellence in robotics, aerospace, embedded systems, and space sciences while competing at the highest global level.', section: 'about', type: 'text' },
    { key: 'footer_tagline', value: 'UIU Mars Rover Team • Pushing the boundaries of autonomous planetary exploration.', section: 'footer', type: 'text' },
  ];

  for (const item of defaultContents) {
    await sql`
      INSERT INTO site_content (key, value, section, type)
      VALUES (${item.key}, ${item.value}, ${item.section}, ${item.type})
      ON CONFLICT (key) DO NOTHING;
    `;
  }
  console.log('Default site_content seeded successfully.');

  console.log('--- Admin Database Setup Completed Successfully! ---');
}

main().catch(err => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});
