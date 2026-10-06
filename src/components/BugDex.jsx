import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, Grid, Eye, Calendar, ArrowUpDown, Camera, Info } from 'lucide-react';
import { getRarityData, RARITY_CONFIG } from '../utils/rarity';
import { playSound } from '../utils/audio';

const RARITY_FILTERS = ['ALL', 'COMMON', 'UNCOMMON', 'RARE', 'VERY RARE', 'LEGENDARY'];

export default function BugDex({ bugs, onSelectBug, onQuickScan }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState('ALL');
  const [sortBy, setSortBy] = useState('recent');

  // Extract unique orders from current bugs
  const availableOrders = useMemo(() => {
    const orders = new Set(bugs.map((b) => b.order).filter(Boolean));
    return ['ALL', ...Array.from(orders)];
  }, [bugs]);

  // Filter & sort bugs
  const filteredBugs = useMemo(() => {
    return bugs.filter((bug) => {
      // Search query
      const matchSearch =
        !searchQuery.trim() ||
        bug.common_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bug.scientific_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bug.order?.toLowerCase().includes(searchQuery.toLowerCase());

      // Rarity filter
      const matchRarity =
        selectedRarity === 'ALL' ||
        (bug.rarity && bug.rarity.toUpperCase() === selectedRarity.toUpperCase());

      // Order filter
      const matchOrder =
        selectedOrder === 'ALL' ||
        (bug.order && bug.order.toLowerCase() === selectedOrder.toLowerCase());

      return matchSearch && matchRarity && matchOrder;
    }).sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.lastSeen || b.firstDiscoveredAt || 0) - new Date(a.lastSeen || a.firstDiscoveredAt || 0);
      }
      if (sortBy === 'name') {
        return (a.common_name || '').localeCompare(b.common_name || '');
      }
      if (sortBy === 'sightings') {
        return (b.observationCount || 1) - (a.observationCount || 1);
      }
      if (sortBy === 'rarity') {
        const order = { LEGENDARY: 5, 'VERY RARE': 4, RARE: 3, UNCOMMON: 2, COMMON: 1 };
        return (order[b.rarity] || 0) - (order[a.rarity] || 0);
      }
      return 0;
    });
  }, [bugs, searchQuery, selectedRarity, selectedOrder, sortBy]);

  return (
    <div className="space-y-6 pb-28 pt-2">
      
      {/* Header & Dex Stats */}
      <div className="glass-panel p-5 rounded-3xl border border-nature-600/40 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white font-display tracking-tight">
                My BugDex Collection
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-nature-500/20 text-nature-300 font-bold text-xs border border-nature-500/30">
                {bugs.length} Species
              </span>
            </div>
            <p className="text-xs text-emerald-100/60 mt-0.5">
              Personal field journal of real-world insects cataloged with Gemini AI.
            </p>
          </div>

          <button
            onClick={() => {
              playSound('scan_start');
              onQuickScan();
            }}
            className="px-4 py-2.5 rounded-xl bg-nature-500 text-nature-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-nature-400 shadow-md shadow-nature-500/20 transition-all self-start sm:self-auto"
          >
            <Camera className="w-4 h-4" />
            <span>Scan New Insect</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3 text-left">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-nature-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bug name, Latin binomial, or order..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl glass-panel border border-nature-700/60 text-white placeholder-emerald-100/40 text-xs focus:outline-none focus:border-nature-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-emerald-200/50 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Rarity Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {RARITY_FILTERS.map((r) => {
            const isSelected = selectedRarity === r;
            const rData = RARITY_CONFIG[r] || { label: 'ALL', icon: '✨' };

            return (
              <button
                key={r}
                onClick={() => {
                  playSound('click');
                  setSelectedRarity(r);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-nature-500 text-nature-950 shadow-md shadow-nature-500/30'
                    : 'bg-nature-900/60 border border-nature-800 text-emerald-100/70 hover:bg-nature-800 hover:text-white'
                }`}
              >
                <span>{r === 'ALL' ? '✨ ALL' : `${rData.icon} ${r}`}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter & Sort Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Order Filter */}
          {availableOrders.length > 2 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-emerald-200/60">Order:</span>
              <select
                value={selectedOrder}
                onChange={(e) => {
                  playSound('click');
                  setSelectedOrder(e.target.value);
                }}
                className="bg-nature-900/80 border border-nature-700/60 text-emerald-200 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-nature-400"
              >
                {availableOrders.map((ord) => (
                  <option key={ord} value={ord} className="bg-nature-950 text-white">
                    {ord}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-nature-400" />
            <select
              value={sortBy}
              onChange={(e) => {
                playSound('click');
                setSortBy(e.target.value);
              }}
              className="bg-nature-900/80 border border-nature-700/60 text-emerald-200 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-nature-400"
            >
              <option value="recent" className="bg-nature-950 text-white">Most Recent</option>
              <option value="name" className="bg-nature-950 text-white">Name (A-Z)</option>
              <option value="rarity" className="bg-nature-950 text-white">Rarity (Highest)</option>
              <option value="sightings" className="bg-nature-950 text-white">Observation Count</option>
            </select>
          </div>

        </div>

      </div>

      {/* Collectible Grid */}
      {filteredBugs.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl text-center border border-dashed border-nature-700/60">
          <div className="w-14 h-14 rounded-2xl bg-nature-900 mx-auto flex items-center justify-center text-3xl mb-3 border border-nature-700">
            🔍
          </div>
          <h4 className="text-base font-bold text-white mb-1">No Insects Match Your Filter</h4>
          <p className="text-xs text-emerald-100/60 max-w-sm mx-auto mb-4">
            Try resetting your search query or go outside to scan new bugs!
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRarity('ALL');
              setSelectedOrder('ALL');
            }}
            className="px-4 py-2 rounded-xl glass-panel border border-nature-600 text-emerald-200 font-bold text-xs hover:bg-nature-800"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {filteredBugs.map((bug) => {
            const rarityInfo = getRarityData(bug.rarity);
            const isLegendary = rarityInfo.label === 'LEGENDARY';

            return (
              <div
                key={bug.id}
                onClick={() => {
                  playSound('click');
                  onSelectBug(bug);
                }}
                className={`glass-panel p-3 rounded-2xl border ${rarityInfo.border} hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer group text-left relative overflow-hidden flex flex-col justify-between ${
                  isLegendary ? 'holo-card-legendary shadow-[0_0_20px_rgba(245,158,11,0.25)]' : ''
                }`}
              >
                {/* Specimen Photo */}
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2.5 relative bg-nature-950">
                  <img
                    src={bug.photo || 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=400&auto=format&fit=crop&q=80'}
                    alt={bug.common_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Rarity Pill Badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider border backdrop-blur-md">
                    <span className={rarityInfo.badgeBg}>{rarityInfo.label}</span>
                  </div>

                  {/* Sightings Pill */}
                  {bug.observationCount > 1 && (
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-emerald-300 text-[9px] font-bold flex items-center gap-1">
                      <Eye className="w-2.5 h-2.5" />
                      <span>{bug.observationCount}x</span>
                    </div>
                  )}
                </div>

                {/* Bug Info */}
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display group-hover:text-nature-300 transition-colors">
                    {bug.common_name}
                  </h4>
                  <p className="text-[10px] italic text-emerald-200/50 truncate font-mono">
                    {bug.scientific_name}
                  </p>
                </div>

                {/* Bottom Footer Info */}
                <div className="mt-2 pt-2 border-t border-nature-800/60 flex items-center justify-between text-[10px] text-emerald-200/50">
                  <span className="truncate">{bug.order || 'Insecta'}</span>
                  <span>{new Date(bug.firstDiscoveredAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
