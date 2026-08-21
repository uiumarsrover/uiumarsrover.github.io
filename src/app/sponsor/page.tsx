'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { clientSql, getLocalCache, setLocalCache } from '@/lib/clientDb';
import { HeartHandshake, Check, Download, Mail, ExternalLink, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

export default function SponsorPage() {
  const [sponsors, setSponsors] = useState<any[]>(() => getLocalCache('sponsors_list', []));

  useEffect(() => {
    clientSql`SELECT * FROM sponsors ORDER BY id ASC;`
      .then((res: any) => {
        if (res && Array.isArray(res) && res.length > 0) {
          setSponsors(res);
          setLocalCache('sponsors_list', res);
        }
      })
      .catch((err: any) => console.error('Real-time sponsors sync error:', err));
  }, []);

  const tiers = [
    {
      name: 'Platinum Partner',
      badge: 'Principal Sponsor',
      amount: 'BDT 5,00,000+',
      color: 'border-cyan-500/50 bg-cyan-500/5',
      buttonColor: 'bg-cyan-500 hover:bg-cyan-600 text-black font-bold',
      perks: [
        'Prominent Logo on Rover Chassis & Robotic Manipulator',
        'Logo on Official UMRT Team Jerseys in Utah, USA & Turkey',
        'Featured in All National TV & Newspaper Interviews',
        'Exclusive Campus Recruitment Drive & Talent Access',
        'Social Media Co-Branding (2.5M+ Digital Reach)',
        'Keynote Presentation Slot at UIU Space Innovation Summit',
      ],
    },
    {
      name: 'Gold Sponsor',
      badge: 'Major Sponsor',
      amount: 'BDT 2,50,000+',
      popular: true,
      color: 'border-mars-500/60 bg-mars-500/10 shadow-2xl shadow-mars-500/20',
      buttonColor: 'bg-mars-500 hover:bg-mars-600 text-white font-bold',
      perks: [
        'Logo on Rover Side Panels & Team Uniforms',
        'Logo in All SAR Video Submissions & Competition Streams',
        'Brand Recognition on UMRT Official Website & Press Releases',
        'Direct Access to Graduating Robotics & Software Engineers',
        'VIP Access to Team Rover Demonstrations & Lab Visits',
      ],
    },
    {
      name: 'Silver / In-Kind',
      badge: 'Technical Partner',
      amount: 'BDT 1,00,000+ / Hardware',
      color: 'border-white/15 bg-white/5',
      buttonColor: 'bg-white/10 hover:bg-white/20 text-white',
      perks: [
        'Logo on Website Partners Page',
        'Social Media Shoutouts and Partner Spotlight Posts',
        'Acknowledgement in Technical Papers & Competition Booklets',
        'Invitation to Annual Rover Showcase Exhibition',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase bg-mars-500/20 text-mars-400 border border-mars-500/30">
          Corporate Partnership & Support
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
          Empower the Next Generation of Space Roboticists
        </h1>
        <p className="text-base text-gray-300">
          Partner with Bangladesh’s leading Mars Rover Team to gain premier national media exposure, brand placement on global stages in the USA, and direct access to top engineering talent.
        </p>
      </div>

      {/* Value Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 text-center">
          <span className="text-2xl font-display font-bold text-white block">3rd in World</span>
          <span className="text-xs text-gray-400 font-mono">Global Competition Record</span>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-white/10 text-center">
          <span className="text-2xl font-display font-bold text-white block">2.5M+ Views</span>
          <span className="text-xs text-gray-400 font-mono">National Broadcast Impressions</span>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-white/10 text-center">
          <span className="text-2xl font-display font-bold text-white block">10,000+ Students</span>
          <span className="text-xs text-gray-400 font-mono">Outreach & STEM Bootcamps</span>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-white/10 text-center">
          <span className="text-2xl font-display font-bold text-white block">80+ Alumni</span>
          <span className="text-xs text-gray-400 font-mono">In Leading Tech Industries</span>
        </div>
      </div>

      {/* Sponsorship Tier Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {tiers.map((tier, i) => (
          <div
            key={i}
            className={`glass-panel p-8 rounded-3xl border flex flex-col justify-between space-y-8 relative ${tier.color}`}
          >
            {tier.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-mars-500 text-white font-mono text-[11px] font-bold uppercase shadow-lg">
                Most Popular Partner Tier
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-mars-400 uppercase font-semibold">{tier.badge}</span>
                <h3 className="text-2xl font-display font-bold text-white">{tier.name}</h3>
              </div>
              <div className="text-3xl font-display font-extrabold text-white">
                {tier.amount}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-xs font-mono uppercase text-gray-400 block font-semibold">Tier Benefits:</span>
                {tier.perks.map((perk, j) => (
                  <div key={j} className="flex items-start gap-2.5 text-xs text-gray-300">
                    <Check className="w-4 h-4 text-mars-400 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <a
                href="mailto:marsrover@uiu.ac.bd?subject=Sponsorship%20Inquiry%20-%20UIU%20Mars%20Rover%20Team"
                className={`w-full py-3 rounded-xl text-xs uppercase tracking-wider transition text-center flex items-center justify-center gap-2 ${tier.buttonColor}`}
              >
                <Mail className="w-4 h-4" /> Inquire for {tier.name}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Existing Sponsors Showcase */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 space-y-8 text-center">
        <div>
          <span className="text-xs font-mono font-semibold uppercase text-mars-400">Current Partners</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">Our Esteemed Sponsors</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 items-center justify-center">
          {sponsors.map((sp) => (
            <div
              key={sp.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center h-28 hover:border-mars-500/40 transition"
            >
              <div className="relative w-full h-12">
                <Image
                  src={sp.logo_url}
                  alt={sp.name}
                  fill
                  className="object-contain filter grayscale hover:grayscale-0 transition opacity-80 hover:opacity-100"
                />
              </div>
              <span className="text-[10px] font-mono text-gray-400 mt-2 line-clamp-1">{sp.name}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
