import React from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { Zap, ShieldAlert, Building2, Flame, Coins, Wand2, ArrowRight } from 'lucide-react';

export default function FeaturesPage({ setActiveTab }) {
  const { isUpsideDown, isHaunted, cardBg, btnPrimary } = useTheme();

  return (
    <article className="max-w-5xl mx-auto px-4 py-8 space-y-12 animate-fade-in">
      <header className="text-center max-w-3xl mx-auto">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
          COMPREHENSIVE GAME DESIGN
        </span>
        <h1 className={`text-3xl sm:text-5xl font-black mt-2 ${
          isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
        }`}>
          Features & RPG Mechanics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
          Engineered from the ground up as a serious productivity application with the depth, progression, and adrenaline of a classic RPG.
        </p>
      </header>

      {/* Feature 1: Non-Linear Progression */}
      <section className={`p-6 sm:p-8 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-700/60 text-cyan-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">1. Authoritative Non-Linear XP & Leveling</h2>
            <span className="text-xs font-mono text-cyan-300 font-semibold">Formula: requiredXP = floor(100 * level^1.5)</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Generic habit apps give flat increments that quickly feel meaningless. Build Your City enforces progressive overload in your habit development: subsequent levels require increasingly more discipline, matching the authentic curve of real-world skill mastery.
        </p>
      </section>

      {/* Feature 2: AI Quest Master */}
      <section className={`p-6 sm:p-8 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-700/60 text-purple-400">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">2. AI Quest Master & Campaign Generator</h2>
            <span className="text-xs font-mono text-purple-300 font-semibold">Real Goal $\to$ Structured Quest Chain $\to$ Nemesis Boss</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Have an overwhelming goal like "Prepare for my DBMS semester exam" or "Build a full-stack SaaS"? The AI Quest Master deconstructs it into bite-sized actionable quests, assigns a thematic boss entity, and automatically populates your schedule.
        </p>
      </section>

      {/* Feature 3: Boss Battles */}
      <section className={`p-6 sm:p-8 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-700/60 text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">3. Boss Battle Mechanics & Strike Damage</h2>
            <span className="text-xs font-mono text-red-300 font-semibold">Every Finished Task Deals Direct Damage</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Each campaign boss has an authoritative HP bar calculated by the backend. Every completed quest inflicts crushing damage with floating damage numbers, lightning strikes, and victory fanfare upon defeat.
        </p>
      </section>

      {/* Feature 4: Living City Progression */}
      <section className={`p-6 sm:p-8 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-700/60 text-amber-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">4. Living City Districts & Urban Blueprints</h2>
            <span className="text-xs font-mono text-amber-300 font-semibold">Settlement $\to$ Village $\to$ Town $\to$ City $\to$ Metropolis</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Invest earned Gold into architectural blueprints across Technology, Knowledge, Strength, Wellness, and Culture districts. As your city grows, your citizen population expands based on your streak and accomplishments.
        </p>
      </section>

      <div className="text-center pt-6">
        <button
          onClick={() => setActiveTab('signup')}
          className={`px-8 py-3.5 rounded-2xl text-sm font-bold ${btnPrimary}`}
        >
          Begin Playing Build Your City
        </button>
      </div>
    </article>
  );
}
