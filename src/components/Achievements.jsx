import React from 'react';
import { Award, Lock, CheckCircle2, Sparkles, Trophy } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function Achievements({ achievements, uniqueCount, streak }) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6 pb-28 pt-2 text-left">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-3xl border border-nature-600/40">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nature-900/80 border border-nature-500/40 text-nature-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-nature-400" />
            <span>Field Badges</span>
          </div>

          <span className="text-xs font-bold text-emerald-300">
            {unlockedCount} / {achievements.length} Unlocked
          </span>
        </div>

        <h2 className="text-2xl font-black text-white font-display">
          Achievements & Badges
        </h2>
        <p className="text-xs text-emerald-100/60 mt-1">
          Master real-world entomological milestones to earn badges and bonus XP.
        </p>

        {/* Global Progress Bar */}
        <div className="w-full h-2 bg-nature-950 rounded-full overflow-hidden border border-nature-800 mt-4">
          <div
            className="h-full bg-gradient-to-r from-nature-500 via-emerald-400 to-teal-300 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {achievements.map((ach) => {
          // Calculate progress towards target
          let currentProgress = 0;
          if (ach.id === 'streak_explorer') {
            currentProgress = streak || 1;
          } else if (ach.target) {
            currentProgress = uniqueCount;
          }
          const progressPercent = ach.unlocked
            ? 100
            : Math.min(100, Math.floor((currentProgress / (ach.target || 1)) * 100));

          return (
            <div
              key={ach.id}
              className={`glass-panel p-4 rounded-2xl border transition-all relative overflow-hidden ${
                ach.unlocked
                  ? 'border-nature-400/50 bg-gradient-to-br from-nature-900/80 to-nature-950/90 shadow-lg shadow-nature-500/10'
                  : 'border-nature-800/80 bg-nature-950/50 opacity-70'
              }`}
            >
              <div className="flex items-start gap-3.5">
                
                {/* Badge Icon */}
                <div
                  className={`w-13 h-13 rounded-2xl border flex items-center justify-center text-2xl flex-shrink-0 shadow-inner ${
                    ach.unlocked
                      ? 'bg-nature-900/90 border-nature-400/60'
                      : 'bg-nature-950 border-nature-800 grayscale opacity-60'
                  }`}
                >
                  {ach.icon}
                </div>

                {/* Badge Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-white truncate font-display">
                      {ach.title}
                    </h4>

                    {ach.unlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-nature-300 px-1.5 py-0.5 rounded bg-nature-500/20 border border-nature-500/30">
                        <CheckCircle2 className="w-3 h-3 text-nature-400" />
                        <span>DONE</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-100/40">
                        <Lock className="w-3 h-3" />
                        <span>+{ach.xpReward} XP</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-emerald-100/70 mt-0.5 leading-relaxed">
                    {ach.description}
                  </p>

                  {/* Progress bar for locked achievements */}
                  {!ach.unlocked && (
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between text-[10px] text-emerald-200/50 mb-1">
                        <span>Progress</span>
                        <span>{Math.min(currentProgress, ach.target)} / {ach.target}</span>
                      </div>
                      <div className="w-full h-1.5 bg-nature-950 rounded-full overflow-hidden border border-nature-800">
                        <div
                          className="h-full bg-nature-500 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {ach.unlocked && ach.unlockedAt && (
                    <div className="mt-2 text-[10px] text-nature-400/80 font-medium">
                      Unlocked on {new Date(ach.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
