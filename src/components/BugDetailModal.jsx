import React from 'react';
import { X, Calendar, MapPin, Sparkles, ShieldCheck, AlertTriangle, Utensils, Home, Info, Eye, History } from 'lucide-react';
import { getRarityData } from '../utils/rarity';
import { playSound } from '../utils/audio';

export default function BugDetailModal({ bug, onClose }) {
  if (!bug) return null;

  const rarityInfo = getRarityData(bug.rarity);
  const isDangerousOrStinging = 
    bug.human_safety &&
    (bug.human_safety.toLowerCase().includes('observe from a safe distance') ||
     bug.human_safety.toLowerCase().includes('sting') ||
     bug.human_safety.toLowerCase().includes('bite') ||
     bug.human_safety.toLowerCase().includes('venom'));

  const observations = bug.observations || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel border border-nature-600/50 rounded-3xl overflow-hidden shadow-2xl my-8 text-left">
        
        {/* Close Button */}
        <button
          onClick={() => {
            playSound('click');
            onClose();
          }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Specimen Header Image */}
        <div className="relative aspect-[16/10] bg-nature-950">
          <img
            src={bug.photo || 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&auto=format&fit=crop&q=80'}
            alt={bug.common_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-nature-950 via-transparent to-black/40" />

          {/* Rarity & Observation Badge */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-wider border backdrop-blur-md shadow-md ${rarityInfo.badgeBg}`}>
              {rarityInfo.label} SPECIES
            </span>

            <span className="px-2.5 py-1 rounded-lg bg-nature-900/90 border border-nature-500/40 text-emerald-300 text-xs font-bold backdrop-blur-md flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-nature-400" />
              <span>{bug.observationCount || 1} Sightings</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          
          {/* Header */}
          <div>
            <h3 className="text-2xl font-black text-white font-display">{bug.common_name}</h3>
            <p className="text-sm italic text-nature-300 font-mono">{bug.scientific_name}</p>

            <div className="flex flex-wrap gap-2 mt-2">
              {bug.order && (
                <span className="px-2.5 py-0.5 rounded-lg bg-nature-900/80 border border-nature-700 text-emerald-300 text-[11px] font-semibold">
                  Order: <strong className="text-white">{bug.order}</strong>
                </span>
              )}
              {bug.family && (
                <span className="px-2.5 py-0.5 rounded-lg bg-nature-900/80 border border-nature-700 text-emerald-300 text-[11px] font-semibold">
                  Family: <strong className="text-white">{bug.family}</strong>
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-lg bg-nature-900/80 border border-nature-700 text-teal-300 text-[11px] font-semibold">
                AI Confidence: <strong className="text-white">{bug.confidence || 90}%</strong>
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed bg-nature-900/40 p-3 rounded-2xl border border-nature-800">
            {bug.description}
          </p>

          {/* Appearance Notes if present */}
          {bug.appearance && (
            <div className="text-xs bg-nature-900/30 p-3 rounded-2xl border border-nature-800/80">
              <span className="font-bold text-white block mb-1">Morphology & Markings</span>
              <p className="text-emerald-100/70">{bug.appearance}</p>
            </div>
          )}

          {/* Habitat & Diet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {bug.habitat && (
              <div className="p-3 rounded-2xl bg-nature-900/50 border border-nature-800 flex items-start gap-2.5">
                <Home className="w-4 h-4 text-nature-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block mb-0.5">Habitat</span>
                  <span className="text-emerald-100/70">{bug.habitat}</span>
                </div>
              </div>
            )}
            {bug.diet && (
              <div className="p-3 rounded-2xl bg-nature-900/50 border border-nature-800 flex items-start gap-2.5">
                <Utensils className="w-4 h-4 text-nature-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block mb-0.5">Diet</span>
                  <span className="text-emerald-100/70">{bug.diet}</span>
                </div>
              </div>
            )}
          </div>

          {/* Field Facts */}
          {bug.interesting_facts && bug.interesting_facts.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-nature-900/40 border border-nature-700/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-nature-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Field Facts
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

          {/* Safety Notice */}
          <div 
            className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
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
              <span className="font-bold block mb-0.5">Safety & Handling</span>
              <span className="text-emerald-100/80 leading-relaxed">
                {bug.human_safety || 'Harmless to humans. Safe to observe.'}
              </span>
            </div>
          </div>

          {/* Observation History Log */}
          <div className="p-3.5 rounded-2xl bg-nature-900/30 border border-nature-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-nature-400" /> Sighting History
            </h4>
            <div className="space-y-1.5 text-xs text-emerald-100/70">
              <div className="flex items-center justify-between py-1 border-b border-nature-800/60">
                <span>First Discovered:</span>
                <span className="font-semibold text-white">
                  {new Date(bug.firstDiscoveredAt || Date.now()).toLocaleDateString()} ({bug.firstLocation || 'Wild'})
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Most Recent Sighting:</span>
                <span className="font-semibold text-white">
                  {new Date(bug.lastSeen || bug.firstDiscoveredAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
