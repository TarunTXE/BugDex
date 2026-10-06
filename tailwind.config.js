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
        nature: {
          950: '#06110a',
          900: '#0a1d12',
          850: '#0e291b',
          800: '#143826',
          700: '#1c5238',
          600: '#25744f',
          500: '#32a872',
          400: '#48cf90',
          300: '#75e6b1',
          200: '#abf5d1',
          100: '#d6fbeb',
          50: '#f0fdf7',
        },
        cardbg: {
          dark: 'rgba(15, 25, 20, 0.75)',
          glow: 'rgba(37, 116, 79, 0.25)',
        },
        rarity: {
          common: '#94a3b8',
          uncommon: '#22c55e',
          rare: '#3b82f6',
          veryrare: '#a855f7',
          legendary: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'scan-line': 'scanLine 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 15px rgba(50, 168, 114, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(72, 207, 144, 0.5)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
