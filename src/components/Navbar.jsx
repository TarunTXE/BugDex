import React from 'react';
import { Flame, Sparkles, Volume2, VolumeX, Settings, Compass } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function Navbar({ stats, onOpenSettings, onToggleLanding, isMuted, setIsMuted, onNavigate }) {
  const levelData = stats.levelData || { level: 1, rankTitle: 'Novice Bug Catcher', progressPercent: 0, xp: 0 };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    localStorage.setItem('bugdex_muted', String(next));
    if (!next) playSound('click');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-nature-700/40 px-4 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <button 
          onClick={() => {
            playSound('click');
            onNavigate('home');
          }}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-nature-600 via-nature-400 to-emerald-300 p-0.5 shadow-lg shadow-nature-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-nature-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl transform group-hover:rotate-12 transition-transform">🌿</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black tracking-tight text-white font-display">
                BUG<span className="text-nature-400">DEX</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-nature-500/20 text-nature-300 border border-nature-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-nature-300/70 font-medium tracking-wide">
              Gotta Find 'Em All
            </p>
          </div>
        </button>

        {/* Level / Streak & Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{stats.streak || 1}d</span>
          </div>

          {/* Level Pill */}
          <button
            onClick={() => {
              playSound('click');
              onNavigate('profile');
            }}
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-nature-900/80 border border-nature-600/40 hover:border-nature-400/60 transition-colors text-left"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-nature-400">
                  LVL {levelData.level}
                </span>
                <span className="text-[11px] font-bold text-white">
                  {stats.xp.toLocaleString()} <span className="text-nature-400 text-[9px]">XP</span>
                </span>
              </div>
              {/* Mini progress bar */}
              <div className="w-20 sm:w-24 h-1.5 bg-nature-950 rounded-full overflow-hidden mt-0.5 border border-nature-800">
                <div 
                  className="h-full bg-gradient-to-r from-nature-500 to-emerald-300 rounded-full transition-all duration-500"
                  style={{ width: `${levelData.progressPercent}%` }}
                />
              </div>
            </div>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="p-2 rounded-xl bg-nature-900/60 border border-nature-700/40 text-nature-300 hover:text-white hover:bg-nature-800 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-nature-400" />}
          </button>

          {/* Settings / Landing guide */}
          <button
            onClick={() => {
              playSound('click');
              onOpenSettings();
            }}
            aria-label="Open Settings"
            className="p-2 rounded-xl bg-nature-900/60 border border-nature-700/40 text-nature-300 hover:text-white hover:bg-nature-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
