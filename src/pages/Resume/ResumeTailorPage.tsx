
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, FileText, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ResumeTailorPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);

  // Mock data for demonstration
  const keywordMatch = 72;
  const suggestedKeywords = [
    { text: "project management", matched: false },
    { text: "agile methodologies", matched: true },
    { text: "cross-functional teams", matched: false },
    { text: "stakeholder communication", matched: true },
    { text: "product roadmap", matched: false },
    { text: "user experience", matched: true },
    { text: "market research", matched: false },
    { text: "data analysis", matched: true }
  ];

  const handleAnalyze = () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisCompleted(true);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed against the job description",
      });
    }, 2000);
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
        <h1 className="text-3xl font-bold">Resume Tailoring</h1>
        <p className="text-muted-foreground mt-1">
          Optimize your resume for specific job descriptions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>
              Paste the job description to analyze keyword matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the full job description here..."
              className="min-h-[300px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full gradient-bg" 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing
                </>
              ) : (
                'Analyze Resume'
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              See how your resume matches the job description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!analysisCompleted ? (
              <div className="flex flex-col items-center justify-center h-[300px]">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">
                  Enter a job description and analyze your resume to see results
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Keyword Match</span>
                    <span className="text-sm font-medium">{keywordMatch}%</span>
                  </div>
                  <Progress value={keywordMatch} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    A score above 80% is excellent for ATS compatibility
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Key Skills in Job Description</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestedKeywords.map((keyword, index) => (
                      <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                        {keyword.matched ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span className="text-xs">{keyword.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Recommendations</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="text-brand-500 mr-2">•</span>
                      Add missing keywords like "project management" and "product roadmap"
                    </li>
                    <li className="flex items-start">
                      <span className="text-brand-500 mr-2">•</span>
                      Quantify your achievements with metrics and numbers
                    </li>
                    <li className="flex items-start">
                      <span className="text-brand-500 mr-2">•</span>
                      Reorganize your experience section to highlight relevant skills
                    </li>
                    <li className="flex items-start">
                      <span className="text-brand-500 mr-2">•</span>
                      Add industry-specific terminology from the job description
                    </li>
                  </ul>
                </div>

                <div className="pt-4">
                  <Button className="w-full">
                    Edit Resume With Suggestions
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeTailorPage;
