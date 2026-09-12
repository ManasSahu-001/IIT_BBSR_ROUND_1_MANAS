import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { soundFx } from '../../utils/sound.js';
import { 
  CheckCircle, 
  Circle, 
  Flame, 
  Coins, 
  Zap, 
  ShieldAlert, 
  Trash2, 
  Sparkles, 
  Clock,
  Skull
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuestCard({ quest, onComplete, onDelete }) {
  const { isUpsideDown, isHaunted, cardBg } = useTheme();
  const [completing, setCompleting] = useState(false);

  const difficultyColors = {
    easy: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
    medium: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
    hard: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
    epic: 'text-purple-400 bg-purple-950/60 border-purple-800/60',
  };

  const handleCompleteClick = async () => {
    if (quest.is_completed || completing) return;
    setCompleting(true);
    soundFx.playQuestComplete();

    // Trigger micro-confetti
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.75 },
      colors: isUpsideDown ? ['#ff0f3f', '#06b6d4', '#fbbf24'] : ['#10b981', '#a855f7', '#fbbf24']
    });

    try {
      await onComplete(quest.id);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className={`relative group rounded-2xl p-5 border transition-all duration-300 ${cardBg} ${
      quest.is_completed ? 'opacity-65 grayscale-[0.3]' : 'hover:scale-[1.01]'
    }`}>
      
      {/* Top Banner: Category & Difficulty */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          {/* Theme Visual Cue: Christmas Light (Theme H) or Candle Flame (Theme G) */}
          {isUpsideDown ? (
            <div 
              className={`w-3 h-3 rounded-full border shadow-sm transition-all ${
                quest.is_completed 
                  ? 'bg-slate-700 border-slate-600' 
                  : 'bg-red-500 border-red-300 shadow-[0_0_8px_#ef4444] animate-pulse'
              }`}
              title="Hawkins Alphabet Light Node"
            />
          ) : (
            <div 
              className={`w-3 h-3 rounded-full border shadow-sm transition-all ${
                quest.is_completed 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-emerald-400 border-emerald-200 shadow-[0_0_8px_#34d399] animate-pulse'
              }`}
              title="Necropolis Grave Flame"
            />
          )}

          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            {quest.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
            difficultyColors[quest.difficulty] || difficultyColors.medium
          }`}>
            {quest.difficulty}
          </span>

          {onDelete && !quest.is_completed && (
            <button
              onClick={() => onDelete(quest.id)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-white/5 transition-all"
              title="Abandon Quest"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quest Title & Description */}
      <div className="mb-4">
        <h4 className={`text-base font-bold tracking-tight text-white mb-1 ${
          quest.is_completed ? 'line-through text-slate-400' : ''
        }`}>
          {quest.title}
        </h4>
        {quest.description && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {quest.description}
          </p>
        )}
      </div>

      {/* Reward Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
        <div className="flex items-center gap-2.5 font-mono text-[11px]">
          <span className="text-cyan-400 font-bold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> +{quest.xp_reward} XP
          </span>
          <span className="text-yellow-400 font-bold flex items-center gap-1">
            <Coins className="w-3.5 h-3.5" /> +{quest.gold_reward} G
          </span>
          {quest.campaign_id && (
            <span className="text-red-400 font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> -{quest.boss_damage || quest.xp_reward} HP
            </span>
          )}
        </div>

        {/* Completion Action Button */}
        {quest.is_completed ? (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40">
            <CheckCircle className="w-3.5 h-3.5" /> Accomplished
          </span>
        ) : (
          <button
            onClick={handleCompleteClick}
            disabled={completing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              isUpsideDown
                ? 'bg-red-600/90 hover:bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                : 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
            }`}
          >
            {completing ? (
              <span className="animate-pulse">Forging...</span>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5" />
                <span>Complete Quest</span>
              </>
            )}
          </button>
        )}
      </div>

    </div>
  );
}
