'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ExternalLink, Newspaper, Flame, Eye, Sparkles } from 'lucide-react';

interface MediaItem {
  id: number;
  publisher_name: string;
  headline: string;
  publisher_logo?: string;
  clipping_image?: string;
  publish_date?: string;
  category?: string;
  article_url?: string;
}

export default function MediaLightbox({ items }: { items: MediaItem[] }) {
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Newspaper', 'Online Portal', 'Television'];

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(i => (i.category || '').toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-8">
      
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-space-900 border border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase transition ${
                filter === cat
                  ? 'bg-gradient-to-r from-red-600 to-mars-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-gray-400">
          Showing <strong>{filteredItems.length}</strong> Press Clippings
        </span>
      </div>

      {/* Big Clipping Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelected(item)}
            className="glass-card rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between border border-white/15 hover:border-mars-500/60 shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            {/* Extra Large Image Aspect */}
            <div className="relative aspect-[16/11] bg-space-950 overflow-hidden">
              {item.clipping_image && (
                <Image
                  src={item.clipping_image}
                  alt={item.headline}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/20 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-mars-500 text-white uppercase shadow-lg backdrop-blur-md">
                  {item.publisher_name}
                </span>
              </div>

              <div className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-mars-400" />
              </div>

              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase bg-black/75 text-gray-200 border border-white/10 backdrop-blur-md">
                  {item.category || 'News'}
                </span>
                <span className="text-[11px] text-gray-300 font-mono">
                  {item.publish_date}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-[11px] font-mono font-bold text-mars-400 uppercase tracking-wide">
                  Frontpage Headline
                </p>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white line-clamp-2 leading-snug group-hover:text-mars-300 transition-colors mt-1">
                  {item.headline}
                </h3>
              </div>
              
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                <span className="flex items-center gap-1 text-gray-300">
                  <Eye className="w-3.5 h-3.5 text-mars-400" /> Click to zoom clipping
                </span>
                <span className="text-mars-400 font-bold group-hover:translate-x-1 transition-transform">Inspect →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selected && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in"
          onClick={() => setSelected(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[92vh] glass-panel rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-white/15 flex items-center justify-between bg-space-900">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-mars-500 text-white uppercase">
                    {selected.publisher_name}
                  </span>
                  <span className="text-xs font-mono text-gray-400">{selected.publish_date}</span>
                </div>
                <h4 className="font-display font-extrabold text-white text-lg sm:text-2xl line-clamp-1">
                  {selected.headline}
                </h4>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Giant Full-Resolution Image Viewer */}
            <div className="relative flex-1 overflow-auto bg-space-950 p-6 flex items-center justify-center min-h-[500px]">
              {selected.clipping_image && (
                <div className="relative w-full h-[65vh]">
                  <Image
                    src={selected.clipping_image}
                    alt={selected.headline}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-space-900 border-t border-white/15 flex items-center justify-between">
              <p className="text-xs text-gray-400 font-mono">
                Official National Media Archive • UIU Mars Rover Team
              </p>
              {selected.article_url && (
                <a
                  href={selected.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase bg-mars-500 text-white hover:bg-mars-600 transition"
                >
                  View Online Article <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
