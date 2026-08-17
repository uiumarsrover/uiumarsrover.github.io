'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Rocket, CheckCircle2, AlertCircle, Shield, Sparkles, Send } from 'lucide-react';

export default function JoinUsPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    student_id: '',
    email: '',
    phone: '',
    department: 'CSE',
    trimester: '4th Trimester',
    cgpa: '',
    subteam_preference: 'Software',
    experience: '',
    portfolio_url: '',
    reason_to_join: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Breadcrumb */}
      <div>
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-gray-400 hover:text-mars-400 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Team Hub
        </Link>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase bg-mars-500/20 text-mars-400 border border-mars-500/30">
          Recruitment Portal
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
          Join the Mars Rover Team
        </h1>
        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
          Are you ready to design aerospace-grade planetary robots and represent UIU on world stages in Utah, Poland, and Turkey? Apply below to join our next campaign.
        </p>
      </div>

      {success ? (
        <div className="glass-panel p-10 rounded-3xl border border-emerald-500/30 text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-white">Application Received!</h2>
            <p className="text-sm text-gray-300 max-w-md mx-auto">
              Your application has been logged directly into the UIU Mars Rover Team Neon Tech database. Our subteam leads will review your profile and contact you for the recruitment interview and technical task round.
            </p>
          </div>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-full text-xs font-mono font-semibold uppercase bg-mars-500 text-white hover:bg-mars-600 transition"
            >
              Return Home
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  full_name: '',
                  student_id: '',
                  email: '',
                  phone: '',
                  department: 'CSE',
                  trimester: '4th Trimester',
                  cgpa: '',
                  subteam_preference: 'Software',
                  experience: '',
                  portfolio_url: '',
                  reason_to_join: '',
                });
              }}
              className="px-6 py-2.5 rounded-full text-xs font-mono font-semibold uppercase bg-white/10 text-gray-200 hover:bg-white/20 transition"
            >
              Submit Another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8">
          
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Academic & Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-mars-400 font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4" /> 1. Academic & Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Tawsif Turabi"
                  className="w-full px-4 py-2.5 rounded-xl bg-space-900/90 border border-white/10 text-sm text-white focus:outline-none focus:border-mars-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1.5">Student ID *</label>
                <input
                  type="text"
                  required
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  placeholder="e.g. 011211000"
                  className="w-full px-4 py-2.5 rounded-xl bg-space-900/90 border border-white/10 text-sm text-white focus:outline-none focus:border-mars-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1.5">UIU Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. student@bscse.uiu.ac.bd"
                  className="w-full px-4 py-2.5 rounded-xl bg-space-900/90 border border-white/10 text-sm text-white focus:outline-none focus:border-mars-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1.5">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +880 1700 000000"
                  className="w-full px-4 py-2.5 rounded-xl bg-space-900/90 border border-white/10 text-sm text-white focus:outline-none focus:border-mars-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1.5">Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-space-900/90 border border-white/10 text-sm text-white focus:outline-none focus:border-mars-500"
                >
                  <option value="CSE">CSE (Computer Science & Engineering)</option>
                  <option value="EEE">EEE (Electrical & Electronic Engineering)</option>
                  <option value="Data Science">Data Science</option>
                  <option value="BBA / Management">BBA / Media & Management</option>
                  <option value="Civil / Other">Other Department</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1.5">Current Trimester / CGPA</label>
                <input
                  type="text"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  placeholder="e.g. 5th Trimester / CGPA 3.85"
                  className="w-full px-4 py-2.5 rounded-xl bg-space-900/90 border border-white/10 text-sm text-white focus:outline-none focus:border-mars-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Subteam Preference & Skills */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-mono uppercase tracking-widest text-mars-400 font-semibold flex items-center gap-2">
              <Rocket className="w-4 h-4" /> 2. Subteam Preference & Engineering Background
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1.5">Subteam Preference *</label>
                <select
                  value={formData.subteam_preference}
                  onChange={(e) => setFormData({ ...formData, subteam_preference: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-space-900/90 border border-white/10 text-sm text-white focus:outline-none focus:border-mars-500"
                >
                  <option value="Software">Software (ROS2, Computer Vision, SLAM, Autonomous Nav, Web GUI)</option>
                  <option value="Mechanical">Mechanical (CAD SolidWorks, FEA simulation, Chassis, 6-DOF Robotic Arm)</option>
                  <option value="Electrical">Electrical (Custom PCB design, Power systems, Motor drivers, RF Comms)</option>
                  <option value="Science">Science (Biochemical soil assays, Spectrometry, Raman analysis, Geology)</option>
                  <option value="Management">Media & Management (Outreach, Sponsorship, Video documentary, Web)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1.5">Relevant Technical Skills & Past Experience</label>
                <textarea
                  rows={3}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="List tools you know: SolidWorks, ROS2, C++, Python, Altium, OpenCV, PyTorch, micro-controllers, etc."
                  className="w-full px-4 py-2.5 rounded-xl bg-space-900/90 border border-white/10 text-sm text-white focus:outline-none focus:border-mars-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1.5">GitHub / Portfolio / LinkedIn Link</label>
                <input
                  type="url"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  placeholder="https://github.com/username or https://linkedin.com/in/username"
                  className="w-full px-4 py-2.5 rounded-xl bg-space-900/90 border border-white/10 text-sm text-white focus:outline-none focus:border-mars-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1.5">Why do you want to join UMRT?</label>
                <textarea
                  rows={3}
                  value={formData.reason_to_join}
                  onChange={(e) => setFormData({ ...formData, reason_to_join: e.target.value })}
                  placeholder="Tell us what motivates you to contribute to space robotics and our Mars rover expeditions..."
                  className="w-full px-4 py-2.5 rounded-xl bg-space-900/90 border border-white/10 text-sm text-white focus:outline-none focus:border-mars-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-mars-600 to-mars-500 hover:from-mars-500 hover:to-mars-400 transition shadow-xl shadow-mars-500/25 border border-mars-400/40 disabled:opacity-50"
            >
              {loading ? (
                <>Submitting to Neon DB...</>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Application
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
