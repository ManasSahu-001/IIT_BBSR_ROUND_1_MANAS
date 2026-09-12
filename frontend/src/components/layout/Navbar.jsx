import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme, THEMES } from '../../contexts/ThemeContext.jsx';
import { 
  Flame, 
  Coins, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Skull, 
  Radio, 
  Compass, 
  Building2, 
  Trophy, 
  LogOut, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, progression, logout } = useAuth();
  const { theme, setTheme, isMuted, toggleSound, isUpsideDown, isHaunted, btnPrimary } = useTheme();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-black/60 border-b border-red-950/40 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            isUpsideDown 
              ? 'bg-red-950/80 border border-red-600/60 shadow-[0_0_12px_rgba(239,68,68,0.5)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.8)]'
              : 'bg-emerald-950/80 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.5)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.8)]'
          }`}>
            {isUpsideDown ? (
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            ) : (
              <Skull className="w-5 h-5 text-emerald-400 animate-pulse" />
            )}
          </div>
          <div>
            <span className={`text-lg sm:text-xl font-bold tracking-wider ${
              isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
            }`}>
              BUILD YOUR CITY
            </span>
            <span className="block text-[10px] tracking-widest text-slate-400 uppercase font-mono">
              {isUpsideDown ? 'Hawkins 1984 Edition' : 'Cursed Necropolis Edition'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs (if logged in) */}
        {user ? (
          <nav className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10" aria-label="Main Navigation">
            {[
              { id: 'dashboard', label: 'Command', icon: Compass },
              { id: 'quests', label: 'Quests', icon: Zap },
              { id: 'campaigns', label: 'AI Boss Battles', icon: ShieldAlert },
              { id: 'city', label: 'City Districts', icon: Building2 },
              { id: 'treasury', label: 'Treasury', icon: Coins },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? isUpsideDown
                        ? 'bg-red-900/60 text-red-200 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300" aria-label="Public Navigation">
            <button onClick={() => setActiveTab('features')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => setActiveTab('how-it-works')} className="hover:text-white transition-colors">How It Works</button>
            <button onClick={() => setActiveTab('faq')} className="hover:text-white transition-colors">FAQ</button>
            <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">About</button>
          </nav>
        )}

        {/* Right Section: HUD & Controls */}
        <div className="flex items-center gap-3">
          
          {/* User Progression HUD */}
          {user && progression && (
            <div className="hidden lg:flex items-center gap-3 text-xs bg-black/50 border border-white/10 px-3 py-1.5 rounded-xl">
              {/* Level */}
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <span className="text-[10px] uppercase text-slate-400 font-mono">LVL</span>
                <span className="text-sm">{progression.level || 1}</span>
              </div>
              
              <div className="h-4 w-px bg-white/10" />

              {/* Gold */}
              <div className="flex items-center gap-1 font-semibold text-yellow-400">
                <Coins className="w-3.5 h-3.5 text-yellow-500" />
                <span>{progression.gold || 0}</span>
              </div>

              <div className="h-4 w-px bg-white/10" />

              {/* Streak */}
              <div className="flex items-center gap-1 font-semibold text-orange-400" title="Daily Streak">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
                <span>{progression.current_streak || 0}d</span>
              </div>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute game sounds' : 'Mute game sounds'}
            className="p-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition-all"
            title={isMuted ? 'Unmute procedural audio' : 'Mute procedural audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Theme Switcher Toggle (Theme H <-> Theme G) */}
          <button
            onClick={() => setTheme(isUpsideDown ? THEMES.THEME_G : THEMES.THEME_H)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isUpsideDown
                ? 'bg-red-950/40 border-red-700/60 text-red-300 hover:bg-red-900/50 hover:border-red-500'
                : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/50 hover:border-emerald-500'
            }`}
            title="Switch presentation theme"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isUpsideDown ? 'Upside Down (80s)' : 'Necropolis (Horror)'}
            </span>
          </button>

          {/* Auth Action */}
          {user ? (
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-black/40 border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/50 transition-all"
              title="Logout Governor"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${btnPrimary}`}
              >
                Sign Up
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Navigation Bar */}
      {user && (
        <nav className="flex md:hidden items-center justify-around mt-3 pt-2 border-t border-white/10" aria-label="Mobile Navigation">
          {[
            { id: 'dashboard', label: 'Command', icon: Compass },
            { id: 'quests', label: 'Quests', icon: Zap },
            { id: 'campaigns', label: 'Bosses', icon: ShieldAlert },
            { id: 'city', label: 'City', icon: Building2 },
            { id: 'treasury', label: 'Treasury', icon: Coins },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-lg ${
                activeTab === id
                  ? isUpsideDown ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'
                  : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
