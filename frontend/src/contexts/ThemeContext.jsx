import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundFx, bgm } from '../utils/sound.js';

const ThemeContext = createContext();

export const THEMES = {
  THEME_H: 'theme-h', // Stranger Things 2: The Upside Down
  THEME_G: 'theme-g', // Horror & Haunted World: Cursed Necropolis
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('life_rpg_active_theme') || THEMES.THEME_H;
  });

  const [isMuted, setIsMuted] = useState(soundFx.isMuted);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('life_rpg_active_theme', newTheme);
    document.documentElement.classList.remove('theme-h', 'theme-g');
    document.documentElement.classList.add(newTheme);
    // Crossfade BGM to new theme
    bgm.switchTheme(newTheme);
  };

  const toggleSound = () => {
    soundFx.bootstrap(); // Unlock AudioContext on this user gesture
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    bgm.onMuteChange(muted); // Stop or resume BGM
    if (!muted) {
      soundFx.playClick();
    }
  };

  useEffect(() => {
    document.documentElement.classList.remove('theme-h', 'theme-g');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Unlock AudioContext on FIRST click anywhere in the app (browser autoplay policy)
  // Then start BGM immediately after unlocking
  useEffect(() => {
    const unlock = () => {
      soundFx.bootstrap();
      // Start BGM after a short delay to let AudioContext fully resume
      setTimeout(() => bgm.start(theme), 400);
      document.removeEventListener('click', unlock, { capture: true });
      document.removeEventListener('keydown', unlock, { capture: true });
    };
    document.addEventListener('click', unlock, { capture: true, once: true });
    document.addEventListener('keydown', unlock, { capture: true, once: true });
    return () => {
      document.removeEventListener('click', unlock, { capture: true });
      document.removeEventListener('keydown', unlock, { capture: true });
      bgm.stop(300); // Stop BGM on unmount (page leave)
    };
  }, []);

  // Helper dynamic classes based on active theme
  const isUpsideDown = theme === THEMES.THEME_H;
  const isHaunted = theme === THEMES.THEME_G;

  const themeTokens = {
    theme,
    isUpsideDown,
    isHaunted,
    setTheme,
    isMuted,
    toggleSound,
    // Cards
    cardBg: isUpsideDown 
      ? 'bg-[#0a0d1d]/90 border border-red-950/70 shadow-[0_0_20px_rgba(239,68,68,0.12)] hover:border-red-600/50' 
      : 'bg-[#0d131a]/90 border border-emerald-950/70 shadow-[0_0_20px_rgba(16,185,129,0.12)] hover:border-emerald-500/50',
    // Buttons
    btnPrimary: isUpsideDown
      ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-500/40 active:scale-98 transition-all'
      : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-500/40 active:scale-98 transition-all',
    // Badges & Accents
    accentText: isUpsideDown ? 'text-red-400' : 'text-emerald-400',
    accentBorder: isUpsideDown ? 'border-red-500/30' : 'border-emerald-500/30',
    accentBadge: isUpsideDown ? 'bg-red-950/60 text-red-300 border-red-800/50' : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50',
    titleStyle: isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
  };

  return (
    <ThemeContext.Provider value={themeTokens}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
