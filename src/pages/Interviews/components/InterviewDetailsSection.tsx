
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormField from "./FormField";
import { experienceLevels } from "../data/interviewData";

interface InterviewDetailsSectionProps {
  experienceLevel: string;
  setExperienceLevel: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
}

const InterviewDetailsSection = ({
  experienceLevel,
  setExperienceLevel,
  duration,
  setDuration
}: InterviewDetailsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField label="Experience Level" htmlFor="experience-level" required>
        <Select value={experienceLevel} onValueChange={setExperienceLevel}>
          <SelectTrigger id="experience-level" className="transition-all duration-200 hover:border-brand-200">
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            {experienceLevels.map((level) => (
              <SelectItem key={level.id} value={level.id} className="transition-colors duration-200">
                {level.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Interview Duration" htmlFor="duration">
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger id="duration" className="transition-all duration-200 hover:border-brand-200">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15" className="transition-colors duration-200">15 minutes</SelectItem>
            <SelectItem value="30" className="transition-colors duration-200">30 minutes</SelectItem>
            <SelectItem value="45" className="transition-colors duration-200">45 minutes</SelectItem>
            <SelectItem value="60" className="transition-colors duration-200">60 minutes</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
    </div>
  );
};

export default InterviewDetailsSection;
