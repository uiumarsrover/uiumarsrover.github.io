import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Globe, ExternalLink, Github, Linkedin, Youtube, Facebook, ShieldCheck, Code, Sparkles, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-space-950 border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-mars-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-white/10">
          
          {/* Col 1: Brand & Affiliation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full border border-mars-500/50 p-1 bg-space-900">
                <Image 
                  src="/images/umrt_logo.png" 
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
              <li><Link href="/webmaster" className="hover:text-mars-400 transition font-semibold text-mars-400">Meet Webmaster</Link></li>
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
                <span>uiumarsrover.github.io</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🌟 SPECIAL WEBMASTER HYPERLINK CARD */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/15 bg-gradient-to-r from-space-900/90 via-space-950 to-space-900/90 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Left: Webmaster Portrait & Identity */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <Link href="/webmaster" className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-mars-500/60 shadow-xl bg-space-900 shrink-0 group">
                <Image
                  src="/images/webmaster.png"
                  alt="Mahin Hasan Upol"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-950/70 via-transparent to-transparent" />
              </Link>
              
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-mars-500/20 text-mars-400 border border-mars-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Code className="w-3 h-3" /> Engineered By Webmaster
                </div>
                <h4 className="font-display font-bold text-lg sm:text-xl text-white">
                  <Link href="/webmaster" className="hover:text-mars-400 transition">
                    Mahin Hasan Upol
                  </Link>
                </h4>
                <p className="text-xs text-gray-300 font-mono">
                  Autonomous Team Engineer & Lead Web Developer
                </p>
              </div>
            </div>

            {/* Right: Direct Hyperlinks (GitHub, LinkedIn, Portfolio) */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://mahinhupol.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-mars-600 to-amber-500 hover:from-mars-500 hover:to-amber-400 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md hover:scale-105"
              >
                <Globe className="w-3.5 h-3.5" /> Portfolio <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://github.com/mahinupol"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-semibold transition-all hover:scale-105"
              >
                <Github className="w-3.5 h-3.5" /> GitHub <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://bd.linkedin.com/in/mahin-hasan-upol-167750355"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0A66C2]/20 hover:bg-[#0A66C2]/40 border border-[#0A66C2]/40 text-[#70b5f9] text-xs font-mono font-semibold transition-all hover:scale-105"
              >
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 pt-2">
          <p>© {new Date().getFullYear()} UIU Mars Rover Team (UMRT). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-gray-400 transition">Admin Telemetry</Link>
            <span>•</span>
            <span className="font-mono text-mars-400">Powered by Next.js & Neon PostgreSQL</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
