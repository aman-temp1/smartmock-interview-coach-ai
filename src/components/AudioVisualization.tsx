
import { useEffect, useState } from 'react';

interface AudioVisualizationProps {
  isPlaying: boolean;
  voice?: string;
}

const AudioVisualization = ({ isPlaying, voice = 'zephyr' }: AudioVisualizationProps) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey(prev => prev + 1);
    }
  }, [isPlaying]);

  // Map internal voice IDs to display names for Gemini Live API
  const getVoiceDisplayName = (voiceId: string) => {
    const voiceMap = {
      'zephyr': 'Puck',
      'charon': 'Charon',
      'kore': 'Kore',
      'zubenelgenubi': 'Aoede'
    };
    return voiceMap[voiceId] || voiceId;
  };

  if (!isPlaying) {
    return (
      <div className="flex items-center space-x-1">
        <span className="text-sm text-muted-foreground">AI is ready to speak with {getVoiceDisplayName(voice)} voice</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-end h-8 space-x-1" key={animationKey}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`wave-bar bg-brand-500 rounded-full ${
              i === 0 ? 'h-2 animate-wave-1' :
              i === 1 ? 'h-4 animate-wave-2' :
              i === 2 ? 'h-6 animate-wave-3' :
              i === 3 ? 'h-8 animate-wave-4' :
              i === 4 ? 'h-5 animate-wave-5' :
              'h-3 animate-wave-1'
            }`}
            style={{
              width: '3px',
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1.2s'
            }}
          />
        ))}
      </div>
      <span className="text-sm text-brand-600 font-medium">
        🎙️ Streaming live with {getVoiceDisplayName(voice)} voice...
      </span>
    </div>
  );
};

export default AudioVisualization;
