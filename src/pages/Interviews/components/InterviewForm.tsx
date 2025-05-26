import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileText, X } from "lucide-react";
import FormField from "./FormField";
import InterviewerSelection from "./InterviewerSelection";
import { interviewTypes, interviewers, experienceLevels, getInterviewPrompt } from "../data/interviewData";

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

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type (PDF, DOC, DOCX)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, or DOCX file",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setResumeFile(file);
      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully",
      });
    }
  };

  const removeResume = () => {
    setResumeFile(null);
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Company Name" htmlFor="company-name">
          <Input
            id="company-name"
            placeholder="e.g. Google, Microsoft, Startup Inc."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="transition-all duration-200 hover:border-brand-200 focus:scale-[1.01]"
          />
        </FormField>

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
      </div>

      <FormField label="Company Description" htmlFor="company-description">
        <Textarea
          id="company-description"
          placeholder="Brief description of the company, its mission, products, or culture..."
          className="min-h-[80px] transition-all duration-200 hover:border-brand-200 focus:scale-[1.01]"
          value={companyDescription}
          onChange={(e) => setCompanyDescription(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1 transition-colors duration-200">
          Adding company details helps the interviewer ask questions about company fit and culture.
        </p>
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

      <FormField label="Resume (Optional)" htmlFor="resume-upload">
        <div className="space-y-3">
          {!resumeFile ? (
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center transition-all duration-300 hover:border-brand-300 hover:bg-brand-50/50 animate-fade-in">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2 transition-colors duration-200" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload your resume for better interview context
              </p>
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="transition-all duration-200 hover:scale-105"
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  Choose File
                </Button>
              </label>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Supports PDF, DOC, DOCX (max 10MB)
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200 animate-scale-in">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">{resumeFile.name}</span>
                <span className="text-xs text-green-600 ml-2">
                  ({(resumeFile.size / 1024 / 1024).toFixed(1)}MB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeResume}
                className="text-green-600 hover:text-green-800 hover:bg-green-100 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 transition-colors duration-200">
          Your resume will help the AI interviewer ask more relevant questions based on your background.
        </p>
      </FormField>

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
