import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Coins, Star, Trophy, RotateCcw, ArrowLeft, Home, ShoppingCart, Zap } from 'lucide-react';
import { mockGameData, planetTypes, gameUtils } from '../data/mock';
import { useToast } from '../hooks/use-toast';
import { useAudio } from './AudioManager';

const Game = ({ onNavigate, gameStats, onStatsUpdate }) => {
  const { toast } = useToast();
  const { playSound } = useAudio();
  const [gameState, setGameState] = useState(mockGameData.initialGameState);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(100);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [moves, setMoves] = useState(0);
  const [sunLastTap, setSunLastTap] = useState(0);
  const [specialEffects, setSpecialEffects] = useState([]);

  // Initialize from gameStats on mount
  useEffect(() => {
    if (gameStats) {
      setScore(gameStats.score || 0);
      setCoins(gameStats.coins || 100);
      setCurrentLevel(gameStats.level || 1);
    }
  }, []);

  // Update parent stats whenever local stats change (with debounce to prevent infinite loops)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onStatsUpdate?.({
        score,
        coins,
        level: currentLevel
      });
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [score, coins, currentLevel]);

  const handleCellClick = useCallback((rowIndex, colIndex) => {
    const cell = gameState.grid[rowIndex][colIndex];
    
    if (selectedPlanet && !cell) {
      // Place selected planet
      const newGrid = [...gameState.grid];
      newGrid[rowIndex][colIndex] = selectedPlanet;
      setGameState({ ...gameState, grid: newGrid });
      setSelectedPlanet(null);
      setMoves(moves + 1);
      playSound('place');
    } else if (cell && !selectedPlanet) {
      // Select planet
      if (cell.type === 'sun') {
        handleSunDoubleTap(cell);
        return;
      }
      
      setSelectedPlanet(cell);
      const newGrid = [...gameState.grid];
      newGrid[rowIndex][colIndex] = null;
      setGameState({ ...gameState, grid: newGrid });
      playSound('select');
    } else if (selectedPlanet && cell && gameUtils.canMergePlanets(selectedPlanet, cell)) {
      // Merge planets
      handlePlanetMerge(selectedPlanet, cell, rowIndex, colIndex);
    }
  }, [gameState, selectedPlanet, moves, playSound]);

  const handlePlanetMerge = (planet1, planet2, rowIndex, colIndex) => {
    const newGrid = [...gameState.grid];
    let newLevel = planet2.level + 1;
    let newPlanet = { id: Date.now(), level: newLevel };
    
    // Special case: Moon + Moon = Mars (Level 4)
    if (planet1.type === 'moon' && planet2.type === 'moon') {
      newPlanet = { id: Date.now(), level: 4 };
      playSound('merge');
      showSpecialEffect(rowIndex, colIndex, '🔴 Mars from Moons!');
      
      toast({
        title: "🔴 Mars Created!",
        description: "Two moons merged into Mars! Special combination!"
      });
    }
    // Special case: Earth merging has chance to create Moon
    else if (planet2.level === 3 && gameUtils.checkMoonChance(planet2.level)) {
      newPlanet = { id: Date.now(), type: 'moon', level: 'moon' };
      playSound('moon_bonus');
      showSpecialEffect(rowIndex, colIndex, '🌙 Moon Discovered!');
      
      toast({
        title: "🌙 Moon Discovered!",
        description: "Earth merger created the Moon! Bonus rewards earned!"
      });
    }
    // After 9th planet (Pluto), create Sun
    else if (planet2.level === 9) {
      newPlanet = { id: Date.now(), type: 'sun', level: 'sun' };
      playSound('sun_double');
      showSpecialEffect(rowIndex, colIndex, '☀️ Sun Created!');
      
      toast({
        title: "☀️ Sun Created!",
        description: "Double-tap the Sun for massive coin bonuses!"
      });
    }
    
    newGrid[rowIndex][colIndex] = newPlanet;
    
    // Check for bonus planet spawn (25% chance)
    if (gameUtils.checkBonusPlanetSpawn()) {
      const bonusSpawn = gameUtils.spawnRandomPlanetOnGrid(newGrid);
      if (bonusSpawn) {
        newGrid[bonusSpawn.position[0]][bonusSpawn.position[1]] = bonusSpawn.planet;
        showSpecialEffect(bonusSpawn.position[0], bonusSpawn.position[1], '✨ Bonus Planet!');
        playSound('achievement');
        
        toast({
          title: "✨ Bonus Planet!",
          description: "A new planet appeared from cosmic energy!"
        });
      }
    }
    
    setGameState({ ...gameState, grid: newGrid });
    
    // Award coins and points
    const reward = gameUtils.calculateMergeReward(newLevel);
    let coinReward = reward.coins;
    let scoreReward = reward.score;
    
    // Moon bonus
    if (newPlanet.type === 'moon') {
      coinReward *= 3;
      scoreReward *= 3;
    }
    
    setCoins(coins + coinReward);
    setScore(score + scoreReward);
    setSelectedPlanet(null);
    setMoves(moves + 1);
    
    playSound('merge');
    playSound('coin_earn');
    
    // Show reward toast
    const planetName = planetTypes[newLevel]?.name || planetTypes[newPlanet.type]?.name || 'Unknown';
    toast({
      title: `${planetName} Created!`,
      description: `+${coinReward} coins, +${scoreReward} points`
    });
    
    // Check for level completion
    if (gameUtils.checkLevelCompletion(score + scoreReward, currentLevel)) {
      setCurrentLevel(prev => Math.min(prev + 1, 1000000));
      playSound('level_up');
      toast({
        title: `🎉 Level ${currentLevel + 1}!`,
        description: "Congratulations on reaching a new level!"
      });
    }
  };

  const handleSunDoubleTap = (sunCell) => {
    const now = Date.now();
    const timeSinceLastTap = now - sunLastTap;
    
    if (timeSinceLastTap < mockGameData.gameSettings.sunDoubleTapWindow) {
      // Double tap detected!
      const doubleCoins = gameUtils.getSunDoubleTapReward(coins);
      setCoins(coins + doubleCoins);
      
      playSound('sun_double');
      showSpecialEffect(0, 0, `☀️ +${doubleCoins} COINS!`);
      
      toast({
        title: "☀️ Sun Power Activated!",
        description: `Double coins reward: +${doubleCoins} coins!`
      });
      
      setSunLastTap(0); // Reset
    } else {
      setSunLastTap(now);
      toast({
        title: "☀️ Sun Selected",
        description: "Double-tap quickly for coin bonus!"
      });
    }
  };

  const showSpecialEffect = (row, col, text) => {
    const effect = {
      id: Date.now(),
      row,
      col,
      text,
      timestamp: Date.now()
    };
    
    setSpecialEffects(prev => [...prev, effect]);
    
    // Remove effect after animation
    setTimeout(() => {
      setSpecialEffects(prev => prev.filter(e => e.id !== effect.id));
    }, 2000);
  };

  const addRandomPlanet = () => {
    if (coins >= 20) {
      const emptySpots = [];
      gameState.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (!cell) emptySpots.push([rowIndex, colIndex]);
        });
      });
      
      if (emptySpots.length > 0) {
        const randomSpot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
        const newGrid = [...gameState.grid];
        newGrid[randomSpot[0]][randomSpot[1]] = {
          id: Date.now(),
          level: gameUtils.getRandomPlanetLevel()
        };
        setGameState({ ...gameState, grid: newGrid });
        setCoins(coins - 20);
        playSound('place');
      }
    }
  };

  const resetGame = () => {
    setGameState(mockGameData.initialGameState);
    setSelectedPlanet(null);
    setScore(0);
    setCoins(100);
    setMoves(0);
    setCurrentLevel(1);
    setSpecialEffects([]);
    playSound('click');
  };

  const levelUp = () => {
    const cost = gameUtils.calculateLevelUpCost(currentLevel);
    if (coins >= cost && currentLevel < 1000000) {
      setCurrentLevel(currentLevel + 1);
      setCoins(coins - cost);
      playSound('level_up');
    }
  };

  const renderPlanet = (cell) => {
    if (!cell) return null;
    
    const planetData = planetTypes[cell.level] || planetTypes[cell.type];
    if (!planetData) return null;
    
    return (
      <div className={`
        w-full h-full rounded-lg bg-gradient-to-br ${planetData.color}
        flex items-center justify-center text-white font-bold shadow-lg
        ${selectedPlanet && selectedPlanet.id === cell.id ? 'ring-2 ring-blue-400 ring-opacity-75' : ''}
        ${cell.type === 'sun' ? 'animate-pulse' : ''}
        transition-all duration-200 hover:scale-105
      `}>
        <div className="text-center">
          <div className="text-lg md:text-xl">{planetData.emoji}</div>
          <div className="text-xs">{cell.type || cell.level}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                playSound('click');
                onNavigate('menu');
              }} 
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Menu
            </Button>
            <Button 
              onClick={() => {
                playSound('click');
                onNavigate('shop');
              }} 
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Shop
            </Button>
          </div>
          
          <div className="text-center flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Merge Planet
            </h1>
            <p className="text-gray-300 text-sm hidden md:block">Merge planets to create new worlds and earn cosmic rewards!</p>
          </div>
          
          <div className="w-20" /> {/* Spacer for balance */}
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4 bg-black/20 border-gray-700">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Level</p>
                <p className="text-xl font-bold text-white">{currentLevel.toLocaleString()}/1M</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-black/20 border-gray-700">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Score</p>
                <p className="text-xl font-bold text-white">{score.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-black/20 border-gray-700">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-400">Coins</p>
                <p className="text-xl font-bold text-white">{coins.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-black/20 border-gray-700">
            <div>
              <p className="text-sm text-gray-400">Moves</p>
              <p className="text-xl font-bold text-white">{moves}</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-black/20 border-gray-700">
            <Button 
              onClick={() => {
                playSound('click');
                levelUp();
              }}
              disabled={coins < gameUtils.calculateLevelUpCost(currentLevel) || currentLevel >= 10000000}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Level Up
              <br />
              <span className="text-xs">{gameUtils.calculateLevelUpCost(currentLevel)} coins</span>
            </Button>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Game Board */}
          <div className="md:col-span-2 relative">
            <Card className="p-6 bg-black/30 border-gray-700">
              <div className="grid grid-cols-6 gap-2 mb-4 relative">
                {gameState.grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={`
                        aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200
                        ${cell ? 'border-gray-600' : 'border-gray-800'}
                        ${selectedPlanet ? 'hover:border-blue-400' : ''}
                        ${cell ? 'hover:scale-105 hover:shadow-lg' : 'hover:bg-gray-800/50'}
                        flex items-center justify-center relative
                      `}
                    >
                      {renderPlanet(cell)}
                    </div>
                  ))
                )}
                
                {/* Special Effects Overlay */}
                {specialEffects.map(effect => (
                  <div
                    key={effect.id}
                    className="absolute pointer-events-none z-10 animate-bounce"
                    style={{
                      left: `${(effect.col * 16.66)}%`,
                      top: `${(effect.row * 16.66)}%`,
                    }}
                  >
                    <div className="bg-yellow-400 text-black px-2 py-1 rounded-lg font-bold text-xs whitespace-nowrap">
                      {effect.text}
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedPlanet && (
                <div className="text-center p-3 bg-blue-500/20 rounded-lg border border-blue-500/50">
                  <p className="text-blue-300 text-sm">
                    Selected: {planetTypes[selectedPlanet.level]?.name || planetTypes[selectedPlanet.type]?.name} 
                    (Level {selectedPlanet.level})
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Click an empty cell to place, or same level planet to merge
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Planet Guide */}
            <Card className="p-4 bg-black/30 border-gray-700">
              <h3 className="text-white font-bold mb-3">Solar System</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {Object.entries(planetTypes).map(([level, planet]) => (
                  <div key={level} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${planet.color} flex items-center justify-center`}>
                      <span className="text-xs">{planet.emoji}</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{planet.name}</p>
                      <p className="text-gray-400 text-xs">
                        {level === 'moon' ? 'Earth Bonus' : level === 'sun' ? 'Ultimate Goal' : `Level ${level}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-4 bg-black/30 border-gray-700">
              <h3 className="text-white font-bold mb-3">Actions</h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    playSound('click');
                    addRandomPlanet();
                  }}
                  disabled={coins < 20}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  Add Planet (20 coins)
                </Button>
                
                <Button 
                  onClick={resetGame}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Game
                </Button>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-4 bg-black/30 border-gray-700">
              <h3 className="text-white font-bold mb-2">Special Features</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>🌍 Earth + Earth = Moon chance</li>
                <li>♇ Pluto + Pluto = Sun</li>
                <li>☀️ Double-tap Sun for coin bonus</li>
                <li>🎯 Reach Level 1,000,000!</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;