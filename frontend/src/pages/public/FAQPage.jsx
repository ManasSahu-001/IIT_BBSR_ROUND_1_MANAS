import React from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const { isUpsideDown, isHaunted, cardBg } = useTheme();

  const faqs = [
    {
      q: 'Does Build Your City store data permanently, or does it vanish on browser refresh?',
      a: 'All data is persistently committed to an authoritative PostgreSQL 18 database with relational integrity and user isolation. Your quests, boss damage, streaks, XP, and constructed buildings remain safe across device reboots and browser refreshes.'
    },
    {
      q: 'Can the frontend tamper with or cheat my XP and Gold rewards?',
      a: 'Never. The backend acts as the sole game authority. Quests validate rewards and streak boundaries server-side using strict PostgreSQL transactions. The client cannot forge levels, gold, or boss damage.'
    },
    {
      q: 'What happens if the AI Quest Master provider is offline or rate-limited?',
      a: 'Our architecture includes a built-in Procedural RPG Quest Forge fallback. If an external AI API fails or is unconfigured, the system automatically detects keywords in your goal and constructs a high-flavor campaign with 100% uptime and zero crashes.'
    },
    {
      q: 'How does the non-linear XP curve work?',
      a: 'We use the formula: requiredXP = floor(100 * level^1.5). This ensures that while early levels feel breezy and rewarding, subsequent levels demand genuine focus and consistency, mirroring real-life skill progression.'
    },
    {
      q: 'Are the audio effects heavy to download?',
      a: 'No. All audio cues are synthesized in real-time through the browser’s native Web Audio API using pure oscillator frequencies. There are zero external audio files to download, resulting in instant 60fps performance.'
    }
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      <header className="text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
          ANSWERS & ARCHITECTURE
        </span>
        <h1 className={`text-3xl sm:text-5xl font-black mt-2 ${
          isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
        }`}>
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
          Everything you need to know about the RPG mechanics, backend authority, and persistent persistence.
        </p>
      </header>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <section key={i} className={`p-6 rounded-2xl border ${cardBg}`}>
            <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <HelpCircle className={`w-4 h-4 shrink-0 ${isUpsideDown ? 'text-red-400' : 'text-emerald-400'}`} />
              <span>{faq.q}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
              {faq.a}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
