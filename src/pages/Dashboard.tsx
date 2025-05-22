
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data for demonstration
  const recentInterviews = [
    {
      id: 1,
      title: "Technical Interview - Frontend Developer",
      date: "May 20, 2025",
      score: 85
    },
    {
      id: 2,
      title: "Behavioral Interview - STAR Method",
      date: "May 18, 2025",
      score: 72
    }
  ];

  const skillBreakdown = [
    { skill: "Technical Knowledge", score: 78 },
    { skill: "Communication", score: 82 },
    { skill: "Problem Solving", score: 75 },
    { skill: "Cultural Fit", score: 90 }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">
            Continue practicing to improve your interview skills
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Interviews</CardTitle>
            <CardDescription>Your practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-brand-500" />
              <span className="text-3xl font-bold">2</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Average Score</CardTitle>
            <CardDescription>Across all interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-3xl font-bold">78.5%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Practice Goal</CardTitle>
            <CardDescription>Weekly target</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">2 of 5 completed</span>
                <span className="text-sm text-muted-foreground">40%</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Interviews</CardTitle>
              <CardDescription>Your latest practice sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentInterviews.length > 0 ? (
                <div className="space-y-4">
                  {recentInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => navigate(`/interviews/${interview.id}`)}
                    >
                      <div>
                        <h3 className="font-medium">{interview.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {interview.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                          Score: {interview.score}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    You haven't completed any interviews yet
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate("/interviews/new")}
                  >
                    Start your first interview
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-5">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Skill Breakdown</CardTitle>
              <CardDescription>Your strengths and areas for improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillBreakdown.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.skill}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.score}%
                      </span>
                    </div>
                    <Progress value={skill.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
