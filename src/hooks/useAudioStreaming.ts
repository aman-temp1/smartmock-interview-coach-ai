
import { useState, useCallback, useRef } from 'react';

export interface AudioStreamingState {
  isPlaying: boolean;
  isLoading: boolean;
  isConnecting: boolean;
  error: string | null;
  currentVoice: string;
}

export const useAudioStreaming = () => {
  const [state, setState] = useState<AudioStreamingState>({
    isPlaying: false,
    isLoading: false,
    isConnecting: false,
    error: null,
    currentVoice: 'zephyr'
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isProcessingQueueRef = useRef(false);

  const initializeAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const processAudioQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    isProcessingQueueRef.current = true;

    while (audioQueueRef.current.length > 0) {
      const audioData = audioQueueRef.current.shift();
      if (!audioData) continue;

      try {
        // Stop any currently playing audio
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
          currentAudioRef.current = null;
        }

        // Create audio element and play
        const audio = new Audio();
        const audioBlob = new Blob([
          Uint8Array.from(atob(audioData), c => c.charCodeAt(0))
        ], { type: 'audio/wav' });
        
        audio.src = URL.createObjectURL(audioBlob);
        currentAudioRef.current = audio;

        // Wait for audio to finish playing
        await new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(audio.src);
            resolve();
          };
          
          audio.onerror = (audioError) => {
            console.error('Audio playback error:', audioError);
            URL.revokeObjectURL(audio.src);
            reject(new Error('Audio playback failed'));
          };

          audio.play().catch(reject);
        });

      } catch (error) {
        console.error('Error playing audio chunk:', error);
        // Continue with next chunk even if current fails
      }
    }

    isProcessingQueueRef.current = false;
  }, []);

  const connectWebSocket = useCallback(() => {
    return new Promise<WebSocket>((resolve, reject) => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//ntmtyrgidorjzfmcpuao.functions.supabase.co/functions/v1/gemini-live-speech`;
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('Connected to Gemini Live Speech WebSocket');
        resolve(ws);
      };

      ws.onerror = (error) => {
        console.error('WebSocket connection error:', error);
        reject(new Error('Failed to connect to speech service'));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'connected':
              console.log('WebSocket connected successfully');
              break;
              
            case 'audio_chunk':
              // Add audio chunk to queue for sequential playback
              audioQueueRef.current.push(data.data);
              if (!isProcessingQueueRef.current) {
                processAudioQueue();
              }
              break;
              
            case 'speech_complete':
              if (data.success && data.audioContent) {
                console.log('Speech generation completed successfully');
              }
              setState(prev => ({ 
                ...prev, 
                isLoading: false,
                isConnecting: false,
                error: data.success ? null : data.error || 'Speech generation failed'
              }));
              break;
              
            case 'error':
              console.error('WebSocket error:', data.error);
              setState(prev => ({ 
                ...prev, 
                isLoading: false,
                isConnecting: false,
                error: data.error,
                isPlaying: false
              }));
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setState(prev => ({ ...prev, isConnecting: false }));
      };
    });
  }, [processAudioQueue]);

  const generateSpeech = useCallback(async (text: string, voice: string = 'zephyr') => {
    setState(prev => ({ ...prev, isLoading: true, isConnecting: true, error: null }));

    try {
      console.log(`Generating speech for: "${text}" with voice: ${voice}`);
      
      // Initialize audio context
      initializeAudioContext();
      
      // Clear audio queue
      audioQueueRef.current = [];
      
      // Connect to WebSocket if not already connected
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        wsRef.current = await connectWebSocket();
      }

      // Send speech generation request
      wsRef.current.send(JSON.stringify({
        type: 'generate_speech',
        text,
        voice
      }));

      setState(prev => ({ 
        ...prev, 
        isConnecting: false,
        isPlaying: true,
        currentVoice: voice
      }));

    } catch (error: any) {
      console.error('Speech generation error:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        isConnecting: false,
        error: error.message || 'Failed to generate speech',
        isPlaying: false
      }));
      
      // Fallback simulation for development
      setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          isPlaying: true,
          currentVoice: voice,
          error: null
        }));
        
        const estimatedDuration = Math.max(2000, text.length * 80);
        setTimeout(() => {
          setState(prev => ({ ...prev, isPlaying: false }));
        }, estimatedDuration);
      }, 1000);
      
      throw error;
    }
  }, [initializeAudioContext, connectWebSocket]);

  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    // Clear audio queue
    audioQueueRef.current = [];
    isProcessingQueueRef.current = false;
    
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const cleanup = useCallback(() => {
    stopAudio();
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
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
