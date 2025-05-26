
import { Label } from "@/components/ui/label";
import InterviewerCard from "./InterviewerCard";
import { GEMINI_VOICES } from "@/contexts/AudioContext";

export interface Interviewer {
  id: string;
  name: string;
  gender: string;
  voiceId: string;
  description: string;
}

interface InterviewerSelectionProps {
  interviewers: Interviewer[];
  selectedInterviewer: string;
  setInterviewer: (id: string) => void;
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
}

const InterviewerSelection = ({ 
  interviewers, 
  selectedInterviewer, 
  setInterviewer,
  selectedVoice,
  onVoiceChange
}: InterviewerSelectionProps) => {
  const handleInterviewerSelect = (interviewerId: string) => {
    const interviewer = interviewers.find(i => i.id === interviewerId);
    if (interviewer) {
      setInterviewer(interviewerId);
      onVoiceChange(interviewer.voiceId);
    }
  };

  return (
    <div>
      <Label className="mb-3 block">Select Your AI Interviewer <span className="text-destructive">*</span></Label>
      <p className="text-sm text-muted-foreground mb-4">
        Choose an AI interviewer persona and voice for your practice session.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {interviewers.map((person) => (
          <InterviewerCard
            key={person.id}
            id={person.id}
            name={person.name}
            gender={person.gender}
            description={person.description}
            isSelected={selectedInterviewer === person.id}
            onSelect={handleInterviewerSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default InterviewerSelection;
