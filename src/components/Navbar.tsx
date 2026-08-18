'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight, Rocket, Award, Users, Cpu, Newspaper, Calendar, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Rovers', href: '/rovers', icon: Cpu },
    { name: 'Achievements', href: '/achievements', icon: Award },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Advisors', href: '/advisors', icon: ShieldCheck },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Media', href: '/media', icon: Newspaper },
    { name: 'Sponsors', href: '/sponsor', icon: HeartHandshake },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-panel shadow-2xl py-3 border-b border-white/10' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full border border-mars-500/40 p-1 bg-space-900 group-hover:border-mars-500 transition-all">
              <Image 
                src="/images/umrt_logo.png" 
                alt="UMRT Logo" 
                fill 
                className="object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg md:text-xl tracking-wider text-white flex items-center gap-1.5">
                UMRT <span className="text-xs px-2 py-0.5 rounded bg-mars-500/20 text-mars-400 font-mono border border-mars-500/30">UIU</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                Mars Rover Team
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-space-900/60 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-mars-500 text-white font-semibold shadow-lg shadow-mars-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition group"
              title="Admin Mission Control"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-mars-400" />
              <span>Admin</span>
            </Link>

            <Link
              href="/team/join"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-mars-600 to-mars-500 hover:from-mars-500 hover:to-mars-400 transition-all shadow-lg shadow-mars-500/25 border border-mars-400/30 group"
            >
              <Rocket className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              Join Team
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-space-850 border border-white/10 text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden glass-panel border-b border-white/10 px-4 pt-4 pb-6 mt-3 space-y-2 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-mars-500 text-white font-semibold'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-mars-400" />}
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-mono font-semibold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              <ShieldCheck className="w-4 h-4 text-mars-400" /> Admin Mission Control
            </Link>
            <Link
              href="/team/join"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white bg-mars-500 hover:bg-mars-600 transition"
            >
              <Rocket className="w-4 h-4" /> Apply for Recruitment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
