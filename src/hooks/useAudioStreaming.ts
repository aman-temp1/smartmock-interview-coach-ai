
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AudioStreamingState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentVoice: string;
}

export const useAudioStreaming = () => {
  const [state, setState] = useState<AudioStreamingState>({
    isPlaying: false,
    isLoading: false,
    error: null,
    currentVoice: 'zephyr'
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const initializeAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const generateSpeech = useCallback(async (text: string, voice: string = 'zephyr') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke('gemini-speech-generation', {
        body: { text, voice }
      });

      if (error) throw error;

      // For now, we'll simulate audio playback since we're not getting actual audio
      // In production, you would decode the base64 audio and play it
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isPlaying: true,
        currentVoice: voice 
      }));

      // Simulate speech duration
      setTimeout(() => {
        setState(prev => ({ ...prev, isPlaying: false }));
      }, text.length * 100); // Rough estimate based on text length

      return data;

    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Failed to generate speech' 
      }));
      throw error;
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const cleanup = useCallback(() => {
    stopAudio();
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, [stopAudio]);

  return {
    ...state,
    generateSpeech,
    stopAudio,
    cleanup,
    initializeAudioContext
  };
};
