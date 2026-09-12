/**
 * Authoritative RPG Engine for Build Your City: Life RPG
 * Enforces non-linear XP formulas, streaks, rewards, and city tiers.
 */

// Formula: requiredXP(level) = floor(100 * (level ^ 1.5))
export const calculateRequiredXPForLevel = (level) => {
  if (level < 1) return 100;
  return Math.floor(100 * Math.pow(level, 1.5));
};

// Calculate total XP required to reach a specific level starting from level 1
export const calculateTotalXPForLevel = (targetLevel) => {
  let total = 0;
  for (let lvl = 1; lvl < targetLevel; lvl++) {
    total += calculateRequiredXPForLevel(lvl);
  }
  return total;
};

// Given an absolute total XP, determine current level, current level progress, and XP needed for next level
export const calculateLevelFromTotalXP = (totalXP) => {
  let level = 1;
  let remainingXP = Number(totalXP);

  while (true) {
    const requiredForCurrent = calculateRequiredXPForLevel(level);
    if (remainingXP >= requiredForCurrent) {
      remainingXP -= requiredForCurrent;
      level += 1;
    } else {
      break;
    }
  }

  const nextLevelRequiredXP = calculateRequiredXPForLevel(level);
  const progressPercent = Math.min(100, Math.round((remainingXP / nextLevelRequiredXP) * 100));

  return {
    level,
    currentLevelXP: remainingXP,
    nextLevelRequiredXP,
    progressPercent,
    cityTier: getCityTier(level),
    cityTitle: getCityTitle(level)
  };
};

export const getCityTier = (level) => {
  if (level < 5) return 'Small Settlement';
  if (level < 10) return 'Village';
  if (level < 20) return 'Town';
  if (level < 40) return 'City';
  if (level < 60) return 'Metropolis';
  return 'Mega City';
};

export const getCityTitle = (level) => {
  if (level < 5) return 'Pioneer Outpost';
  if (level < 10) return 'Budding Township';
  if (level < 20) return 'Fortified Citadel';
  if (level < 40) return 'Thriving Capital';
  if (level < 60) return 'Grand Metropolis';
  return 'Omni-Dominion Megacity';
};

// Authoritative rewards based on quest difficulty
export const QUEST_DIFFICULTY_REWARDS = {
  easy: {
    xp: 25,
    gold: 10,
    attributeGain: 5,
    bossDamage: 25
  },
  medium: {
    xp: 60,
    gold: 25,
    attributeGain: 12,
    bossDamage: 60
  },
  hard: {
    xp: 125,
    gold: 60,
    attributeGain: 25,
    bossDamage: 125
  },
  epic: {
    xp: 300,
    gold: 150,
    attributeGain: 60,
    bossDamage: 300
  }
};

// Category mapping to character RPG attributes
export const CATEGORY_TO_ATTRIBUTE = {
  coding: 'tech_xp',
  study: 'knowledge_xp',
  fitness: 'strength_xp',
  wellness: 'wellness_xp',
  finance: 'economy_xp',
  creative: 'culture_xp',
  social: 'community_xp'
};

// Department name formatting for game theme
export const DEPARTMENT_NAMES = {
  coding: 'Technology Department',
  study: 'Knowledge Academy',
  fitness: 'Physical Defense',
  wellness: 'Sanctuary of Wellness',
  finance: 'Treasury & Commerce',
  creative: 'Cultural Arts',
  social: 'Community Guild'
};

// Calculate streak updates authoritatively
export const calculateStreakUpdate = (lastCompletedDateStr, currentStreak, longestStreak) => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  if (!lastCompletedDateStr) {
    return {
      newStreak: 1,
      newLongest: Math.max(1, longestStreak || 0),
      isNewDay: true
    };
  }

  // Normalize last completion date (YYYY-MM-DD)
  const lastDate = new Date(lastCompletedDateStr);
  const lastDateStr = lastDate.toISOString().split('T')[0];

  if (lastDateStr === todayStr) {
    // Already completed a quest today; streak stays maintained
    return {
      newStreak: currentStreak,
      newLongest: longestStreak,
      isNewDay: false
    };
  }

  // Check if yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastDateStr === yesterdayStr) {
    // Consecutive day streak!
    const newStreak = currentStreak + 1;
    return {
      newStreak,
      newLongest: Math.max(newStreak, longestStreak),
      isNewDay: true
    };
  }

  // Missed a day -> reset to 1
  return {
    newStreak: 1,
    newLongest: Math.max(1, longestStreak),
    isNewDay: true
  };
};

// Population calculation based on city development metrics
export const calculatePopulation = (level, currentStreak, gold, buildingsCount = 0) => {
  const basePop = 100;
  const levelPop = level * 90;
  const streakPop = (currentStreak || 0) * 50;
  const wealthPop = Math.floor((gold || 0) / 10);
  const infrastructurePop = buildingsCount * 75;
  return basePop + levelPop + streakPop + wealthPop + infrastructurePop;
};
