import React from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Award, ArrowRight } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function LevelUpModal({ newLevel, rankTitle, onClose }) {
  React.useEffect(() => {
    playSound('levelup');
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#ffffff'],
      });
    } catch (e) {}
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm glass-panel-highlight border border-nature-400/60 rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-scaleUp">
        
        {/* Glow halo */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-nature-500 to-amber-400 p-1 mx-auto shadow-2xl shadow-nature-400/50 flex items-center justify-center animate-bounce">
          <div className="w-full h-full bg-nature-950 rounded-[20px] flex items-center justify-center text-3xl font-black text-amber-400">
            {newLevel}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase tracking-widest text-nature-400">
            LEVEL UP!
          </span>
          <h3 className="text-2xl font-black text-white font-display">
            Level {newLevel} Reached
          </h3>
          <p className="text-xs font-bold text-amber-300">
            {rankTitle}
          </p>
        </div>

        <p className="text-xs text-emerald-100/70 leading-relaxed">
          Your entomological expertise grows! Keep exploring to unlock higher ranks and rare species.
        </p>

        <button
          onClick={() => {
            playSound('click');
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-nature-500 via-nature-400 to-emerald-400 text-nature-950 font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-nature-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span>CONTINUE EXPLORING</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
