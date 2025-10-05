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
    if (!settings.soundEnabled) {
      console.log(`🔇 Sound disabled: ${soundKey}`);
      return;
    }
    
    try {
      // Calculate final volume
      let finalVolume = settings.masterVolume * settings.sfxVolume;
      if (volume !== null) {
        finalVolume *= volume;
      }
      
      console.log(`🔊 Attempting to play sound: ${soundKey} with volume: ${finalVolume}`);
      
      // Create audio feedback through Web Audio API for development
      if (finalVolume > 0) {
        createSoundFeedback(soundKey, finalVolume);
      }
      
      // In production, load and play actual audio files
      // const audio = audioCache[soundKey];
      // if (audio) {
      //   audio.volume = Math.max(0, Math.min(1, finalVolume));
      //   audio.currentTime = 0;
      //   audio.play().catch(e => console.warn('Audio play failed:', e));
      // }
    } catch (error) {
      console.warn('Failed to play sound:', soundKey, error);
    }
  };

  // Development sound feedback using Web Audio API
  const createSoundFeedback = (soundKey, volume) => {
    if (!settings.soundEnabled || volume <= 0) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies and types for different sound effects
      const soundMap = {
        click: { freq: 800, type: 'sine', duration: 0.1 },
        hover: { freq: 600, type: 'sine', duration: 0.05 },
        merge: { freq: 400, type: 'sawtooth', duration: 0.2 },
        place: { freq: 700, type: 'triangle', duration: 0.1 },
        select: { freq: 900, type: 'sine', duration: 0.05 },
        coin_earn: { freq: 1000, type: 'sine', duration: 0.15 },
        level_up: { freq: 1200, type: 'square', duration: 0.3 },
        moon_bonus: { freq: 300, type: 'sawtooth', duration: 0.4 },
        sun_double: { freq: 500, type: 'triangle', duration: 0.25 },
        achievement: { freq: 1500, type: 'sine', duration: 0.5 }
      };
      
      const sound = soundMap[soundKey] || { freq: 440, type: 'sine', duration: 0.1 };
      
      oscillator.frequency.setValueAtTime(sound.freq, audioContext.currentTime);
      oscillator.type = sound.type;
      
      // Make sounds much more audible
      const finalVolume = Math.min(volume * 0.3, 0.3); // Increase volume significantly
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(finalVolume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + sound.duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + sound.duration);
      
      console.log(`🔊 Playing sound: ${soundKey} at ${finalVolume} volume`);
    } catch (error) {
      console.warn('Web Audio API error:', error);
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