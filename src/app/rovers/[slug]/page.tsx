import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sql } from '@/lib/db';
import { ArrowLeft, Cpu, ShieldCheck, Zap, Radio, Target, Wrench, Microscope, Compass } from 'lucide-react';

export const revalidate = 60;

export default async function RoverDetailPage({ params }: { params: { slug: string } }) {
  let rover: any = null;

  try {
    const result = await sql`SELECT * FROM rovers WHERE slug = ${params.slug} LIMIT 1;`;
    if (result && result.length > 0) {
      rover = result[0];
    }
  } catch (err) {
    console.error('Error fetching rover by slug:', err);
  }

  if (!rover) {
    notFound();
  }

  const specs = typeof rover.specs === 'string' ? JSON.parse(rover.specs) : rover.specs || {};
  const subsystems = typeof rover.subsystems === 'string' ? JSON.parse(rover.subsystems) : rover.subsystems || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back Button & Breadcrumbs */}
      <div>
        <Link
          href="/rovers"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-gray-400 hover:text-mars-400 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Rovers Fleet
        </Link>
      </div>

      {/* Rover Hero */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-10 lg:p-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-mars-500 text-white uppercase shadow-md">
                {rover.year} Campaign
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/10 text-gray-200 border border-white/15">
                {rover.competition}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30">
                🏆 {rover.rank_achieved}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white">
                {rover.name}
              </h1>
              <p className="text-sm font-mono text-mars-400">{rover.tagline}</p>
            </div>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {rover.description}
            </p>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Weight</span>
                <span className="text-sm font-bold text-white">{specs.weight || '48.5 kg'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Max Speed</span>
                <span className="text-sm font-bold text-white">{specs.speed || '1.8 m/s'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Battery</span>
                <span className="text-sm font-bold text-white">{specs.battery || '24V LiFePO4'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
              <Image
                src={rover.cover_image}
                alt={rover.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-950/70 via-transparent to-transparent" />
            </div>
          </div>

        </div>
      </div>

      {/* Technical Specifications Matrix */}
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-mono font-semibold uppercase text-mars-400">Engineering Telemetry</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Full System Specifications</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-mars-500/20 text-mars-400 border border-mars-500/30">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-gray-400 uppercase">Mass & Payload</span>
                <h4 className="text-base font-bold text-white">{specs.weight || '48.5 kg'} / {specs.payload || '12 kg'}</h4>
              </div>
            </div>
            <p className="text-xs text-gray-400">Lightweight aerospace alloy structure optimized under strict 50kg competition limits.</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-gray-400 uppercase">Power & Battery</span>
                <h4 className="text-base font-bold text-white">{specs.battery || '24V 30Ah LiFePO4'}</h4>
              </div>
            </div>
            <p className="text-xs text-gray-400">Custom BMS with thermal runaway protection and continuous 2.5-hour mission endurance.</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-gray-400 uppercase">Manipulator Freedom</span>
                <h4 className="text-base font-bold text-white">{specs.dof || '6-DOF Precision Arm'}</h4>
              </div>
            </div>
            <p className="text-xs text-gray-400">Sub-millimeter inverse kinematics control for service panel operations and soil tube grasping.</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-gray-400 uppercase">Communication RF</span>
                <h4 className="text-base font-bold text-white">5.8GHz + 2.4GHz Backup</h4>
              </div>
            </div>
            <p className="text-xs text-gray-400">{specs.comms || 'High-gain directional tracking antenna array up to 2.5 km line-of-sight.'}</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-gray-400 uppercase">Autonomous Nav</span>
                <h4 className="text-base font-bold text-white">Dual RealSense + RTK-GPS</h4>
              </div>
            </div>
            <p className="text-xs text-gray-400">ROS2 Nav2 stack running real-time 3D voxel grid mapping and dynamic obstacle avoidance.</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Microscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-gray-400 uppercase">Science Lab Unit</span>
                <h4 className="text-base font-bold text-white">In-situ Bio-detection</h4>
              </div>
            </div>
            <p className="text-xs text-gray-400">Deep soil auger with multi-chamber spectrophotometric reagent testing.</p>
          </div>
        </div>
      </div>

      {/* Subsystems Deep Dive */}
      {Object.keys(subsystems).length > 0 && (
        <div className="space-y-8 pt-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-xs font-mono font-semibold uppercase text-mars-400">Module Architectures</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Subsystems & Payloads</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(subsystems).map(([key, sys]: any) => (
              <div key={key} className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between">
                {sys.image && (
                  <div className="relative aspect-[16/10] bg-space-950">
                    <Image
                      src={sys.image}
                      alt={sys.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-mars-400 uppercase font-semibold">Subsystem Module</span>
                    <h3 className="text-lg font-display font-bold text-white">{sys.title}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed mt-2">{sys.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
