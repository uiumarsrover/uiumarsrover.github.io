'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { clientSql, getLocalCache, setLocalCache } from '@/lib/clientDb';
import StatsCounter from '@/components/StatsCounter';
import { 
  ArrowRight, Trophy, Sparkles, ChevronRight, Award, Compass, Cpu, 
  ExternalLink, Calendar, Newspaper, Rocket, Tv, Radio, Flame, Eye, Maximize2, ShieldCheck, Zap, Activity, Navigation, Crosshair, Building2
} from 'lucide-react';

const DEFAULT_ROVERS = [
  { id: 5, slug: 'aurion', name: 'AURION Rover (5th Gen)', year: 2026, competition: 'URC 2026 & ARC 2026', rank_achieved: '3rd Place in the World', cover_image: '/images/aurion.png', tagline: '5th Generation Martian Explorer', specs: { weight: '47.5 kg', speed: '2.0 m/s', dof: '6-DOF' } },
  { id: 4, slug: 'maven', name: 'MAVEN & MAVEN 2.0', year: 2025, competition: 'ARC 2025 & URC 2025', rank_achieved: 'Champion in Asia', cover_image: '/images/maven.jpg', tagline: 'Astrobiology & Autonomous Navigation', specs: { weight: '48.2 kg', speed: '1.8 m/s', dof: '6-DOF' } },
  { id: 3, slug: 'telos', name: 'TELOS Rover', year: 2024, competition: 'URC 2024', rank_achieved: 'World Finalist', cover_image: '/images/telos.jpg', tagline: 'Carbon-Fiber Manipulator & Raman Spectrometry', specs: { weight: '49.0 kg', speed: '1.5 m/s', dof: '6-DOF' } },
  { id: 2, slug: 'yggdrasil', name: 'YGGDRASIL Rover', year: 2023, competition: 'URC 2023', rank_achieved: 'Global Finalist', cover_image: '/images/yggdrasil.jpg', tagline: 'Extreme Retrieval & Autonomous Traversals', specs: { weight: '49.5 kg', speed: '1.6 m/s', dof: '5-DOF' } },
];

const DEFAULT_SITE_CONTENT: Record<string, string> = {
  hero_bg_image: '/Hero.PNG',
  hero_badge: '5TH GEN FLAGSHIP • AURION ROVER',
  hero_headline_1: 'AURION',
  hero_headline_2: 'UIU 5th Generation Autonomous Mars Rover',
  hero_subtitle: 'Engineered with 3D-printed flexible tires, high-torque carbon-fiber manipulator, dual RealSense stereo vision, and in-situ bio-detection assays.',
  stat_1_val: '3rd Place',
  stat_1_label: 'World URC 2026 Record',
  stat_2_val: '1st in Asia',
  stat_2_label: 'URC 2022 Milestone',
  stat_3_val: '5 Generations',
  stat_3_label: 'Planetary Rovers Built',
  stat_4_val: '80+ Engineers',
  stat_4_label: 'Team Members & Alumni',
};

export default function HomePage() {
  const [rovers, setRovers] = useState<any[]>(() => getLocalCache('home_rovers', DEFAULT_ROVERS));
  const [achievements, setAchievements] = useState<any[]>(() => getLocalCache('home_achievements', []));
  const [events, setEvents] = useState<any[]>(() => getLocalCache('home_events', []));
  const [media, setMedia] = useState<any[]>(() => getLocalCache('home_media', []));
  const [sponsors, setSponsors] = useState<any[]>(() => getLocalCache('home_sponsors', []));
  const [siteContent, setSiteContent] = useState<Record<string, string>>(() => getLocalCache('home_content', DEFAULT_SITE_CONTENT));

  useEffect(() => {
    // Fast background query to sync latest database state without delaying page paint
    Promise.all([
      clientSql`SELECT * FROM rovers ORDER BY year DESC LIMIT 5;`,
      clientSql`SELECT * FROM achievements WHERE is_featured = true ORDER BY year DESC LIMIT 4;`,
      clientSql`SELECT * FROM events ORDER BY id ASC LIMIT 3;`,
      clientSql`SELECT * FROM media_articles ORDER BY id ASC LIMIT 8;`,
      clientSql`SELECT * FROM sponsors ORDER BY id ASC;`,
      clientSql`SELECT * FROM site_content;`,
    ])
      .then(([rRes, aRes, eRes, mRes, sRes, cRes]) => {
        if (rRes && rRes.length) {
          setRovers(rRes);
          setLocalCache('home_rovers', rRes);
        }
        if (aRes && aRes.length) {
          setAchievements(aRes);
          setLocalCache('home_achievements', aRes);
        }
        if (eRes && eRes.length) {
          setEvents(eRes);
          setLocalCache('home_events', eRes);
        }
        if (mRes && mRes.length) {
          setMedia(mRes);
          setLocalCache('home_media', mRes);
        }
        if (sRes && sRes.length) {
          setSponsors(sRes);
          setLocalCache('home_sponsors', sRes);
        }
        if (cRes && cRes.length) {
          const map: Record<string, string> = { ...DEFAULT_SITE_CONTENT };
          cRes.forEach((item: any) => { map[item.key] = item.value; });
          setSiteContent(map);
          setLocalCache('home_content', map);
        }
      })
      .catch((err) => console.error('Background home sync error:', err));
  }, []);

  const heroSponsors = [
    { name: 'United International University', logo: '/images/UIU-logo.png' },
    { name: 'CAIR - Center for Advanced Information Robotics', logo: '/images/CAIR_Logo.svg' },
    { name: 'SolidWorks 3D CAD', logo: '/images/solidworks-logo.png' },
    { name: 'Dassault Systèmes', logo: '/images/Dassauly-systemes-logo.png' },
    { name: 'DFRobot', logo: '/images/DFRobot-logo.png' },
    { name: 'Protospace', logo: '/images/protospace-logo.png' },
  ];

  const heroMedia = [
    { name: 'The Daily Star', logo: '/images/Logo_of_The_Daily_Star.svg_white.png' },
    { name: 'Prothom Alo', logo: '/images/Prothom_Alo_logo.svg.png' },
    { name: 'The Business Standard', logo: '/images/The_Business_Standard_logo.svg' },
    { name: 'Jamuna TV', logo: '/images/Jamuna_TV_logo.svg.png' },
    { name: 'NTV', logo: '/images/NTV_(Bangladesh)_logo.svg.png' },
    { name: 'Daily Kalbela', logo: '/images/Logo_Daily_Kalbela.png' },
  ];

  return (
    <div className="relative overflow-hidden space-y-24 pb-28">
      
      {/* 🚀 1. AWARD-WINNING CINEMATIC HERO SECTION */}
      <section className="relative min-h-[92vh] flex flex-col justify-between pt-4 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Background Image: Dynamic or Default AURION Rover Photo */}
        <div className="absolute inset-0 z-0">
          <Image
            src={siteContent['hero_bg_image'] || '/images/aurion.jpg'}
            alt="AURION 5th Generation Mars Rover"
            fill
            priority
            className="object-cover object-center scale-100 sm:scale-105 transition-transform duration-1000"
          />
          
          {/* Subtle Top & Bottom Gradient Blends */}
          <div className="absolute inset-0 bg-gradient-to-b from-space-950/80 via-transparent to-space-950" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-space-950/20 to-space-950/60" />
          
          {/* Cyber Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none opacity-40" />
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-mars-500/15 rounded-full blur-[130px] pointer-events-none" />

        {/* TOP HUD BAR */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 pt-4">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-mars-500/40 bg-space-950/80 text-white text-xs font-mono backdrop-blur-xl shadow-lg shadow-mars-500/10">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mars-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mars-500"></span>
            </span>
            <span className="text-mars-400 font-bold">{siteContent['hero_badge'] || '5TH GEN FLAGSHIP • AURION ROVER'}</span>
          </div>

          {/* World Record Indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-amber-400/50 bg-black/70 text-amber-300 text-xs font-mono font-bold backdrop-blur-xl shadow-lg shadow-amber-500/15">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{siteContent['stat_1_val'] ? `${siteContent['stat_1_val'].toUpperCase()} • ${siteContent['stat_1_label']?.toUpperCase()}` : '3RD PLACE WORLDWIDE • URC 2026'}</span>
          </div>
        </div>

        {/* CENTER HERO CONTENT & TELEMETRY HUD */}
        <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Left Main Title & CTAs */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 border border-white/15 text-xs font-mono text-gray-300 backdrop-blur-md">
                  <Crosshair className="w-3.5 h-3.5 text-mars-400 animate-spin" />
                  <span>MARTIAN EXPLORATION EXPEDITION • UIU / CAIR</span>
                </div>

                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold text-white tracking-tight leading-[1.02] drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
                  {siteContent['hero_headline_1'] ? (
                    siteContent['hero_headline_1']
                  ) : (
                    <>AU<span className="text-gradient-mars">RI</span>ON</>
                  )}
                </h1>

                <p className="text-lg sm:text-2xl font-display font-bold text-gray-100 drop-shadow-lg">
                  {siteContent['hero_headline_2'] || 'UIU 5th Generation Autonomous Mars Rover'}
                </p>
                
                <p className="text-sm sm:text-base text-gray-200 max-w-2xl leading-relaxed drop-shadow-md bg-black/40 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                  {siteContent['hero_subtitle'] || 'Engineered with 3D-printed flexible tires, high-torque carbon-fiber manipulator, dual RealSense stereo vision, and in-situ bio-detection assays.'}
                </p>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/rovers/aurion"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-display font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-mars-600 via-mars-500 to-amber-500 hover:from-mars-500 hover:to-amber-400 transition-all shadow-2xl shadow-mars-500/50 border border-mars-400/50 hover:scale-105 group"
                >
                  <Cpu className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  Explore 5th Gen Specs
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/achievements"
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full font-display font-semibold text-sm uppercase tracking-wider text-white bg-black/70 hover:bg-black/90 transition-all border border-white/30 hover:scale-105 backdrop-blur-md shadow-xl"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  Global Trophies
                </Link>
              </div>
            </div>

            {/* Right Telemetry HUD Card Overlay */}
            <div className="lg:col-span-4">
              <div className="glass-panel p-6 rounded-3xl border border-white/20 bg-space-950/80 backdrop-blur-xl shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-mars-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-white uppercase">ROVER TELEMETRY</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">ONLINE</span>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-gray-400">Total Mass:</span>
                    <strong className="text-white">47.5 kg (Under 50kg Limit)</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-gray-400">Max Velocity:</span>
                    <strong className="text-white">2.0 m/s High-Torque</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-gray-400">Manipulator:</span>
                    <strong className="text-white">6-DOF Carbon Fiber</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-gray-400">Autonomy:</span>
                    <strong className="text-amber-400">ROS2 Nav2 + LiDAR</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>Base Station: UIU-CAIR</span>
                  <span className="text-mars-400 font-bold">Signal: 100%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* 2. STATS COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatsCounter />
      </section>

      {/* 🌟 3. SPONSOR & NEWS MEDIA LOGOS (PLACED DIRECTLY AFTER THE STATS COUNTER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-white/15 shadow-2xl bg-gradient-to-b from-white/[0.04] to-transparent space-y-8">
          
          {/* Top Row: Institutional Patrons & Tech Sponsors */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <span className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-mars-400">
                <Building2 className="w-4 h-4" /> Institutional Patrons & Technology Sponsors
              </span>
              <span className="text-xs font-mono text-gray-400">
                Supporting Advanced Space Robotics Research
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center pt-2">
              {heroSponsors.map((sp, idx) => (
                <div
                  key={idx}
                  title={sp.name}
                  className="relative h-12 w-32 sm:w-36 bg-transparent flex items-center justify-center"
                >
                  <Image
                    src={sp.logo}
                    alt={sp.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row: National News Media & Prime-Time Outlets */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <span className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                <Tv className="w-4 h-4" /> Featured In National Press & Broadcasts
              </span>
              <Link
                href="/media"
                className="text-xs font-mono text-mars-400 hover:text-mars-300 font-bold flex items-center gap-1 group"
              >
                View Complete 22+ Press Articles <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center pt-2">
              {heroMedia.map((m, idx) => (
                <Link
                  key={idx}
                  href="/media"
                  title={m.name}
                  className="relative h-11 w-28 sm:w-32 bg-transparent flex items-center justify-center"
                >
                  <Image
                    src={m.logo}
                    alt={m.name}
                    fill
                    className="object-contain"
                  />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. GRAND URC 2026 SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-white/15 glass-panel p-6 sm:p-10 lg:p-14 shadow-2xl bg-gradient-to-br from-white/[0.07] to-transparent">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" /> Utah Desert Expedition 2026
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white leading-tight">
                University Rover Challenge <br />
                <span className="text-gradient-gold">3rd Place in the World</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Competing at the Mars Desert Research Station in Hanksville, Utah, against 100+ global powerhouse universities including BYU, Stanford, and McGill, UMRT secured a podium finish with historic scores in Autonomous Navigation and Extreme Retrieval.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono">
                  <span className="text-gray-400 block mb-1">Global Standing</span>
                  <strong className="text-base text-amber-400">3rd Worldwide 🥉</strong>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono">
                  <span className="text-gray-400 block mb-1">Competition Venue</span>
                  <strong className="text-base text-white">Hanksville, Utah, USA</strong>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/achievements"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-mars-400 hover:text-mars-300 transition group"
                >
                  Read the full Utah expedition story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Giant High-Res Photo Container */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] sm:aspect-[16/10] rounded-2xl overflow-hidden border-2 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
                <Image
                  src="/images/team_urc2026.jpg"
                  alt="UIU Mars Rover Team at URC 2026 in Hanksville Utah"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-950/90 via-transparent to-transparent" />
                
                <div className="absolute top-4 right-4">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500 text-black shadow-lg uppercase">
                    3rd Place Globally
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs font-mono text-white/90">
                  <span className="font-semibold text-sm">Official URC 2026 Delegation</span>
                  <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-[11px]">
                    Mars Desert Research Station, USA
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. ROVERS FLEET SHOWCASE WITH AURION (5TH GEN) FEATURED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-mars-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Robotics Engineering Fleet
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mt-1">
              Five Generations of Planetary Rovers
            </h2>
          </div>
          <Link
            href="/rovers"
            className="inline-flex items-center gap-2 text-sm font-bold text-mars-400 hover:text-mars-300 transition group"
          >
            Explore All Specs & Telemetry <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rovers.map((rover: any) => {
            const specs = typeof rover.specs === 'string' ? JSON.parse(rover.specs) : rover.specs || {};
            const is5thGen = rover.slug === 'aurion';
            return (
              <Link
                key={rover.id}
                href={`/rovers/${rover.slug}`}
                className={`glass-card rounded-3xl overflow-hidden border group flex flex-col justify-between hover:border-mars-500/60 transition-all duration-300 shadow-2xl ${
                  is5thGen ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-space-card to-space-card md:col-span-2' : 'border-white/15'
                }`}
              >
                {/* Large Photo Container */}
                <div className={`relative ${is5thGen ? 'aspect-[21/9] sm:aspect-[21/9]' : 'aspect-[16/10]'} bg-space-950 overflow-hidden`}>
                  <Image
                    src={rover.cover_image}
                    alt={rover.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-mars-500 text-white uppercase shadow-xl">
                      {is5thGen ? '🌟 5th Generation Flagship' : `${rover.year} Generation`}
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-space-900/80 text-gray-200 backdrop-blur-md border border-white/20">
                      {rover.competition}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <span className="text-xs font-mono font-bold text-amber-300 bg-black/75 px-3.5 py-1.5 rounded-xl backdrop-blur-md border border-amber-400/40">
                      🏆 {rover.rank_achieved}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white group-hover:text-mars-400 transition-colors">
                      {rover.name}
                    </h3>
                    <p className="text-xs text-gray-300 font-mono leading-relaxed">
                      {rover.tagline || rover.description}
                    </p>
                  </div>

                  {/* Spec Mini Gauges */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                      <span className="text-[10px] font-mono text-gray-400 block uppercase">Weight</span>
                      <strong className="text-xs sm:text-sm text-white">{specs.weight || '47.5 kg'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                      <span className="text-[10px] font-mono text-gray-400 block uppercase">Max Speed</span>
                      <strong className="text-xs sm:text-sm text-white">{specs.speed || '2.0 m/s'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                      <span className="text-[10px] font-mono text-gray-400 block uppercase">Arm DOF</span>
                      <strong className="text-xs sm:text-sm text-white">{specs.dof || '6-DOF'}</strong>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                    <span className="text-gray-300">Click to view 3D telemetry & subsystem breakdown</span>
                    <span className="text-mars-400 font-bold group-hover:translate-x-1 transition-transform">Full Specs →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. ULTRA-SHOWY "PRESS & MEDIA SPOTLIGHT" SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gradient-to-r from-red-600/10 via-amber-500/10 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 glass-panel p-8 sm:p-12 rounded-3xl border border-white/15 text-center space-y-4 bg-gradient-to-b from-white/[0.08] to-transparent">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-mono font-bold uppercase tracking-widest animate-pulse">
            <Flame className="w-4 h-4 text-red-400" /> AS SEEN ON NATIONAL TELEVISION & FRONTPAGES
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white">
            Press & <span className="text-gradient-mars">Media Spotlight</span>
          </h2>
          
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Celebrating Bangladesh’s triumphs in space exploration across the country’s leading daily newspapers, television prime-time broadcasts, and international tech portals.
          </p>
        </div>

        {/* Big Clipping Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {media.slice(0, 6).map((item: any) => (
            <Link
              key={item.id}
              href="/media"
              className="glass-card rounded-3xl overflow-hidden border border-white/15 group flex flex-col justify-between hover:border-mars-500/60 transition-all duration-300 shadow-2xl hover:-translate-y-2"
            >
              {/* Extra Large Clipping Container */}
              <div className="relative aspect-[16/11] bg-space-950 overflow-hidden">
                <Image
                  src={item.clipping_image}
                  alt={item.headline}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/30 to-transparent" />
                
                {/* Floating outlet tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-mars-500 text-white uppercase shadow-lg backdrop-blur-md">
                    {item.publisher_name}
                  </span>
                </div>

                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4 text-mars-400" />
                </div>

                <div className="absolute bottom-3 left-4">
                  <span className="text-[11px] font-mono text-gray-300 bg-black/70 px-2.5 py-1 rounded-md border border-white/10">
                    {item.publish_date}
                  </span>
                </div>
              </div>

              {/* Text Body */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-mars-400 font-semibold uppercase block mb-1">
                    National Coverage • {item.category || 'Print & Broadcast'}
                  </span>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-mars-300 transition-colors leading-snug">
                    {item.headline}
                  </h3>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <Eye className="w-3.5 h-3.5 text-mars-400" /> Click to view full clipping
                  </span>
                  <span className="text-mars-400 font-bold group-hover:translate-x-1 transition-transform">Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Media CTA Banner */}
        <div className="text-center pt-4">
          <Link
            href="/media"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-display font-bold text-sm sm:text-base uppercase tracking-wider text-white bg-gradient-to-r from-red-600 via-mars-500 to-amber-500 hover:from-red-500 hover:to-amber-400 transition-all shadow-2xl shadow-mars-500/30 border border-mars-400/50 hover:scale-105"
          >
            <Newspaper className="w-5 h-5" /> View Complete 22+ Press Articles & TV Archive
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 7. EVENTS & CAMPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-mars-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Community & STEM Outreach
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mt-1">
              Events, Camps & Space Olympiads
            </h2>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-mars-400 hover:text-mars-300 transition group"
          >
            All Workshops & Bootcamps <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((evt: any) => (
            <div key={evt.id} className="glass-card rounded-3xl overflow-hidden border border-white/15 flex flex-col justify-between group shadow-xl">
              <div className="relative aspect-[16/10] bg-space-950 overflow-hidden">
                <Image
                  src={evt.image_url}
                  alt={evt.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-mars-500 text-white uppercase shadow-md">
                    {evt.category}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <Calendar className="w-3.5 h-3.5 text-mars-400" /> {evt.event_date}
                  </div>
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-mars-300 transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span>{evt.location}</span>
                  <span className="text-mars-400 font-bold">Details →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. PARTNERS & SPONSORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-14 rounded-3xl border border-white/15 text-center space-y-8 bg-gradient-to-b from-white/[0.06] to-transparent">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-mars-400">
              Supported by Global Aerospace & CAD Leaders
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-1">
              Our Esteemed Partners & Sponsors
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto mt-2">
              Empowering student robotics research through SolidWorks CAD, electronic prototyping, and university laboratory infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 items-center justify-center">
            {sponsors.map((sp: any) => (
              <div
                key={sp.id}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center h-32 hover:border-mars-500/50 transition group"
              >
                <div className="relative w-full h-14">
                  <Image
                    src={sp.logo_url}
                    alt={sp.name}
                    fill
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100"
                  />
                </div>
                <span className="text-[10px] font-mono text-gray-400 mt-2 line-clamp-1">{sp.name}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              href="/sponsor"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-white bg-mars-500 hover:bg-mars-600 transition shadow-xl shadow-mars-500/30"
            >
              Become a Corporate Sponsor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
