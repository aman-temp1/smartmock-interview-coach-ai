
import { Label } from "@/components/ui/label";
import InterviewerCard from "./InterviewerCard";

export interface Interviewer {
  id: string;
  name: string;
  gender: string;
}

interface InterviewerSelectionProps {
  interviewers: Interviewer[];
  selectedInterviewer: string;
  setInterviewer: (id: string) => void;
}

const InterviewerSelection = ({ 
  interviewers, 
  selectedInterviewer, 
  setInterviewer 
}: InterviewerSelectionProps) => {
  return (
    <div>
      <Label className="mb-3 block">Select an Interviewer <span className="text-destructive">*</span></Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {interviewers.map((person) => (
          <InterviewerCard
            key={person.id}
            id={person.id}
            name={person.name}
            gender={person.gender}
            isSelected={selectedInterviewer === person.id}
            onSelect={setInterviewer}
          />
        ))}
      </div>
    </div>
  );
};

export default InterviewerSelection;
