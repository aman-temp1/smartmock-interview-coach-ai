
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
  { id: 'zephyr', name: 'Puck (Bright, Energetic)', gender: 'neutral' },
  { id: 'charon', name: 'Charon (Deep, Authoritative)', gender: 'male' },
  { id: 'kore', name: 'Kore (Clear, Professional)', gender: 'female' },
  { id: 'zubenelgenubi', name: 'Aoede (Warm, Friendly)', gender: 'female' }
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
