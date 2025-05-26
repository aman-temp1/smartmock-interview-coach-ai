
import { Textarea } from "@/components/ui/textarea";
import FormField from "./FormField";

interface JobDescriptionSectionProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
}

const JobDescriptionSection = ({
  jobDescription,
  setJobDescription
}: JobDescriptionSectionProps) => {
  return (
    <FormField label="Job Description" htmlFor="job-description">
      <Textarea
        id="job-description"
        placeholder="Paste the job description to customize the interview questions..."
        className="min-h-[100px] transition-all duration-200 hover:border-brand-200 focus:scale-[1.01]"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <p className="text-xs text-muted-foreground mt-1 transition-colors duration-200">
        Adding a job description helps tailor the interview questions to the specific role.
      </p>
    </FormField>
  );
};

export default JobDescriptionSection;
