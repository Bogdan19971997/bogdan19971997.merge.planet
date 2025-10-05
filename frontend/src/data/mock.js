// Mock data for the Merge Planet game

export const mockShopItems = {
  powerUps: [
    { id: 'auto_merge', name: 'Auto Merge', price: 50, description: 'Automatically merge planets' },
    { id: 'double_coins', name: 'Double Coins', price: 75, description: '2x coins for 5 minutes' },
    { id: 'lucky_spawn', name: 'Lucky Spawn', price: 100, description: 'Better planet spawns' }
  ],
  coinPacks: [
    { id: 'small_pack', name: 'Small Pack', coins: 500, price: 0, description: 'Watch ad' },
    { id: 'medium_pack', name: 'Medium Pack', coins: 1500, price: 200, description: '1,500 coins' },
    { id: 'large_pack', name: 'Large Pack', coins: 5000, price: 600, description: '5,000 coins' }
  ]
};

export const mockPremiumItems = [
  {
    id: 'starter_pack',
    name: 'Cosmic Starter',
    price: 2.99,
    coins: 2000,
    items: ['2,000 Coins', '3 Power-ups', 'Ad-Free Week']
  },
  {
    id: 'explorer_pack',
    name: 'Galaxy Explorer',
    price: 7.99,
    coins: 6000,
    items: ['6,000 Coins', '10 Power-ups', 'Ad-Free Month', 'Exclusive Skins']
  }
];

// Enhanced planet system with all 9 planets + Moon + Sun
export const planetTypes = {
  1: { name: 'Mercury', color: 'from-gray-400 to-gray-600', emoji: '☿️', sound: 'mercury' },
  2: { name: 'Venus', color: 'from-orange-400 to-yellow-500', emoji: '♀️', sound: 'venus' },
  3: { name: 'Earth', color: 'from-blue-400 to-green-500', emoji: '🌍', sound: 'earth', special: 'moon_chance' },
  4: { name: 'Mars', color: 'from-red-400 to-red-600', emoji: '♂️', sound: 'mars' },
  5: { name: 'Jupiter', color: 'from-amber-500 to-orange-600', emoji: '♃', sound: 'jupiter' },
  6: { name: 'Saturn', color: 'from-purple-400 to-indigo-600', emoji: '♄', sound: 'saturn' },
  7: { name: 'Uranus', color: 'from-cyan-400 to-blue-600', emoji: '♅', sound: 'uranus' },
  8: { name: 'Neptune', color: 'from-blue-600 to-indigo-700', emoji: '♆', sound: 'neptune' },
  9: { name: 'Pluto', color: 'from-gray-600 to-purple-700', emoji: '♇', sound: 'pluto' },
  'moon': { name: 'Moon', color: 'from-gray-200 to-gray-400', emoji: '🌙', sound: 'moon', special: true },
  'sun': { name: 'Sun', color: 'from-yellow-300 to-orange-500', emoji: '☀️', sound: 'sun', special: 'double_coins' }
};

export const mockGameData = {
  initialGameState: {
    grid: Array(6).fill(null).map(() => Array(6).fill(null).map(() => {
      // More planets on the grid initially (65% filled)
      if (Math.random() < 0.65) {
        return {
          id: Math.random().toString(36).substr(2, 9),
          level: Math.random() > 0.7 ? (Math.random() > 0.5 ? 3 : 2) : 1
        };
      }
      return null;
    }))
  },
  
  gameSettings: {
    gridSize: 6,
    maxPlanetLevel: 9,
    maxGameLevel: 10000000, // 10 Million levels
    coinCostForNewPlanet: 20,
    coinCostForLevelUp: 100,
    initialCoins: 100,
    moonChance: 0.15, // 15% chance when merging Earth
    sunDoubleTapWindow: 1000, // 1 second window for double tap
    bonusPlanetChance: 0.25, // 25% chance to spawn bonus planet on merge
    autoSpawnRate: 0.3, // 30% chance to auto-spawn planets periodically
    moonMergeLevel: 4, // Moons merge into Mars level
    initialPlanetDensity: 0.65 // 65% of grid filled initially
  },
  
  achievements: [
    { id: 1, name: 'First Merge', description: 'Merge your first planet', unlocked: false },
    { id: 2, name: 'Earth Creator', description: 'Create an Earth planet', unlocked: false },
    { id: 3, name: 'Lunar Discovery', description: 'Discover the Moon', unlocked: false },
    { id: 4, name: 'Solar Master', description: 'Create the Sun', unlocked: false },
    { id: 5, name: 'Cosmic Collector', description: 'Earn 1000 coins', unlocked: false },
    { id: 6, name: 'Pluto Finder', description: 'Create Pluto', unlocked: false },
    { id: 7, name: 'Level 100', description: 'Reach level 100', unlocked: false },
    { id: 8, name: 'Solar System Master', description: 'Create all 9 planets', unlocked: false }
  ],
  
  leaderboard: [
    { rank: 1, name: 'CosmicMaster', score: 154200, level: 250 },
    { rank: 2, name: 'PlanetHunter', score: 128900, level: 220 },
    { rank: 3, name: 'StarForge', score: 112500, level: 200 },
    { rank: 4, name: 'GalaxyBuilder', score: 98700, level: 180 },
    { rank: 5, name: 'SpaceExplorer', score: 86400, level: 160 }
  ],
  
  soundEffects: {
    menu: {
      hover: '/sounds/menu_hover.mp3',
      click: '/sounds/menu_click.mp3',
      transition: '/sounds/page_transition.mp3'
    },
    game: {
      merge: '/sounds/planet_merge.mp3',
      select: '/sounds/planet_select.mp3',
      place: '/sounds/planet_place.mp3',
      coin_earn: '/sounds/coin_earn.mp3',
      level_up: '/sounds/level_up.mp3',
      moon_bonus: '/sounds/moon_discover.mp3',
      sun_double: '/sounds/sun_power.mp3',
      achievement: '/sounds/achievement.mp3'
    },
    planets: {
      mercury: '/sounds/planets/mercury.mp3',
      venus: '/sounds/planets/venus.mp3',
      earth: '/sounds/planets/earth.mp3',
      mars: '/sounds/planets/mars.mp3',
      jupiter: '/sounds/planets/jupiter.mp3',
      saturn: '/sounds/planets/saturn.mp3',
      uranus: '/sounds/planets/uranus.mp3',
      neptune: '/sounds/planets/neptune.mp3',
      pluto: '/sounds/planets/pluto.mp3',
      moon: '/sounds/planets/moon.mp3',
      sun: '/sounds/planets/sun.mp3'
    }
  }
};

// Helper functions for game logic
export const gameUtils = {
  canMergePlanets: (planet1, planet2) => {
    // Regular planets can merge with same level
    if (planet1.level === planet2.level && planet1.level <= 9) return true;
    // Moons can merge with other moons to create Mars
    if (planet1.type === 'moon' && planet2.type === 'moon') return true;
    return false;
  },
  
  calculateMergeReward: (level) => {
    const baseReward = level * 10;
    return {
      coins: baseReward,
      score: baseReward * 5
    };
  },
  
  calculateLevelUpCost: (currentLevel) => {
    return Math.floor(100 + (currentLevel * 15));
  },
  
  getRandomPlanetLevel: () => {
    const rand = Math.random();
    if (rand > 0.85) return 3;
    if (rand > 0.7) return 2;
    return 1;
  },
  
  checkLevelCompletion: (score, currentLevel) => {
    const requiredScore = currentLevel * 1000;
    return score >= requiredScore;
  },
  
  checkMoonChance: (earthMergeLevel) => {
    // Higher chance for moon when merging higher level earths
    const baseChance = 0.15;
    const bonusChance = earthMergeLevel * 0.05;
    return Math.random() < (baseChance + bonusChance);
  },

  checkBonusPlanetSpawn: () => {
    // 25% chance to spawn bonus planet after merge
    return Math.random() < 0.25;
  },

  spawnRandomPlanetOnGrid: (grid) => {
    const emptySpots = [];
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell) emptySpots.push([rowIndex, colIndex]);
      });
    });
    
    if (emptySpots.length > 0) {
      const randomSpot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
      return {
        position: randomSpot,
        planet: {
          id: Date.now() + Math.random(),
          level: Math.random() > 0.8 ? 2 : 1
        }
      };
    }
    return null;
  },
  
  getSunDoubleTapReward: (currentCoins) => {
    return currentCoins; // Double the current coins
  }
};