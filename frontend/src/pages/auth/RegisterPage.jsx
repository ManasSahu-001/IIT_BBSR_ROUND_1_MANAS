import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme, THEMES } from '../../contexts/ThemeContext.jsx';
import { soundFx } from '../../utils/sound.js';
import { UserPlus, Radio, Skull, Sparkles, Building2 } from 'lucide-react';

export default function RegisterPage({ setActiveTab }) {
  const { register } = useAuth();
  const { isUpsideDown, isHaunted, cardBg, btnPrimary, setTheme } = useTheme();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cityName, setCityName] = useState('Hawkins Township');
  const [governorTitle, setGovernorTitle] = useState('Founder of Hawkins');
  const [chosenTheme, setChosenTheme] = useState('theme-h');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password) {
      setError('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Passcode must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');
    soundFx.playClick();

    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        cityName: cityName.trim(),
        governorTitle: governorTitle.trim(),
        activeTheme: chosenTheme
      });
      setTheme(chosenTheme);
      soundFx.playLevelUp();
      setActiveTab('dashboard');
    } catch (err) {
      setError(err.message || 'Registration rejected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8 px-4 animate-fade-in">
      <div className={`rounded-3xl p-8 border shadow-2xl relative overflow-hidden ${cardBg}`}>
        
        <div className="text-center mb-6">
          <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 border ${
            isUpsideDown 
              ? 'bg-red-950/80 border-red-600 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
              : 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
          }`}>
            <UserPlus className="w-7 h-7" />
          </div>

          <h1 className={`text-2xl sm:text-3xl font-black ${
            isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
          }`}>
            Found Your City
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Charter a new metropolitan settlement and begin your Life RPG adventure.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
                Governor Call-Sign:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. DustinHenderson"
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
                Communications Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dustin@avclub.net"
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
              Security Passcode (6+ chars):
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
                City Name:
              </label>
              <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="e.g. Hawkins Township"
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-semibold">
                Governor Title:
              </label>
              <input
                type="text"
                value={governorTitle}
                onChange={(e) => setGovernorTitle(e.target.value)}
                placeholder="e.g. Warden of the Gate"
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2 font-semibold">
              Initial Realm Aesthetic:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setChosenTheme('theme-h')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  chosenTheme === 'theme-h'
                    ? 'bg-red-950/70 border-red-500 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                    : 'bg-black/50 border-white/10 text-slate-400 hover:border-white/30'
                }`}
              >
                <Radio className="w-4 h-4 mb-1 text-red-500" />
                <span className="block text-xs font-bold font-benguiat">The Upside Down</span>
                <span className="text-[10px] text-slate-400">Hawkins 1984 & CRT Spores</span>
              </button>

              <button
                type="button"
                onClick={() => setChosenTheme('theme-g')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  chosenTheme === 'theme-g'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-black/50 border-white/10 text-slate-400 hover:border-white/30'
                }`}
              >
                <Skull className="w-4 h-4 mb-1 text-emerald-400" />
                <span className="block text-xs font-bold font-gothic">Cursed Necropolis</span>
                <span className="text-[10px] text-slate-400">Victorian Mist & Gothic Horror</span>
              </button>
            </div>
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
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Chartering Realm...' : 'Charter City & Enter RPG'}</span>
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-white/10 text-center text-xs text-slate-500">
          Already established a charter?{' '}
          <button
            onClick={() => setActiveTab('login')}
            className="text-slate-300 hover:text-white font-bold underline"
          >
            Enter Login
          </button>
        </div>

      </div>
    </div>
  );
}
