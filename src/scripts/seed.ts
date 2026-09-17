import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5ryfmk4YAxKR@ep-damp-pine-ayign3qd-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(connectionString);

async function main() {
  console.log('Connecting to Neon Tech PostgreSQL...');

  // Drop old tables if they existed with legacy schemas
  await sql`
    DROP TABLE IF EXISTS members, rovers, achievements, advisors, events, media_articles, sponsors, join_applications, contact_messages CASCADE;
  `;

  // 1. Create Tables
  await sql`
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      subteam VARCHAR(100) NOT NULL,
      year INT NOT NULL,
      bio TEXT,
      image_url VARCHAR(500),
      linkedin_url VARCHAR(500),
      github_url VARCHAR(500),
      email VARCHAR(255),
      is_lead BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS rovers (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      year INT NOT NULL,
      competition VARCHAR(255) NOT NULL,
      rank_achieved VARCHAR(255),
      cover_image VARCHAR(500) NOT NULL,
      logo_image VARCHAR(500),
      tagline TEXT,
      description TEXT,
      specs JSONB,
      subsystems JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS achievements (
      id SERIAL PRIMARY KEY,
      year INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      competition VARCHAR(100) NOT NULL,
      rank VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      image_url VARCHAR(500),
      description TEXT,
      is_featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS advisors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      designation VARCHAR(255) NOT NULL,
      organization VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL, -- 'FACULTY_ADVISOR' or 'FOUNDING_DIRECTOR'
      image_url VARCHAR(500),
      bio TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      event_date VARCHAR(100),
      location VARCHAR(255),
      image_url VARCHAR(500),
      description TEXT,
      category VARCHAR(100),
      status VARCHAR(50) DEFAULT 'COMPLETED',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS media_articles (
      id SERIAL PRIMARY KEY,
      publisher_name VARCHAR(255) NOT NULL,
      headline VARCHAR(500) NOT NULL,
      publisher_logo VARCHAR(500),
      clipping_image VARCHAR(500),
      article_url VARCHAR(500),
      publish_date VARCHAR(100),
      category VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sponsors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      tier VARCHAR(100) NOT NULL,
      logo_url VARCHAR(500) NOT NULL,
      website_url VARCHAR(500),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS join_applications (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      student_id VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(100),
      department VARCHAR(100) NOT NULL,
      trimester VARCHAR(50),
      cgpa VARCHAR(50),
      subteam_preference VARCHAR(100) NOT NULL,
      experience TEXT,
      portfolio_url VARCHAR(500),
      reason_to_join TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log('Tables created or verified successfully!');

  // Clear existing seed records to ensure fresh state
  await sql`TRUNCATE TABLE members, rovers, achievements, advisors, events, media_articles, sponsors RESTART IDENTITY;`;

  // 2. Insert Rovers
  console.log('Seeding Rovers...');
  await sql`
    INSERT INTO rovers (slug, name, year, competition, rank_achieved, cover_image, logo_image, tagline, description, specs, subsystems)
    VALUES
    (
      'axios',
      'AXIOS Rover',
      2025,
      'URC 2025 & ARC 2025',
      'Global Top 5 & Finalist',
      '/images/axios.jpg',
      '/images/axios_logo.png',
      'Next-Generation Autonomous Martian Explorer with Hybrid Rocker-Bogie Suspension',
      'AXIOS represents the pinnacle of UMRT engineering. Engineered for high-speed rough terrain traversal, autonomous navigation, and advanced biochemical life detection.',
      '{"weight": "48.5 kg", "speed": "1.8 m/s", "battery": "24V 30Ah LiFePO4", "dof": "6-DOF Precision Manipulator", "payload": "12 kg max", "comms": "5.8GHz Ubiquiti Rocket M5 + 2.4GHz backup"}',
      '{"mechanical": {"title": "Rocker-Bogie Chassis", "image": "/images/axios.jpg", "desc": "Aerospace-grade 6061-T6 aluminum truss design optimized using FEA for minimum weight and maximum payload rigidity."}, "autonomy": {"title": "Autonomous Navigation System", "image": "/images/axios_auto.jpg", "desc": "Dual Intel RealSense D435i cameras + Velodyne LiDAR paired with RTK-GPS and EKF for millimeter-precision waypoint navigation."}, "science": {"title": "In-situ Biochemical Lab", "image": "/images/axios_science.png", "desc": "Automated Raman spectrometer, Bradford assay protein quantification, and deep soil auger extraction."}}'
    ),
    (
      'yggdrasil',
      'YGGDRASIL Rover',
      2024,
      'URC 2024 & ARC 2024',
      'Finalist & Outstanding Technical Execution',
      '/images/yggdrasil.jpg',
      '/images/yggdrasil_logo.png',
      'High-Torque Extreme Terrain Platform with Carbon-Fiber Armature',
      'YGGDRASIL established new standards in robotic manipulation and autonomous terrain mapping during URC 2024 in Hanksville, Utah.',
      '{"weight": "49.2 kg", "speed": "1.5 m/s", "battery": "22.2V 25Ah Li-Po", "dof": "6-DOF Harmonic Drive Arm", "payload": "10 kg max", "comms": "900MHz Telemetry + 5GHz Video Link"}',
      '{"mechanical": {"title": "Harmonic Drive Arm", "image": "/images/yggdrasil_arm.JPG", "desc": "Carbon-fiber tubular arm with harmonic drive actuators delivering high precision and zero-backlash handling."}, "science": {"title": "Soil Chemistry Analyzer", "image": "/images/yggdrasil_science.JPG", "desc": "Multi-chamber sample carousel with reagent micro-dispensers and microscopic imaging."}}'
    ),
    (
      'telos',
      'TELOS Rover',
      2023,
      'URC 2023 & ERC 2023',
      'Top Asian Team & World Finalist',
      '/images/telos.jpg',
      '/images/umrt_logo.png',
      'Robust Field Rover for Extreme Desert Operations',
      'TELOS showcased remarkable reliability in the Utah desert and Kielce, Poland, navigating boulder fields and complex service panel tasks.',
      '{"weight": "47.8 kg", "speed": "1.6 m/s", "battery": "24V 20Ah LiFePO4", "dof": "5-DOF Arm", "payload": "8 kg", "comms": "Ubiquiti 5GHz Link"}',
      '{"mechanical": {"title": "Differential Pivot Drive", "image": "/images/telos.jpg", "desc": "Custom planetary gearboxes with high traction custom tires."}, "autonomy": {"title": "Stereo Vision Nav", "image": "/images/telos.jpg", "desc": "ZED 2i stereo camera with SLAM and obstacle costmaps."}}'
    ),
    (
      'maven',
      'MAVEN & MAVEN 2.0',
      2022,
      'URC 2022',
      '1st in Asia & Top 10 Worldwide',
      '/images/maven.jpg',
      '/images/umrt_logo.png',
      'The Breakthrough Rover that Put Bangladesh on the Global Martian Map',
      'MAVEN made history for Bangladesh by securing 1st place in Asia at the University Rover Challenge 2022 held at Mars Desert Research Station, Utah.',
      '{"weight": "49.8 kg", "speed": "1.4 m/s", "battery": "24V 18Ah Li-Po", "dof": "5-DOF Manipulator", "payload": "7 kg", "comms": "COFDM Wireless Link"}',
      '{"mechanical": {"title": "Titanium Rocker-Bogie", "image": "/images/maven2.jpg", "desc": "Custom differential rocker-bogie for steep sand dune climbing."}}'
    );
  `;

  // 3. Insert Achievements
  console.log('Seeding Achievements...');
  await sql`
    INSERT INTO achievements (year, title, competition, rank, location, image_url, description, is_featured)
    VALUES
    (2026, 'University Rover Challenge 2026', 'URC', '3rd Place Worldwide (Historic Record)', 'MDRS, Utah, USA', '/images/team_urc2026.jpg', 'UMRT achieved an all-time historic record by securing 3rd place globally out of 100+ top universities worldwide at the University Rover Challenge.', true),
    (2025, 'Anatolian Rover Challenge 2025', 'ARC', 'Championship Podium & Best Science', 'Ankara, Turkey', '/images/team_ARC25.jpg', 'Exceptional performance across extreme mobility and autonomous science tasks, receiving international acclaim.', true),
    (2025, 'University Rover Challenge 2025', 'URC', 'World Finalist Delegation', 'Hanksville, Utah, USA', '/images/urc2025.jpg', 'Successfully passed SAR review with top tier score and competed at Mars Desert Research Station.', false),
    (2025, 'BEAR Innovation Summit 2025', 'Summit', 'Keynote Innovation Award', 'Dhaka, Bangladesh', '/images/bearsummit2025.jpg', 'Honored for pioneering robotics and AI innovations in Bangladesh.', false),
    (2024, 'University Rover Challenge 2024', 'URC', 'Global Finalist (YGGDRASIL)', 'Utah, USA', '/images/2024urc.png', 'YGGDRASIL competed against top global teams in robotic arm dexterity and extreme retrieval.', true),
    (2023, 'European Rover Challenge 2023', 'ERC', 'World Finalist', 'Kielce, Poland', '/images/team_2023_2.jpg', 'Demonstrated outstanding remote manipulation and autonomous traverse.', false),
    (2022, 'University Rover Challenge 2022', 'URC', '1st in Asia & Top 10 in the World', 'MDRS, Utah, USA', '/images/team_2022_1.jpg', 'Historic debut securing 1st place among all Asian universities and 10th worldwide.', true);
  `;

  // 4. Insert Advisors & Directors
  console.log('Seeding Advisors & Directors...');
  await sql`
    INSERT INTO advisors (name, designation, organization, type, image_url, bio)
    VALUES
    ('Prof. Dr. Md. Abul Kashem Mia', 'Vice-Chancellor & Chief Patron', 'United International University', 'FACULTY_ADVISOR', '/images/abul-kashem-VC-UIU.jpg', 'Distinguished academic leader guiding UIU towards world-class research excellence in robotics and space systems.'),
    ('Prof. Dr. M. Rezwan Khan', 'Distinguished Professor & Chief Advisor', 'United International University / CAIR', 'FACULTY_ADVISOR', '/images/Dr.-M.-Rezwan-Khan.jpg', 'Former VC of UIU, internationally recognized researcher, and mentor for the Mars Rover Team.'),
    ('Prof. Dr. Chowdhury Mofizur Rahman', 'Professor & Senior Advisor', 'United International University', 'FACULTY_ADVISOR', '/images/Chowdhury_Mofizur_Rahman.jpg', 'Pioneer in Artificial Intelligence and Machine Learning in Bangladesh.'),
    ('Prof. Dr. Swakkhar Shatabda', 'Director, Data Science / Faculty Advisor', 'United International University', 'FACULTY_ADVISOR', '/images/Swakkhar_Shatabda.jpg', 'Guiding autonomous algorithmic design, AI navigation, and sensor fusion.'),
    ('Prof. Dr. Hasan Sarwar', 'Dean, School of Science & Engineering', 'United International University', 'FACULTY_ADVISOR', '/images/Dr.-Hasan-Sarwar.jpg', 'Leading scientific research initiatives and academic support for UMRT.'),
    ('Prof. Dr. Salekul Islam', 'Professor, CSE Department', 'United International University', 'FACULTY_ADVISOR', '/images/Salekul_Islam.jpg', 'Expert in wireless networking, embedded communications, and telemetry.'),
    ('Prof. Dr. Md. Saddam Hossain Mukta', 'Associate Professor, CSE', 'United International University', 'FACULTY_ADVISOR', '/images/Saddam_Hossain_Mukta.jpg', 'Advising on software architecture and autonomous intelligence.'),
    ('Prof. Dr. Raqibul Mostafa', 'Dean, SoSE', 'United International University', 'FACULTY_ADVISOR', '/images/Dr.-Raqibul-Mostafa.jpg', 'Advisor on RF communications and mechanical structural integrity.'),
    ('Abid Hossain', 'Founder & Team Director', 'UIU Mars Rover Team', 'FOUNDING_DIRECTOR', '/images/abid.jpg', 'Founding leader and director of UMRT, leading global delegations from 2022 to present.'),
    ('Akib Zaman', 'Founding Advisor & Technical Director', 'UIU Mars Rover Team / CAIR', 'FOUNDING_DIRECTOR', '/images/Akib_Zaman.jpg', 'Lead architect behind rover electronic architectures and team strategy.');
  `;

  // 5. Insert Team Members (2022-2026 samples from existing site)
  console.log('Seeding Team Members...');
  await sql`
    INSERT INTO members (name, role, subteam, year, bio, image_url, is_lead)
    VALUES
    -- 2026 Leads & Core
    ('Mosfiqur Rahman', 'Team Leader', 'Management', 2026, 'Leading the historic URC 2026 expedition and team strategy.', '/team/competition/img_team2025/Mosfiqur.jpg', true),
    ('Tawsif Turabi', 'Co-Team Leader & Software Lead', 'Software', 2026, 'Architect of autonomous navigation and telemetry stack.', '/team/competition/img_team2025/Turabi.jpg', true),
    ('Siam Ibne Sarwar', 'Mechanical Subteam Lead', 'Mechanical', 2026, 'Chassis optimization and robotic manipulator design.', '/team/competition/img_team2025/Siam.jpg', true),
    ('Shoukhin Islam', 'Electrical Subteam Lead', 'Electrical', 2026, 'High-voltage power distribution and custom PCB design.', '/team/competition/img_team2025/Shoukhin.jpg', true),
    ('Saif Uddin', 'Science Subteam Lead', 'Science', 2026, 'In-situ bio-signature detection and soil assay protocols.', '/team/competition/img_team2025/Saif.jpg', true),
    ('Md Sheikh Sadi', 'Full-Stack & Embedded Engineer', 'Software', 2026, 'Webmaster and rover ROS2 communications engineer.', '/team/competition/img_team2025/Sadi.jpg', false),
    ('Nazmul Hasan Athin', 'Mechanical & CAD Engineer', 'Mechanical', 2026, 'Rocker-bogie FEA simulation and CNC fabrication.', '/team/competition/img_team2025/Athin.jpg', false),
    ('Adiba Habiba', 'Science & Research Specialist', 'Science', 2026, 'Spectrometry analysis and biochemical test bench.', '/team/competition/img_team2025/Adiba.jpg', false),
    ('Abdullah Al Asif', 'Embedded Firmware Engineer', 'Electrical', 2026, 'Motor controller firmware and CAN bus integration.', '/team/competition/img_team2025/Asif.jpg', false),
    ('Digonta Karmaker', 'Robotics Software Engineer', 'Software', 2026, 'Computer vision and obstacle avoidance algorithms.', '/team/competition/img_team2025/Digonta.jpg', false),
    ('Hamim Mahmud', 'Mechanical Design Engineer', 'Mechanical', 2026, 'Suspension damping and robotic gripper prototyping.', '/team/competition/img_team2025/Hamim.jpg', false),

    -- 2025 Team
    ('Mosfiqur Rahman', 'Team Leader', 'Management', 2025, 'Leading ARC & URC 2025 campaigns.', '/team/competition/img_team2025/Mosfiqur.jpg', true),
    ('Tawsif Turabi', 'Co-Team Leader', 'Software', 2025, 'Software Lead for AXIOS Rover.', '/team/competition/img_team2025/Turabi.jpg', true),
    ('Ifta Faisal', 'Sub-Team Lead (Mechanical)', 'Mechanical', 2025, 'Structural FEA and lightweight alloy integration.', '/team/competition/img_team2025/Ifta_Faisal.jpg', true),
    ('Aowiza Tasnim', 'Sub-Team Lead (Science)', 'Science', 2025, 'Biological assay micro-fluidics.', '/team/competition/img_team2025/Aowiza.jpg', true),
    ('Md Istiak Hossain', 'Software Engineer', 'Software', 2025, 'Localization and SLAM.', '/team/competition/img_team2025/Istiak.jpg', false),
    ('Mahnaj Binta Rahman', 'Electrical Engineer', 'Electrical', 2025, 'Power management and battery telemetry.', '/team/competition/img_team2025/Mahnaj.jpg', false),

    -- 2024 Team
    ('Yeasin Arafat', 'Team Leader', 'Management', 2024, 'Team leader for YGGDRASIL rover campaign.', '/team/competition/img_team2024/yeasin.png', true),
    ('Fahim Ahmed', 'Co-Team Leader', 'Software', 2024, 'ROS2 autonomy lead.', '/team/competition/img_team2024/fahim.png', true),
    ('Bayezid Hossain', 'Mechanical Lead', 'Mechanical', 2024, 'Robotic arm design and structural integrity.', '/team/competition/img_team2024/bayezid.png', true),
    ('Maria Sultana', 'Science Lead', 'Science', 2024, 'Soil chemistry and fluorescence detection.', '/team/competition/img_team2024/maria.png', true),

    -- 2023 Team
    ('Abid Hossain', 'Team Leader', 'Management', 2023, 'Team Leader for TELOS Rover in URC & ERC.', '/team/competition/img_team2023/abid-01.png', true),
    ('Mukit Hossain', 'Co-Team Leader', 'Mechanical', 2023, 'Hardware integration and chassis lead.', '/team/competition/img_team2023/mukit-01.png', true),
    ('Bodiuzzaman', 'Electrical Sub-Lead', 'Electrical', 2023, 'Power electronics and wireless telemetry.', '/team/competition/img_team2023/bodiuzzaman-01.png', true),
    ('Tanim Ahmed', 'Software Sub-Lead', 'Software', 2023, 'Autonomous waypoint pipeline.', '/team/competition/img_team2023/tanim-01.png', true),

    -- 2022 Pioneer Team
    ('Rokib Hasan', 'Team Leader', 'Management', 2022, 'Founding team leader of the historic 1st in Asia MAVEN team.', '/team/competition/img_team2022/rokib.png', true),
    ('Abid Hossain', 'Co-Team Leader', 'Mechanical', 2022, 'MAVEN rover design and fabrication.', '/team/competition/img_team2022/abid.png', true),
    ('Masud Parvez', 'Electrical Lead', 'Electrical', 2022, 'Electronics layout and safety systems.', '/team/competition/img_team2022/masud.png', true),
    ('Zidan Al Mamun', 'Software Lead', 'Software', 2022, 'Rover base station and control GUI.', '/team/competition/img_team2022/zidan.png', true);
  `;

  // 6. Insert Events
  console.log('Seeding Events...');
  await sql`
    INSERT INTO events (title, event_date, location, image_url, description, category, status)
    VALUES
    ('Space Innovation Camp Bangladesh', 'October 2025', 'UIU Main Campus, Dhaka', '/images/campaigns1.png', 'National hands-on workshop on space robotics, satellite engineering, and rover mechanics for aspiring engineers across Bangladesh.', 'Workshop & Outreach', 'COMPLETED'),
    ('ArcaNoca 251 Robotics Workshop', 'August 2025', 'CAIR Laboratory, UIU', '/images/campaigns2.jpg', 'Intensive hands-on training on ROS2, CAD modelling, PCB fabrication, and Martian rover subsystems.', 'Technical Workshop', 'COMPLETED'),
    ('Space Exploration Camp at Holy Cross College', 'July 2025', 'Holy Cross Girls College, Dhaka', '/images/holy_cross1.jpg', 'Interactive workshop bringing Mars rover engineering, telemetry systems, and rocketry science directly to students.', 'STEM Outreach', 'COMPLETED'),
    ('Bangladesh Space Olympiad 2025 - National Finals', 'June 2025', 'United International University', '/images/campaigns3.jpg', 'Hosting 500+ students in astrophysics, rocketry, and planetary science competitions.', 'National Olympiad', 'COMPLETED'),
    ('BEAR Innovation Summit & Keynote', 'May 2025', 'UIU Auditorium', '/images/bearsummit2025.jpg', 'Keynote presentation and demonstration of rover obstacle avoidance and sample return mechanism.', 'Keynote & Showcase', 'COMPLETED');
  `;

  // 7. Insert Media Articles
  console.log('Seeding Media Articles...');
  await sql`
    INSERT INTO media_articles (publisher_name, headline, publisher_logo, clipping_image, publish_date, category)
    VALUES
    ('The Daily Star', 'UIU Mars Rover Team Makes History on Global Stage in Utah', '/images/Logo_of_The_Daily_Star.svg_white.png', '/News Media/Screenshot 2025-09-22 at 12.03.27 PM.png', 'June 2025', 'Newspaper'),
    ('Prothom Alo', 'আন্তর্জাতিক রোভার প্রতিযোগিতায় ইউআইইউ মার্স রোভার দলের অভাবনীয় সাফল্য', '/images/Prothom_Alo_logo.svg.png', '/News Media/Screenshot 2025-09-22 at 12.03.47 PM.png', 'June 2025', 'Newspaper'),
    ('The Business Standard', 'How UIU Mars Rover Team built Asia’s top planetary exploration robot', '/images/The_Business_Standard_logo.svg', '/News Media/Screenshot 2025-09-22 at 12.04.06 PM.png', 'July 2025', 'Online Portal'),
    ('Daily Kalbela', 'বিশ্বমঞ্চে বাংলাদেশের লাল সবুজের গৌরব ইউআইইউ রোভার দল', '/images/Logo_Daily_Kalbela.png', '/News Media/Screenshot 2025-09-22 at 12.05.02 PM.png', 'July 2025', 'Newspaper'),
    ('Jamuna Television', 'আমেরিকায় বিশ্বসেরা বিশ্ববিদ্যালয়গুলোর সাথে লড়ছে বাংলাদেশি রোভার', '/images/Jamuna_TV_logo.svg.png', '/News Media/Screenshot 2025-09-22 at 12.05.18 PM.png', 'June 2025', 'Television'),
    ('NTV Bangladesh', 'বিশ্ব রোভার চ্যালেঞ্জে বাংলাদেশের নতুন রেকর্ড', '/images/NTV_(Bangladesh)_logo.svg.png', '/News Media/Screenshot 2025-09-22 at 12.05.32 PM.png', 'August 2025', 'Television'),
    ('Naya Diganta', 'নাসার বিজ্ঞানীদের সামনে ইউআইইউ রোভারের চমক', '/images/Naya_Diganta.svg.png', '/News Media/Screenshot 2025-09-22 at 12.07.11 PM.png', 'June 2025', 'Newspaper'),
    ('Ajker Patrika', 'তুরস্ক ও আমেরিকায় বাংলাদেশের রোভার বিপ্লব', '/images/AlokDia_logo.jpg', '/images/AjkerPotrika-ARC25.jpg', 'July 2025', 'Newspaper');
  `;

  // 8. Insert Sponsors
  console.log('Seeding Sponsors...');
  await sql`
    INSERT INTO sponsors (name, tier, logo_url, website_url)
    VALUES
    ('Center for Advanced Intelligent Robotics (CAIR)', 'Principal Partner', '/images/CAIR_Logo.svg', 'https://cair.uiu.ac.bd'),
    ('Dassault Systèmes / SolidWorks', 'Platinum Technical Sponsor', '/images/solidworks-logo.png', 'https://www.solidworks.com'),
    ('Protospace Manufacturing', 'Gold Fabrication Sponsor', '/images/protospace-logo.png', 'https://protospace.com'),
    ('DFRobot', 'Gold Electronics Sponsor', '/images/DFRobot-logo.png', 'https://www.dfrobot.com'),
    ('Dassault Systèmes 3DEXPERIENCE', 'Technical Software Partner', '/images/Dassauly-systemes-logo.png', 'https://www.3ds.com');
  `;

  console.log('🎉 Database seeding completed successfully into Neon Tech PostgreSQL!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  });
