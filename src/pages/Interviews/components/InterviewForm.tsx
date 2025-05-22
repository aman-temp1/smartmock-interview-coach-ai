
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import FormField from "./FormField";
import InterviewerSelection from "./InterviewerSelection";
import { interviewTypes, interviewers, experienceLevels } from "../data/interviewData";

interface InterviewFormProps {
  initialInterviewType?: string;
}

const InterviewForm = ({ initialInterviewType = "" }: InterviewFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [interviewType, setInterviewType] = useState(initialInterviewType);
  const [position, setPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [duration, setDuration] = useState("30");
  const [interviewer, setInterviewer] = useState("");

  const handleStartInterview = () => {
    // Validate required fields
    if (!interviewType || !position || !experienceLevel || !interviewer) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would create an interview session in the backend
    // For now, we'll navigate to a mock interview page
    navigate("/interviews/session");
  };

  const handleCancel = () => {
    navigate("/interviews");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Interview Type" htmlFor="interview-type" required>
          <Select value={interviewType} onValueChange={setInterviewType}>
            <SelectTrigger id="interview-type">
              <SelectValue placeholder="Select interview type" />
            </SelectTrigger>
            <SelectContent>
              {interviewTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
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
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Experience Level" htmlFor="experience-level" required>
          <Select value={experienceLevel} onValueChange={setExperienceLevel}>
            <SelectTrigger id="experience-level">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level.id} value={level.id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Interview Duration" htmlFor="duration">
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger id="duration">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <FormField label="Job Description" htmlFor="job-description">
        <Textarea
          id="job-description"
          placeholder="Paste the job description to customize the interview questions..."
          className="min-h-[100px]"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Adding a job description helps tailor the interview questions to the specific role.
        </p>
      </FormField>

      <InterviewerSelection 
        interviewers={interviewers}
        selectedInterviewer={interviewer}
        setInterviewer={setInterviewer}
      />

      <div className="flex justify-end pt-4">
        <Button
          variant="outline"
          className="mr-2"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button className="gradient-bg" onClick={handleStartInterview}>
          Start Interview
        </Button>
      </div>
    </div>
  );
};

export default InterviewForm;
