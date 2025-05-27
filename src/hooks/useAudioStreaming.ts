
import { useState, useCallback, useRef } from 'react';

export interface AudioStreamingState {
  isPlaying: boolean;
  isLoading: boolean;
  isConnecting: boolean;
  error: string | null;
  currentVoice: string;
}

// Audio queue class for sequential playback
class AudioQueue {
  private queue: Uint8Array[] = [];
  private isProcessing = false;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async addToQueue(audioData: Uint8Array) {
    this.queue.push(audioData);
    if (!this.isProcessing) {
      await this.processNext();
    }
  }

  private async processNext() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const audioData = this.queue.shift()!;

    try {
      const wavData = this.createWavFromPCM(audioData);
      const audioBuffer = await this.audioContext.decodeAudioData(wavData.buffer);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => this.processNext();
      source.start(0);
    } catch (error) {
      console.error('Error playing audio chunk:', error);
      this.processNext(); // Continue with next chunk even if current fails
    }
  }

  private createWavFromPCM(pcmData: Uint8Array): Uint8Array {
    // Convert bytes to 16-bit samples
    const int16Data = new Int16Array(pcmData.length / 2);
    for (let i = 0; i < pcmData.length; i += 2) {
      int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
    }
    
    // WAV header parameters
    const sampleRate = 24000; // Gemini Live API outputs at 24kHz
    const numChannels = 1;
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    // Create WAV header
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + int16Data.byteLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, int16Data.byteLength, true);

    // Combine header and data
    const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
    wavArray.set(new Uint8Array(wavHeader), 0);
    wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
    
    return wavArray;
  }

  clear() {
    this.queue = [];
    this.isProcessing = false;
  }
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
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const initializeAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioQueueRef.current = new AudioQueue(audioContextRef.current);
    }
    return audioContextRef.current;
  }, []);

  const connectWebSocket = useCallback(() => {
    return new Promise<WebSocket>((resolve, reject) => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//ntmtyrgidorjzfmcpuao.functions.supabase.co/functions/v1/gemini-live-speech`;
      
      console.log('Connecting to:', wsUrl);
      
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
          console.log('WebSocket message:', data.type);
          
          switch (data.type) {
            case 'connected':
              console.log('WebSocket connected successfully');
              break;
              
            case 'audio_chunk':
              // Process audio chunk for playback
              if (data.data && audioQueueRef.current) {
                const binaryString = atob(data.data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                audioQueueRef.current.addToQueue(bytes);
              }
              break;
              
            case 'speech_complete':
              console.log('Speech generation completed');
              setState(prev => ({ 
                ...prev, 
                isLoading: false,
                isConnecting: false,
                isPlaying: false,
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
        setState(prev => ({ ...prev, isConnecting: false, isPlaying: false }));
      };
    });
  }, []);

  const generateSpeech = useCallback(async (text: string, voice: string = 'zephyr') => {
    setState(prev => ({ ...prev, isLoading: true, isConnecting: true, error: null }));

    try {
      console.log(`Generating speech for: "${text}" with voice: ${voice}`);
      
      // Initialize audio context
      initializeAudioContext();
      
      // Clear audio queue
      audioQueueRef.current?.clear();
      
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
    }
  }, [initializeAudioContext, connectWebSocket]);

  const stopAudio = useCallback(() => {
    // Clear audio queue
    audioQueueRef.current?.clear();
    
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
    
    audioQueueRef.current = null;
  }, [stopAudio]);

  return {
    ...state,
    generateSpeech,
    stopAudio,
    cleanup,
    initializeAudioContext
  };
};
