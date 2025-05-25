
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Gemini voice models
const GEMINI_VOICES = {
  'zephyr': 'Zephyr', // bright, female
  'charon': 'Charon', // informative, male
  'kore': 'Kore', // firm, female
  'zubenelgenubi': 'Zubenelgenubi' // casual, male
};

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

    // Use Gemini's text-to-speech API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate speech for: "${text}" using voice model ${GEMINI_VOICES[voice] || 'Zephyr'}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();
    
    // For now, we'll return the text response. In a production setup,
    // you would use Google's actual Text-to-Speech API for audio generation
    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text || text;

    return new Response(
      JSON.stringify({ 
        audioContent: null, // Would contain base64 audio in production
        text: generatedContent,
        voice: voice 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in gemini-speech-generation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
