
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InterviewsPage = () => {
  const navigate = useNavigate();

  const interviewTypes = [
    {
      id: "general",
      name: "General Interview",
      description: "Basic job interviews focusing on experience and background",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=200&auto=format"
    },
    {
      id: "technical",
      name: "Technical Interview",
      description: "Coding challenges, system design, problem-solving questions",
      image: "https://images.unsplash.com/photo-1522252234503-e356532cafd5?q=80&w=200&auto=format"
    },
    {
      id: "behavioral",
      name: "Behavioral Interview",
      description: "STAR method questions, past experience analysis",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=200&auto=format"
    },
    {
      id: "hr",
      name: "HR Interview",
      description: "Company culture fit, policies, workplace scenarios",
      image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=200&auto=format"
    },
    {
      id: "leadership",
      name: "Leadership Interview",
      description: "Management scenarios, team leadership questions",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=200&auto=format"
    },
    {
      id: "aptitude",
      name: "Aptitude/Quantitative",
      description: "Math, logic, analytical reasoning questions",
      image: "https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?q=80&w=200&auto=format"
    }
  ];

  const completedInterviews = [
    {
      id: 1,
      type: "Technical Interview",
      title: "Frontend Developer",
      date: "May 20, 2025",
      score: 85,
      duration: "45 minutes"
    },
    {
      id: 2,
      type: "Behavioral Interview",
      title: "STAR Method Practice",
      date: "May 18, 2025",
      score: 72,
      duration: "30 minutes"
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Interview Practice</h1>
          <p className="text-muted-foreground mt-1">
            Choose an interview type or review past practice sessions
          </p>
        </div>
        <Button
          className="gradient-bg"
          size="lg"
          onClick={() => navigate("/interviews/new")}
        >
          Start New Interview
        </Button>
      </div>

      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="new">New Interview</TabsTrigger>
          <TabsTrigger value="history">Interview History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviewTypes.map((type) => (
              <Card
                key={type.id}
                className="overflow-hidden cursor-pointer transform transition-all hover:shadow-md hover:-translate-y-1"
                onClick={() => navigate(`/interviews/new?type=${type.id}`)}
              >
                <div className="h-32 overflow-hidden">
                  <img
                    src={type.image}
                    alt={type.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{type.name}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Select
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          {completedInterviews.length > 0 ? (
            <div className="space-y-4">
              {completedInterviews.map((interview) => (
                <Card
                  key={interview.id}
                  className="cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => navigate(`/interviews/${interview.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-medium text-lg">
                          {interview.type} - {interview.title}
                        </h3>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <span>{interview.date}</span>
                          <span className="mx-2">•</span>
                          <span>{interview.duration}</span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center">
                        <div className="px-3 py-1 rounded-full text-sm font-medium bg-brand-100 text-brand-800">
                          Score: {interview.score}%
                        </div>
                        <Button variant="ghost" className="ml-2" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No interviews completed yet</h3>
              <p className="text-muted-foreground mb-6">
                Start a new interview to see your history here
              </p>
              <Button onClick={() => navigate("/interviews/new")}>
                Start New Interview
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewsPage;
