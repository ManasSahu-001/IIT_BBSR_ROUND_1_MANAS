import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { soundFx } from '../../utils/sound.js';
import { LogIn, Radio, Skull, Shield, Sparkles, KeyRound } from 'lucide-react';

export default function LoginPage({ setActiveTab }) {
  const { login } = useAuth();
  const { isUpsideDown, isHaunted, cardBg, btnPrimary } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide your Governor email and authorization passcode.');
      return;
    }

    setLoading(true);
    setError('');
    soundFx.playClick();

    try {
      await login(email, password);
      soundFx.playQuestComplete();
      setActiveTab('dashboard');
    } catch (err) {
      setError(err.message || 'Authentication rejected.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('governor@liferpg.io');
    setPassword('rpg12345');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 animate-fade-in">
      <div className={`rounded-3xl p-8 border shadow-2xl relative overflow-hidden ${cardBg}`}>
        
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 border ${
            isUpsideDown 
              ? 'bg-red-950/80 border-red-600 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
              : 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
          }`}>
            {isUpsideDown ? <Radio className="w-7 h-7 animate-pulse" /> : <Skull className="w-7 h-7 animate-pulse" />}
          </div>

          <h1 className={`text-2xl sm:text-3xl font-black ${
            isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
          }`}>
            Governor Login
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Re-enter the dimensional command center of your city.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Governor Email or Username:
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="governor@liferpg.io"
              className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Security Passcode:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-700/60 text-xs text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${btnPrimary}`}
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authorizing Access...' : 'Authorize Login'}</span>
          </button>
        </form>

        {/* Demo Account Button for instant competition inspection */}
        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1 mx-auto bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-lg"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Load Competition Demo Account</span>
          </button>

          <p className="text-xs text-slate-500 mt-4">
            New to the realm?{' '}
            <button
              onClick={() => setActiveTab('signup')}
              className="text-slate-300 hover:text-white font-bold underline"
            >
              Found a New City
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
