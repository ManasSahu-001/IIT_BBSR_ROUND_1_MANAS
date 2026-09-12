import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { ShieldAlert, Skull, Flame, Zap, Trophy, HeartPulse } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BossArenaView({ boss, lastDamage, onBossDefeated }) {
  const { isUpsideDown, isHaunted, cardBg } = useTheme();
  const [animatingDamage, setAnimatingDamage] = useState(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (lastDamage && lastDamage.damageDealt > 0) {
      setAnimatingDamage(lastDamage.damageDealt);
      setShake(true);

      const timer = setTimeout(() => {
        setAnimatingDamage(null);
        setShake(false);
      }, 1000);

      if (lastDamage.isDefeated) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: isUpsideDown ? ['#ff0f3f', '#06b6d4', '#fbbf24'] : ['#10b981', '#a855f7', '#fbbf24']
        });
      }

      return () => clearTimeout(timer);
    }
  }, [lastDamage]);

  if (!boss) {
    return (
      <div className={`rounded-2xl p-6 text-center border ${cardBg}`}>
        <ShieldAlert className="w-10 h-10 mx-auto text-slate-500 mb-2 animate-pulse" />
        <h3 className="text-sm font-semibold text-slate-300">No Active Boss Threat</h3>
        <p className="text-xs text-slate-500 mt-1">Forge an AI Campaign to summon an interdimensional boss manifestation.</p>
      </div>
    );
  }

  const hpPercent = Math.max(0, Math.min(100, Math.round((boss.current_hp / boss.max_hp) * 100)));
  const isCritical = hpPercent <= 25 && !boss.is_defeated;

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 border transition-all ${cardBg} ${
      shake ? 'animate-boss-shake' : ''
    }`}>
      {/* Background Glow / Atmosphere */}
      <div className={`absolute inset-0 pointer-events-none opacity-20 ${
        isUpsideDown
          ? 'bg-radial-at-t from-red-600/30 via-transparent to-transparent'
          : 'bg-radial-at-t from-emerald-600/30 via-transparent to-transparent'
      }`} />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${
            isUpsideDown ? 'bg-red-950/80 border-red-700/60 text-red-400' : 'bg-emerald-950/80 border-emerald-700/60 text-emerald-400'
          }`}>
            {isUpsideDown ? <Zap className="w-5 h-5 animate-pulse" /> : <Skull className="w-5 h-5 animate-pulse" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                CAMPAIGN NEMESIS
              </span>
              {boss.is_defeated ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                  <Trophy className="w-2.5 h-2.5" /> VANQUISHED
                </span>
              ) : (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isCritical ? 'bg-red-900/80 text-red-200 border-red-500 animate-pulse' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {isCritical ? 'CRITICAL HP' : 'ACTIVE THREAT'}
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-wide text-white font-benguiat">
              {boss.title}
            </h3>
          </div>
        </div>

        {/* Boss HP Numeric */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-xs font-mono font-bold">
            <HeartPulse className={`w-3.5 h-3.5 ${isCritical ? 'text-red-500 animate-bounce' : 'text-slate-400'}`} />
            <span className={boss.is_defeated ? 'text-slate-500 line-through' : 'text-white'}>
              {boss.current_hp} / {boss.max_hp} HP
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">{hpPercent}% Vitality</span>
        </div>
      </div>

      {/* Floating Damage Number */}
      {animatingDamage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none animate-damage-float">
          <span className="text-3xl sm:text-4xl font-black text-yellow-300 drop-shadow-[0_0_12px_rgba(234,179,8,1)] font-mono">
            -{animatingDamage} HP!
          </span>
        </div>
      )}

      {/* Dynamic Visual Sprite / Graphic Arena */}
      <div className={`relative h-44 rounded-xl flex items-center justify-center border overflow-hidden my-3 ${
        isUpsideDown
          ? 'bg-gradient-to-b from-[#0e0716] via-[#160b1e] to-[#08030d] border-red-950/80'
          : 'bg-gradient-to-b from-[#081512] via-[#0d1e19] to-[#050d0a] border-emerald-950/80'
      }`}>
        {/* Animated Tendrils / Mist in Background */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent" />

        {isUpsideDown ? (
          /* Mind Flayer Shadow Monster Silhouette with Glowing Red Core */
          <div className="relative flex flex-col items-center select-none">
            <div className={`relative transition-all duration-300 ${
              boss.is_defeated ? 'opacity-30 grayscale scale-90' : 'scale-100 hover:scale-105'
            }`}>
              <svg className="w-28 h-28 text-red-600 drop-shadow-[0_0_25px_rgba(255,15,63,0.8)]" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 10 C30 10, 20 25, 20 40 C10 42, 5 50, 10 60 C15 70, 25 65, 30 75 C35 85, 45 90, 50 85 C55 90, 65 85, 70 75 C75 65, 85 70, 90 60 C95 50, 90 42, 80 40 C80 25, 70 10, 50 10 Z" />
                <circle cx="42" cy="35" r="3.5" fill="#fef08a" />
                <circle cx="58" cy="35" r="3.5" fill="#fef08a" />
              </svg>
              {/* Pulsing Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-500/40 animate-ping" />
              </div>
            </div>
            <p className="text-[11px] font-mono text-red-300 mt-2 font-bold tracking-widest uppercase">
              {boss.is_defeated ? 'SHADOW DISSIPATED' : 'FEEDING ON PROCRASTINATION'}
            </p>
          </div>
        ) : (
          /* Eldritch Lich Necropolis Silhouette with Spectral Flame */
          <div className="relative flex flex-col items-center select-none">
            <div className={`relative transition-all duration-300 ${
              boss.is_defeated ? 'opacity-30 grayscale scale-90' : 'scale-100 hover:scale-105'
            }`}>
              <svg className="w-28 h-28 text-emerald-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.8)]" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 12 C35 12, 32 26, 30 38 C24 44, 20 54, 22 66 C24 78, 36 84, 50 84 C64 84, 76 78, 78 66 C80 54, 76 44, 70 38 C68 26, 65 12, 50 12 Z" />
                <circle cx="40" cy="38" r="4" fill="#a7f3d0" />
                <circle cx="60" cy="38" r="4" fill="#a7f3d0" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/40 animate-ping" />
              </div>
            </div>
            <p className="text-[11px] font-mono text-emerald-300 mt-2 font-bold tracking-widest uppercase">
              {boss.is_defeated ? 'CURSE BROKEN' : 'CASTING PROCRASTINATION HEX'}
            </p>
          </div>
        )}
      </div>

      {/* Health Bar */}
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              boss.is_defeated
                ? 'bg-slate-700 w-0'
                : isUpsideDown
                  ? isCritical ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-red-600 to-amber-500'
                  : isCritical ? 'bg-rose-600 animate-pulse' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* Boss Description */}
      <p className="text-xs text-slate-400 mt-3 italic leading-relaxed">
        "{boss.description}"
      </p>

      {/* Rewards Spoils Banner */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono text-[11px] text-slate-500 uppercase">Victory Spoils:</span>
        <div className="flex items-center gap-3 font-semibold text-slate-300">
          <span className="text-amber-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> +{boss.reward_gold || 200} Gold
          </span>
          <span className="text-cyan-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> +{boss.reward_xp || 450} XP
          </span>
        </div>
      </div>
    </div>
  );
}
