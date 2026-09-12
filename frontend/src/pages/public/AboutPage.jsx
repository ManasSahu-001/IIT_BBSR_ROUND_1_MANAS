import React from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { ShieldCheck, Database, Cpu, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const { isUpsideDown, isHaunted, cardBg } = useTheme();

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      <header className="text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
          MISSION & TECH STACK
        </span>
        <h1 className={`text-3xl sm:text-5xl font-black mt-2 ${
          isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
        }`}>
          About Build Your City
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
          Crafted by Tech Member 3 for competition excellence, combining hardcore software engineering with atmospheric RPG immersion.
        </p>
      </header>

      <section className={`p-6 sm:p-8 rounded-2xl border space-y-4 ${cardBg}`}>
        <h2 className="text-lg font-bold text-white">Full-Stack Competition Architecture</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Unlike standard todo prototypes that rely merely on localStorage or static mockups, Build Your City is a true full-stack distributed system. It features:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-mono text-slate-300">
          <li className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>PostgreSQL 18 Persistent Engine</span>
          </li>
          <li className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Node.js / Express Authoritative API</span>
          </li>
          <li className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>JWT Auth & Row-Level Isolation</span>
          </li>
          <li className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>React + Tailwind CSS Presentation</span>
          </li>
        </ul>
      </section>

      <section className={`p-6 sm:p-8 rounded-2xl border space-y-3 ${cardBg}`}>
        <h2 className="text-lg font-bold text-white">The Philosophy of Gamified Productivity</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Real-life progress is non-linear and demands grit. When you see your real efforts directly constructing a digital city and knocking down fearsome bosses like the Mind Flayer or the Eldritch Lich, the psychological barrier to starting vanishes.
        </p>
      </section>
    </article>
  );
}
