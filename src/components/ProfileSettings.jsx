import React, { useState } from 'react';
import { User, Volume2, VolumeX, Database, Trash2, Sparkles, Check, Download, Shield, RefreshCw } from 'lucide-react';
import { playSound } from '../utils/audio';
import { seedSampleCollection, resetAllData, getUserProfile, saveUserProfile } from '../services/storage';

const AVATAR_OPTIONS = ['🌿', '🦋', '🔍', '🐝', '🦗', '🐞', '👑', '⚡', '🦉', '🍃'];

export default function ProfileSettings({
  stats,
  isMuted,
  setIsMuted,
  onDataResetOrSeeded,
  onClose,
}) {
  const [profile, setProfile] = useState(getUserProfile());
  const [nameSaved, setNameSaved] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    saveUserProfile(profile);
    setNameSaved(true);
    playSound('click');
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleSeedData = () => {
    playSound('discovery');
    seedSampleCollection();
    onDataResetOrSeeded();
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset your BugDex? All discovered insects and XP will be cleared.')) {
      playSound('error');
      resetAllData();
      onDataResetOrSeeded();
    }
  };

  const handleExportData = () => {
    playSound('click');
    const data = {
      bugs: JSON.parse(localStorage.getItem('bugdex_bugs_collection_v1') || '[]'),
      stats: JSON.parse(localStorage.getItem('bugdex_user_stats_v1') || '{}'),
      achievements: JSON.parse(localStorage.getItem('bugdex_achievements_v1') || '[]'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bugdex_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-28 pt-2 text-left">
      
      {/* Explorer Profile Card */}
      <div className="glass-panel p-5 rounded-3xl border border-nature-600/40">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-nature-600 to-emerald-300 p-0.5 shadow-lg shadow-nature-500/20">
            <div className="w-full h-full bg-nature-950 rounded-[14px] flex items-center justify-center text-3xl">
              {profile.avatar || '🌿'}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white font-display">
                {profile.name || 'Field Explorer'}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-nature-500/20 text-nature-300 border border-nature-500/30">
                LVL {stats.levelData?.level || 1}
              </span>
            </div>
            <p className="text-xs text-nature-400 font-semibold mt-0.5">
              {stats.levelData?.rankTitle || 'Novice Bug Catcher'}
            </p>
            <p className="text-[11px] text-emerald-100/60 mt-0.5">
              {stats.uniqueDiscovered} Species Cataloged • {stats.xp.toLocaleString()} XP
            </p>
          </div>
        </div>

        {/* Profile Avatar Selector */}
        <div className="space-y-2 pt-3 border-t border-nature-800">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            Choose Explorer Avatar
          </label>
          <div className="flex flex-wrap gap-2">
            {AVATAR_OPTIONS.map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => {
                  playSound('click');
                  const updated = { ...profile, avatar: av };
                  setProfile(updated);
                  saveUserProfile(updated);
                }}
                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                  profile.avatar === av
                    ? 'bg-nature-500 shadow-md shadow-nature-500/30 scale-110'
                    : 'bg-nature-900/80 border border-nature-700/60 hover:bg-nature-800'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Explorer Name Form */}
        <form onSubmit={handleSaveProfile} className="mt-4 space-y-2">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            Explorer Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Your Explorer Name"
              className="flex-1 px-3.5 py-2 rounded-xl glass-panel border border-nature-700 text-xs text-white placeholder-emerald-100/40 focus:outline-none focus:border-nature-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-nature-500 text-nature-950 font-bold text-xs hover:bg-nature-400 transition-all flex items-center gap-1"
            >
              {nameSaved ? <Check className="w-4 h-4" /> : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {/* App Preferences & Audio */}
      <div className="glass-panel p-5 rounded-3xl border border-nature-600/40 space-y-3">
        <h3 className="text-sm font-bold text-white">App Preferences</h3>

        {/* Audio Sound Effects */}
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-xs font-bold text-white block">Nature & Game SFX</span>
            <span className="text-[11px] text-emerald-100/60">Tactile sounds for scan, discover, and level up</span>
          </div>

          <button
            onClick={() => {
              const next = !isMuted;
              setIsMuted(next);
              localStorage.setItem('bugdex_muted', String(next));
              if (!next) playSound('click');
            }}
            className={`p-2.5 rounded-xl border transition-all ${
              !isMuted
                ? 'bg-nature-500/20 border-nature-500/40 text-nature-300'
                : 'bg-nature-950 border-nature-800 text-slate-500'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collection Data & Demo Tools */}
      <div className="glass-panel p-5 rounded-3xl border border-nature-600/40 space-y-4">
        <h3 className="text-sm font-bold text-white">Data Management & Demo Tools</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={handleSeedData}
            className="p-3 rounded-xl bg-nature-900/80 border border-nature-700/60 hover:border-nature-500/60 text-emerald-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-nature-400" />
            <span>Seed 5 Demo Specimens</span>
          </button>

          <button
            onClick={handleExportData}
            className="p-3 rounded-xl bg-nature-900/80 border border-nature-700/60 hover:border-nature-500/60 text-emerald-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Export My BugDex JSON</span>
          </button>
        </div>

        {/* Wipe / Reset Button */}
        <div className="pt-2 border-t border-nature-800">
          <button
            onClick={handleResetData}
            className="w-full py-2.5 px-4 rounded-xl bg-red-950/40 border border-red-800/50 hover:bg-red-900/50 text-red-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset All BugDex Data</span>
          </button>
        </div>
      </div>

    </div>
  );
}
