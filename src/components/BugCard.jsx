import React from 'react';
import { ShieldCheck, AlertTriangle, Sparkles, MapPin, Calendar, CheckCircle2, Award, Heart, Info, Utensils, Home as HomeIcon } from 'lucide-react';
import { getRarityData } from '../utils/rarity';

export default function BugCard({ bug, photoUrl, isNewDiscovery = false, xpEarned = 0, location = 'Garden' }) {
  const rarityInfo = getRarityData(bug?.rarity);
  const isLegendary = rarityInfo.label === 'LEGENDARY';
  const isVeryRare = rarityInfo.label === 'VERY RARE';

  // Format confidence display safely
  const confidencePercent = Math.min(Math.max(bug?.confidence || 88, 60), 98);

  const isDangerousOrStinging = 
    bug?.human_safety &&
    (bug.human_safety.toLowerCase().includes('observe from a safe distance') ||
     bug.human_safety.toLowerCase().includes('sting') ||
     bug.human_safety.toLowerCase().includes('bite') ||
     bug.human_safety.toLowerCase().includes('venom') ||
     bug.human_safety.toLowerCase().includes('toxin'));

  return (
    <div 
      className={`rounded-3xl glass-panel border ${rarityInfo.border} overflow-hidden shadow-2xl transition-all relative ${
        isLegendary ? 'holo-card-legendary shadow-[0_0_40px_rgba(245,158,11,0.3)]' : isVeryRare ? 'shadow-[0_0_35px_rgba(168,85,247,0.25)]' : ''
      }`}
    >
      {/* Top Banner Ribbon */}
      <div className={`px-4 py-2 flex items-center justify-between border-b ${rarityInfo.border} bg-gradient-to-r ${rarityInfo.gradient}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm">{rarityInfo.icon}</span>
          <span className={`text-xs font-black tracking-wider uppercase ${rarityInfo.color}`}>
            {rarityInfo.label} SPECIES
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-bold text-emerald-300">
          <Sparkles className="w-3 h-3 text-nature-400" />
          <span>{confidencePercent}% AI Confidence</span>
        </div>
      </div>

      {/* Main Specimen Photograph */}
      <div className="relative aspect-[16/10] bg-nature-950 overflow-hidden">
        <img
          src={photoUrl || bug?.photo || 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&auto=format&fit=crop&q=80'}
          alt={bug?.common_name}
          className="w-full h-full object-cover"
        />

        {/* Floating XP Badge */}
        {xpEarned > 0 && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-nature-900/90 backdrop-blur-md border border-nature-400/50 text-nature-300 font-black text-xs shadow-lg flex items-center gap-1.5 animate-bounce">
            <Award className="w-3.5 h-3.5 text-nature-400" />
            <span>+{xpEarned} XP</span>
          </div>
        )}

        {/* Location & Date Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-medium text-emerald-100/90">
          <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-nature-400" />
            <span className="truncate max-w-[140px]">{location || bug?.firstLocation || 'Wild'}</span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-nature-400" />
            <span>{new Date(bug?.firstDiscoveredAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Bug Details Content */}
      <div className="p-5 space-y-4 text-left">
        
        {/* Name & Taxonomy */}
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
            {bug?.common_name}
          </h3>
          <p className="text-sm italic text-nature-300 font-mono mt-0.5">
            {bug?.scientific_name}
          </p>

          {/* Taxonomic Chips */}
          <div className="flex flex-wrap gap-2 mt-2.5">
            {bug?.order && (
              <span className="px-2.5 py-0.5 rounded-lg bg-nature-900/80 border border-nature-700/60 text-emerald-300 text-[11px] font-semibold">
                Order: <strong className="text-white">{bug.order}</strong>
              </span>
            )}
            {bug?.family && (
              <span className="px-2.5 py-0.5 rounded-lg bg-nature-900/80 border border-nature-700/60 text-emerald-300 text-[11px] font-semibold">
                Family: <strong className="text-white">{bug.family}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed bg-nature-950/40 p-3 rounded-xl border border-nature-800/60">
          {bug?.description}
        </p>

        {/* Habitat & Diet Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {bug?.habitat && (
            <div className="p-3 rounded-xl bg-nature-900/50 border border-nature-800 flex items-start gap-2.5">
              <HomeIcon className="w-4 h-4 text-nature-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Habitat</span>
                <span className="text-emerald-100/70 leading-normal">{bug.habitat}</span>
              </div>
            </div>
          )}

          {bug?.diet && (
            <div className="p-3 rounded-xl bg-nature-900/50 border border-nature-800 flex items-start gap-2.5">
              <Utensils className="w-4 h-4 text-nature-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Diet</span>
                <span className="text-emerald-100/70 leading-normal">{bug.diet}</span>
              </div>
            </div>
          )}
        </div>

        {/* Interesting Facts List */}
        {bug?.interesting_facts && bug.interesting_facts.length > 0 && (
          <div className="p-3.5 rounded-xl bg-nature-900/40 border border-nature-700/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-nature-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Fascinating Field Facts
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-100/80">
              {bug.interesting_facts.map((fact, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-nature-400 font-bold">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Safety Warning / Information Box */}
        <div 
          className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
            isDangerousOrStinging 
              ? 'bg-amber-950/40 border-amber-500/50 text-amber-200' 
              : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
          }`}
        >
          {isDangerousOrStinging ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-nature-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <span className="font-bold block mb-0.5">
              {isDangerousOrStinging ? 'Safety Warning' : 'Human Safety & Eco Role'}
            </span>
            <span className="text-emerald-100/80 leading-relaxed">
              {bug?.human_safety || 'Harmless to humans. Safe to observe.'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
