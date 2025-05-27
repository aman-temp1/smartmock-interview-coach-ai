
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voice mapping for Gemini Live API
const GEMINI_LIVE_VOICES = {
  'zephyr': 'Puck',
  'charon': 'Charon', 
  'kore': 'Kore',
  'zubenelgenubi': 'Aoede'
};

interface WavHeader {
  numChannels: number;
  sampleRate: number;
  bitsPerSample: number;
}

function createWavHeader(dataLength: number, options: WavHeader): Uint8Array {
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

function convertPCMToWav(pcmChunks: Uint8Array[]): Uint8Array {
  const options: WavHeader = {
    numChannels: 1,
    sampleRate: 24000, // Gemini Live API outputs at 24kHz
    bitsPerSample: 16
  };

  // Combine all PCM chunks
  const totalLength = pcmChunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const combinedPCM = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of pcmChunks) {
    combinedPCM.set(chunk, offset);
    offset += chunk.length;
  }

  // Create WAV file
  const wavHeader = createWavHeader(combinedPCM.length, options);
  const wavFile = new Uint8Array(wavHeader.length + combinedPCM.length);
  wavFile.set(wavHeader, 0);
  wavFile.set(combinedPCM, wavHeader.length);

  return wavFile;
}

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    return new Response("Gemini API key not configured", { status: 500 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let geminiSocket: WebSocket | null = null;
  let audioChunks: Uint8Array[] = [];

  socket.onopen = () => {
    console.log('WebSocket client connected');
    socket.send(JSON.stringify({ type: 'connected' }));
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Received message:', message.type);

      if (message.type === 'generate_speech') {
        const { text, voice = 'zephyr' } = message;
        const selectedVoice = GEMINI_LIVE_VOICES[voice] || 'Puck';
        
        console.log(`Generating speech with Gemini Live API: "${text}" using voice: ${selectedVoice}`);
        
        // Reset audio chunks for new generation
        audioChunks = [];

        // Connect to Gemini Live API
        const geminiUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService/BidiGenerateContent?key=${geminiApiKey}`;
        geminiSocket = new WebSocket(geminiUrl);

        geminiSocket.onopen = () => {
          console.log('Connected to Gemini Live API');
          
          // Send session setup
          const setupMessage = {
            setup: {
              model: "models/gemini-2.0-flash-live-001",
              generation_config: {
                response_modalities: ["AUDIO"],
                speech_config: {
                  voice_config: {
                    prebuilt_voice_config: {
                      voice_name: selectedVoice
                    }
                  }
                }
              }
            }
          };
          
          geminiSocket?.send(JSON.stringify(setupMessage));
          
          // Send the text to generate speech
          setTimeout(() => {
            const clientContent = {
              client_content: {
                turns: [{
                  role: "user",
                  parts: [{ text: text }]
                }],
                turn_complete: true
              }
            };
            geminiSocket?.send(JSON.stringify(clientContent));
          }, 100);
        };

        geminiSocket.onmessage = (geminiEvent) => {
          try {
            const geminiData = JSON.parse(geminiEvent.data);
            console.log('Gemini message type:', geminiData.server_content?.model_turn ? 'model_turn' : 'other');
            
            if (geminiData.server_content?.model_turn?.parts) {
              for (const part of geminiData.server_content.model_turn.parts) {
                if (part.inline_data?.mime_type?.startsWith('audio/') && part.inline_data.data) {
                  // Convert base64 to binary
                  const binaryString = atob(part.inline_data.data);
                  const bytes = new Uint8Array(binaryString.length);
                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  audioChunks.push(bytes);
                  
                  // Send audio chunk immediately to client
                  socket.send(JSON.stringify({
                    type: 'audio_chunk',
                    data: part.inline_data.data,
                    mimeType: part.inline_data.mime_type
                  }));
                }
              }
            }
            
            // Check if generation is complete
            if (geminiData.server_content?.turn_complete || geminiData.server_content?.model_turn) {
              console.log('Generation complete, processing final audio');
              
              if (audioChunks.length > 0) {
                // Convert all chunks to WAV
                const wavData = convertPCMToWav(audioChunks);
                const base64Audio = btoa(String.fromCharCode(...wavData));
                
                socket.send(JSON.stringify({
                  type: 'speech_complete',
                  audioContent: base64Audio,
                  success: true
                }));
              } else {
                socket.send(JSON.stringify({
                  type: 'speech_complete',
                  success: false,
                  error: 'No audio generated'
                }));
              }
              
              geminiSocket?.close();
            }
          } catch (error) {
            console.error('Error processing Gemini message:', error);
            socket.send(JSON.stringify({
              type: 'error',
              error: 'Failed to process audio response'
            }));
          }
        };

        geminiSocket.onerror = (error) => {
          console.error('Gemini WebSocket error:', error);
          socket.send(JSON.stringify({
            type: 'error',
            error: 'Gemini Live API connection failed'
          }));
        };

        geminiSocket.onclose = () => {
          console.log('Gemini WebSocket closed');
        };

      }
    } catch (error) {
      console.error('Error processing message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        error: error.message
      }));
    }
  };

  socket.onclose = () => {
    console.log('Client WebSocket closed');
    geminiSocket?.close();
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    geminiSocket?.close();
  };

  return response;
});
