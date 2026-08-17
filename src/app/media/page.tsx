import React from 'react';
import { sql } from '@/lib/db';
import MediaLightbox from '@/components/MediaLightbox';
import { Newspaper, Tv, Globe } from 'lucide-react';

export const revalidate = 60;

export default async function MediaPage() {
  let mediaArticles: any[] = [];
  try {
    mediaArticles = await sql`SELECT * FROM media_articles ORDER BY id ASC;`;
  } catch (err) {
    console.error('Error fetching media:', err);
  }

  // Also include the rest of the newspaper press clippings from the repository
  const extraMedia = [
    {
      id: 101,
      publisher_name: 'eProtidiner Bangladesh',
      headline: 'রোভারের বিশ্বমঞ্চে লাল সবুজের সাফল্য - ইউআইইউ রোভার দল',
      publish_date: 'July 2025',
      category: 'Newspaper',
      clipping_image: '/News Media/রোভারের বিশ্বমঞ্চে লাল সবুজের সাফল্য - eProtidiner Bangladesh-page-00001.jpg',
    },
    {
      id: 102,
      publisher_name: 'National Dailies',
      headline: 'আন্তর্জাতিক মার্স রোভার প্রতিযোগিতায় অভূতপূর্ব সাফল্য',
      publish_date: 'August 2025',
      category: 'Newspaper',
      clipping_image: '/News Media/Screenshot 2025-09-22 at 12.07.48 PM.png',
    },
    {
      id: 103,
      publisher_name: 'Tech Horizon',
      headline: 'Autonomous Rover Traversal by Bangladeshi University Engineers',
      publish_date: 'June 2025',
      category: 'Online Portal',
      clipping_image: '/News Media/Screenshot 2025-09-22 at 12.08.05 PM.png',
    },
    {
      id: 104,
      publisher_name: 'The Daily Star',
      headline: 'UIU Mars Rover Team Wins Worldwide Acclaim in Utah',
      publish_date: 'June 2025',
      category: 'Newspaper',
      clipping_image: '/News Media/Screenshot 2025-09-22 at 12.08.23 PM.png',
    },
    {
      id: 105,
      publisher_name: 'Prothom Alo Features',
      headline: 'মঙ্গল জয়ের স্বপ্ন: বুয়েট ও ইউআইইউ রোভার দলের গল্প',
      publish_date: 'July 2025',
      category: 'Newspaper',
      clipping_image: '/News Media/Screenshot 2025-09-22 at 12.08.39 PM.png',
    },
    {
      id: 106,
      publisher_name: 'Samakal',
      headline: 'বিশ্বমঞ্চে বাংলাদেশের শিক্ষার্থীদের অনন্য উদ্ভাবন',
      publish_date: 'July 2025',
      category: 'Newspaper',
      clipping_image: '/News Media/Screenshot 2025-09-22 at 12.08.57 PM.png',
    },
    {
      id: 107,
      publisher_name: 'Dhaka Tribune',
      headline: 'How UMRT Built an Aerospace-Grade Rover from Dhaka',
      publish_date: 'May 2025',
      category: 'Online Portal',
      clipping_image: '/News Media/Screenshot 2025-09-22 at 12.09.11 PM.png',
    },
    {
      id: 108,
      publisher_name: 'Bangla Tribune',
      headline: 'নাসার বিজ্ঞানীদের সামনে বাংলাদেশের রোভার পরীক্ষা',
      publish_date: 'June 2025',
      category: 'Online Portal',
      clipping_image: '/News Media/Screenshot 2025-09-22 at 12.09.26 PM.png',
    },
  ];

  const allMedia = [...mediaArticles, ...extraMedia];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase bg-mars-500/20 text-mars-400 border border-mars-500/30">
          Press Archive & Broadcasts
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
          National & Global Media
        </h1>
        <p className="text-base text-gray-300">
          Extensive coverage by premier national dailies, television networks, and international science magazines highlighting UMRT achievements.
        </p>
      </div>

      {/* Media Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/10 text-center space-y-1">
          <Newspaper className="w-6 h-6 text-mars-400 mx-auto mb-2" />
          <h3 className="font-display font-bold text-2xl text-white">30+ Frontpage Articles</h3>
          <p className="text-xs text-gray-400">The Daily Star, Prothom Alo, Business Standard</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 text-center space-y-1">
          <Tv className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <h3 className="font-display font-bold text-2xl text-white">15+ TV Broadcasts</h3>
          <p className="text-xs text-gray-400">Jamuna TV, NTV, Channel 24, BTV World</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 text-center space-y-1">
          <Globe className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <h3 className="font-display font-bold text-2xl text-white">2.5M+ Digital Reach</h3>
          <p className="text-xs text-gray-400">Inspiring STEM youth across South Asia</p>
        </div>
      </div>

      {/* Lightbox Gallery Grid */}
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4 flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-white">Interactive Press Clippings</h2>
          <span className="text-xs font-mono text-gray-400">Click any clipping to zoom in</span>
        </div>

        <MediaLightbox items={allMedia} />
      </div>

    </div>
  );
}
