import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { ArrowLeft, Volume2, VolumeX, Bell, BellOff, Music, Gamepad2 } from 'lucide-react';
import { useAudio } from './AudioManager';
import { useToast } from '../hooks/use-toast';

const Settings = ({ onNavigate }) => {
  const { settings, updateSettings, playSound } = useAudio();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    achievements: true,
    levelUps: true,
    coinRewards: true,
    dailyRewards: true,
    friendUpdates: false
  });

  const handleVolumeChange = (type, value) => {
    const newValue = value[0] / 100;
    updateSettings({ [type]: newValue });
    
    // Play test sound
    if (type === 'sfxVolume') {
      playSound('click');
    }
  };

  const handleSoundToggle = (type) => {
    const newValue = !settings[type];
    updateSettings({ [type]: newValue });
    
    if (newValue && type === 'soundEnabled') {
      playSound('achievement');
    }
    
    toast({
      title: newValue ? `${type} Enabled` : `${type} Disabled`,
      description: newValue ? 'Audio is now active' : 'Audio is now muted'
    });
  };

  const handleNotificationToggle = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    
    playSound('click');
  };

  const resetSettings = () => {
    updateSettings({
      masterVolume: 0.7,
      sfxVolume: 0.8,
      musicVolume: 0.6,
      soundEnabled: true,
      musicEnabled: true
    });
    
    setNotifications({
      achievements: true,
      levelUps: true,
      coinRewards: true,
      dailyRewards: true,
      friendUpdates: false
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to default values"
    });
    
    playSound('achievement');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => {
              playSound('click');
              onNavigate('menu');
            }} 
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-300">Customize your cosmic gaming experience</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Audio Settings */}
          <Card className="bg-black/30 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Audio Settings</h2>
            </div>

            <div className="space-y-6">
              {/* Master Volume */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white font-medium">Master Volume</label>
                  <span className="text-gray-400">{Math.round(settings.masterVolume * 100)}%</span>
                </div>
                <Slider
                  value={[settings.masterVolume * 100]}
                  onValueChange={(value) => handleVolumeChange('masterVolume', value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* SFX Volume */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white font-medium">Sound Effects</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{Math.round(settings.sfxVolume * 100)}%</span>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={() => handleSoundToggle('soundEnabled')}
                    />
                  </div>
                </div>
                <Slider
                  value={[settings.sfxVolume * 100]}
                  onValueChange={(value) => handleVolumeChange('sfxVolume', value)}
                  max={100}
                  step={1}
                  disabled={!settings.soundEnabled}
                  className="w-full"
                />
              </div>

              {/* Music Volume */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white font-medium">Background Music</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{Math.round(settings.musicVolume * 100)}%</span>
                    <Switch
                      checked={settings.musicEnabled}
                      onCheckedChange={() => handleSoundToggle('musicEnabled')}
                    />
                  </div>
                </div>
                <Slider
                  value={[settings.musicVolume * 100]}
                  onValueChange={(value) => handleVolumeChange('musicVolume', value)}
                  max={100}
                  step={1}
                  disabled={!settings.musicEnabled}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-black/30 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Notifications</h2>
            </div>

            <div className="space-y-4">
              {[
                { key: 'achievements', label: 'Achievement Unlocked', icon: '🏆' },
                { key: 'levelUps', label: 'Level Up Celebrations', icon: '⬆️' },
                { key: 'coinRewards', label: 'Coin Rewards', icon: '🪙' },
                { key: 'dailyRewards', label: 'Daily Login Rewards', icon: '🎁' },
                { key: 'friendUpdates', label: 'Friend Updates', icon: '👥' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-white font-medium">{item.label}</span>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={() => handleNotificationToggle(item.key)}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Game Settings */}
          <Card className="bg-black/30 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Game Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-800/30">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Haptic Feedback</span>
                  <Switch defaultChecked={true} />
                </div>
                <p className="text-gray-400 text-sm mt-1">Vibration on interactions</p>
              </div>
              
              <div className="p-3 rounded-lg bg-gray-800/30">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Auto-Save</span>
                  <Switch defaultChecked={true} />
                </div>
                <p className="text-gray-400 text-sm mt-1">Automatically save progress</p>
              </div>
              
              <div className="p-3 rounded-lg bg-gray-800/30">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Show Hints</span>
                  <Switch defaultChecked={true} />
                </div>
                <p className="text-gray-400 text-sm mt-1">Display helpful gameplay tips</p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="bg-black/30 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 shadow-lg">
                <ArrowLeft className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Actions</h2>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => {
                  playSound('achievement', 'game', 1.0);
                  toast({
                    title: "🔊 Sound Test",
                    description: "Did you hear the achievement sound?"
                  });
                }}
                variant="outline"
                className="w-full border-blue-600 text-blue-300 hover:bg-blue-800/20"
              >
                🔊 Test Sound
              </Button>
              
              <Button 
                onClick={resetSettings}
                variant="outline"
                className="w-full border-yellow-600 text-yellow-300 hover:bg-yellow-800/20"
              >
                Reset to Defaults
              </Button>
              
              <Button 
                onClick={() => {
                  playSound('click');
                  toast({
                    title: "Settings Saved",
                    description: "Your preferences have been saved successfully"
                  });
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                Save Settings
              </Button>
            </div>

            {/* Version Info */}
            <div className="mt-6 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
              <p>Merge Planet v2.0.0</p>
              <p>© 2024 Cosmic Games</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;