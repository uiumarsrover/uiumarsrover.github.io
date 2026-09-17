import { sql } from '@/lib/db';
import TeamRoster from './TeamRoster';

export const revalidate = 60;

export default async function TeamPage() {
  let members: any[] = [];
  try {
    members = await sql`SELECT * FROM members ORDER BY is_lead DESC, id ASC;`;
  } catch (err) {
    console.error('Error fetching team members:', err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase bg-mars-500/20 text-mars-400 border border-mars-500/30">
          The Minds Behind The Machine
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
          Team Roster (2022–2026)
        </h1>
        <p className="text-base text-gray-300">
          Multidisciplinary student engineers, programmers, scientists, and designers from United International University collaborating on world-class space robotics.
        </p>
      </div>

      {/* Interactive Roster */}
      <TeamRoster initialMembers={members as any} />
    </div>
  );
}
