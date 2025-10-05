import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Coins, Zap, Rocket, Target, Clock, Shield, Star } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Shop = ({ onNavigate, gameStats, onPurchase }) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('powerups');

  const categories = [
    { id: 'powerups', name: 'Power-ups', icon: Zap },
    { id: 'boosters', name: 'Boosters', icon: Rocket },
    { id: 'coins', name: 'Coin Packs', icon: Coins },
    { id: 'special', name: 'Special Items', icon: Star }
  ];

  const shopItems = {
    powerups: [
      {
        id: 'auto_merge',
        name: 'Auto Merge',
        description: 'Automatically merges planets of same level for 10 moves',
        price: 50,
        icon: Target,
        rarity: 'common',
        effect: 'Saves time and effort'
      },
      {
        id: 'double_coins',
        name: 'Double Coins',
        description: 'Earn 2x coins from merges for 5 minutes',
        price: 75,
        icon: Coins,
        rarity: 'uncommon',
        effect: 'Duration: 5 minutes'
      },
      {
        id: 'lucky_spawn',
        name: 'Lucky Spawn',
        description: 'Next 5 spawned planets will be level 2 or higher',
        price: 100,
        icon: Star,
        rarity: 'rare',
        effect: 'Better planet quality'
      }
    ],
    boosters: [
      {
        id: 'speed_boost',
        name: 'Speed Boost',
        description: 'Reduce merge cooldown by 50% for 10 minutes',
        price: 60,
        icon: Rocket,
        rarity: 'common',
        effect: 'Faster gameplay'
      },
      {
        id: 'mega_merge',
        name: 'Mega Merge',
        description: 'Merge up to 4 planets at once (3 uses)',
        price: 120,
        icon: Zap,
        rarity: 'epic',
        effect: '3 uses only'
      },
      {
        id: 'time_freeze',
        name: 'Time Freeze',
        description: 'Pause all timers and think strategically',
        price: 80,
        icon: Clock,
        rarity: 'uncommon',
        effect: 'Strategic planning'
      }
    ],
    coins: [
      {
        id: 'small_coins',
        name: 'Small Coin Pack',
        description: '500 coins for your cosmic adventures',
        price: 0,
        coins: 500,
        icon: Coins,
        rarity: 'common',
        effect: 'Watch ad to claim'
      },
      {
        id: 'medium_coins',
        name: 'Medium Coin Pack',
        description: '1,500 coins + 1 random power-up',
        price: 200,
        coins: 1500,
        icon: Coins,
        rarity: 'uncommon',
        effect: 'Bonus power-up included'
      },
      {
        id: 'large_coins',
        name: 'Large Coin Pack',
        description: '5,000 coins + 3 random power-ups',
        price: 600,
        coins: 5000,
        icon: Coins,
        rarity: 'epic',
        effect: 'Best value deal'
      }
    ],
    special: [
      {
        id: 'planet_protector',
        name: 'Planet Protector',
        description: 'Prevents planet loss for 1 hour',
        price: 150,
        icon: Shield,
        rarity: 'rare',
        effect: 'Safety guarantee'
      },
      {
        id: 'cosmic_multiplier',
        name: 'Cosmic Multiplier',
        description: 'All rewards x3 for 15 minutes',
        price: 250,
        icon: Star,
        rarity: 'legendary',
        effect: 'Triple everything!'
      },
      {
        id: 'instant_level',
        name: 'Instant Level Up',
        description: 'Skip level requirements and advance instantly',
        price: 300,
        icon: Rocket,
        rarity: 'legendary',
        effect: 'Immediate progression'
      }
    ]
  };

  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    uncommon: 'from-green-500 to-green-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-orange-600'
  };

  const handlePurchase = (item) => {
    if (item.price === 0) {
      // Free item (ad-based)
      toast({
        title: "Ad Required",
        description: "Watch a short ad to claim your free coins!"
      });
      return;
    }

    if (gameStats.coins >= item.price) {
      onPurchase(item);
      toast({
        title: "Purchase Successful!",
        description: `${item.name} has been added to your inventory.`
      });
    } else {
      toast({
        title: "Insufficient Coins",
        description: `You need ${item.price - gameStats.coins} more coins.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => onNavigate('menu')} 
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Cosmic Shop
            </h1>
            <p className="text-gray-300">Enhance your gameplay with powerful items</p>
          </div>
          
          <div className="flex items-center gap-2 bg-black/30 rounded-lg px-4 py-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-xl font-bold text-white">{gameStats?.coins || 100}</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  selectedCategory === category.id 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Shop Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopItems[selectedCategory].map((item) => {
            const IconComponent = item.icon;
            const canAfford = gameStats?.coins >= item.price || item.price === 0;
            
            return (
              <Card 
                key={item.id} 
                className={`bg-black/30 border-gray-700 p-6 transform hover:scale-105 transition-all duration-200 ${
                  !canAfford ? 'opacity-60' : 'hover:shadow-2xl'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${rarityColors[item.rarity]} shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <Badge 
                    className={`bg-gradient-to-r ${rarityColors[item.rarity]} text-white capitalize`}
                  >
                    {item.rarity}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-blue-300">
                    <Star className="w-3 h-3" />
                    <span>{item.effect}</span>
                  </div>
                  {item.coins && (
                    <div className="flex items-center gap-2 text-sm text-yellow-300">
                      <Coins className="w-3 h-3" />
                      <span>+{item.coins.toLocaleString()} coins</span>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => handlePurchase(item)}
                  disabled={!canAfford}
                  className={`w-full ${
                    item.price === 0 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                  }`}
                >
                  {item.price === 0 ? (
                    <>Watch Ad</>
                  ) : (
                    <>
                      <Coins className="w-4 h-4 mr-2" />
                      {item.price}
                    </>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Need More Coins Banner */}
        <Card className="mt-12 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Need More Coins?</h3>
            <p className="text-gray-300 mb-4">Check out our Premium Store for exclusive coin packs and deals!</p>
            <Button 
              onClick={() => onNavigate('premium')}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700"
            >
              Visit Premium Store
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Shop;