import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sql } from '@/lib/db';
import { Cpu, ArrowRight, ShieldCheck, Gauge, Wrench, Radio } from 'lucide-react';

export const revalidate = 60;

export default async function RoversPage() {
  let rovers: any[] = [];
  try {
    rovers = await sql`SELECT * FROM rovers ORDER BY year DESC;`;
  } catch (err) {
    console.error('Error fetching rovers:', err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase bg-mars-500/20 text-mars-400 border border-mars-500/30">
          Autonomous Exploration Vehicles
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
          Our Martian Fleet
        </h1>
        <p className="text-base text-gray-300">
          Five generations of planetary rovers designed, modeled, FEA analyzed, and built from scratch by student engineers at United International University.
        </p>
      </div>

      {/* Rovers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rovers.map((rover: any) => {
          const specs = typeof rover.specs === 'string' ? JSON.parse(rover.specs) : rover.specs || {};
          return (
            <div
              key={rover.id}
              className="glass-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/10] bg-space-950 overflow-hidden">
                <Image
                  src={rover.cover_image}
                  alt={rover.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/20 to-transparent" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-mars-500 text-white uppercase shadow-lg">
                    {rover.year} Campaign
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-space-900/80 text-gray-200 backdrop-blur-md border border-white/15">
                    {rover.competition}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-black/60 px-3 py-1 rounded-lg backdrop-blur-md border border-amber-400/30">
                    🏆 {rover.rank_achieved}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-white group-hover:text-mars-400 transition-colors">
                      {rover.name}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {rover.description}
                  </p>
                </div>

                {/* Specs quick grid */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">Weight</span>
                    <span className="text-xs sm:text-sm font-bold text-white">{specs.weight || '48.5 kg'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">Speed</span>
                    <span className="text-xs sm:text-sm font-bold text-white">{specs.speed || '1.8 m/s'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">Arm DOF</span>
                    <span className="text-xs sm:text-sm font-bold text-white">{specs.dof || '6-DOF'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/rovers/${rover.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-mars-400 hover:text-mars-300 transition group-hover:translate-x-1"
                  >
                    Explore Subsystems & Technical Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Aerial UAV Section */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono font-semibold uppercase text-cyan-400">Autonomous Aerial Scouts</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Unmanned Aerial Vehicles (UAVs)</h2>
          <p className="text-sm text-gray-300">
            High-altitude aerial reconnaissance drones providing topographic orthomosaic mapping and route optimization for Martian rovers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-6 items-center">
            <div className="relative w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-space-950 shrink-0">
              <Image src="/images/MAARC.png" alt="MAARC UAV" fill className="object-cover" />
            </div>
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Autonomous Quadrotor</span>
              <h3 className="text-xl font-display font-bold text-white">MAARC UAV</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Equipped with optical flow, RTK-GPS, and downward multispectral camera for aerial bio-signature detection and canyon reconnaissance.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-6 items-center">
            <div className="relative w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-space-950 shrink-0">
              <Image src="/images/ICARUS.png" alt="ICARUS UAV" fill className="object-cover" />
            </div>
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Hexacopter Scout</span>
              <h3 className="text-xl font-display font-bold text-white">ICARUS UAV</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Heavy-payload aerial system capable of autonomous landing on rough terrains and air-dropping emergency beacon modules.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
