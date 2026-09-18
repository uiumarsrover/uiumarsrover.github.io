import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5ryfmk4YAxKR@ep-damp-pine-ayign3qd-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(connectionString);

function toWebp(url: string | null | undefined): string | null | undefined {
  if (!url) return url;
  return url.replace(/\.(png|jpg|jpeg|PNG|JPG|JPEG)$/i, '.webp');
}

async function main() {
  console.log('🔄 Connecting to Neon Database to update image references to .webp...');

  // 1. Members
  console.log('Updating members table...');
  const members = await sql`SELECT id, image_url FROM members WHERE image_url IS NOT NULL;`;
  let memberCount = 0;
  for (const m of members) {
    const newUrl = toWebp(m.image_url);
    if (newUrl !== m.image_url) {
      await sql`UPDATE members SET image_url = ${newUrl} WHERE id = ${m.id};`;
      memberCount++;
    }
  }
  console.log(`Updated ${memberCount} members image_url.`);

  // 2. Rovers
  console.log('Updating rovers table...');
  const rovers = await sql`SELECT id, cover_image, logo_image, subsystems FROM rovers;`;
  let roverCount = 0;
  for (const r of rovers) {
    const newCover = toWebp(r.cover_image);
    const newLogo = toWebp(r.logo_image);
    let newSubsystems = r.subsystems;

    if (typeof newSubsystems === 'string') {
      try {
        newSubsystems = JSON.parse(newSubsystems);
      } catch (e) {}
    }

    if (newSubsystems && typeof newSubsystems === 'object') {
      for (const key of Object.keys(newSubsystems)) {
        if (newSubsystems[key] && newSubsystems[key].image) {
          newSubsystems[key].image = toWebp(newSubsystems[key].image);
        }
      }
    }

    await sql`
      UPDATE rovers 
      SET cover_image = ${newCover}, 
          logo_image = ${newLogo}, 
          subsystems = ${JSON.stringify(newSubsystems)} 
      WHERE id = ${r.id};
    `;
    roverCount++;
  }
  console.log(`Updated ${roverCount} rovers.`);

  // 3. Achievements
  console.log('Updating achievements table...');
  const achievements = await sql`SELECT id, image_url FROM achievements WHERE image_url IS NOT NULL;`;
  let achCount = 0;
  for (const a of achievements) {
    const newUrl = toWebp(a.image_url);
    if (newUrl !== a.image_url) {
      await sql`UPDATE achievements SET image_url = ${newUrl} WHERE id = ${a.id};`;
      achCount++;
    }
  }
  console.log(`Updated ${achCount} achievements.`);

  // 4. Advisors
  console.log('Updating advisors table...');
  const advisors = await sql`SELECT id, image_url FROM advisors WHERE image_url IS NOT NULL;`;
  let advCount = 0;
  for (const adv of advisors) {
    const newUrl = toWebp(adv.image_url);
    if (newUrl !== adv.image_url) {
      await sql`UPDATE advisors SET image_url = ${newUrl} WHERE id = ${adv.id};`;
      advCount++;
    }
  }
  console.log(`Updated ${advCount} advisors.`);

  // 5. Events
  console.log('Updating events table...');
  const events = await sql`SELECT id, image_url FROM events WHERE image_url IS NOT NULL;`;
  let evCount = 0;
  for (const ev of events) {
    const newUrl = toWebp(ev.image_url);
    if (newUrl !== ev.image_url) {
      await sql`UPDATE events SET image_url = ${newUrl} WHERE id = ${ev.id};`;
      evCount++;
    }
  }
  console.log(`Updated ${evCount} events.`);

  // 6. Media Articles
  console.log('Updating media_articles table...');
  const articles = await sql`SELECT id, publisher_logo, clipping_image FROM media_articles;`;
  let artCount = 0;
  for (const art of articles) {
    const newLogo = toWebp(art.publisher_logo);
    const newClip = toWebp(art.clipping_image);
    await sql`
      UPDATE media_articles 
      SET publisher_logo = ${newLogo}, 
          clipping_image = ${newClip} 
      WHERE id = ${art.id};
    `;
    artCount++;
  }
  console.log(`Updated ${artCount} media articles.`);

  // 7. Sponsors
  console.log('Updating sponsors table...');
  const sponsors = await sql`SELECT id, logo_url FROM sponsors WHERE logo_url IS NOT NULL;`;
  let sponCount = 0;
  for (const sp of sponsors) {
    const newUrl = toWebp(sp.logo_url);
    if (newUrl !== sp.logo_url) {
      await sql`UPDATE sponsors SET logo_url = ${newUrl} WHERE id = ${sp.id};`;
      sponCount++;
    }
  }
  console.log(`Updated ${sponCount} sponsors.`);

  console.log('✨ All database image references updated to .webp successfully!');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
