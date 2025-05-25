
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AudioContextType {
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  isAudioEnabled: boolean;
  setIsAudioEnabled: (enabled: boolean) => void;
  audioQueue: string[];
  addToQueue: (text: string) => void;
  clearQueue: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const GEMINI_VOICES = [
  { id: 'zephyr', name: 'Zephyr (Bright, Female)', gender: 'female' },
  { id: 'charon', name: 'Charon (Informative, Male)', gender: 'male' },
  { id: 'kore', name: 'Kore (Firm, Female)', gender: 'female' },
  { id: 'zubenelgenubi', name: 'Zubenelgenubi (Casual, Male)', gender: 'male' }
];

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedVoice, setSelectedVoice] = useState('zephyr');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);

  const addToQueue = (text: string) => {
    setAudioQueue(prev => [...prev, text]);
  };

  const clearQueue = () => {
    setAudioQueue([]);
  };

  return (
    <AudioContext.Provider value={{
      selectedVoice,
      setSelectedVoice,
      isAudioEnabled,
      setIsAudioEnabled,
      audioQueue,
      addToQueue,
      clearQueue
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
