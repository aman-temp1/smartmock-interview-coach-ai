
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GEMINI_VOICES } from "@/contexts/AudioContext";

interface VoiceSelectionProps {
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
}

const VoiceSelection = ({ selectedVoice, onVoiceChange }: VoiceSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="voice-selection">
        AI Interviewer Voice
      </Label>
      <Select value={selectedVoice} onValueChange={onVoiceChange}>
        <SelectTrigger id="voice-selection" className="transition-all duration-200 hover:border-brand-200">
          <SelectValue placeholder="Select interviewer voice" />
        </SelectTrigger>
        <SelectContent>
          {GEMINI_VOICES.map((voice) => (
            <SelectItem key={voice.id} value={voice.id} className="transition-colors duration-200">
              {voice.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground transition-colors duration-200">
        Choose the AI interviewer's voice for speech generation during the interview.
      </p>
    </div>
  );
};

export default VoiceSelection;
