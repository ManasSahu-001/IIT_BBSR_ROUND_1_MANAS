import React from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { 
  Sparkles, 
  ShieldAlert, 
  Building2, 
  Flame, 
  Zap, 
  Wand2, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Radio, 
  Skull,
  Coins
} from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  const { isUpsideDown, isHaunted, cardBg, btnPrimary } = useTheme();

  return (
    <article className="space-y-20 animate-fade-in pb-12">
      
      {/* 1. Hero Section */}
      <section className="text-center pt-8 pb-12 sm:pt-16 sm:pb-20 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/50 border border-red-700/50 text-red-300 text-xs font-mono mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-red-400" />
          <span>The Next Generation Life RPG & Productivity Engine</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight ${
          isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
        }`}>
          Turn Your Real Life Into a City-Building RPG
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Complete real-life quests, earn authoritative XP, maintain population streaks, defeat AI-forged campaign bosses, and build your own virtual metropolis.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveTab('signup')}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 ${btnPrimary}`}
          >
            <span>Found Your City Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('features')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 transition-all"
          >
            Explore RPG Mechanics
          </button>
        </div>

        {/* Value Proof Badges */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs text-slate-400 font-mono">
          <div>
            <span className="block text-lg sm:text-xl font-bold text-white">Non-Linear</span>
            <span>XP Leveling</span>
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-bold text-white">AI Quest Master</span>
            <span>Structured Campaigns</span>
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-bold text-white">Boss Battles</span>
            <span>HP Damage per Quest</span>
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-bold text-white">PostgreSQL 18</span>
            <span>Persistent Database</span>
          </div>
        </div>
      </section>

      {/* 2. What is Build Your City? */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            THE REVOLUTIONARY PARADIGM
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            What is Build Your City?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
            Standard todo lists feel like administrative chores. Build Your City transforms real-life tasks into high-stakes RPG quests where each accomplishment constructs a thriving virtual empire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-700/60 text-red-400 w-fit mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Real-Life Task $\to$ RPG Quest</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every coding problem, textbook chapter, or gym workout translates directly into an authoritative RPG quest with calculated XP and Gold yields.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-700/60 text-purple-400 w-fit mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Campaigns & Boss Battles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Facing a major deadline? Our AI Quest Master generates a structured campaign and a formidable Boss. Completing tasks deals direct damage to the boss's HP!
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-700/60 text-amber-400 w-fit mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Living City Evolution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watch your settlement graduate from a humble outpost to a bustling Town, City, and Grand Metropolis, unlocking districts and blueprints along the way.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Thematic Immersion: Stranger Things & Gothic Horror */}
      <section className={`max-w-6xl mx-auto px-6 py-12 rounded-3xl border ${cardBg}`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              THEMES G & H
            </span>
            <h2 className={`text-2xl sm:text-3xl font-black ${
              isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
            }`}>
              Bespoke Atmospheric Worlds
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Switch seamlessly between <strong>Theme H: The Upside Down</strong> (Hawkins 1984 CRT glow, incandescent Christmas lights, red storms, and drifting spore particles) and <strong>Theme G: Cursed Necropolis</strong> (Victorian gothic cemetery mist, spectral ectoplasm, and gargoyle stone borders).
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-red-500" /> Theme H (Upside Down)
              </span>
              <span className="flex items-center gap-1.5">
                <Skull className="w-4 h-4 text-emerald-400" /> Theme G (Horror)
              </span>
            </div>
          </div>

          <div className="w-full lg:w-96 p-6 rounded-2xl bg-black/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-red-400 font-bold">MIND FLAYER BOSS</span>
              <span className="text-slate-400">375 / 500 HP</span>
            </div>
            <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full w-3/4" />
            </div>
            <p className="text-[11px] text-slate-400 italic">
              "Master Database Normalization to strike down the shadow monster."
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
              <span className="text-yellow-400 flex items-center gap-1">
                <Coins className="w-3 h-3" /> +150 Gold
              </span>
              <span className="text-cyan-400 flex items-center gap-1">
                <Zap className="w-3 h-3" /> +300 XP
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ready Call to Action */}
      <section className="text-center max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Begin Your Life RPG Journey Today
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Join founders and governors turning daily discipline into legendary cities.
        </p>
        <button
          onClick={() => setActiveTab('signup')}
          className={`mt-6 px-8 py-3.5 rounded-2xl text-sm font-bold ${btnPrimary}`}
        >
          Charter Your City For Free
        </button>
      </section>

    </article>
  );
}
