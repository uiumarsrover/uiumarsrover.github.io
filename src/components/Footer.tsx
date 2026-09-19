'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail, MapPin, Globe, ShieldCheck, Code } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/' || pathname === '';

  return (
    <footer className="relative bg-space-950 border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-mars-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-white/10">
          
          {/* Col 1: Brand & Affiliation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full border border-mars-500/50 p-1 bg-space-900">
                <Image 
                  src="/images/umrt_logo.webp" 
                  alt="UMRT Logo" 
                  fill 
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white">UIU Mars Rover Team</h3>
                <p className="text-xs text-mars-400 font-mono">Pioneering Space Robotics in Bangladesh</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Official collegiate Mars rover robotics team of United International University (UIU), operating under the Center for Advanced Intelligent Robotics (CAIR).
            </p>

            {/* University & Lab Badges */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                <ShieldCheck className="w-4 h-4 text-mars-400" />
                <span>Affiliated with <strong>CAIR-UIU</strong></span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-gray-400 font-semibold">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-mars-400 transition">Home</Link></li>
              <li><Link href="/rovers" className="hover:text-mars-400 transition">Rovers & UAVs</Link></li>
              <li><Link href="/achievements" className="hover:text-mars-400 transition">Achievements</Link></li>
              <li><Link href="/team" className="hover:text-mars-400 transition">Team Roster</Link></li>
              <li><Link href="/advisors" className="hover:text-mars-400 transition">Advisors & Directors</Link></li>
              <li><Link href="/events" className="hover:text-mars-400 transition">Workshops & Events</Link></li>
            </ul>
          </div>

          {/* Col 3: Competitions & Media */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-gray-400 font-semibold">Programs</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/achievements" className="hover:text-mars-400 transition">University Rover Challenge (USA)</Link></li>
              <li><Link href="/achievements" className="hover:text-mars-400 transition">Anatolian Rover Challenge (Turkey)</Link></li>
              <li><Link href="/media" className="hover:text-mars-400 transition">Press & National Media</Link></li>
              <li><Link href="/sponsor" className="hover:text-mars-400 transition">Sponsorship Prospectus</Link></li>
              <li><Link href="/team/join" className="hover:text-mars-400 transition">Recruitment Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-gray-400 font-semibold">Base Station</h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-mars-400 shrink-0 mt-0.5" />
                <span>Center for Advanced Intelligent Robotics (CAIR), United International University, Dhaka-1212</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-mars-400 shrink-0" />
                <span>marsrover@uiu.ac.bd</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-mars-400 shrink-0" />
                <a href="https://uiumarsrover.org" target="_blank" rel="noopener noreferrer" className="hover:text-mars-400 transition">uiumarsrover.org</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 pt-2">
          <p>© {new Date().getFullYear()} UIU Mars Rover Team (UMRT). All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href="/admin" className="hover:text-gray-400 transition">Admin Telemetry</Link>
            <span>•</span>
            <span className="font-mono text-mars-400">Powered by Next.js & Neon PostgreSQL</span>
            {isHome && (
              <>
                <span>•</span>
                <Link 
                  href="/webmaster" 
                  title="Meet Webmaster — Mahin Hasan Upol"
                  className="font-mono text-mars-400 hover:text-mars-300 transition flex items-center gap-1.5 underline underline-offset-4 font-medium"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Meet Webmaster</span>
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}

