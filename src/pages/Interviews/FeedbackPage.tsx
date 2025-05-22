
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FeedbackPage = () => {
  const navigate = useNavigate();

  // Mock feedback data
  const overallScore = 78;
  const categories = [
    { name: "Communication", score: 82, feedback: "Your communication was clear and concise. You articulated your thoughts well and maintained good pace." },
    { name: "Technical Knowledge", score: 75, feedback: "You demonstrated solid technical knowledge, but could elaborate more on system design principles and optimization techniques." },
    { name: "Problem Solving", score: 70, feedback: "Your approach to problems was methodical, but consider exploring multiple solutions before committing to one approach." },
    { name: "Cultural Fit", score: 85, feedback: "You showed good alignment with company values and demonstrated teamwork through your examples." }
  ];

  const questionsAndAnswers = [
    {
      question: "Tell me about yourself and your experience.",
      answer: "I'm a frontend developer with 3 years of experience building web applications using React, TypeScript, and modern CSS frameworks.",
      feedback: "Good overview of your experience, but consider structuring your answer with a past-present-future approach to make it more compelling.",
      score: 75
    },
    {
      question: "What are your greatest strengths and how do they relate to this position?",
      answer: "My strengths include problem-solving, attention to detail, and communication skills. These help me create user-friendly interfaces and collaborate effectively with teammates.",
      feedback: "Strong answer that connects your skills to the role. Consider adding a specific example to illustrate each strength.",
      score: 80
    },
    {
      question: "Describe a challenging project you worked on and how you handled it.",
      answer: "I worked on a complex dashboard that had performance issues. I implemented code splitting and optimized render cycles to improve loading times by 40%.",
      feedback: "Good technical example. To strengthen this answer, use the STAR method (Situation, Task, Action, Result) more explicitly.",
      score: 78
    }
  ];

  const improvements = [
    "Use more specific examples when discussing your experience",
    "Elaborate more on technical solutions and their impact",
    "Practice answering behavioral questions using the STAR method",
    "Research more about system design concepts for technical interviews"
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Interview Feedback</h1>
          <p className="text-muted-foreground mt-1">
            General Interview - Frontend Developer Position
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/interviews")}>
            Back to Interviews
          </Button>
          <Button onClick={() => navigate("/interviews/new")}>
            Practice Again
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Overall Score</CardTitle>
            <CardDescription>Your interview performance</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="text-brand-500 stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * overallScore) / 100}
                  ></circle>
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-bold">{overallScore}</span>
                </div>
              </div>
              <p className="text-center text-muted-foreground">
                Good performance with room for improvement
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Category Breakdown</CardTitle>
            <CardDescription>Detailed analysis by category</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {category.score}/100
                    </span>
                  </div>
                  <Progress value={category.score} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.feedback}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="questions">Question Analysis</TabsTrigger>
          <TabsTrigger value="improvements">Suggested Improvements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="questions">
          <div className="space-y-6">
            {questionsAndAnswers.map((qa, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Question {index + 1}</h3>
                      <p className="text-muted-foreground">{qa.question}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Your Response</h4>
                      <p className="bg-muted/30 p-3 rounded-md">{qa.answer}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium mb-1">Feedback</h4>
                        <p className="text-muted-foreground">{qa.feedback}</p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-brand-100 text-brand-800">
                          Score: {qa.score}/100
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="improvements">
          <Card>
            <CardHeader>
              <CardTitle>Areas for Improvement</CardTitle>
              <CardDescription>
                Focus on these areas to enhance your interview performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 rounded-full bg-brand-100 p-1 mr-3">
                      <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs">
                        {index + 1}
                      </div>
                    </div>
                    <p>{improvement}</p>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Additional Resources</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Here are some resources to help you improve in these areas:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></span>
                    <span>Technical Interview Handbook</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></span>
                    <span>STAR Method Guide for Behavioral Questions</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></span>
                    <span>System Design Interview Preparation</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackPage;
