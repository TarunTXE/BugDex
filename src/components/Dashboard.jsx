import React from 'react';
import { Camera, Sparkles, Flame, ShieldAlert, Award, ChevronRight, Zap, Target, BookOpen, Compass, Plus } from 'lucide-react';
import { playSound } from '../utils/audio';
import { getRarityData } from '../utils/rarity';

export default function Dashboard({ stats, bugs, dailyQuests, onNavigate, onSelectBug, onQuickScan }) {
  const levelData = stats.levelData || {
    level: 1,
    rankTitle: 'Novice Bug Catcher',
    progressPercent: 0,
    xp: 0,
    xpInLevel: 0,
    xpNeeded: 200,
  };

  const activeDailyQuest = dailyQuests.find((q) => !q.completed) || dailyQuests[0];
  const recentBugs = bugs.slice(0, 6);

  return (
    <div className="space-y-6 pb-28 pt-2">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-highlight p-6 sm:p-8 border border-nature-500/30">
        
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-nature-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nature-950/70 border border-nature-500/40 text-nature-300 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-nature-400 animate-pulse" />
            <span>AI Field Journal</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight leading-tight mb-2">
            GO OUTSIDE. FIND BUGS. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-300 via-emerald-200 to-teal-100">
              BUILD YOUR DEX.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed mb-6">
            Turn real-world insect discoveries into a living AI-powered collection.
          </p>

          <button
            onClick={() => {
              playSound('scan_start');
              onQuickScan();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-nature-500 via-nature-400 to-emerald-400 text-nature-950 font-black text-sm tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-nature-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Camera className="w-5 h-5 text-nature-950" />
            <span>SCAN A BUG</span>
          </button>
        </div>
      </div>

      {/* Level & XP Progression Card */}
      <div className="glass-panel p-5 rounded-2xl border border-nature-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-nature-900 border border-nature-500/40 flex items-center justify-center text-nature-300 font-black text-lg shadow-inner">
              {levelData.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">{levelData.rankTitle}</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-nature-500/20 text-nature-300 border border-nature-500/30">
                  LVL {levelData.level}
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/60">
                {levelData.xpInLevel} / {levelData.xpNeeded} XP to Level {levelData.level + 1}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-nature-400">{levelData.progressPercent}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-nature-950 rounded-full overflow-hidden border border-nature-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-nature-500 via-emerald-400 to-teal-300 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(72,207,144,0.5)]"
            style={{ width: `${levelData.progressPercent}%` }}
          />
        </div>
      </div>

      {/* 4 Core Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Total Bugs */}
        <div className="glass-panel p-3.5 rounded-2xl border border-nature-700/40">
          <span className="text-[11px] text-emerald-200/60 font-medium block mb-1">Total Sightings</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white font-display">{stats.totalDiscovered}</span>
            <span className="text-[10px] text-nature-400">scans</span>
          </div>
        </div>

        {/* Unique Bugs */}
        <div className="glass-panel p-3.5 rounded-2xl border border-nature-700/40">
          <span className="text-[11px] text-emerald-200/60 font-medium block mb-1">Unique Species</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-nature-300 font-display">{stats.uniqueDiscovered}</span>
            <span className="text-[10px] text-emerald-300/70">in Dex</span>
          </div>
        </div>

        {/* Total XP */}
        <div className="glass-panel p-3.5 rounded-2xl border border-nature-700/40">
          <span className="text-[11px] text-emerald-200/60 font-medium block mb-1">Total XP</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-teal-300 font-display">{stats.xp.toLocaleString()}</span>
            <span className="text-[10px] text-teal-400">pts</span>
          </div>
        </div>

        {/* Discovery Streak */}
        <div className="glass-panel p-3.5 rounded-2xl border border-nature-700/40">
          <span className="text-[11px] text-emerald-200/60 font-medium block mb-1">Daily Streak</span>
          <div className="flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-2xl font-black text-amber-300 font-display">{stats.streak || 1}</span>
            <span className="text-[10px] text-amber-400/80">days</span>
          </div>
        </div>

      </div>

      {/* Daily Quest Highlight Banner */}
      {activeDailyQuest && (
        <div className="glass-panel p-4 rounded-2xl border border-nature-600/40 relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-nature-900 border border-nature-700 flex items-center justify-center text-xl flex-shrink-0">
                {activeDailyQuest.icon || '🎯'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-nature-400">
                    Daily Outdoor Quest
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    +{activeDailyQuest.xpReward} XP
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">{activeDailyQuest.title}</h4>
                <p className="text-xs text-emerald-100/70 mt-0.5">{activeDailyQuest.description}</p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                onNavigate('quests');
              }}
              className="p-2 rounded-xl bg-nature-800/80 text-nature-300 hover:text-white hover:bg-nature-700 transition-colors flex-shrink-0"
              aria-label="View quests"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Recent Discoveries Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Recent Discoveries</h3>
            <span className="text-xs text-nature-400 font-medium">({bugs.length})</span>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onNavigate('bugdex');
            }}
            className="text-xs text-nature-300 hover:text-nature-200 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>View All Dex</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentBugs.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center border border-dashed border-nature-700/60">
            <div className="w-12 h-12 rounded-2xl bg-nature-900/80 mx-auto flex items-center justify-center text-2xl mb-3 border border-nature-700">
              🔍
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Your BugDex is Empty</h4>
            <p className="text-xs text-emerald-100/60 max-w-sm mx-auto mb-4">
              Step outside into your garden, park, or balcony and photograph your first insect!
            </p>
            <button
              onClick={() => {
                playSound('scan_start');
                onQuickScan();
              }}
              className="px-5 py-2.5 rounded-xl bg-nature-500 text-nature-950 font-bold text-xs inline-flex items-center gap-2 hover:bg-nature-400 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Scan First Bug</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {recentBugs.map((bug) => {
              const rarityInfo = getRarityData(bug.rarity);
              return (
                <div
                  key={bug.id}
                  onClick={() => {
                    playSound('click');
                    onSelectBug(bug);
                  }}
                  className={`glass-panel p-2.5 rounded-2xl border ${rarityInfo.border} hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group text-left relative overflow-hidden`}
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2 relative bg-nature-950">
                    <img
                      src={bug.photo || 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=400&auto=format&fit=crop&q=80'}
                      alt={bug.common_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-wider border backdrop-blur-md">
                      <span className={rarityInfo.badgeBg}>{rarityInfo.label}</span>
                    </div>
                    {bug.observationCount > 1 && (
                      <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-emerald-300 text-[9px] font-bold">
                        x{bug.observationCount}
                      </div>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white truncate font-display group-hover:text-nature-300 transition-colors">
                    {bug.common_name}
                  </h4>
                  <p className="text-[10px] italic text-emerald-200/50 truncate font-mono">
                    {bug.scientific_name}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Field Naturalist Tip Box */}
      <div className="glass-panel-subtle p-4 rounded-2xl border border-nature-800 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-100/70 leading-relaxed">
          <span className="font-bold text-white">Field Safety Reminder: </span>
          Observe all insects from a comfortable, respectful distance. Never touch, handle, or provoke unknown insects or stinging species.
        </div>
      </div>

    </div>
  );
}
