const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: 'UMRT_NEW/.env.local' });

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5ryfmk4YAxKR@ep-damp-pine-ayign3qd-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(connectionString);

function extractMembers(year) {
  const file = 'team/competition/member' + year + '.html';
  if (!fs.existsSync(file)) return [];
  const content = fs.readFileSync(file, 'utf8');
  const match = content.match(/const\s+members\s*=\s*({[\s\S]*?});/);
  if (!match) return [];
  const getMembers = new Function('return ' + match[1]);
  const dict = getMembers();
  
  return Object.keys(dict).map(slug => {
    const m = dict[slug];
    let subteam = 'Management';
    const roleLower = (m.role || '').toLowerCase();
    
    if (roleLower.includes('software') || roleLower.includes('autonomous') || roleLower.includes('web') || roleLower.includes('ai') || roleLower.includes('nav')) {
      subteam = 'Software';
    } else if (roleLower.includes('mechanical') || roleLower.includes('chassis') || roleLower.includes('cad') || roleLower.includes('structure') || roleLower.includes('arm')) {
      subteam = 'Mechanical';
    } else if (roleLower.includes('electrical') || roleLower.includes('communication') || roleLower.includes('power') || roleLower.includes('circuit') || roleLower.includes('pcb') || roleLower.includes('aerial')) {
      subteam = 'Electrical';
    } else if (roleLower.includes('science') || roleLower.includes('bio') || roleLower.includes('chemical') || roleLower.includes('assay') || roleLower.includes('geolog')) {
      subteam = 'Science';
    } else if (roleLower.includes('media') || roleLower.includes('branding') || roleLower.includes('documentary')) {
      subteam = 'Media & Outreach';
    }

    const isLead = roleLower.includes('leader') || roleLower.includes('lead');

    // Clean image path
    let imgPath = m.image || '';
    if (imgPath.startsWith('.')) {
      imgPath = '/team/competition/' + imgPath.replace(/^\.\//, '');
    }

    return {
      name: m.name,
      role: m.role,
      subteam: subteam,
      year: year,
      slug: slug,
      image_url: imgPath,
      is_lead: isLead,
      bio: `${m.name} served as ${m.role} for the UIU Mars Rover Team during the ${year} competition expedition.`
    };
  });
}

async function seedAllMembers() {
  console.log('Connecting to Neon PostgreSQL to seed all 133+ members...');

  await sql("DELETE FROM members;");

  let count = 0;
  for (const yr of [2026, 2025, 2024, 2023, 2022]) {
    const members = extractMembers(yr);
    console.log(`Seeding ${members.length} members for ${yr}...`);
    
    for (const m of members) {
      await sql(
        `INSERT INTO members (name, role, subteam, year, bio, image_url, is_lead)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [m.name, m.role, m.subteam, m.year, m.bio, m.image_url, m.is_lead]
      );
      count++;
    }
  }

  console.log(`🎉 Successfully seeded ${count} members from the previous website into Neon DB!`);
}

seedAllMembers().catch(console.error);
