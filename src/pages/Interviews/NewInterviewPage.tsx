
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const NewInterviewPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const initialInterviewType = searchParams.get("type") || "";

  const [interviewType, setInterviewType] = useState(initialInterviewType);
  const [position, setPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [duration, setDuration] = useState("30");
  const [interviewer, setInterviewer] = useState("");

  const interviewTypes = [
    { id: "general", name: "General Interview" },
    { id: "technical", name: "Technical Interview" },
    { id: "behavioral", name: "Behavioral Interview" },
    { id: "hr", name: "HR Interview" },
    { id: "leadership", name: "Leadership Interview" },
    { id: "aptitude", name: "Aptitude/Quantitative" }
  ];

  const interviewers = [
    { id: "alex", name: "Alex (Friendly)", gender: "male" },
    { id: "sophia", name: "Sophia (Professional)", gender: "female" },
    { id: "james", name: "James (Technical)", gender: "male" },
    { id: "olivia", name: "Olivia (HR Specialist)", gender: "female" }
  ];

  const experienceLevels = [
    { id: "junior", name: "Junior (0-2 years)" },
    { id: "mid", name: "Mid-level (3-5 years)" },
    { id: "senior", name: "Senior (6+ years)" },
    { id: "leadership", name: "Leadership/Management" }
  ];

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Set Up Your Interview</h1>
        <p className="text-muted-foreground mt-1">
          Customize your practice interview session
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Configuration</CardTitle>
          <CardDescription>
            Provide details about the position and interview type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="interview-type">Interview Type <span className="text-destructive">*</span></Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position/Role <span className="text-destructive">*</span></Label>
              <Input
                id="position"
                placeholder="e.g. Frontend Developer, Product Manager"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="experience-level">Experience Level <span className="text-destructive">*</span></Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Interview Duration</Label>
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description (Optional)</Label>
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
          </div>

          <div>
            <Label className="mb-3 block">Select an Interviewer <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {interviewers.map((person) => (
                <div
                  key={person.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    interviewer === person.id
                      ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                      : "border-border hover:border-brand-200 hover:bg-muted/20"
                  }`}
                  onClick={() => setInterviewer(person.id)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {person.gender === "male" ? "Male Voice" : "Female Voice"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => navigate("/interviews")}
            >
              Cancel
            </Button>
            <Button className="gradient-bg" onClick={handleStartInterview}>
              Start Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Placeholder for User icon
const User = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default NewInterviewPage;
