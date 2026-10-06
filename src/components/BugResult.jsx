import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Award, ArrowRight, CheckCircle2, RotateCcw, Share2, Compass, Trees, ShieldAlert } from 'lucide-react';
import BugCard from './BugCard';
import { playSound } from '../utils/audio';

export default function BugResult({
  analysisData,
  photoUrl,
  location,
  onSaveAndExplore,
  onViewDex,
  onScanAnother,
  isExisting = false,
  xpEarned = 100,
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti if it's a new discovery or high rarity
    try {
      if (!isExisting) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#32a872', '#48cf90', '#f59e0b', '#38bdf8'],
        });
      }
    } catch (e) {
      console.debug('Confetti error:', e);
    }
  }, [isExisting]);

  const handleSave = () => {
    playSound('click');
    setSaved(true);
    onSaveAndExplore();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-28 pt-2 text-center">
      
      {/* Discovery Reveal Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nature-900/90 border border-nature-500/40 text-nature-300 text-xs font-bold shadow-lg animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-nature-400" />
          <span>{isExisting ? 'SPECIES OBSERVED AGAIN' : 'NEW BUG DISCOVERED!'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
          {analysisData?.common_name}
        </h2>

        <div className="flex items-center justify-center gap-2 text-sm font-bold text-teal-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>+{xpEarned} XP Earned</span>
        </div>
      </div>

      {/* Collectible Card Display */}
      <div className="transition-all duration-500 transform animate-fadeIn">
        <BugCard
          bug={analysisData}
          photoUrl={photoUrl}
          isNewDiscovery={!isExisting}
          xpEarned={xpEarned}
          location={location}
        />
      </div>

      {/* Action / Save Buttons or Post-Save Screen */}
      {!saved ? (
        <div className="space-y-3">
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-nature-500 via-nature-400 to-emerald-400 text-nature-950 font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-nature-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <CheckCircle2 className="w-5 h-5 text-nature-950" />
            <span>SAVE TO MY BUGDEX</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              onScanAnother();
            }}
            className="w-full py-3 rounded-2xl glass-panel border border-nature-700/50 text-emerald-200 font-semibold text-xs hover:bg-nature-800/80 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Discard & Scan Another</span>
          </button>
        </div>
      ) : (
        /* Rewarding Nature Engagement Screen */
        <div className="glass-panel p-6 rounded-3xl border border-nature-500/40 text-center space-y-4 shadow-2xl bg-gradient-to-b from-nature-900/90 to-nature-950/95 animate-fadeIn">
          
          <div className="w-14 h-14 rounded-full bg-nature-500/20 border border-nature-400/40 flex items-center justify-center mx-auto text-2xl shadow-inner">
            🌿
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-white font-display">
              Bug Added to Your Dex!
            </h3>
            <p className="text-sm font-semibold text-nature-300">
              Put your phone away and keep exploring. 🌿
            </p>
            <p className="text-xs text-emerald-100/60 max-w-xs mx-auto">
              Look under leaves, on tree bark, and around garden flowers for your next specimen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                playSound('click');
                onViewDex();
              }}
              className="py-3 px-4 rounded-xl glass-panel border border-nature-600/50 text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-nature-800/80 hover:text-white transition-all"
            >
              <span>View in BugDex</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                playSound('scan_start');
                onScanAnother();
              }}
              className="py-3 px-4 rounded-xl bg-nature-500 text-nature-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-nature-400 shadow-md shadow-nature-500/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Scan Next Bug</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
