
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voice mapping for Gemini Live API
const GEMINI_LIVE_VOICES = {
  'zephyr': 'Zephyr',
  'charon': 'Charon', 
  'kore': 'Kore',
  'zubenelgenubi': 'Aoede'
};

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
  let audioChunks: string[] = [];

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
        const selectedVoice = GEMINI_LIVE_VOICES[voice] || 'Zephyr';
        
        console.log(`Generating speech with Gemini Live API: "${text}" using voice: ${selectedVoice}`);
        
        // Reset audio chunks for new generation
        audioChunks = [];

        // Connect to Gemini Live API with correct URL format
        const geminiUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService/BidiGenerateContent?key=${geminiApiKey}`;
        geminiSocket = new WebSocket(geminiUrl);

        geminiSocket.onopen = () => {
          console.log('Connected to Gemini Live API');
          
          // Send correct setup message according to Live API docs
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
          
          console.log('Sending setup message:', JSON.stringify(setupMessage));
          geminiSocket?.send(JSON.stringify(setupMessage));
          
          // Send the text content after setup
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
            console.log('Sending client content:', JSON.stringify(clientContent));
            geminiSocket?.send(JSON.stringify(clientContent));
          }, 500);
        };

        geminiSocket.onmessage = (geminiEvent) => {
          try {
            const geminiData = JSON.parse(geminiEvent.data);
            console.log('Gemini response received, keys:', Object.keys(geminiData));
            
            // Handle setup confirmation
            if (geminiData.setupComplete) {
              console.log('Setup complete');
              return;
            }
            
            // Handle server content with audio data
            if (geminiData.serverContent?.modelTurn?.parts) {
              for (const part of geminiData.serverContent.modelTurn.parts) {
                if (part.inlineData && part.inlineData.mimeType?.startsWith('audio/pcm') && part.inlineData.data) {
                  console.log('Received audio chunk, size:', part.inlineData.data.length);
                  audioChunks.push(part.inlineData.data);
                  
                  // Send audio chunk immediately to client for real-time playback
                  socket.send(JSON.stringify({
                    type: 'audio_chunk',
                    data: part.inlineData.data,
                    mimeType: part.inlineData.mimeType
                  }));
                }
              }
            }
            
            // Check if generation is complete
            if (geminiData.serverContent?.turnComplete || 
                (geminiData.serverContent?.modelTurn && audioChunks.length > 0)) {
              console.log('Generation complete, total audio chunks:', audioChunks.length);
              
              socket.send(JSON.stringify({
                type: 'speech_complete',
                success: true,
                audioChunks: audioChunks.length
              }));
              
              geminiSocket?.close();
            }
          } catch (error) {
            console.error('Error processing Gemini message:', error);
            socket.send(JSON.stringify({
              type: 'error',
              error: 'Failed to process audio response: ' + error.message
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

        geminiSocket.onclose = (event) => {
          console.log('Gemini WebSocket closed, code:', event.code, 'reason:', event.reason);
          if (event.code !== 1000 && audioChunks.length === 0) {
            socket.send(JSON.stringify({
              type: 'error',
              error: `Connection closed unexpectedly: ${event.reason || 'Unknown reason'}`
            }));
          }
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
