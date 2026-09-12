import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { api } from '../../utils/api.js';
import { soundFx } from '../../utils/sound.js';
import { Sparkles, X, Wand2, ShieldAlert, CheckCircle2, Flame, Loader2 } from 'lucide-react';

export default function AIQuestMasterModal({ isOpen, onClose, onCampaignForged }) {
  const { isUpsideDown, isHaunted, cardBg, btnPrimary } = useTheme();
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const quickGoals = [
    'Conquer my DBMS semester exam in 2 weeks',
    'Build and launch a full-stack SaaS app',
    'Train and run a 5k outdoor marathon',
    'Master advanced TypeScript and design patterns',
    'Read 2 books and summarize chapter insights'
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!goal.trim()) {
      setError('Please provide a real-life goal for the Quest Master to forge.');
      return;
    }

    setError('');
    setLoading(true);
    soundFx.playClick();

    try {
      const data = await api.post('/campaigns/generate', { goal: goal.trim() });
      if (data.success) {
        soundFx.playLevelUp();
        onCampaignForged(data);
        onClose();
        setGoal('');
      } else {
        setError(data.error || 'Failed to forge campaign.');
      }
    } catch (err) {
      setError(err.message || 'Quest Master was unable to connect. Check backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-xl rounded-2xl p-6 sm:p-8 border shadow-2xl relative transition-all ${cardBg}`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-2xl border ${
            isUpsideDown ? 'bg-red-950/80 border-red-700/60 text-red-400' : 'bg-emerald-950/80 border-emerald-700/60 text-emerald-400'
          }`}>
            <Wand2 className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h2 className={`text-xl sm:text-2xl font-black ${
              isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
            }`}>
              AI QUEST MASTER
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Transform any real-world ambition into a structured RPG Campaign, Quest Chain, & Boss.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 font-mono">
              Declare Your Real-Life Objective:
            </label>
            <textarea
              value={goal}
              onChange={(e) => { setGoal(e.target.value); setError(''); }}
              placeholder="e.g. Master Database Normalization & Indexing for my university finals..."
              rows={3}
              disabled={loading}
              className="w-full bg-black/60 border border-white/10 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Quick Suggestions */}
          <div>
            <span className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase">
              Or pick an immediate trial:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickGoals.map((qg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setGoal(qg); setError(''); }}
                  disabled={loading}
                  className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg text-slate-300 transition-all text-left"
                >
                  {qg}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-700/60 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Loading Animation or Submit Button */}
          {loading ? (
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center gap-3 text-sm text-slate-300 font-mono">
              <Loader2 className={`w-5 h-5 animate-spin ${isUpsideDown ? 'text-red-500' : 'text-emerald-400'}`} />
              <span className="animate-pulse">
                {isUpsideDown 
                  ? 'Transmitting objective across Hawkins Radio frequencies...' 
                  : 'Incanting gothic runes in the Cursed Necropolis...'}
              </span>
            </div>
          ) : (
            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${btnPrimary}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Forge RPG Campaign & Boss Battle</span>
            </button>
          )}

        </form>

      </div>
    </div>
  );
}
