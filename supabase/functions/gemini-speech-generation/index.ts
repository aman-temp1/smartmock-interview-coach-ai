
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voice mapping for Gemini Live API voices
const GEMINI_VOICES = {
  'zephyr': 'Puck',
  'charon': 'Charon', 
  'kore': 'Kore',
  'zubenelgenubi': 'Aoede'
};

interface WavConversionOptions {
  numChannels: number;
  sampleRate: number;
  bitsPerSample: number;
}

function createWavHeader(dataLength: number, options: WavConversionOptions) {
  const { numChannels, sampleRate, bitsPerSample } = options;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  return new Uint8Array(buffer);
}

function convertToWav(audioDataArray: string[], mimeType: string = 'audio/pcm;rate=24000') {
  const options: WavConversionOptions = {
    numChannels: 1,
    sampleRate: 24000,
    bitsPerSample: 16
  };

  // Parse sample rate from mime type if available
  const rateMatch = mimeType.match(/rate=(\d+)/);
  if (rateMatch) {
    options.sampleRate = parseInt(rateMatch[1]);
  }

  // Convert base64 audio data to binary
  const audioBuffers = audioDataArray.map(data => {
    const binaryString = atob(data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  });

  // Combine all audio data
  const totalLength = audioBuffers.reduce((sum, buffer) => sum + buffer.length, 0);
  const combinedAudio = new Uint8Array(totalLength);
  let offset = 0;
  for (const buffer of audioBuffers) {
    combinedAudio.set(buffer, offset);
    offset += buffer.length;
  }

  // Create WAV file
  const wavHeader = createWavHeader(combinedAudio.length, options);
  const wavFile = new Uint8Array(wavHeader.length + combinedAudio.length);
  wavFile.set(wavHeader, 0);
  wavFile.set(combinedAudio, wavHeader.length);

  return wavFile;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice = 'zephyr' } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const selectedVoice = GEMINI_VOICES[voice] || 'Puck';
    
    console.log(`Generating speech for: "${text}" with voice: ${selectedVoice}`);

    // Use Gemini Live API with proper audio configuration
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: text
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: selectedVoice
                }
              }
            }
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      
      // Fallback: return success without audio for development
      console.log('API call failed, returning success without audio for development');
      return new Response(
        JSON.stringify({ 
          audioContent: null,
          text: text,
          voice: selectedVoice,
          success: false,
          error: 'Audio generation temporarily unavailable'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No audio generated from Gemini API');
    }

    // Extract audio data from the response
    const candidate = data.candidates[0];
    let audioContent = null;
    let audioDataArray: string[] = [];

    if (candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('audio/')) {
          audioDataArray.push(part.inlineData.data);
        }
      }
    }

    if (audioDataArray.length > 0) {
      // Convert to WAV format
      const wavData = convertToWav(audioDataArray);
      const base64Audio = btoa(String.fromCharCode(...wavData));
      audioContent = base64Audio;
    }

    return new Response(
      JSON.stringify({ 
        audioContent,
        text: text,
        voice: selectedVoice,
        success: audioContent !== null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in gemini-speech-generation:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
