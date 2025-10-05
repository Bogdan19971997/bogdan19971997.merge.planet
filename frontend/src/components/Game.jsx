import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Coins, Star, Trophy, RotateCcw, ArrowLeft, Home, ShoppingCart } from 'lucide-react';
import { mockGameData } from '../data/mock';
import { useToast } from '../hooks/use-toast';

const Game = ({ onNavigate, gameStats, onStatsUpdate }) => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState(mockGameData.initialGameState);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [score, setScore] = useState(gameStats?.score || 0);
  const [coins, setCoins] = useState(gameStats?.coins || 100);
  const [currentLevel, setCurrentLevel] = useState(gameStats?.level || 1);
  const [moves, setMoves] = useState(0);

  // Update parent stats whenever local stats change
  useEffect(() => {
    onStatsUpdate?.({
      score,
      coins,
      level: currentLevel
    });
  }, [score, coins, currentLevel, onStatsUpdate]);

  const planetTypes = {
    1: { name: 'Mercury', color: 'from-gray-400 to-gray-600', emoji: '☿️' },
    2: { name: 'Venus', color: 'from-orange-400 to-yellow-500', emoji: '♀️' },
    3: { name: 'Earth', color: 'from-blue-400 to-green-500', emoji: '🌍' },
    4: { name: 'Mars', color: 'from-red-400 to-red-600', emoji: '♂️' },
    5: { name: 'Jupiter', color: 'from-amber-500 to-orange-600', emoji: '♃' },
    6: { name: 'Saturn', color: 'from-purple-400 to-indigo-600', emoji: '♄' }
  };

  const handleCellClick = (rowIndex, colIndex) => {
    const cell = gameState.grid[rowIndex][colIndex];
    
    if (selectedPlanet && !cell) {
      // Place selected planet
      const newGrid = [...gameState.grid];
      newGrid[rowIndex][colIndex] = selectedPlanet;
      setGameState({ ...gameState, grid: newGrid });
      setSelectedPlanet(null);
      setMoves(moves + 1);
    } else if (cell && !selectedPlanet) {
      // Select planet
      setSelectedPlanet(cell);
      const newGrid = [...gameState.grid];
      newGrid[rowIndex][colIndex] = null;
      setGameState({ ...gameState, grid: newGrid });
    } else if (selectedPlanet && cell && selectedPlanet.level === cell.level && selectedPlanet.level < 6) {
      // Merge planets
      const newGrid = [...gameState.grid];
      const newLevel = cell.level + 1;
      newGrid[rowIndex][colIndex] = { id: Date.now(), level: newLevel };
      setGameState({ ...gameState, grid: newGrid });
      
      // Award coins and points
      const coinReward = newLevel * 10;
      const scoreReward = newLevel * 50;
      setCoins(coins + coinReward);
      setScore(score + scoreReward);
      setSelectedPlanet(null);
      setMoves(moves + 1);
      
      // Show reward toast
      toast({
        title: `${planetTypes[newLevel].name} Created!`,
        description: `+${coinReward} coins, +${scoreReward} points`
      });
      
      // Check for level completion
      if (newLevel === 6) {
        // Bonus for creating max level planet
        setCoins(coins + coinReward + 100);
        setScore(score + scoreReward + 500);
        toast({
          title: "🎉 Saturn Achieved!",
          description: "Bonus: +100 coins, +500 points!"
        });
      }
    }
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
          level: Math.random() > 0.7 ? 2 : 1
        };
        setGameState({ ...gameState, grid: newGrid });
        setCoins(coins - 20);
      }
    }
  };

  const resetGame = () => {
    setGameState(mockGameData.initialGameState);
    setSelectedPlanet(null);
    setScore(0);
    setCoins(100);
    setMoves(0);
  };

  const levelUp = () => {
    if (coins >= 100 && currentLevel < 100) {
      setCurrentLevel(currentLevel + 1);
      setCoins(coins - 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => onNavigate('menu')} 
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Menu
            </Button>
            <Button 
              onClick={() => onNavigate('shop')} 
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
                <p className="text-xl font-bold text-white">{currentLevel}/100</p>
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
                <p className="text-xl font-bold text-white">{coins}</p>
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
              onClick={levelUp} 
              disabled={coins < 100 || currentLevel >= 100}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Level Up
            </Button>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Game Board */}
          <div className="md:col-span-2">
            <Card className="p-6 bg-black/30 border-gray-700">
              <div className="grid grid-cols-6 gap-2 mb-4">
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
                      {cell && (
                        <div className={`
                          w-full h-full rounded-lg bg-gradient-to-br ${planetTypes[cell.level].color}
                          flex items-center justify-center text-white font-bold shadow-lg
                          ${selectedPlanet && selectedPlanet.id === cell.id ? 'ring-2 ring-blue-400' : ''}
                        `}>
                          <div className="text-center">
                            <div className="text-lg">{planetTypes[cell.level].emoji}</div>
                            <div className="text-xs">{cell.level}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              {selectedPlanet && (
                <div className="text-center p-3 bg-blue-500/20 rounded-lg border border-blue-500/50">
                  <p className="text-blue-300 text-sm">
                    Selected: {planetTypes[selectedPlanet.level].name} (Level {selectedPlanet.level})
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
              <h3 className="text-white font-bold mb-3">Planet Types</h3>
              <div className="space-y-2">
                {Object.entries(planetTypes).map(([level, planet]) => (
                  <div key={level} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${planet.color} flex items-center justify-center`}>
                      <span className="text-xs text-white font-bold">{level}</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{planet.name}</p>
                      <p className="text-gray-400 text-xs">Level {level}</p>
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
                  onClick={addRandomPlanet}
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
              <h3 className="text-white font-bold mb-2">How to Play</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Click planets to select them</li>
                <li>• Merge same level planets</li>
                <li>• Earn coins from merging</li>
                <li>• Use coins to level up</li>
                <li>• Reach level 100 to win!</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;