import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { api } from '../../utils/api.js';
import { soundFx } from '../../utils/sound.js';
import { 
  Building2, 
  Users, 
  Coins, 
  Trophy, 
  Hammer, 
  Cpu, 
  BookOpen, 
  Dumbbell, 
  Heart, 
  Landmark, 
  Palette, 
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CityCanvasView() {
  const { user, progression, updateProgression } = useAuth();
  const { isUpsideDown, isHaunted, cardBg, btnPrimary } = useTheme();
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [constructingKey, setConstructingKey] = useState(null);
  const [message, setMessage] = useState('');

  const fetchCity = async () => {
    try {
      const data = await api.get('/city');
      if (data.success) {
        setCityData(data);
      }
    } catch (err) {
      console.error('Failed to load city data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCity();
  }, []);

  const handleConstruct = async (buildingKey) => {
    setConstructingKey(buildingKey);
    soundFx.playClick();

    try {
      const data = await api.post('/city/construct', { buildingKey });
      if (data.success) {
        soundFx.playLevelUp();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
        setMessage(data.message);
        updateProgression({ gold: data.newGold });
        fetchCity();
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setConstructingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono animate-pulse">
        Surveying territorial blueprints and urban districts...
      </div>
    );
  }

  const districtsConfig = [
    { key: 'technology', label: 'Technology District', icon: Cpu, color: 'text-cyan-400' },
    { key: 'knowledge', label: 'Knowledge Academy', icon: BookOpen, color: 'text-blue-400' },
    { key: 'strength', label: 'Strength & Defense', icon: Dumbbell, color: 'text-red-400' },
    { key: 'wellness', label: 'Sanctuary of Wellness', icon: Heart, color: 'text-emerald-400' },
    { key: 'economy', label: 'Treasury & Commerce', icon: Landmark, color: 'text-amber-400' },
    { key: 'culture', label: 'Cultural Arts', icon: Palette, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* City Overview Hero Card */}
      <div className={`rounded-2xl p-6 sm:p-8 border relative overflow-hidden ${cardBg}`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                METROPOLITAN CHARTER
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isUpsideDown ? 'bg-red-950/60 text-red-300 border-red-800' : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
              }`}>
                {cityData.levelInfo.cityTier}
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black ${
              isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
            }`}>
              {cityData.cityName}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Governed by <strong className="text-slate-200">{cityData.governorTitle}</strong> • {cityData.levelInfo.cityTitle}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 sm:gap-6 bg-black/40 border border-white/10 p-4 rounded-xl">
            <div>
              <span className="block text-[10px] uppercase font-mono text-slate-400">City Level</span>
              <span className="text-xl font-bold text-amber-400">{cityData.levelInfo.level}</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="block text-[10px] uppercase font-mono text-slate-400">Population</span>
              <div className="flex items-center gap-1 text-xl font-bold text-cyan-400">
                <Users className="w-4 h-4" />
                <span>{cityData.population.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="block text-[10px] uppercase font-mono text-slate-400">Treasury</span>
              <div className="flex items-center gap-1 text-xl font-bold text-yellow-400">
                <Coins className="w-4 h-4" />
                <span>{cityData.gold} G</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-600 text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* City Districts Grid */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 font-mono">
          Erected Districts & Infrastructure
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {districtsConfig.map((dist) => {
            const buildings = cityData.districts[dist.key] || [];
            const Icon = dist.icon;

            return (
              <div key={dist.key} className={`rounded-xl p-5 border ${cardBg}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${dist.color}`} />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      {dist.label}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {buildings.length} Structures
                  </span>
                </div>

                {buildings.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    No buildings erected in this district yet. Unlock below.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {buildings.map((b) => (
                      <li key={b.id} className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 text-xs">
                        <span className="font-semibold text-slate-200">{b.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
                          Tier {b.tier}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Construction Blueprints Catalog */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
              Urban Blueprints & Expansion Catalog
            </h3>
            <p className="text-xs text-slate-400">Construct buildings with your earned quest gold to boost city population & prestige.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cityData.catalog.map((item) => (
            <div key={item.key} className={`rounded-xl p-5 border flex flex-col justify-between ${cardBg}`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {item.district}
                  </span>
                  <span className="text-xs font-bold text-yellow-400 flex items-center gap-1 font-mono">
                    <Coins className="w-3.5 h-3.5" /> {item.cost} Gold
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
                <p className="text-xs text-slate-400 mb-3">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  Req. Level {item.minLevel}
                </span>

                {item.isUnlocked ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Built
                  </span>
                ) : !item.meetsLevel ? (
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Level {item.minLevel} Locked
                  </span>
                ) : (
                  <button
                    onClick={() => handleConstruct(item.key)}
                    disabled={!item.canAfford || constructingKey === item.key}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      item.canAfford ? btnPrimary : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Hammer className="w-3.5 h-3.5" />
                    <span>{constructingKey === item.key ? 'Erecting...' : 'Construct'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
