import React, { useEffect } from 'react';
import { Award, X } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function AchievementToast({ achievement, onClose }) {
  useEffect(() => {
    playSound('achievement');
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm pointer-events-auto animate-bounce">
      <div className="glass-panel-highlight border border-amber-400/70 p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 bg-gradient-to-r from-nature-950 via-nature-900 to-amber-950/80">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-xl flex-shrink-0">
            {achievement.icon || '🏆'}
          </div>

          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
              Achievement Unlocked!
            </span>
            <h4 className="text-xs font-bold text-white truncate font-display">
              {achievement.title}
            </h4>
            <span className="text-[10px] text-emerald-300 font-semibold">
              +{achievement.xpReward} Bonus XP
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-emerald-200/60 hover:text-white p-1"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
