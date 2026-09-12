/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme H: The Upside Down / Hawkins 1984
        upside: {
          bg: '#050711',
          card: '#0a0d1d',
          border: '#371722',
          red: '#ff0f3f',
          neon: '#ef4444',
          darkRed: '#7f1d1d',
          cyan: '#06b6d4',
          amber: '#f59e0b',
        },
        // Theme G: Cursed Necropolis / Horror & Haunted World
        haunted: {
          bg: '#07090e',
          card: '#0d131a',
          border: '#162e24',
          emerald: '#10b981',
          spectral: '#34d399',
          purple: '#8b5cf6',
          blood: '#dc2626',
          bone: '#e2e8f0',
        }
      },
      fontFamily: {
        retro: ['"Press Start 2P"', 'Courier New', 'monospace'],
        gothic: ['"Cinzel"', 'Georgia', 'serif'],
        benguiat: ['"Merriweather"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'flicker': 'flicker 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-spore': 'floatSpore 8s ease-in-out infinite',
        'fog-drift': 'fogDrift 20s linear infinite',
        'damage-float': 'damageFloat 1s ease-out forwards',
        'boss-shake': 'bossShake 0.4s ease-in-out',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '0.99' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' },
        },
        floatSpore: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-15px) translateX(10px)' },
        },
        fogDrift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        damageFloat: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-40px) scale(1.3)' },
        },
        bossShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        }
      }
    },
  },
  plugins: [],
}
