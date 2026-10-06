import { getRarityData } from '../utils/rarity';

const STORAGE_KEYS = {
  BUGS: 'bugdex_bugs_collection_v1',
  USER_STATS: 'bugdex_user_stats_v1',
  DAILY_QUESTS: 'bugdex_daily_quests_v1',
  ACHIEVEMENTS: 'bugdex_achievements_v1',
  LAST_QUEST_DATE: 'bugdex_quest_date_v1',
  USER_PROFILE: 'bugdex_user_profile_v1',
};

export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'first_bug',
    icon: '🐛',
    title: 'First Bug',
    description: 'Discover your first insect',
    target: 1,
    unlocked: false,
    unlockedAt: null,
    xpReward: 100,
  },
  {
    id: 'bug_hunter',
    icon: '🔎',
    title: 'Bug Hunter',
    description: 'Discover 5 different unique bugs',
    target: 5,
    unlocked: false,
    unlockedAt: null,
    xpReward: 250,
  },
  {
    id: 'collector',
    icon: '🦋',
    title: 'Collector',
    description: 'Discover 10 different unique bugs',
    target: 10,
    unlocked: false,
    unlockedAt: null,
    xpReward: 500,
  },
  {
    id: 'nature_explorer',
    icon: '🌿',
    title: 'Nature Explorer',
    description: 'Discover 15 different unique bugs',
    target: 15,
    unlocked: false,
    unlockedAt: null,
    xpReward: 750,
  },
  {
    id: 'night_hunter',
    icon: '🌙',
    title: 'Night Hunter',
    description: 'Discover a nocturnal or evening insect',
    target: 1,
    unlocked: false,
    unlockedAt: null,
    xpReward: 300,
  },
  {
    id: 'bug_master',
    icon: '🏆',
    title: 'Bug Master',
    description: 'Discover 25 different unique bugs',
    target: 25,
    unlocked: false,
    unlockedAt: null,
    xpReward: 1500,
  },
  {
    id: 'legendary_seeker',
    icon: '👑',
    title: 'Crown of Nature',
    description: 'Discover a Legendary insect',
    target: 1,
    unlocked: false,
    unlockedAt: null,
    xpReward: 1000,
  },
  {
    id: 'streak_explorer',
    icon: '🔥',
    title: 'Streak Adventurer',
    description: 'Achieve a 3-day discovery streak',
    target: 3,
    unlocked: false,
    unlockedAt: null,
    xpReward: 400,
  },
];

export const DEFAULT_QUEST_POOL = [
  {
    id: 'quest_wings',
    title: 'Airborne Wonder',
    description: 'Find an insect with wings (bee, fly, wasp, dragon fly, beetle)',
    icon: '🪽',
    xpReward: 150,
  },
  {
    id: 'quest_flower',
    title: 'Flora Pollinator',
    description: 'Find an insect resting or feeding on a flower',
    icon: '🌸',
    xpReward: 200,
  },
  {
    id: 'quest_micro',
    title: 'Micro Marvel',
    description: 'Find an insect smaller than your fingernail',
    icon: '🔬',
    xpReward: 200,
  },
  {
    id: 'quest_butterfly',
    title: 'Fluttering Jewel',
    description: 'Find a butterfly, moth, or caterpillar',
    icon: '🦋',
    xpReward: 250,
  },
  {
    id: 'quest_underleaf',
    title: 'Undercover Resident',
    description: 'Find an insect hiding under a leaf or bark',
    icon: '🍃',
    xpReward: 250,
  },
  {
    id: 'quest_predator',
    title: 'Garden Guardian',
    description: 'Find a predatory insect (mantis, ladybug, dragonfly, spider)',
    icon: '🛡️',
    xpReward: 220,
  },
];

/**
 * Calculates level and progress percentage from total XP
 */
export function calculateLevelData(xp = 0) {
  // Threshold table: level N starts at thresholds[N-1]
  const thresholds = [
    0,     // Level 1
    200,   // Level 2
    500,   // Level 3
    950,   // Level 4
    1550,  // Level 5
    2350,  // Level 6
    3350,  // Level 7
    4600,  // Level 8
    6100,  // Level 9
    8000,  // Level 10
    10500, // Level 11
    13500, // Level 12
    17000, // Level 13
    21000, // Level 14
    26000, // Level 15
  ];

  let level = 1;
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  const currentLevelBaseXp = thresholds[level - 1] || 0;
  const nextLevelXp = thresholds[level] || (currentLevelBaseXp + level * 2500);
  const xpInLevel = xp - currentLevelBaseXp;
  const xpNeeded = nextLevelXp - currentLevelBaseXp;
  const progressPercent = Math.min(100, Math.max(0, Math.floor((xpInLevel / xpNeeded) * 100)));

  let rankTitle = 'Novice Bug Catcher';
  if (level >= 12) rankTitle = 'Legendary Grandmaster';
  else if (level >= 9) rankTitle = 'Master Entomologist';
  else if (level >= 7) rankTitle = 'Expert Naturalist';
  else if (level >= 5) rankTitle = 'Field Researcher';
  else if (level >= 3) rankTitle = 'Backyard Explorer';

  return {
    level,
    xp,
    currentLevelBaseXp,
    nextLevelXp,
    xpInLevel,
    xpNeeded,
    progressPercent,
    rankTitle,
  };
}

/**
 * Get all stored bugs
 */
export function getBugDex() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUGS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading BugDex:', e);
    return [];
  }
}

/**
 * Get user stats
 */
export function getUserStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    const defaults = {
      xp: 0,
      totalDiscovered: 0,
      uniqueDiscovered: 0,
      streak: 1,
      lastDiscoveryDate: null,
    };
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch (e) {
    return { xp: 0, totalDiscovered: 0, uniqueDiscovered: 0, streak: 1, lastDiscoveryDate: null };
  }
}

/**
 * Save or update user stats
 */
function saveUserStats(stats) {
  localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
}

/**
 * Get user profile info
 */
export function getUserProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    const defaults = {
      name: 'Field Explorer',
      avatar: '🌿',
      bio: 'Exploring biodiversity one bug at a time.',
      defaultLocation: 'Garden',
    };
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return { name: 'Field Explorer', avatar: '🌿', bio: '', defaultLocation: 'Garden' };
  }
}

export function saveUserProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

/**
 * Get daily quests with automatic day check
 */
export function getDailyQuests() {
  const todayStr = new Date().toISOString().split('T')[0];
  const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_QUEST_DATE);

  if (lastDate !== todayStr) {
    // Generate new active set of 3 quests
    const shuffled = [...DEFAULT_QUEST_POOL].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3).map((q) => ({
      ...q,
      completed: false,
      completedAt: null,
    }));
    localStorage.setItem(STORAGE_KEYS.DAILY_QUESTS, JSON.stringify(selected));
    localStorage.setItem(STORAGE_KEYS.LAST_QUEST_DATE, todayStr);
    return selected;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_QUESTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Complete a daily quest and award XP
 */
export function completeQuest(questId) {
  const quests = getDailyQuests();
  const quest = quests.find((q) => q.id === questId);
  if (!quest || quest.completed) return { success: false };

  quest.completed = true;
  quest.completedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.DAILY_QUESTS, JSON.stringify(quests));

  // Award XP
  const stats = getUserStats();
  const prevLevel = calculateLevelData(stats.xp).level;
  stats.xp += quest.xpReward || 200;
  saveUserStats(stats);
  const newLevel = calculateLevelData(stats.xp).level;

  return {
    success: true,
    xpAwarded: quest.xpReward || 200,
    leveledUp: newLevel > prevLevel,
    newLevel,
    quest,
  };
}

/**
 * Get achievements list
 */
export function getAchievements() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    const list = raw ? JSON.parse(raw) : INITIAL_ACHIEVEMENTS;
    // merge any new definitions from INITIAL_ACHIEVEMENTS
    const merged = INITIAL_ACHIEVEMENTS.map((item) => {
      const existing = list.find((e) => e.id === item.id);
      return existing ? { ...item, ...existing } : item;
    });
    return merged;
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

/**
 * Evaluates achievements based on current collection & stats
 */
function evaluateAchievements(bugs, stats) {
  const achievements = getAchievements();
  const unlockedNow = [];
  const uniqueCount = bugs.length;
  const isNight = () => {
    const hour = new Date().getHours();
    return hour >= 19 || hour < 6;
  };

  achievements.forEach((ach) => {
    if (ach.unlocked) return;

    let shouldUnlock = false;
    if (ach.id === 'first_bug' && uniqueCount >= 1) shouldUnlock = true;
    if (ach.id === 'bug_hunter' && uniqueCount >= 5) shouldUnlock = true;
    if (ach.id === 'collector' && uniqueCount >= 10) shouldUnlock = true;
    if (ach.id === 'nature_explorer' && uniqueCount >= 15) shouldUnlock = true;
    if (ach.id === 'bug_master' && uniqueCount >= 25) shouldUnlock = true;
    if (ach.id === 'legendary_seeker' && bugs.some((b) => b.rarity === 'LEGENDARY')) shouldUnlock = true;
    if (ach.id === 'streak_explorer' && stats.streak >= 3) shouldUnlock = true;
    if (ach.id === 'night_hunter' && (isNight() || bugs.some((b) => b.isNocturnal))) shouldUnlock = true;

    if (shouldUnlock) {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString();
      stats.xp += ach.xpReward || 200;
      unlockedNow.push(ach);
    }
  });

  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  return unlockedNow;
}

/**
 * Core Save Discovery Function:
 * Saves bug to Dex, handles duplicates & observation increments, calculates streak & XP.
 */
export function saveDiscovery(bugData, userLocation = 'Garden', photoBase64 = null) {
  const bugs = getBugDex();
  const stats = getUserStats();
  const prevLevel = calculateLevelData(stats.xp).level;
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Update Discovery Streak
  if (stats.lastDiscoveryDate) {
    const lastDate = new Date(stats.lastDiscoveryDate);
    const diffTime = Math.abs(now - lastDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      stats.streak += 1;
    } else if (diffDays > 1) {
      stats.streak = 1;
    }
  } else {
    stats.streak = 1;
  }
  stats.lastDiscoveryDate = now.toISOString();

  // Check if bug already exists in Dex
  const commonNameKey = (bugData.common_name || '').trim().toLowerCase();
  const sciNameKey = (bugData.scientific_name || '').trim().toLowerCase();

  const existingIndex = bugs.findIndex((b) => {
    const matchCommon = b.common_name && b.common_name.trim().toLowerCase() === commonNameKey;
    const matchSci = b.scientific_name && b.scientific_name.trim().toLowerCase() === sciNameKey;
    return matchCommon || matchSci;
  });

  const rarityInfo = getRarityData(bugData.rarity);
  let isNewDiscovery = false;
  let xpEarned = 0;
  let savedBug = null;

  const observationRecord = {
    id: 'obs_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: now.toISOString(),
    location: userLocation || 'Wild',
    photo: photoBase64,
    confidence: bugData.confidence,
  };

  if (existingIndex >= 0) {
    // Repeat observation
    isNewDiscovery = false;
    xpEarned = rarityInfo.repeatXp || 35;
    const existing = bugs[existingIndex];
    existing.observationCount = (existing.observationCount || 1) + 1;
    existing.lastSeen = now.toISOString();
    // Keep newest photo or best photo
    if (photoBase64) existing.photo = photoBase64;
    existing.observations = [observationRecord, ...(existing.observations || [])];
    // update details if more detailed
    existing.confidence = Math.max(existing.confidence || 0, bugData.confidence || 0);
    bugs[existingIndex] = existing;
    savedBug = existing;
  } else {
    // Brand new species discovery!
    isNewDiscovery = true;
    xpEarned = rarityInfo.xpReward || 100;
    savedBug = {
      id: 'bug_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      common_name: bugData.common_name || 'Mysterious Bug',
      scientific_name: bugData.scientific_name || 'Insecta incertae',
      order: bugData.order || 'Insecta',
      family: bugData.family || 'Unknown',
      confidence: bugData.confidence || 85,
      description: bugData.description || 'A fascinating arthropod specimen.',
      appearance: bugData.appearance || '',
      habitat: bugData.habitat || 'Temperate environment',
      diet: bugData.diet || 'Generalist',
      interesting_facts: bugData.interesting_facts || [],
      human_safety: bugData.human_safety || 'Harmless to humans.',
      rarity: rarityInfo.label,
      firstDiscoveredAt: now.toISOString(),
      lastSeen: now.toISOString(),
      firstLocation: userLocation || 'Wild',
      observationCount: 1,
      photo: photoBase64,
      observations: [observationRecord],
      isNocturnal: now.getHours() >= 19 || now.getHours() < 6,
    };
    bugs.unshift(savedBug);
  }

  // Update overall stats
  stats.totalDiscovered += 1;
  stats.uniqueDiscovered = bugs.length;
  stats.xp += xpEarned;

  // Check achievements
  const newAchievements = evaluateAchievements(bugs, stats);

  // Save changes
  localStorage.setItem(STORAGE_KEYS.BUGS, JSON.stringify(bugs));
  saveUserStats(stats);

  const newLevel = calculateLevelData(stats.xp).level;
  const leveledUp = newLevel > prevLevel;

  return {
    isNewDiscovery,
    xpEarned,
    leveledUp,
    newLevel,
    newAchievements,
    savedBug,
    stats: {
      ...stats,
      levelData: calculateLevelData(stats.xp),
    },
  };
}

/**
 * Seed sample bugs for rich demonstration
 */
export function seedSampleCollection() {
  const sampleBugs = [
    {
      id: 'sample_1',
      common_name: 'Seven-Spotted Ladybug',
      scientific_name: 'Coccinella septempunctata',
      order: 'Coleoptera',
      family: 'Coccinellidae',
      confidence: 94,
      description: 'A beloved glossy scarlet beetle renowned across gardens as a natural organic pest controller.',
      appearance: 'Round, dome-shaped red elytra with seven distinct black spots.',
      habitat: 'Gardens, meadows, crop fields and parks.',
      diet: 'Voracious predator of aphids and scale insects.',
      interesting_facts: [
        'A single ladybug can consume over 5,000 aphids in its lifetime.',
        'When threatened, they reflex-bleed a foul-tasting fluid from their leg joints.'
      ],
      human_safety: 'Harmless to humans. Cherished garden ally.',
      rarity: 'COMMON',
      firstDiscoveredAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      lastSeen: new Date(Date.now() - 86400000 * 1).toISOString(),
      firstLocation: 'Backyard Garden',
      observationCount: 3,
      photo: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&auto=format&fit=crop&q=80',
      observations: [],
    },
    {
      id: 'sample_2',
      common_name: 'Monarch Butterfly',
      scientific_name: 'Danaus plexippus',
      order: 'Lepidoptera',
      family: 'Nymphalidae',
      confidence: 96,
      description: 'An iconic, majestic migratory pollinator famous for multi-generational journeys across the Americas.',
      appearance: 'Tawny-orange wings laced with bold black veins and studded with white margins.',
      habitat: 'Milkweed meadows, botanical gardens, and sunny clearings.',
      diet: 'Nectar from wildflowers and milkweeds.',
      interesting_facts: [
        'Monarchs travel up to 3,000 miles to overwinter in the high mountains of Mexico.',
        'Caterpillars ingest milkweed cardenolides to become toxic to predatory birds.'
      ],
      human_safety: 'Harmless and gentle pollinator.',
      rarity: 'RARE',
      firstDiscoveredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      lastSeen: new Date().toISOString(),
      firstLocation: 'Botanical Garden',
      observationCount: 1,
      photo: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=800&auto=format&fit=crop&q=80',
      observations: [],
    },
    {
      id: 'sample_3',
      common_name: 'Chinese Praying Mantis',
      scientific_name: 'Tenodera sinensis',
      order: 'Mantodea',
      family: 'Mantidae',
      confidence: 95,
      description: 'An apex ambush predator equipped with 3D stereo vision and lightning-fast raptorial strike forelegs.',
      appearance: 'Slender elongated body with green wing margins and triangular swivel head.',
      habitat: 'Tall meadows, shrubs, forest edges, and gardens.',
      diet: 'Carnivorous: flies, crickets, grasshoppers, and moths.',
      interesting_facts: [
        'They are the only insects known to turn their head 180 degrees without moving their body.',
        'Their stereoscopic vision is unique in the animal kingdom.'
      ],
      human_safety: 'Harmless to humans. Do not harass, but safe to observe closely.',
      rarity: 'VERY RARE',
      firstDiscoveredAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      lastSeen: new Date(Date.now() - 86400000 * 5).toISOString(),
      firstLocation: 'Forest Edge',
      observationCount: 1,
      photo: 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=800&auto=format&fit=crop&q=80',
      observations: [],
    },
    {
      id: 'sample_4',
      common_name: 'Blue Emperor Dragonfly',
      scientific_name: 'Anax imperator',
      order: 'Odonata',
      family: 'Aeshnidae',
      confidence: 97,
      description: 'One of the largest and most ferocious aerial hunters, capable of flying backwards and hovering with pinpoint precision.',
      appearance: 'Apple-green thorax with an electric azure blue abdomen in males.',
      habitat: 'Clean ponds, lakes, marshes, and riverbanks.',
      diet: 'Mid-air hunter of mosquitoes, midges, and small butterflies.',
      interesting_facts: [
        'Dragonflies possess a hunting success rate exceeding 95%, higher than lions.',
        'They have nearly 360-degree vision with around 30,000 lens facets per eye.'
      ],
      human_safety: 'Completely harmless to humans. Champion mosquito predator!',
      rarity: 'RARE',
      firstDiscoveredAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      lastSeen: new Date().toISOString(),
      firstLocation: 'Park Wetland Pond',
      observationCount: 2,
      photo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      observations: [],
    },
    {
      id: 'sample_5',
      common_name: 'Atlas Moth',
      scientific_name: 'Attacus atlas',
      order: 'Lepidoptera',
      family: 'Saturniidae',
      confidence: 98,
      description: 'One of the largest lepidopterans in the world with a wingspan reaching up to 10 inches and snake-head wingtips.',
      appearance: 'Gigantic reddish-brown wings with triangular transparent fenestrae windows and cobra-like apical tips.',
      habitat: 'Subtropical and tropical secondary forests.',
      diet: 'Adults lack mouthparts and live off stored caterpillar reserves.',
      interesting_facts: [
        'The wingtips resemble cobra snake heads to terrify bird predators.',
        'Their silk is spun into durable fagara silk fabric.'
      ],
      human_safety: 'Completely gentle and harmless. A breathtaking living marvel.',
      rarity: 'LEGENDARY',
      firstDiscoveredAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      firstLocation: 'Rainforest Conservatory',
      observationCount: 1,
      photo: 'https://images.unsplash.com/photo-1533048324814-79b0a31982f1?w=800&auto=format&fit=crop&q=80',
      observations: [],
    }
  ];

  localStorage.setItem(STORAGE_KEYS.BUGS, JSON.stringify(sampleBugs));
  const stats = {
    xp: 3250,
    totalDiscovered: 8,
    uniqueDiscovered: 5,
    streak: 4,
    lastDiscoveryDate: new Date().toISOString(),
  };
  saveUserStats(stats);
  evaluateAchievements(sampleBugs, stats);
}

/**
 * Wipe all local data
 */
export function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.BUGS);
  localStorage.removeItem(STORAGE_KEYS.USER_STATS);
  localStorage.removeItem(STORAGE_KEYS.DAILY_QUESTS);
  localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
  localStorage.removeItem(STORAGE_KEYS.LAST_QUEST_DATE);
}
