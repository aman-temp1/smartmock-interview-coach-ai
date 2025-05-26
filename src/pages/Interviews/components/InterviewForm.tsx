
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import InterviewTypeSelection from "./InterviewTypeSelection";
import CompanyInfoSection from "./CompanyInfoSection";
import InterviewDetailsSection from "./InterviewDetailsSection";
import JobDescriptionSection from "./JobDescriptionSection";
import ResumeUploadSection from "./ResumeUploadSection";
import InterviewerSelection from "./InterviewerSelection";
import { interviewers, getInterviewPrompt } from "../data/interviewData";

interface InterviewFormProps {
  initialInterviewType?: string;
}

const InterviewForm = ({ initialInterviewType = "" }: InterviewFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [interviewType, setInterviewType] = useState(initialInterviewType);
  const [position, setPosition] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [duration, setDuration] = useState("30");
  const [interviewer, setInterviewer] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("zephyr");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

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

    const selectedInterviewer = interviewers.find(i => i.id === interviewer);
    const interviewPrompt = getInterviewPrompt(
      interviewType,
      position,
      experienceLevel,
      companyName,
      companyDescription,
      jobDescription,
      selectedInterviewer
    );

    // Store interview configuration for the session
    localStorage.setItem('interview-voice', selectedVoice);
    localStorage.setItem('interview-prompt', interviewPrompt);
    localStorage.setItem('interview-config', JSON.stringify({
      interviewType,
      position,
      companyName,
      experienceLevel,
      duration,
      interviewer: selectedInterviewer?.name
    }));
    
    navigate("/interviews/session");
  };

  const handleCancel = () => {
    navigate("/interviews");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <InterviewTypeSelection
        interviewType={interviewType}
        setInterviewType={setInterviewType}
        position={position}
        setPosition={setPosition}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompanyInfoSection
          companyName={companyName}
          setCompanyName={setCompanyName}
          companyDescription={companyDescription}
          setCompanyDescription={setCompanyDescription}
        />
      </div>

      <InterviewDetailsSection
        experienceLevel={experienceLevel}
        setExperienceLevel={setExperienceLevel}
        duration={duration}
        setDuration={setDuration}
      />

      <JobDescriptionSection
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
      />

      <ResumeUploadSection
        resumeFile={resumeFile}
        setResumeFile={setResumeFile}
      />

      <InterviewerSelection 
        interviewers={interviewers}
        selectedInterviewer={interviewer}
        setInterviewer={setInterviewer}
        selectedVoice={selectedVoice}
        onVoiceChange={setSelectedVoice}
      />

      <div className="flex justify-end pt-4 animate-fade-in">
        <Button
          variant="outline"
          className="mr-2 transition-all duration-200 hover:scale-105"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button 
          className="gradient-bg transition-all duration-200 hover:scale-105" 
          onClick={handleStartInterview}
        >
          Start Interview
        </Button>
      </div>
    </div>
  );
};

export default InterviewForm;
