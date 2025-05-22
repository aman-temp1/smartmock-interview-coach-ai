
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save, FileText } from "lucide-react";

const ResumeBuilderPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(20);

  // Sample form state for demonstration
  const [resumeData, setResumeData] = useState({
    title: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
      setProgress((step + 1) * 20);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress((step - 1) * 20);
    }
  };

  const handleSave = () => {
    toast({
      title: "Resume saved",
      description: "Your resume has been saved successfully.",
    });
    navigate("/resume");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate("/resume")}
        className="mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-2" /> Back to Resumes
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Resume Builder</h1>
        <p className="text-muted-foreground mt-1">
          Create an ATS-optimized resume step by step
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Step {step} of 5</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-6">
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Resume Details</CardTitle>
              <CardDescription>Let's start with the basics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Resume Title</Label>
                <Input 
                  id="title" 
                  name="title"
                  placeholder="e.g., Software Developer Resume"
                  value={resumeData.title}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  A title to help you identify this resume
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="John Doe"
                  value={resumeData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={resumeData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    placeholder="(555) 123-4567"
                    value={resumeData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location"
                  placeholder="City, State"
                  value={resumeData.location}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
              <CardDescription>Write a compelling summary of your skills and experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea 
                  id="summary" 
                  name="summary"
                  placeholder="Write a 3-4 sentence summary highlighting your experience, key skills, and career achievements..."
                  className="min-h-[150px]"
                  value={resumeData.summary}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  Keep this concise and impactful - focus on your most relevant qualifications for your target role
                </p>
              </div>
            </CardContent>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Add your relevant work history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">
                  This is a demo version
                </h3>
                <p className="text-muted-foreground mb-4">
                  In a complete implementation, this would allow adding multiple work experiences
                </p>
              </div>
            </CardContent>
          </>
        )}

        {step === 4 && (
          <>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Add your educational background</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">
                  This is a demo version
                </h3>
                <p className="text-muted-foreground mb-4">
                  In a complete implementation, this would allow adding educational details
                </p>
              </div>
            </CardContent>
          </>
        )}

        {step === 5 && (
          <>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Add your relevant skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">
                  This is a demo version
                </h3>
                <p className="text-muted-foreground mb-4">
                  In a complete implementation, this would allow adding technical and soft skills
                </p>
              </div>
            </CardContent>
          </>
        )}

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          {step < 5 ? (
            <Button onClick={handleNext}>
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button className="gradient-bg" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" /> Save Resume
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResumeBuilderPage;
