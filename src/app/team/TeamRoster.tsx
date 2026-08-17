'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Mail, Linkedin, Github, Shield, Sparkles, Filter, ChevronRight, Rocket, Search, Crown, Award, Cpu } from 'lucide-react';

interface Member {
  id: number;
  name: string;
  role: string;
  subteam: string;
  year: number;
  bio?: string;
  image_url?: string;
  linkedin_url?: string;
  github_url?: string;
  email?: string;
  is_lead?: boolean;
}

export default function TeamRoster({ initialMembers }: { initialMembers: Member[] }) {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedSubteam, setSelectedSubteam] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const years = [2026, 2025, 2024, 2023, 2022];
  const subteams = ['All', 'Management', 'Software', 'Mechanical', 'Electrical', 'Science', 'Media & Outreach'];

  // Filter members by Year, Subteam, and Search
  const currentYearMembers = initialMembers.filter((m) => m.year === selectedYear);

  const filteredMembers = currentYearMembers.filter((m) => {
    const matchesSubteam = selectedSubteam === 'All' || m.subteam.toLowerCase() === selectedSubteam.toLowerCase();
    const matchesSearch = searchQuery.trim() === '' || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubteam && matchesSearch;
  });

  // Categorize into 3 distinct hierarchical groups
  const executiveLeads = filteredMembers.filter((m) => {
    const r = (m.role || '').toLowerCase();
    return (
      r === 'team leader' || 
      r.includes('co-team leader') || 
      r.includes('co team leader') || 
      r.includes('senior lead') || 
      r.startsWith('team leader') ||
      m.name.toLowerCase().includes('saif al saad') ||
      m.name.toLowerCase().includes('sheikh shakib hossain') ||
      m.name.toLowerCase().includes('mosfiqur rahman') && selectedYear === 2026
    );
  });

  const subteamLeads = filteredMembers.filter((m) => {
    const r = (m.role || '').toLowerCase();
    const isExec = executiveLeads.some(el => el.id === m.id);
    return !isExec && (
      r.includes('sub-team lead') || 
      r.includes('sub team lead') || 
      r.includes('lead') ||
      m.is_lead
    );
  });

  const generalMembers = filteredMembers.filter((m) => {
    const isExec = executiveLeads.some(el => el.id === m.id);
    const isSub = subteamLeads.some(sl => sl.id === m.id);
    return !isExec && !isSub;
  });

  const yearHighlights: Record<number, { title: string; desc: string; banner: string; stat: string }> = {
    2026: {
      title: '2026 Delegation: Historic 3rd Worldwide Podium Finish',
      desc: 'The delegation that achieved an all-time record score with AURION at the University Rover Challenge in Hanksville, Utah, USA.',
      banner: '/images/team_urc2026.jpg',
      stat: '🏆 3rd in the World (Historic Record)',
    },
    2025: {
      title: '2025 Campaign: AXIOS Dual Championship in Turkey & USA',
      desc: 'Pioneered next-generation autonomous navigation and biochemical soil assays with the AXIOS rover.',
      banner: '/images/team_ARC25.jpg',
      stat: '🏆 ARC Championship & URC Finalist',
    },
    2024: {
      title: '2024 Campaign: YGGDRASIL Extreme Manipulation',
      desc: 'Engineered high-torque carbon harmonic drive arms and autonomous terrain mapping.',
      banner: '/images/team_2024_1.jpg',
      stat: '🏆 Global Top Tier Finalist',
    },
    2023: {
      title: '2023 Campaign: TELOS Trans-Continental Expeditions',
      desc: 'Competed at both URC in the Utah Desert and ERC in Poland.',
      banner: '/images/team_2023_1.jpg',
      stat: '🏆 Top Asian Team & Finalist',
    },
    2022: {
      title: '2022 Pioneers: 1st in Asia Debut at URC Utah',
      desc: 'The founding team that put Bangladesh on the global planetary exploration map with MAVEN.',
      banner: '/images/team_2022_1.jpg',
      stat: '🏆 1st in Asia & Top 10 World',
    },
  };

  const currentHighlight = yearHighlights[selectedYear] || yearHighlights[2026];

  const getSubteamBadgeColor = (subteam: string) => {
    switch (subteam.toLowerCase()) {
      case 'software':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'mechanical':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'electrical':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'science':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'media & outreach':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/40';
      default:
        return 'bg-mars-500/20 text-mars-400 border-mars-500/40';
    }
  };

  // Reusable Member Card Component
  const renderMemberCard = (member: Member, cardSize: 'large' | 'medium' = 'medium') => (
    <div
      key={member.id}
      onClick={() => setSelectedMember(member)}
      className={`glass-card rounded-3xl overflow-hidden border p-4 flex flex-col justify-between cursor-pointer group hover:border-mars-500/70 shadow-2xl hover:-translate-y-2 transition-all duration-300 ${
        member.is_lead ? 'border-amber-400/40 bg-gradient-to-b from-amber-500/10 via-space-card to-space-card' : 'border-white/15'
      }`}
    >
      {/* Photo Container */}
      <div className={`relative ${cardSize === 'large' ? 'aspect-[4/5] sm:aspect-[4/5]' : 'aspect-[4/5]'} rounded-2xl overflow-hidden mb-4 bg-space-950 border border-white/10`}>
        {member.image_url ? (
          <Image
            src={member.image_url}
            alt={member.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <Users className="w-12 h-12" />
          </div>
        )}
        
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-space-950/90 via-transparent to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

        {/* Lead Badge */}
        {member.is_lead && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-black text-[11px] font-mono font-extrabold shadow-xl z-20 flex items-center gap-1">
            <Crown className="w-3 h-3" /> LEAD
          </div>
        )}

        {/* Subteam Badge */}
        <div className="absolute bottom-3 left-3 z-20">
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border backdrop-blur-md ${getSubteamBadgeColor(member.subteam)}`}>
            {member.subteam}
          </span>
        </div>
      </div>

      {/* Text Info */}
      <div className="space-y-2 flex-1 flex flex-col justify-between px-1">
        <div>
          <h3 className={`font-display font-bold text-white group-hover:text-mars-300 transition-colors leading-tight ${
            cardSize === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
          }`}>
            {member.name}
          </h3>
          <p className="text-xs text-mars-400 font-mono mt-1 line-clamp-2 leading-relaxed font-semibold">
            {member.role}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
          <span className="text-[11px] text-gray-400">{member.year} Campaign</span>
          <span className="text-mars-400 font-bold group-hover:translate-x-1 transition-transform">Bio →</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-16">
      
      {/* Year Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto p-1.5 rounded-2xl bg-space-900 border border-white/10">
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => {
                setSelectedYear(yr);
                setSelectedSubteam('All');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all ${
                selectedYear === yr
                  ? 'bg-gradient-to-r from-mars-600 to-mars-500 text-white shadow-lg shadow-mars-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {yr} Team {yr === 2026 && '🌟'}
            </button>
          ))}
        </div>

        <Link
          href="/team/join"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-mars-500/20 hover:bg-mars-500/30 border border-mars-500/40 transition"
        >
          <Rocket className="w-4 h-4 text-mars-400" /> Join Our Mission
        </Link>
      </div>

      {/* Campaign Banner Highlight */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/15 p-6 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-mars-500/20 text-mars-400 border border-mars-500/30">
                {selectedYear} Official Delegation
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {currentHighlight.stat}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white leading-tight">
              {currentHighlight.title}
            </h2>
            
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {currentHighlight.desc}
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
              <Image
                src={currentHighlight.banner}
                alt={currentHighlight.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/90">
                <span>UIU Mars Rover Delegation ({selectedYear})</span>
                <span className="px-2 py-0.5 rounded bg-mars-500 text-[10px] font-bold">OFFICIAL SQUAD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subteam Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Subteam Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <span className="text-xs font-mono text-gray-400 uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Subteam:
          </span>
          {subteams.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubteam(sub)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold whitespace-nowrap transition ${
                selectedSubteam === sub
                  ? 'bg-white text-space-950 shadow-md'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-space-900/90 border border-white/10 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-mars-500 transition"
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* 👑 TIER 1: EXECUTIVE LEADERSHIP (TEAM LEADER CENTERED) */}
      {/* ============================================================== */}
      {executiveLeads.length > 0 && (() => {
        const teamLeader = executiveLeads.find(m => {
          const r = m.role.toLowerCase();
          const n = m.name.toLowerCase();
          if (selectedYear === 2026) return n.includes('saif') || r === 'team leader';
          if (selectedYear === 2025) return n.includes('mosfiqur') || r === 'team leader';
          if (selectedYear === 2024) return n.includes('yeasin') || r === 'team leader';
          if (selectedYear === 2023) return n.includes('abid') || r === 'team leader';
          if (selectedYear === 2022) return n.includes('rokib') || r === 'team leader';
          return r === 'team leader';
        });
        const otherExecLeads = executiveLeads.filter(m => !teamLeader || m.id !== teamLeader.id);

        return (
          <section className="space-y-8 pt-4">
            <div className="border-b border-amber-500/30 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                    Executive Team Leadership
                  </h3>
                  <p className="text-xs text-amber-400/90 font-mono">
                    Team Leader, Co-Team Leader & Senior Leadership
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-gray-400 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                {executiveLeads.length} Leaders
              </span>
            </div>

            {/* Team Leader Centerpiece */}
            {teamLeader && (
              <div className="space-y-3">
                <div className="text-center">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    👑 Team Leader
                  </span>
                </div>
                <div className="max-w-sm mx-auto">
                  {renderMemberCard(teamLeader, 'large')}
                </div>
              </div>
            )}

            {/* Co-Team Leaders & Senior Leads Centered */}
            {otherExecLeads.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-center">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase bg-white/5 text-gray-300 border border-white/15">
                    Co-Team Leaders & Senior Leads
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                  {otherExecLeads.map((member) => renderMemberCard(member, 'large'))}
                </div>
              </div>
            )}
          </section>
        );
      })()}

      {/* ============================================================== */}
      {/* 🚀 TIER 2: SUB-TEAM LEADERS */}
      {/* ============================================================== */}
      {subteamLeads.length > 0 && (
        <section className="space-y-6 pt-10">
          <div className="border-b border-mars-500/30 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-mars-500/20 text-mars-400 border border-mars-500/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                  Sub-Team Leaders & Module Leads
                </h3>
                <p className="text-xs text-mars-400/90 font-mono">
                  Autonomous, Mechanical, Electrical, Science & Media Subteam Leads
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-gray-400 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              {subteamLeads.length} Leads
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {subteamLeads.map((member) => renderMemberCard(member, 'medium'))}
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 🛠️ TIER 3: TEAM MEMBERS & ENGINEERS */}
      {/* ============================================================== */}
      {generalMembers.length > 0 && (
        <section className="space-y-6 pt-10">
          <div className="border-b border-white/15 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 text-gray-300 border border-white/15">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                  Engineering Squad & Core Members
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Software, Mechanical, Electronics, Science & Outreach Engineers
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-gray-400 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              {generalMembers.length} Members
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {generalMembers.map((member) => renderMemberCard(member, 'medium'))}
          </div>
        </section>
      )}

      {/* Empty Search Result Fallback */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-16 glass-card rounded-3xl border border-white/10">
          <p className="text-gray-400 font-mono text-sm">No members found matching your search in {selectedYear}.</p>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="glass-panel max-w-lg w-full rounded-3xl p-6 sm:p-8 border-2 border-white/20 shadow-2xl relative space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-5 items-center">
              <div className="relative w-24 h-28 rounded-2xl overflow-hidden border border-white/20 bg-space-950 shrink-0">
                {selectedMember.image_url && (
                  <Image
                    src={selectedMember.image_url}
                    alt={selectedMember.name}
                    fill
                    className="object-cover object-top"
                  />
                )}
              </div>
              <div className="space-y-1">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getSubteamBadgeColor(selectedMember.subteam)}`}>
                  {selectedMember.subteam} Subteam • {selectedMember.year}
                </span>
                <h3 className="font-display font-bold text-2xl text-white">{selectedMember.name}</h3>
                <p className="text-xs font-mono text-mars-400 font-semibold">{selectedMember.role}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-gray-400 font-semibold">Official Designation & Campaign</h4>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 text-xs font-mono text-gray-300">
                <p><strong>Role:</strong> {selectedMember.role}</p>
                <p><strong>Subteam:</strong> {selectedMember.subteam}</p>
                <p><strong>Expedition Year:</strong> {selectedMember.year}</p>
                <p className="text-gray-400 pt-2 border-t border-white/10 leading-relaxed font-sans text-sm">
                  {selectedMember.bio || `${selectedMember.name} was an official member of UIU Mars Rover Team during the ${selectedMember.year} international rover campaign, contributing to rover subsystem development and international competition executions.`}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase bg-mars-500 hover:bg-mars-600 text-white transition shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
