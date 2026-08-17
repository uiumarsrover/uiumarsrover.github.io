import React from 'react';
import { sql } from '@/lib/db';
import { ShieldCheck, Users, Cpu, Award, Mail, Calendar, FileText, Database } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let applications: any[] = [];
  let counts = {
    members: 0,
    rovers: 0,
    achievements: 0,
    applications: 0,
  };

  try {
    applications = await sql`SELECT * FROM join_applications ORDER BY created_at DESC LIMIT 50;`;
    const mRes = await sql`SELECT COUNT(*) as c FROM members;`;
    const rRes = await sql`SELECT COUNT(*) as c FROM rovers;`;
    const aRes = await sql`SELECT COUNT(*) as c FROM achievements;`;
    const appRes = await sql`SELECT COUNT(*) as c FROM join_applications;`;

    counts = {
      members: parseInt(mRes[0].c, 10),
      rovers: parseInt(rRes[0].c, 10),
      achievements: parseInt(aRes[0].c, 10),
      applications: parseInt(appRes[0].c, 10),
    };
  } catch (err) {
    console.error('Error fetching admin data:', err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" /> Neon PostgreSQL Connected
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-2">
            UMRT Admin & Database Telemetry
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Serverless database status and recruitment inbox
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-mono text-gray-400 uppercase">Total Members</span>
          <h3 className="text-2xl font-display font-bold text-white mt-1">{counts.members}</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-mono text-gray-400 uppercase">Rovers Fleet</span>
          <h3 className="text-2xl font-display font-bold text-white mt-1">{counts.rovers}</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-mono text-gray-400 uppercase">Achievements</span>
          <h3 className="text-2xl font-display font-bold text-white mt-1">{counts.achievements}</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-mono text-gray-400 uppercase">Join Applications</span>
          <h3 className="text-2xl font-display font-bold text-emerald-400 mt-1">{counts.applications}</h3>
        </div>
      </div>

      {/* Applications Inbox Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-white">Incoming Recruitment Applications</h2>
            <p className="text-xs text-gray-400 font-mono">Stored in Neon Serverless PostgreSQL (`join_applications` table)</p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
            {applications.length} Submissions
          </span>
        </div>

        {applications.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-mono text-xs">
            No recruitment applications submitted yet. Test by submitting the application on <a href="/team/join" className="text-mars-400 underline">/team/join</a>!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-space-900 border-b border-white/10 text-gray-400 font-mono uppercase">
                <tr>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Student ID / Dept</th>
                  <th className="p-4">Subteam</th>
                  <th className="p-4">Skills / Experience</th>
                  <th className="p-4">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition">
                    <td className="p-4">
                      <strong className="text-white block font-medium">{app.full_name}</strong>
                      <span className="text-gray-400 font-mono text-[11px]">{app.email}</span>
                      {app.phone && <span className="text-gray-500 block text-[10px]">{app.phone}</span>}
                    </td>
                    <td className="p-4 font-mono">
                      <span className="text-white block">{app.student_id}</span>
                      <span className="text-gray-400">{app.department} ({app.trimester || 'N/A'})</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-mars-500/20 text-mars-400 border border-mars-500/30">
                        {app.subteam_preference}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="line-clamp-2 text-gray-300">{app.experience || 'No experience provided'}</p>
                      {app.portfolio_url && (
                        <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-mars-400 text-[10px] underline block mt-1">
                          View Portfolio
                        </a>
                      )}
                    </td>
                    <td className="p-4 font-mono text-gray-400 text-[11px]">
                      {new Date(app.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
