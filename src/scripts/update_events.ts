import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5ryfmk4YAxKR@ep-damp-pine-ayign3qd-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(connectionString);

async function fixEventPhotos() {
  console.log('Updating events in Neon PostgreSQL with verified photos...');

  await sql`TRUNCATE TABLE events RESTART IDENTITY;`;

  await sql`
    INSERT INTO events (title, event_date, location, image_url, description, category, status)
    VALUES
    (
      'Space Innovation Camp Bangladesh',
      'October 2025',
      'UIU Main Campus, Dhaka',
      '/images/campaigns1.png',
      'The UIU Mars Rover Team hosted the Astro Robotics Team from Space Innovation Camp Bangladesh. Honored by Prof. Emeritus Dr. M. Rezwan Khan and Dr. Hasan Sarwar, inspiring young innovators in rover mechanics and space systems.',
      'Workshop & Outreach',
      'COMPLETED'
    ),
    (
      'ArcaNoca 251 Robotics & IoT Workshop',
      'August 2025',
      'CAIR Laboratory, UIU',
      '/images/campaigns2.jpg',
      'UIU Robotics & UIU Mars Rover Team collaborated for an engaging IoT & Robotics Workshop. Demonstrated the rover AXIOS with live teleoperation and sensory feedback.',
      'Technical Workshop',
      'COMPLETED'
    ),
    (
      'Space Exploration Camp at Holy Cross College',
      'July 2025',
      'Holy Cross Girls College, Dhaka',
      '/images/holy_cross1.jpg',
      'Interactive workshop bringing Mars rover engineering, telemetry systems, and rocketry science directly to high school students and young women in STEM.',
      'STEM Outreach',
      'COMPLETED'
    ),
    (
      'Bangladesh Space Olympiad - National Finals',
      'June 2025',
      'United International University',
      '/images/campaigns3.jpg',
      'Over 500 participants gathered for the national round of the Space Olympiad, celebrating robotics innovation and collegiate rover engineering.',
      'National Olympiad',
      'COMPLETED'
    ),
    (
      'BEAR Innovation Summit & Rover Keynote',
      'May 2025',
      'UIU Auditorium',
      '/images/bearsummit2025.jpg',
      'Keynote presentation and live demonstration of rover autonomous obstacle avoidance and sample return mechanism.',
      'Keynote & Showcase',
      'COMPLETED'
    ),
    (
      'Google Tech Tour & AI Lab Exhibition',
      'March 2025',
      'CAIR Robotics Lab',
      '/images/google_tour.jpg',
      'Exhibition of rover autonomous computer vision, SLAM navigation, and 6-DOF robotic manipulator control.',
      'Exhibition',
      'COMPLETED'
    );
  `;

  console.log('✅ Events table updated with real verified photos!');
  
  const evts = await sql`SELECT id, title, image_url FROM events;`;
  console.log('Current events in database:', evts);
}

fixEventPhotos().catch(console.error);
