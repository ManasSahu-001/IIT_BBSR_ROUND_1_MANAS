import React from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { ArrowRight, CheckCircle2, Target, Wand2, Swords, Building2 } from 'lucide-react';

export default function HowItWorksPage({ setActiveTab }) {
  const { isUpsideDown, isHaunted, cardBg, btnPrimary } = useTheme();

  const steps = [
    {
      step: '01',
      title: 'Set Your Real-Life Goal',
      description: 'Input any academic, professional, creative, or fitness milestone. No goal is too big or too granular.',
      icon: Target
    },
    {
      step: '02',
      title: 'AI Synthesizes Your Campaign & Boss',
      description: 'The Quest Master breaks your ambition down into realistic, scheduled quests and spawns a thematic Boss Nemesis.',
      icon: Wand2
    },
    {
      step: '03',
      title: 'Execute Quests & Deal Boss Damage',
      description: 'Every time you finish real-world work, check off the quest. Watch floating damage numbers strike down the Boss HP and claim Gold.',
      icon: Swords
    },
    {
      step: '04',
      title: 'Construct Buildings & Ascend City Tiers',
      description: 'Spend your treasury on architectural blueprints. Upgrade from a Settlement into a thriving Metropolis with growing population.',
      icon: Building2
    }
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 space-y-12 animate-fade-in">
      <header className="text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
          STEP-BY-STEP BLUEPRINT
        </span>
        <h1 className={`text-3xl sm:text-5xl font-black mt-2 ${
          isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
        }`}>
          How Build Your City Works
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
          From abstract intentions to an unshakeable daily habit loop powered by real RPG progression.
        </p>
      </header>

      <div className="space-y-6">
        {steps.map((s, idx) => (
          <section key={s.step} className={`p-6 sm:p-8 rounded-2xl border flex flex-col sm:flex-row items-start gap-6 ${cardBg}`}>
            <div className={`p-4 rounded-2xl border text-xl font-black font-mono flex items-center justify-center shrink-0 ${
              isUpsideDown ? 'bg-red-950/80 border-red-700/60 text-red-400' : 'bg-emerald-950/80 border-emerald-700/60 text-emerald-400'
            }`}>
              {s.step}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                <s.icon className="w-5 h-5 text-slate-400" />
                <span>{s.title}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {s.description}
              </p>
            </div>
          </section>
        ))}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => setActiveTab('signup')}
          className={`px-8 py-3.5 rounded-2xl text-sm font-bold ${btnPrimary}`}
        >
          Begin Playing Now
        </button>
      </div>
    </article>
  );
}
