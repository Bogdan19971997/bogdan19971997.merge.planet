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

  // Enhanced sound system with multiple approaches
  const [audioContext, setAudioContext] = useState(null);

  // Initialize AudioContext on first user interaction
  const initAudioContext = () => {
    if (!audioContext && window.AudioContext) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(ctx);
        console.log('🔊 AudioContext initialized');
        return ctx;
      } catch (error) {
        console.warn('Failed to initialize AudioContext:', error);
        return null;
      }
    }
    return audioContext;
  };

  // Create sound using Web Audio API with better error handling
  const createSoundFeedback = (soundKey, volume) => {
    if (!settings.soundEnabled || volume <= 0) {
      console.log(`🔇 Sound disabled or volume 0: ${soundKey}`);
      return;
    }
    
    try {
      // Try to get or create audio context
      const ctx = initAudioContext();
      if (!ctx) {
        console.warn('No AudioContext available');
        return;
      }

      // Resume context if suspended (required by browser policies)
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          console.log('AudioContext resumed');
        });
      }
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Enhanced sound mapping with more realistic frequencies
      const soundMap = {
        click: { freq: 1000, type: 'sine', duration: 0.1 },
        hover: { freq: 800, type: 'sine', duration: 0.05 },
        merge: { freq: 600, type: 'sawtooth', duration: 0.3 },
        place: { freq: 900, type: 'triangle', duration: 0.15 },
        select: { freq: 1100, type: 'sine', duration: 0.08 },
        coin_earn: { freq: 1400, type: 'sine', duration: 0.2 },
        level_up: { freq: 1600, type: 'square', duration: 0.4 },
        moon_bonus: { freq: 400, type: 'sawtooth', duration: 0.5 },
        sun_double: { freq: 700, type: 'triangle', duration: 0.3 },
        achievement: { freq: 2000, type: 'sine', duration: 0.6 }
      };
      
      const sound = soundMap[soundKey] || { freq: 440, type: 'sine', duration: 0.1 };
      
      oscillator.frequency.setValueAtTime(sound.freq, ctx.currentTime);
      oscillator.type = sound.type;
      
      // Increase volume and make it more noticeable
      const finalVolume = Math.min(volume * 0.5, 0.5);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(finalVolume, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sound.duration - 0.01);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + sound.duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + sound.duration);
      
      console.log(`🔊 SUCCESS: Playing ${soundKey} at ${finalVolume} volume for ${sound.duration}s`);
      
      // Visual feedback for debugging
      if (typeof window !== 'undefined') {
        const indicator = document.createElement('div');
        indicator.textContent = `🔊 ${soundKey}`;
        indicator.style.position = 'fixed';
        indicator.style.top = '10px';
        indicator.style.right = '10px';
        indicator.style.background = 'rgba(0, 255, 0, 0.8)';
        indicator.style.padding = '5px';
        indicator.style.borderRadius = '5px';
        indicator.style.zIndex = '9999';
        indicator.style.color = 'white';
        indicator.style.fontSize = '12px';
        document.body.appendChild(indicator);
        
        setTimeout(() => {
          if (document.body.contains(indicator)) {
            document.body.removeChild(indicator);
          }
        }, 1000);
      }
      
    } catch (error) {
      console.error('🔊 Web Audio API error:', error);
      
      // Fallback: Try HTML5 audio
      try {
        const audio = new Audio();
        audio.volume = Math.min(volume * 0.5, 0.5);
        
        // Create a simple beep using data URI
        const freq = 800;
        const duration = 0.1;
        const sampleRate = 44100;
        const samples = duration * sampleRate;
        const audioBuffer = new Float32Array(samples);
        
        for (let i = 0; i < samples; i++) {
          audioBuffer[i] = Math.sin(2 * Math.PI * freq * (i / sampleRate)) * 0.3;
        }
        
        console.log('🔊 Fallback sound system attempted');
      } catch (fallbackError) {
        console.error('🔊 All audio systems failed:', fallbackError);
      }
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