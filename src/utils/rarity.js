export const RARITY_CONFIG = {
  COMMON: {
    label: 'COMMON',
    color: 'text-slate-300',
    bg: 'bg-slate-800/80',
    border: 'border-slate-600/50',
    glow: 'shadow-[0_0_15px_rgba(148,163,184,0.15)]',
    badgeBg: 'bg-slate-700/60 text-slate-200 border-slate-500/40',
    xpReward: 100,
    repeatXp: 30,
    gradient: 'from-slate-700/40 to-slate-900/80',
    icon: '⚪',
  },
  UNCOMMON: {
    label: 'UNCOMMON',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/80',
    border: 'border-emerald-500/40',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.25)]',
    badgeBg: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40',
    xpReward: 200,
    repeatXp: 50,
    gradient: 'from-emerald-800/40 to-emerald-950/90',
    icon: '🟢',
  },
  RARE: {
    label: 'RARE',
    color: 'text-blue-400',
    bg: 'bg-blue-950/80',
    border: 'border-blue-500/50',
    glow: 'shadow-[0_0_25px_rgba(59,130,246,0.35)]',
    badgeBg: 'bg-blue-900/60 text-blue-300 border-blue-400/40',
    xpReward: 400,
    repeatXp: 80,
    gradient: 'from-blue-800/40 to-blue-950/90',
    icon: '🔷',
  },
  'VERY RARE': {
    label: 'VERY RARE',
    color: 'text-purple-400',
    bg: 'bg-purple-950/80',
    border: 'border-purple-500/60',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.45)]',
    badgeBg: 'bg-purple-900/60 text-purple-300 border-purple-400/50',
    xpReward: 750,
    repeatXp: 120,
    gradient: 'from-purple-800/40 to-purple-950/90',
    icon: '🔮',
  },
  LEGENDARY: {
    label: 'LEGENDARY',
    color: 'text-amber-400',
    bg: 'bg-amber-950/80',
    border: 'border-amber-400/70',
    glow: 'shadow-[0_0_35px_rgba(245,158,11,0.55)]',
    badgeBg: 'bg-amber-900/70 text-amber-300 border-amber-400/60',
    xpReward: 1500,
    repeatXp: 250,
    gradient: 'from-amber-600/30 via-yellow-900/40 to-stone-950/95',
    icon: '👑',
  },
};

export const normalizeRarity = (rarityStr) => {
  if (!rarityStr) return 'COMMON';
  const clean = rarityStr.toString().trim().toUpperCase();
  if (clean.includes('LEGEND')) return 'LEGENDARY';
  if (clean.includes('VERY') || clean.includes('EPIC') || clean.includes('MYTHIC')) return 'VERY RARE';
  if (clean.includes('RARE')) return 'RARE';
  if (clean.includes('UNCOMMON')) return 'UNCOMMON';
  return 'COMMON';
};

export const getRarityData = (rarityStr) => {
  const norm = normalizeRarity(rarityStr);
  return RARITY_CONFIG[norm] || RARITY_CONFIG.COMMON;
};
