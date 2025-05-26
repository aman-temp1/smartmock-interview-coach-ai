
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import FormField from "./FormField";
import { interviewTypes } from "../data/interviewData";

interface InterviewTypeSelectionProps {
  interviewType: string;
  setInterviewType: (value: string) => void;
  position: string;
  setPosition: (value: string) => void;
}

const InterviewTypeSelection = ({
  interviewType,
  setInterviewType,
  position,
  setPosition
}: InterviewTypeSelectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField label="Interview Type" htmlFor="interview-type" required>
        <Select value={interviewType} onValueChange={setInterviewType}>
          <SelectTrigger id="interview-type" className="transition-all duration-200 hover:border-brand-200">
            <SelectValue placeholder="Select interview type" />
          </SelectTrigger>
          <SelectContent>
            {interviewTypes.map((type) => (
              <SelectItem key={type.id} value={type.id} className="transition-colors duration-200">
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Position/Role" htmlFor="position" required>
        <Input
          id="position"
          placeholder="e.g. Frontend Developer, Product Manager"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="transition-all duration-200 hover:border-brand-200 focus:scale-[1.01]"
        />
      </FormField>
    </div>
  );
};

export default InterviewTypeSelection;
