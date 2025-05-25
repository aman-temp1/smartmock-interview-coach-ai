
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
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const initializeAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const generateSpeech = useCallback(async (text: string, voice: string = 'zephyr') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log(`Generating speech for: "${text}" with voice: ${voice}`);
      
      const { data, error } = await supabase.functions.invoke('gemini-speech-generation', {
        body: { text, voice }
      });

      if (error) throw error;

      if (data?.success && data?.audioContent) {
        // Stop any currently playing audio
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
          currentAudioRef.current = null;
        }

        // Create audio element and play
        const audio = new Audio();
        const audioBlob = new Blob([
          Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
        ], { type: 'audio/wav' });
        
        audio.src = URL.createObjectURL(audioBlob);
        currentAudioRef.current = audio;

        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          isPlaying: true,
          currentVoice: voice 
        }));

        // Play audio
        await audio.play();

        // Handle audio end
        audio.onended = () => {
          setState(prev => ({ ...prev, isPlaying: false }));
          URL.revokeObjectURL(audio.src);
          currentAudioRef.current = null;
        };

        audio.onerror = () => {
          setState(prev => ({ 
            ...prev, 
            isPlaying: false, 
            error: 'Failed to play audio' 
          }));
          URL.revokeObjectURL(audio.src);
          currentAudioRef.current = null;
        };

      } else {
        // Fallback: simulate speech for development
        console.log('No audio returned, simulating speech...');
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          isPlaying: true,
          currentVoice: voice 
        }));

        // Simulate speech duration based on text length
        const estimatedDuration = Math.max(2000, text.length * 100);
        setTimeout(() => {
          setState(prev => ({ ...prev, isPlaying: false }));
        }, estimatedDuration);
      }

      return data;

    } catch (error: any) {
      console.error('Speech generation error:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Failed to generate speech' 
      }));
      throw error;
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
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
