import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Crown, Star, Coins, Gem, Zap, Shield, Gift } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const PremiumShop = ({ onNavigate, gameStats, onPurchase }) => {
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);

  const premiumPackages = [
    {
      id: 'starter',
      name: 'Cosmic Starter',
      description: 'Perfect for new space explorers',
      price: 2.99,
      originalPrice: 4.99,
      coins: 2000,
      items: [
        '2,000 Coins',
        '3 Power-ups',
        '1 Week Ad-Free',
        '5x Speed Boost'
      ],
      popular: false,
      icon: Star,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'explorer',
      name: 'Galaxy Explorer',
      description: 'Most popular choice for active players',
      price: 7.99,
      originalPrice: 12.99,
      coins: 6000,
      items: [
        '6,000 Coins',
        '10 Power-ups',
        '1 Month Ad-Free',
        '10x Speed Boost',
        '5x Auto Merge',
        'Exclusive Planet Skins'
      ],
      popular: true,
      icon: Gem,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'master',
      name: 'Cosmic Master',
      description: 'Ultimate package for serious players',
      price: 19.99,
      originalPrice: 29.99,
      coins: 20000,
      items: [
        '20,000 Coins',
        'Unlimited Power-ups',
        'Permanent Ad-Free',
        'Unlimited Speed Boost',
        'All Exclusive Skins',
        'VIP Status Badge',
        'Priority Support'
      ],
      popular: false,
      icon: Crown,
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  const subscriptionOptions = [
    {
      id: 'monthly',
      name: 'Monthly VIP',
      description: 'Premium benefits every month',
      price: 4.99,
      period: 'month',
      benefits: [
        '1,000 Coins Monthly',
        '5 Power-ups Weekly',
        'Ad-Free Experience',
        'Exclusive Events Access',
        '2x Merge Speed'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly VIP',
      description: 'Best value with 50% savings',
      price: 29.99,
      originalPrice: 59.88,
      period: 'year',
      benefits: [
        '15,000 Coins Upfront',
        '1,500 Coins Monthly',
        '10 Power-ups Weekly',
        'Ad-Free Experience',
        'All Exclusive Content',
        '3x Merge Speed',
        'VIP Badge & Support'
      ],
      bestValue: true
    }
  ];

  const handlePurchase = async (item, type = 'package') => {
    setLoading(true);
    try {
      // Simulate payment processing
      toast({
        title: "Processing Payment...",
        description: "Redirecting to secure payment gateway"
      });
      
      // In real app, integrate with Stripe, Apple Pay, Google Pay
      setTimeout(() => {
        toast({
          title: "Purchase Successful!",
          description: `${item.name} has been added to your account.`
        });
        onPurchase(item, type);
        setLoading(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
      setLoading(false);
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
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-3">
              <Crown className="w-10 h-10 text-yellow-400" />
              Premium Store
            </h1>
            <p className="text-gray-300">Unlock exclusive content and boost your progress</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-400">Secure payments by</div>
            <div className="text-lg font-semibold text-white">Stripe & Apple Pay</div>
          </div>
        </div>

        {/* Premium Packages */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Premium Packages</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {premiumPackages.map((pkg) => {
              const IconComponent = pkg.icon;
              return (
                <Card 
                  key={pkg.id}
                  className={`relative bg-black/30 border-gray-700 p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer ${
                    pkg.popular ? 'border-yellow-500 shadow-yellow-500/20 shadow-2xl' : 'hover:shadow-2xl'
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${pkg.color} shadow-lg mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                    <p className="text-gray-400 text-sm">{pkg.description}</p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-white">${pkg.price}</span>
                      {pkg.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">${pkg.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-yellow-400">
                      <Coins className="w-4 h-4" />
                      <span className="font-semibold">{pkg.coins.toLocaleString()} coins</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {pkg.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <Star className="w-3 h-3 text-green-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => handlePurchase(pkg)}
                    disabled={loading}
                    className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 text-white font-semibold`}
                  >
                    {loading ? 'Processing...' : 'Purchase Now'}
                  </Button>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Subscription Plans */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">VIP Subscriptions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {subscriptionOptions.map((sub) => (
              <Card 
                key={sub.id}
                className={`relative bg-black/30 border-gray-700 p-6 ${
                  sub.bestValue ? 'border-green-500 shadow-green-500/20 shadow-2xl' : ''
                }`}
              >
                {sub.bestValue && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1">
                    Best Value
                  </Badge>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{sub.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{sub.description}</p>
                  
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-white">${sub.price}</span>
                    <span className="text-gray-400">/{sub.period}</span>
                    {sub.originalPrice && (
                      <span className="text-lg text-gray-500 line-through ml-2">${sub.originalPrice}</span>
                    )}
                  </div>
                  
                  {sub.originalPrice && (
                    <div className="text-green-400 text-sm font-semibold mt-1">
                      Save {Math.round((1 - sub.price / sub.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  {sub.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <Shield className="w-3 h-3 text-blue-400" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handlePurchase(sub, 'subscription')}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
                >
                  {loading ? 'Processing...' : `Subscribe ${sub.period === 'year' ? 'Yearly' : 'Monthly'}`}
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust & Security */}
        <Card className="bg-black/20 border-gray-700 p-6 text-center">
          <div className="flex items-center justify-center gap-6 mb-4">
            <Shield className="w-6 h-6 text-green-400" />
            <span className="text-white font-semibold">256-bit SSL Encryption</span>
            <span className="text-gray-400">|</span>
            <Crown className="w-6 h-6 text-yellow-400" />
            <span className="text-white font-semibold">App Store Approved</span>
            <span className="text-gray-400">|</span>
            <Gift className="w-6 h-6 text-purple-400" />
            <span className="text-white font-semibold">30-Day Refund</span>
          </div>
          <p className="text-gray-400 text-sm">
            All payments are processed securely. Your purchase supports game development and new features.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PremiumShop;