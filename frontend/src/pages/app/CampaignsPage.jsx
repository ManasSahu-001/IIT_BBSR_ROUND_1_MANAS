import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { api } from '../../utils/api.js';
import BossArenaView from '../../components/campaigns/BossArenaView.jsx';
import QuestCard from '../../components/quests/QuestCard.jsx';
import AIQuestMasterModal from '../../components/campaigns/AIQuestMasterModal.jsx';
import { ShieldAlert, Wand2, Trophy, Target, ArrowRight, Sparkles } from 'lucide-react';

export default function CampaignsPage() {
  const { progression, updateProgression } = useAuth();
  const { isUpsideDown, isHaunted, cardBg, btnPrimary } = useTheme();

  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastDamage, setLastDamage] = useState(null);
  const [isAIOpen, setIsAIOpen] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const data = await api.get('/campaigns');
      if (data.success) {
        setCampaigns(data.campaigns);
        if (data.campaigns.length > 0) {
          // Select first active campaign or the first one
          const current = data.campaigns.find(c => c.status === 'active') || data.campaigns[0];
          setActiveCampaign(current);
        }
      }
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleQuestComplete = async (questId) => {
    try {
      const data = await api.post(`/quests/${questId}/complete`);
      if (data.success) {
        updateProgression(data.progression);
        if (data.bossBattle) {
          setLastDamage(data.bossBattle);
        }
        // Refresh campaign state
        fetchCampaigns();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCampaignForged = (newCampaignData) => {
    fetchCampaigns();
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-mono animate-pulse">
        Entering dimensional boss rift and decoding campaign archives...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            STRATEGIC OBJECTIVES & BOSS ENCOUNTERS
          </span>
          <h2 className={`text-2xl sm:text-3xl font-black ${
            isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
          }`}>
            Campaigns & Boss Arenas
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Break massive real-life milestones into disciplined quest chains guarded by towering RPG bosses.
          </p>
        </div>

        <button
          onClick={() => setIsAIOpen(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold ${btnPrimary}`}
        >
          <Wand2 className="w-4 h-4" />
          <span>Forge Campaign with AI</span>
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${cardBg}`}>
          <ShieldAlert className="w-12 h-12 mx-auto text-slate-500 mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-white mb-1">No Active Campaigns</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            Enter a real-life goal (e.g. "Prepare for DBMS exam") and let the AI Quest Master forge a structured campaign and Boss.
          </p>
          <button
            onClick={() => setIsAIOpen(true)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold ${btnPrimary}`}
          >
            Forge First Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Campaigns Selector & Overview */}
          <div className="space-y-4 lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Your Campaigns ({campaigns.length})
            </h3>

            <div className="space-y-3">
              {campaigns.map((camp) => {
                const isSelected = activeCampaign?.id === camp.id;
                const isCompleted = camp.status === 'completed';

                return (
                  <div
                    key={camp.id}
                    onClick={() => { setActiveCampaign(camp); setLastDamage(null); }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? isUpsideDown
                          ? 'bg-red-950/60 border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                          : 'bg-emerald-950/60 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                        : `${cardBg} hover:border-white/20`
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        Goal: {camp.real_life_goal.slice(0, 25)}...
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800">
                          COMPLETED
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">{camp.title}</h4>
                    
                    {/* Progress */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{camp.completed_quests} / {camp.total_quests} Quests Done</span>
                      <span className="text-amber-400 font-bold">
                        {Math.round((camp.completed_quests / Math.max(1, camp.total_quests)) * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Boss Battle Arena & Linked Quests */}
          <div className="space-y-6 lg:col-span-2">
            {activeCampaign && (
              <>
                {/* Active Campaign Boss Arena */}
                <BossArenaView
                  boss={activeCampaign.boss}
                  lastDamage={lastDamage}
                />

                {/* Linked Quest Chain */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                      Campaign Quest Chain ({activeCampaign.quests.length})
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Completing these quests inflicts direct damage to the boss
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeCampaign.quests.map((quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        onComplete={handleQuestComplete}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      )}

      {/* AI Modal */}
      <AIQuestMasterModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onCampaignForged={handleCampaignForged}
      />

    </div>
  );
}
