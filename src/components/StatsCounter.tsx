import React from 'react';
import { Trophy, Globe2, Cpu, Users } from 'lucide-react';

export default function StatsCounter() {
  const stats = [
    {
      label: 'World URC 2026 Record',
      value: '3rd Place',
      subtitle: 'Worldwide Podium Finish',
      icon: Trophy,
      color: 'from-amber-500/20 to-mars-500/20 border-amber-500/30 text-amber-400',
    },
    {
      label: 'URC 2022 Milestone',
      value: '1st in Asia',
      subtitle: '10th Place Globally',
      icon: Globe2,
      color: 'from-mars-500/20 to-red-500/20 border-mars-500/30 text-mars-400',
    },
    {
      label: 'Planetary Rovers Built',
      value: '5 Generations',
      subtitle: 'AXIOS, Yggdrasil, Telos, Maven',
      icon: Cpu,
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
    },
    {
      label: 'Team Members & Alumni',
      value: '80+ Engineers',
      subtitle: 'Research & Industry Leaders',
      icon: Users,
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`glass-card p-6 rounded-2xl border bg-gradient-to-br ${stat.color} relative overflow-hidden group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                VERIFIED STAT
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl lg:text-3xl text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-xs font-semibold text-gray-200">{stat.label}</p>
            <p className="text-[11px] text-gray-400 mt-1">{stat.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
