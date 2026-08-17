import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Globe, Code, ArrowLeft, ExternalLink, ShieldCheck, Terminal, Cpu, Sparkles, Rocket } from 'lucide-react';

export const metadata = {
  title: 'Webmaster — Mahin Hasan Upol | UIU Mars Rover Team',
  description: 'Official web developer and robotics software engineer for UIU Mars Rover Team.',
};

export default function WebmasterPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-gradient-to-tr from-mars-600/20 via-cyan-500/10 to-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl w-full glass-panel rounded-3xl p-8 sm:p-12 border-2 border-white/20 shadow-2xl space-y-8 bg-space-950/80 backdrop-blur-2xl">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Mission Control
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mars-500/20 text-mars-400 border border-mars-500/40 text-xs font-mono font-bold uppercase">
            <Code className="w-3.5 h-3.5" /> Official Webmaster
          </div>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          
          {/* Photo */}
          <div className="relative w-40 h-48 sm:w-48 sm:h-56 rounded-2xl overflow-hidden border-2 border-mars-500/50 shadow-2xl bg-space-900 shrink-0 group">
            <Image
              src="/images/webmaster.png"
              alt="Mahin Hasan Upol - Webmaster UMRT"
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-space-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center">
              <span className="px-2 py-0.5 rounded bg-mars-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow">
                Lead Web Architect
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4 text-center sm:text-left flex-1">
            <div className="space-y-1">
              <span className="text-xs font-mono text-mars-400 font-bold uppercase tracking-widest block">
                UIU Mars Rover Team • Core Technical Crew
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                Mahin Hasan Upol
              </h1>
              <p className="text-sm sm:text-base font-mono text-gray-300">
                Webmaster & Autonomous Team Engineer
              </p>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Designed and engineered the next-generation UIU Mars Rover Team web application and mission portal utilizing Next.js, React, Tailwind CSS, and Neon Serverless PostgreSQL.
            </p>

            {/* Social & Portfolio Links */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <a
                href="https://mahinhupol.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-mars-600 to-amber-500 hover:from-mars-500 hover:to-amber-400 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-105"
              >
                <Globe className="w-4 h-4" /> Portfolio <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://github.com/mahinupol"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-semibold transition-all hover:scale-105"
              >
                <Github className="w-4 h-4" /> GitHub <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://bd.linkedin.com/in/mahin-hasan-upol-167750355"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2]/20 hover:bg-[#0A66C2]/40 border border-[#0A66C2]/40 text-[#70b5f9] text-xs font-mono font-semibold transition-all hover:scale-105"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Tech Stack Matrix */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-gray-400 block text-[10px]">Framework</span>
            <strong className="text-white">Next.js 14 / React</strong>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-gray-400 block text-[10px]">Database</span>
            <strong className="text-white">Neon PostgreSQL</strong>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-gray-400 block text-[10px]">Styling</span>
            <strong className="text-white">Tailwind / Glassmorphism</strong>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-gray-400 block text-[10px]">Subteam</span>
            <strong className="text-amber-400">Autonomous / Dev</strong>
          </div>
        </div>

      </div>
    </div>
  );
}
