import React from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { Shield, Sparkles, Heart, Compass } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  const { isUpsideDown, isHaunted } = useTheme();

  return (
    <footer className="mt-20 border-t border-white/10 bg-black/70 backdrop-blur-md text-slate-400 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand & Purpose */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className={`text-lg font-black tracking-wider ${
              isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
            }`}>
              BUILD YOUR CITY
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            A production-grade Gamified Productivity RPG. Transform daily tasks into rewarding quests, maintain streaks, defeat towering AI-generated bosses, and forge a living virtual metropolis powered by real-life focus.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authoritative PostgreSQL 18 Architecture • Pure Web Audio Engine</span>
          </div>
        </div>

        {/* Public SEO & Crawlable Navigation */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 font-mono">
            Navigation
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => { setActiveTab('features'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors"
              >
                Features & RPG Mechanics
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('how-it-works'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors"
              >
                How It Works: Goals to Cities
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors"
              >
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors"
              >
                About the Architecture
              </button>
            </li>
          </ul>
        </div>

        {/* RPG Themes & Departments */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 font-mono">
            Themes & Lore
          </h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
              <span>Theme H: The Upside Down (Hawkins 1984)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span>Theme G: Cursed Necropolis (Gothic Horror)</span>
            </li>
            <li className="pt-2 text-[11px] text-slate-500">
              Department Attributes: Tech, Knowledge, Strength, Wellness, Economy, Culture.
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
        <p>© 2026 Build Your City — Gamified Productivity RPG. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built for competition excellence with high performance & accessibility.
        </p>
      </div>
    </footer>
  );
}
