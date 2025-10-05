// Mock data for the Merge Planet game

export const mockGameData = {
  initialGameState: {
    grid: Array(6).fill(null).map(() => Array(6).fill(null).map(() => {
      // Randomly place some initial planets
      if (Math.random() > 0.8) {
        return {
          id: Math.random().toString(36).substr(2, 9),
          level: Math.random() > 0.5 ? 2 : 1
        };
      }
      return null;
    }))
  },
  
  planetTypes: {
    1: { name: 'Mercury', baseValue: 10, color: 'gray' },
    2: { name: 'Venus', baseValue: 25, color: 'orange' },
    3: { name: 'Earth', baseValue: 50, color: 'blue' },
    4: { name: 'Mars', baseValue: 100, color: 'red' },
    5: { name: 'Jupiter', baseValue: 200, color: 'amber' },
    6: { name: 'Saturn', baseValue: 500, color: 'purple' }
  },
  
  gameSettings: {
    gridSize: 6,
    maxPlanetLevel: 6,
    maxGameLevel: 100,
    coinCostForNewPlanet: 20,
    coinCostForLevelUp: 100,
    initialCoins: 100
  },
  
  achievements: [
    { id: 1, name: 'First Merge', description: 'Merge your first planet', unlocked: false },
    { id: 2, name: 'Earth Creator', description: 'Create an Earth planet', unlocked: false },
    { id: 3, name: 'Cosmic Collector', description: 'Earn 1000 coins', unlocked: false },
    { id: 4, name: 'Saturn Master', description: 'Create a Saturn planet', unlocked: false },
    { id: 5, name: 'Level 10', description: 'Reach level 10', unlocked: false },
    { id: 6, name: 'High Roller', description: 'Earn 10000 points', unlocked: false }
  ],
  
  leaderboard: [
    { rank: 1, name: 'CosmicMaster', score: 15420, level: 25 },
    { rank: 2, name: 'PlanetHunter', score: 12890, level: 22 },
    { rank: 3, name: 'StarForge', score: 11250, level: 20 },
    { rank: 4, name: 'GalaxyBuilder', score: 9870, level: 18 },
    { rank: 5, name: 'SpaceExplorer', score: 8640, level: 16 }
  ]
};

// Helper functions for game logic
export const gameUtils = {
  canMergePlanets: (planet1, planet2) => {
    return planet1.level === planet2.level && planet1.level < 6;
  },
  
  calculateMergeReward: (level) => {
    return {
      coins: level * 10,
      score: level * 50
    };
  },
  
  calculateLevelUpCost: (currentLevel) => {
    return 100 + (currentLevel * 10);
  },
  
  getRandomPlanetLevel: () => {
    const rand = Math.random();
    if (rand > 0.7) return 2;
    if (rand > 0.9) return 3;
    return 1;
  },
  
  checkLevelCompletion: (score, currentLevel) => {
    const requiredScore = currentLevel * 500;
    return score >= requiredScore;
  }
};