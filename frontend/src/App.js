import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Game from "./components/Game";
import Shop from "./components/Shop";
import PremiumShop from "./components/PremiumShop";
import Settings from "./components/Settings";
import { Toaster } from "./components/ui/toaster";
import { AudioProvider } from "./components/AudioManager";
import { mockGameData } from "./data/mock";

function App() {
  const [currentScreen, setCurrentScreen] = useState('menu');
  const [gameStats, setGameStats] = useState({
    level: 1,
    score: 0,
    coins: 100,
    inventory: [],
    premiumItems: []
  });

  // Load game stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('mergePlanetStats');
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
  }, []);

  // Save game stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mergePlanetStats', JSON.stringify(gameStats));
  }, [gameStats]);

  const handleNavigation = (screen) => {
    setCurrentScreen(screen);
  };

  const handleGameStatsUpdate = (newStats) => {
    setGameStats(prevStats => ({ ...prevStats, ...newStats }));
  };

  const handlePurchase = (item, type = 'shop') => {
    if (type === 'shop') {
      // Handle in-game shop purchase
      if (item.coins) {
        setGameStats(prevStats => ({
          ...prevStats,
          coins: prevStats.coins + item.coins
        }));
      } else {
        setGameStats(prevStats => ({
          ...prevStats,
          coins: prevStats.coins - item.price,
          inventory: [...prevStats.inventory, item]
        }));
      }
    } else if (type === 'premium') {
      // Handle premium purchase
      setGameStats(prevStats => ({
        ...prevStats,
        coins: prevStats.coins + (item.coins || 0),
        premiumItems: [...prevStats.premiumItems, item]
      }));
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <Menu onNavigate={handleNavigation} gameStats={gameStats} />;
      case 'game':
        return (
          <Game 
            onNavigate={handleNavigation} 
            gameStats={gameStats}
            onStatsUpdate={handleGameStatsUpdate}
          />
        );
      case 'shop':
        return (
          <Shop 
            onNavigate={handleNavigation} 
            gameStats={gameStats}
            onPurchase={handlePurchase}
          />
        );
      case 'premium':
        return (
          <PremiumShop 
            onNavigate={handleNavigation} 
            gameStats={gameStats}
            onPurchase={(item) => handlePurchase(item, 'premium')}
          />
        );
      case 'leaderboard':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Leaderboard</h1>
              <p className="text-gray-300 mb-6">Coming Soon - Compete with players worldwide!</p>
              <button 
                onClick={() => handleNavigation('menu')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Back to Menu
              </button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Profile & Achievements</h1>
              <p className="text-gray-300 mb-6">View your cosmic journey and unlock achievements!</p>
              <button 
                onClick={() => handleNavigation('menu')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Back to Menu
              </button>
            </div>
          </div>
        );
      case 'settings':
        return (
          <Settings 
            onNavigate={handleNavigation} 
          />
        );
      default:
        return <Menu onNavigate={handleNavigation} gameStats={gameStats} />;
    }
  };

  return (
    <AudioProvider>
      <div className="App">
        <BrowserRouter>
          {renderScreen()}
        </BrowserRouter>
        <Toaster />
      </div>
    </AudioProvider>
  );
}

export default App;