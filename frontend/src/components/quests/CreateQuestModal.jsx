import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { api } from '../../utils/api.js';
import { soundFx } from '../../utils/sound.js';
import { X, Plus, Zap, Coins, ShieldAlert } from 'lucide-react';

export default function CreateQuestModal({ isOpen, onClose, onQuestCreated }) {
  const { isUpsideDown, isHaunted, cardBg, btnPrimary } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('study');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const rewardPreview = {
    easy: { xp: 25, gold: 10, bossDamage: 25 },
    medium: { xp: 60, gold: 25, bossDamage: 60 },
    hard: { xp: 125, gold: 60, bossDamage: 125 },
    epic: { xp: 300, gold: 150, bossDamage: 300 }
  }[difficulty];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for the quest.');
      return;
    }

    setLoading(true);
    soundFx.playClick();

    try {
      const data = await api.post('/quests', {
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty
      });

      if (data.success) {
        soundFx.playClick();
        onQuestCreated(data.quest);
        onClose();
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      setError(err.message || 'Failed to create quest.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-lg rounded-2xl p-6 sm:p-8 border shadow-2xl relative transition-all ${cardBg}`}>
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className={`text-xl font-black mb-1 ${
          isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
        }`}>
          FORGE NEW QUEST
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Turn your real-world productivity task into an authoritative RPG challenge.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Quest Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Study 3NF & BCNF Decomposition"
              className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Description (Optional):
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specific details or sub-steps to complete..."
              rows={2}
              className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
                Department / Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/80 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="coding">Technology (Coding)</option>
                <option value="study">Knowledge (Study)</option>
                <option value="fitness">Strength (Fitness)</option>
                <option value="wellness">Wellness (Mental Health)</option>
                <option value="finance">Economy (Finance)</option>
                <option value="creative">Culture (Creative Work)</option>
                <option value="social">Community (Social)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
                Difficulty Tier:
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-black/80 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="easy">Easy (Quick win)</option>
                <option value="medium">Medium (Focused effort)</option>
                <option value="hard">Hard (Deep grind)</option>
                <option value="epic">Epic (Master challenge)</option>
              </select>
            </div>
          </div>

          {/* Authoritative Rewards Preview */}
          <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-around text-xs font-mono font-bold">
            <span className="text-cyan-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> +{rewardPreview.xp} XP
            </span>
            <span className="text-yellow-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> +{rewardPreview.gold} Gold
            </span>
            <span className="text-red-400 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> -{rewardPreview.bossDamage} Boss Dmg
            </span>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${btnPrimary}`}
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Forging Quest...' : 'Create Quest'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
