import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { api } from '../../utils/api.js';
import QuestCard from '../../components/quests/QuestCard.jsx';
import BossArenaView from '../../components/campaigns/BossArenaView.jsx';
import AIQuestMasterModal from '../../components/campaigns/AIQuestMasterModal.jsx';
import CreateQuestModal from '../../components/quests/CreateQuestModal.jsx';
import { 
  Flame, 
  Coins, 
  Users, 
  Trophy, 
  Wand2, 
  Plus, 
  ArrowRight, 
  ShieldAlert, 
  Compass, 
  Building2,
  Cpu,
  BookOpen,
  Dumbbell,
  Heart,
  Landmark,
  Palette
} from 'lucide-react';

export default function DashboardPage({ setActiveTab }) {
  const { user, progression, updateProgression } = useAuth();
  const { isUpsideDown, isHaunted, cardBg, btnPrimary } = useTheme();

  const [quests, setQuests] = useState([]);
  const [activeBoss, setActiveBoss] = useState(null);
  const [cityOverview, setCityOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastDamage, setLastDamage] = useState(null);

  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [questsRes, campRes, cityRes] = await Promise.all([
        api.get('/quests?status=active'),
        api.get('/campaigns'),
        api.get('/city')
      ]);

      if (questsRes.success) setQuests(questsRes.quests.slice(0, 4));
      if (campRes.success && campRes.campaigns.length > 0) {
        const activeCamp = campRes.campaigns.find(c => c.status === 'active') || campRes.campaigns[0];
        setActiveBoss(activeCamp?.boss || null);
      }
      if (cityRes.success) setCityOverview(cityRes);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuestComplete = async (questId) => {
    try {
      const data = await api.post(`/quests/${questId}/complete`);
      if (data.success) {
        updateProgression(data.progression);
        if (data.bossBattle) {
          setLastDamage(data.bossBattle);
          if (activeBoss) {
            setActiveBoss(prev => ({
              ...prev,
              current_hp: data.bossBattle.currentHp,
              is_defeated: data.bossBattle.isDefeated
            }));
          }
        }
        setQuests(prev => prev.filter(q => q.id !== questId));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-mono animate-pulse">
        Initializing command headquarters and syncing satellite telemetry...
      </div>
    );
  }

  const attributes = [
    { label: 'Technology', val: progression?.tech_xp || 0, icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500' },
    { label: 'Knowledge', val: progression?.knowledge_xp || 0, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500' },
    { label: 'Strength', val: progression?.strength_xp || 0, icon: Dumbbell, color: 'text-red-400', bg: 'bg-red-500' },
    { label: 'Wellness', val: progression?.wellness_xp || 0, icon: Heart, color: 'text-emerald-400', bg: 'bg-emerald-500' },
    { label: 'Economy', val: progression?.economy_xp || 0, icon: Landmark, color: 'text-amber-400', bg: 'bg-amber-500' },
    { label: 'Culture', val: progression?.culture_xp || 0, icon: Palette, color: 'text-purple-400', bg: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Command Banner */}
      <div className={`rounded-2xl p-6 sm:p-8 border relative overflow-hidden ${cardBg}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                HEADQUARTERS COMMAND
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isUpsideDown ? 'bg-red-950/60 text-red-300 border-red-800' : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
              }`}>
                {progression?.cityTier || 'Small Settlement'}
              </span>
            </div>

            <h1 className={`text-2xl sm:text-4xl font-black ${
              isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
            }`}>
              Welcome, Governor {user?.username}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Your real-life productivity is actively expanding <strong className="text-white">{user?.city_name}</strong>. Complete quests to gain non-linear XP, maintain population streaks, and defend against looming dimensional entities.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAIOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-950/70 border border-purple-600/70 text-purple-200 hover:bg-purple-900/60 transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            >
              <Wand2 className="w-4 h-4" />
              <span>AI Quest Master</span>
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold ${btnPrimary}`}
            >
              <Plus className="w-4 h-4" />
              <span>Forge Quest</span>
            </button>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-400">City Level {progression?.level || 1}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{progression?.cityTitle}</span>
            </div>
            <span className="text-slate-400">
              {progression?.currentLevelXP || 0} / {progression?.nextLevelRequiredXP || 100} XP ({progression?.progressPercent || 0}%)
            </span>
          </div>

          <div className="h-2.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isUpsideDown 
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 shadow-[0_0_8px_#ef4444]' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_#10b981]'
              }`}
              style={{ width: `${progression?.progressPercent || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3 Metric Cards: Streak, Population, Treasury */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Streak */}
        <div className={`p-5 rounded-xl border flex items-center gap-4 ${cardBg}`}>
          <div className="p-3 rounded-xl bg-orange-950/60 border border-orange-700/60 text-orange-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono text-slate-400 font-semibold">Active Streak</span>
            <span className="text-xl font-black text-orange-300 font-mono">
              {progression?.current_streak || 0} Days
            </span>
            <span className="block text-[11px] text-slate-500">Record: {progression?.longest_streak || 0} days</span>
          </div>
        </div>

        {/* Population */}
        <div className={`p-5 rounded-xl border flex items-center gap-4 ${cardBg}`}>
          <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-700/60 text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono text-slate-400 font-semibold">Population</span>
            <span className="text-xl font-black text-cyan-300 font-mono">
              {(progression?.population || 100).toLocaleString()}
            </span>
            <span className="block text-[11px] text-slate-500">Growing with daily habits</span>
          </div>
        </div>

        {/* Treasury */}
        <div className={`p-5 rounded-xl border flex items-center gap-4 ${cardBg}`}>
          <div className="p-3 rounded-xl bg-yellow-950/60 border border-yellow-700/60 text-yellow-400">
            <Coins className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono text-slate-400 font-semibold">City Treasury</span>
            <span className="text-xl font-black text-yellow-300 font-mono">
              {progression?.gold || 0} Gold
            </span>
            <span className="block text-[11px] text-slate-500">Ready for urban blueprints</span>
          </div>
        </div>
      </div>

      {/* Dual Section: Active Boss Nemesis & Department Attributes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Boss Threat */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Current Dimensional Threat</span>
            </h3>
            <button
              onClick={() => setActiveTab('campaigns')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View Campaigns</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <BossArenaView
            boss={activeBoss}
            lastDamage={lastDamage}
          />
        </div>

        {/* Department Attributes Radar / Gauges */}
        <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            Department Attributes
          </h3>

          <div className="space-y-3">
            {attributes.map((attr) => (
              <div key={attr.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                    <attr.icon className={`w-3.5 h-3.5 ${attr.color}`} />
                    {attr.label}
                  </span>
                  <span className="font-mono text-slate-400 font-bold">{attr.val} XP</span>
                </div>
                <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${attr.bg}`}
                    style={{ width: `${Math.min(100, (attr.val / 200) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 text-center">
            <button
              onClick={() => setActiveTab('city')}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 w-full py-1 font-semibold"
            >
              <span>Inspect City Districts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Immediate Quests Priority Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
              Priority Quests ({quests.length})
            </h3>
            <p className="text-xs text-slate-500">Immediate directives ready for action.</p>
          </div>

          <button
            onClick={() => setActiveTab('quests')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>All Quests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {quests.length === 0 ? (
          <div className={`p-8 text-center rounded-xl border ${cardBg}`}>
            <p className="text-xs text-slate-400 mb-3">All priority directives accomplished for now!</p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${btnPrimary}`}
            >
              Forge New Quest
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onComplete={handleQuestComplete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AIQuestMasterModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onCampaignForged={() => fetchDashboardData()}
      />

      <CreateQuestModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onQuestCreated={() => fetchDashboardData()}
      />

    </div>
  );
}
