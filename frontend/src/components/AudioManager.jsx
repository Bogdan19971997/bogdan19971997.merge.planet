import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockGameData } from '../data/mock';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    masterVolume: 0.7,
    sfxVolume: 0.8,
    musicVolume: 0.6,
    soundEnabled: true,
    musicEnabled: true
  });
  
  const [audioCache, setAudioCache] = useState({});

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('mergePlanetAudioSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mergePlanetAudioSettings', JSON.stringify(settings));
  }, [settings]);

  // Preload audio files
  useEffect(() => {
    const preloadAudio = async () => {
      const cache = {};
      const allSounds = {
        ...mockGameData.soundEffects.menu,
        ...mockGameData.soundEffects.game,
        ...mockGameData.soundEffects.planets
      };

      // Create mock audio objects for development
      // In production, replace with actual audio files
      Object.entries(allSounds).forEach(([key, url]) => {
        try {
          const audio = new Audio();
          // For development, we'll create silent audio objects
          // In production, set audio.src = url
          audio.volume = 0;
          cache[key] = audio;
        } catch (error) {
          console.warn(`Failed to load audio: ${url}`);
        }
      });
      
      setAudioCache(cache);
    };

    if (settings.soundEnabled) {
      preloadAudio();
    }
  }, [settings.soundEnabled]);

  const playSound = (soundKey, category = 'game', volume = null) => {
    if (!settings.soundEnabled) return;
    
    try {
      const audio = audioCache[soundKey];
      if (!audio) return;
      
      // Calculate final volume
      let finalVolume = settings.masterVolume * settings.sfxVolume;
      if (volume !== null) {
        finalVolume *= volume;
      }
      
      audio.volume = Math.max(0, Math.min(1, finalVolume));
      audio.currentTime = 0;
      
      // Create audio feedback through Web Audio API oscillator for development
      if (settings.soundEnabled && finalVolume > 0) {
        createSoundFeedback(soundKey, finalVolume);
      }
      
      // In production, use: audio.play().catch(e => console.warn('Audio play failed:', e));
    } catch (error) {
      console.warn('Failed to play sound:', soundKey, error);
    }
  };

  // Development sound feedback using Web Audio API
  const createSoundFeedback = (soundKey, volume) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different sound types
      const soundMap = {
        click: 800,
        hover: 600,
        merge: 400,
        coin_earn: 1000,
        level_up: 1200,
        moon_bonus: 300,
        sun_double: 500,
        achievement: 1500
      };
      
      oscillator.frequency.setValueAtTime(
        soundMap[soundKey] || 440, 
        audioContext.currentTime
      );
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Silently fail if Web Audio API is not supported
    }
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value = {
    settings,
    updateSettings,
    playSound,
    audioCache
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};