import React from 'react';
import { Camera, Sparkles, Compass, ShieldCheck, Trophy, ArrowRight, Zap, Eye, Trees } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function LandingPage({ onStartExploring, onQuickScan }) {
  const previewBugs = [
    {
      name: 'Monarch Butterfly',
      sci: 'Danaus plexippus',
      rarity: 'RARE',
      badgeBg: 'bg-blue-900/60 text-blue-300 border-blue-400/40',
      border: 'border-blue-500/50',
      photo: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=600&auto=format&fit=crop&q=80',
      xp: '+400 XP',
    },
    {
      name: 'Atlas Moth',
      sci: 'Attacus atlas',
      rarity: 'LEGENDARY',
      badgeBg: 'bg-amber-900/70 text-amber-300 border-amber-400/60',
      border: 'border-amber-400/70',
      photo: 'https://images.unsplash.com/photo-1533048324814-79b0a31982f1?w=600&auto=format&fit=crop&q=80',
      xp: '+1500 XP',
      isHolo: true,
    },
    {
      name: 'Seven-Spotted Ladybug',
      sci: 'Coccinella septempunctata',
      rarity: 'COMMON',
      badgeBg: 'bg-slate-700/60 text-slate-200 border-slate-500/40',
      border: 'border-slate-600/50',
      photo: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=600&auto=format&fit=crop&q=80',
      xp: '+100 XP',
    },
  ];

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-hidden pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-nature-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 pt-8 sm:pt-14 text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-nature-500/30 text-nature-300 text-xs font-semibold mb-6 animate-float">
          <Sparkles className="w-4 h-4 text-nature-400" />
          <span>Powered by Google Gemini Multimodal AI</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-display mb-4">
          BUG<span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-400 via-emerald-300 to-teal-200">DEX</span>
        </h1>
        
        <p className="text-xl sm:text-2xl font-bold text-nature-300 tracking-wide font-display mb-2">
          Gotta Find 'Em All.
        </p>

        <p className="text-sm sm:text-base text-emerald-100/70 max-w-xl mx-auto leading-relaxed mb-8">
          Turn real-world insect discoveries into a living AI-powered collection. Go outside, photograph bugs, and discover nature right at your feet.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={() => {
              playSound('scan_start');
              onQuickScan();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-nature-500 via-nature-400 to-emerald-400 text-nature-950 font-black text-base tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-nature-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Camera className="w-5 h-5" />
            <span>SCAN A BUG NOW</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              onStartExploring();
            }}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-panel border border-nature-600/40 text-emerald-200 font-bold text-base flex items-center justify-center gap-2 hover:bg-nature-800/60 hover:text-white transition-all"
          >
            <span>Start Exploring</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Step Workflow */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-14 text-left">
          <div className="glass-panel p-4 rounded-2xl border border-nature-700/40">
            <div className="w-8 h-8 rounded-xl bg-nature-900 flex items-center justify-center text-nature-400 font-bold mb-3 border border-nature-700">
              1
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Go Outside & Snap</h2>
            <p className="text-xs text-emerald-100/60 leading-relaxed">
              Find real-world insects in your garden, college campus, park, or trail.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-nature-700/40">
            <div className="w-8 h-8 rounded-xl bg-nature-900 flex items-center justify-center text-nature-400 font-bold mb-3 border border-nature-700">
              2
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Gemini AI Analysis</h2>
            <p className="text-xs text-emerald-100/60 leading-relaxed">
              Instant taxonomic order, family, diet, habitat, safety facts & rarity rating.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-nature-700/40">
            <div className="w-8 h-8 rounded-xl bg-nature-900 flex items-center justify-center text-nature-400 font-bold mb-3 border border-nature-700">
              3
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Level Up & Collect</h2>
            <p className="text-xs text-emerald-100/60 leading-relaxed">
              Earn XP, unlock achievement badges, maintain streaks, and complete quests.
            </p>
          </div>
        </div>

        {/* Live Collectible Card Showcase */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-nature-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Sample Collectible Cards
            </h2>
            <span className="text-[11px] text-emerald-200/50">Holo Foil Cards</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {previewBugs.map((bug, idx) => (
              <div
                key={idx}
                className={`glass-panel rounded-2xl p-3.5 border ${bug.border} text-left relative overflow-hidden transition-all hover:-translate-y-1 ${
                  bug.isHolo ? 'holo-card-legendary shadow-[0_0_30px_rgba(245,158,11,0.25)]' : ''
                }`}
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 relative bg-nature-950">
                  <img
                    src={bug.photo}
                    alt={bug.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider border backdrop-blur-md shadow-md">
                    <span className={bug.badgeBg}>{bug.rarity}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-emerald-300 font-bold text-[10px]">
                    {bug.xp}
                  </div>
                </div>

                <h4 className="text-sm font-black text-white truncate font-display">{bug.name}</h4>
                <p className="text-[11px] italic text-emerald-200/60 truncate font-mono">{bug.sci}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Safety & Nature First Footer Note */}
      <div className="max-w-xl mx-auto px-4 mt-12 text-center text-xs text-emerald-100/50">
        <p className="flex items-center justify-center gap-1.5">
          <Trees className="w-4 h-4 text-nature-400" />
          <span>Respect wildlife. Observe from a safe distance without touching or harming insects.</span>
        </p>
      </div>
    </div>
  );
}
