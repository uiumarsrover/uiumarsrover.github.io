import React from 'react';
import { notFound } from 'next/navigation';
import { sql } from '@/lib/db';
import RoverDetailClient from './RoverDetailClient';

export async function generateStaticParams() {
  try {
    const result = await sql`SELECT slug FROM rovers;`;
    if (result && result.length > 0) {
      return result.map((r: any) => ({ slug: r.slug }));
    }
  } catch (err) {}
  return [
    { slug: 'aurion' },
    { slug: 'maven' },
    { slug: 'telos' },
    { slug: 'yggdrasil' },
    { slug: 'axios' },
  ];
}

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
    // Return empty fallback so client can hydrate from clientSql
    rover = { slug: params.slug, name: params.slug.toUpperCase(), year: 2026, competition: 'URC', rank_achieved: 'Finalist' };
  }

  return <RoverDetailClient initialRover={rover} slug={params.slug} />;
}
