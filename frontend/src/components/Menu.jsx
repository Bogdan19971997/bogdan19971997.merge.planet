import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Play, ShoppingCart, Crown, Settings, Trophy, Star, Users } from 'lucide-react';
import { mockGameData } from '../data/mock';
import { useAudio } from './AudioManager';

const Menu = ({ onNavigate, gameStats }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const menuItems = [
    {
      id: 'play',
      title: 'Play Game',
      description: 'Start your cosmic adventure',
      icon: Play,
      color: 'from-green-500 to-emerald-600',
      action: () => onNavigate('game')
    },
    {
      id: 'shop',
      title: 'Cosmic Shop',
      description: 'Buy power-ups & boosters',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-600',
      action: () => onNavigate('shop'),
      badge: 'Hot'
    },
    {
      id: 'premium',
      title: 'Premium Store',
      description: 'Exclusive items & coins',
      icon: Crown,
      color: 'from-yellow-500 to-amber-600',
      action: () => onNavigate('premium'),
      badge: 'Premium'
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      description: 'Compete with other players',
      icon: Trophy,
      color: 'from-purple-500 to-indigo-600',
      action: () => onNavigate('leaderboard')
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'View achievements & stats',
      icon: Users,
      color: 'from-pink-500 to-rose-600',
      action: () => onNavigate('profile')
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Audio, notifications & more',
      icon: Settings,
      color: 'from-gray-500 to-slate-600',
      action: () => onNavigate('settings')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Merge Planet
            </h1>
            <p className="text-xl text-gray-300 mb-2">Create new worlds, explore the cosmos</p>
            <p className="text-lg text-gray-400">The ultimate planet merging adventure</p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-6 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{gameStats?.level || 1}</div>
              <div className="text-sm text-gray-400">Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{gameStats?.score?.toLocaleString() || '0'}</div>
              <div className="text-sm text-gray-400">Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{gameStats?.coins || 100}</div>
              <div className="text-sm text-gray-400">Coins</div>
            </div>
          </div>

          {/* Quick Play Button */}
          <Button 
            onClick={() => onNavigate('game')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <Play className="w-6 h-6 mr-3" />
            Start Playing
          </Button>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={item.id}
                className="group cursor-pointer bg-black/30 border-gray-700 hover:border-gray-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                onClick={item.action}
                onMouseEnter={() => setSelectedFeature(item.id)}
                onMouseLeave={() => setSelectedFeature(null)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    {item.badge && (
                      <Badge className={`${item.badge === 'Premium' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                    {item.description}
                  </p>

                  {selectedFeature === item.id && (
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <div className="text-xs text-blue-300 animate-pulse">
                        Click to continue →
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Featured Updates */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Latest Updates</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">New Power-ups Available!</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Discover cosmic boosters in the shop to accelerate your planet merging journey.
              </p>
            </Card>
            
            <Card className="bg-black/20 border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Premium Rewards</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Unlock exclusive planets and massive coin packages in our premium store.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;