import React from 'react';
import Image from 'next/image';
import { sql } from '@/lib/db';
import { Calendar, MapPin, Sparkles, Users, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function EventsPage() {
  let events: any[] = [];
  try {
    events = await sql`SELECT * FROM events ORDER BY id ASC;`;
  } catch (err) {
    console.error('Error fetching events:', err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase bg-mars-500/20 text-mars-400 border border-mars-500/30">
          Workshops & Community Outreach
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
          Events & Bootcamps
        </h1>
        <p className="text-base text-gray-300">
          Fostering robotics, aerospace engineering, and autonomous systems education for university and high-school students across Bangladesh.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="glass-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-mars-500/40 transition-all"
          >
            <div className="relative aspect-[16/10] bg-space-950 overflow-hidden">
              {evt.image_url && (
                <Image
                  src={evt.image_url}
                  alt={evt.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-mars-500 text-white uppercase shadow-md">
                  {evt.category || 'Workshop'}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-mono bg-black/60 text-gray-200 backdrop-blur-md border border-white/15">
                  {evt.status}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1 text-mars-400">
                    <Calendar className="w-3.5 h-3.5" /> {evt.event_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {evt.location}
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl text-white group-hover:text-mars-300 transition-colors">
                  {evt.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed pt-1">
                  {evt.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                <span>UIU Space Innovation Lab</span>
                <span className="text-mars-400 group-hover:translate-x-1 transition-transform">Details →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
