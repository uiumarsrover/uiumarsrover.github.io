'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { clientSql } from '@/lib/clientDb';
import { Trophy, Award, MapPin, Calendar, Star, Sparkles } from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    clientSql`SELECT * FROM achievements ORDER BY year DESC, id ASC;`
      .then((res: any) => {
        if (res && Array.isArray(res) && res.length > 0) {
          setAchievements(res);
        }
      })
      .catch((err: any) => console.error('Real-time achievements sync error:', err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase bg-mars-500/20 text-mars-400 border border-mars-500/30">
          Global Hall of Fame
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
          Our Achievements & Records
        </h1>
        <p className="text-base text-gray-300">
          A track record of excellence across the world’s most prestigious collegiate robotics challenges: University Rover Challenge (USA), Anatolian Rover Challenge (Turkey), and European Rover Challenge (Poland).
        </p>
      </div>

      {/* Featured Highlight Card */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-amber-500/40 relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-space-950 to-space-950">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-mono font-bold uppercase">
              <Sparkles className="w-4 h-4" /> Historic Milestone (2026)
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              3rd Place Worldwide at URC 2026
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Out of more than 100 international university teams from North America, Europe, and Asia, UIU Mars Rover Team achieved 3rd place on the world podium at the Mars Desert Research Station in Hanksville, Utah.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-gray-200">
                🏆 Score: 384.5 / 400
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-gray-200">
                📍 Utah, USA
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              <Image
                src="/images/team_urc2026.jpg"
                alt="3rd Place Worldwide URC 2026"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="space-y-8">
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-mono font-semibold uppercase text-mars-400">Milestone Timeline</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Competition Journey (2022–2026)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((item: any) => (
            <div
              key={item.id}
              className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6 group hover:border-mars-500/40 transition-all"
            >
              {item.image_url && (
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-space-950 border border-white/10">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-mars-500 text-white uppercase shadow-md">
                      {item.year}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-black/70 text-amber-400 border border-amber-400/30 backdrop-blur-md">
                      🏆 {item.rank}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-mars-400 mb-1">
                    <span>{item.competition}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-mars-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
