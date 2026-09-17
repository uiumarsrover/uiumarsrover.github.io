import React from 'react';
import Image from 'next/image';
import { sql } from '@/lib/db';
import { ShieldCheck, Award, GraduationCap, Compass } from 'lucide-react';

export const revalidate = 60;

export default async function AdvisorsPage() {
  let advisors: any[] = [];
  try {
    advisors = await sql`SELECT * FROM advisors ORDER BY id ASC;`;
  } catch (err) {
    console.error('Error fetching advisors:', err);
  }

  const facultyAdvisors = advisors.filter((a) => a.type === 'FACULTY_ADVISOR');
  const foundingDirectors = advisors.filter((a) => a.type === 'FOUNDING_DIRECTOR');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase bg-mars-500/20 text-mars-400 border border-mars-500/30">
          Academic Mentorship & Leadership
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
          Advisors & Directors
        </h1>
        <p className="text-base text-gray-300">
          The distinguished faculty members, university leaders, and founding mentors guiding the UIU Mars Rover Team in engineering excellence, AI algorithms, and international robotics standards.
        </p>
      </div>

      {/* Faculty Leadership Section */}
      <div className="space-y-8">
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-mono font-semibold uppercase text-mars-400">Institutional Guidance</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-mars-400" /> Faculty Advisors & Patrons
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facultyAdvisors.map((advisor) => (
            <div
              key={advisor.id}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 p-5 flex flex-col justify-between group"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-space-900 mb-4 border border-white/10">
                {advisor.image_url && (
                  <Image
                    src={advisor.image_url}
                    alt={advisor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>

              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-white group-hover:text-mars-300 transition-colors">
                    {advisor.name}
                  </h3>
                  <p className="text-xs text-mars-400 font-mono mt-0.5">{advisor.designation}</p>
                  <p className="text-[11px] text-gray-400">{advisor.organization}</p>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mt-2 pt-2 border-t border-white/10">
                  {advisor.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Founding Directors Section */}
      <div className="space-y-8">
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-mono font-semibold uppercase text-mars-400">Operations & Technical Direction</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-mars-400" /> Team Directors & Founders
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {foundingDirectors.map((director) => (
            <div
              key={director.id}
              className="glass-panel rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center group"
            >
              <div className="relative w-full sm:w-40 aspect-square rounded-2xl overflow-hidden bg-space-900 border border-white/15 shrink-0">
                {director.image_url && (
                  <Image
                    src={director.image_url}
                    alt={director.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>

              <div className="space-y-2 flex-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-mars-500/20 text-mars-400 border border-mars-500/30 uppercase font-semibold">
                  {director.designation}
                </span>
                <h3 className="font-display font-bold text-2xl text-white">
                  {director.name}
                </h3>
                <p className="text-xs text-gray-400 font-mono">{director.organization}</p>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-2">
                  {director.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
