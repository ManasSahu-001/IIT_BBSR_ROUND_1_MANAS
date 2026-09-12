import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { api } from '../../utils/api.js';
import QuestCard from '../../components/quests/QuestCard.jsx';
import CreateQuestModal from '../../components/quests/CreateQuestModal.jsx';
import AIQuestMasterModal from '../../components/campaigns/AIQuestMasterModal.jsx';
import { Plus, Wand2, Filter, Search, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function QuestsPage() {
  const { progression, updateProgression } = useAuth();
  const { isUpsideDown, isHaunted, cardBg, btnPrimary } = useTheme();
  
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, completed
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  const fetchQuests = async () => {
    try {
      const data = await api.get('/quests');
      if (data.success) {
        setQuests(data.quests);
      }
    } catch (err) {
      console.error('Failed to load quests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  const handleQuestComplete = async (questId) => {
    try {
      const data = await api.post(`/quests/${questId}/complete`);
      if (data.success) {
        updateProgression(data.progression);
        setQuests((prev) =>
          prev.map((q) => (q.id === questId ? { ...q, is_completed: true } : q))
        );
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleQuestDelete = async (questId) => {
    try {
      const data = await api.delete(`/quests/${questId}`);
      if (data.success) {
        setQuests((prev) => prev.filter((q) => q.id !== questId));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleQuestCreated = (newQuest) => {
    setQuests((prev) => [newQuest, ...prev]);
  };

  const handleCampaignForged = (campaignData) => {
    fetchQuests();
  };

  const filteredQuests = quests.filter((q) => {
    if (statusFilter === 'active' && q.is_completed) return false;
    if (statusFilter === 'completed' && !q.is_completed) return false;
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
    if (search.trim() && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            QUEST BOARD & EXPEDITIONS
          </span>
          <h2 className={`text-2xl sm:text-3xl font-black ${
            isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
          }`}>
            Active Quests & Directives
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete daily quests to gain authoritative XP, expand city borders, and strike down campaign bosses.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-950/60 border border-purple-600/60 text-purple-300 hover:bg-purple-900/50 transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Quest Master</span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold ${btnPrimary}`}
          >
            <Plus className="w-4 h-4" />
            <span>Forge Quest</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${cardBg}`}>
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
          {[
            { id: 'all', label: 'All Quests' },
            { id: 'active', label: 'In Progress' },
            { id: 'completed', label: 'Accomplished' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                statusFilter === tab.id
                  ? isUpsideDown ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quests..."
              className="bg-black/60 border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 w-44 sm:w-56"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="all">All Departments</option>
            <option value="coding">Technology</option>
            <option value="study">Knowledge</option>
            <option value="fitness">Strength</option>
            <option value="wellness">Wellness</option>
            <option value="finance">Economy</option>
            <option value="creative">Culture</option>
            <option value="social">Community</option>
          </select>
        </div>
      </div>

      {/* Quests Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono animate-pulse">
          Scanning quest scrolls and radio frequency archives...
        </div>
      ) : filteredQuests.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${cardBg}`}>
          <CheckCircle2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <h3 className="text-base font-bold text-slate-300">No Quests in this Category</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Ready to conquer your goals? Forge a custom quest manually or let the AI Quest Master synthesize a campaign.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={handleQuestComplete}
              onDelete={handleQuestDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateQuestModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onQuestCreated={handleQuestCreated}
      />

      <AIQuestMasterModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onCampaignForged={handleCampaignForged}
      />

    </div>
  );
}
