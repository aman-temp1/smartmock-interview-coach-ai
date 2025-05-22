
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Edit, FileCheck } from "lucide-react";

const ResumePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("manage");

  // Mock data for demonstration
  const mockResumes = [
    {
      id: 1,
      name: "Software Developer Resume",
      lastUpdated: "May 15, 2025",
      atsScore: 85
    },
    {
      id: 2,
      name: "Product Manager Resume",
      lastUpdated: "May 10, 2025",
      atsScore: 78
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Resume Management</h1>
          <p className="text-muted-foreground mt-1">
            Create, optimize, and manage your resumes
          </p>
        </div>
        <Button
          className="gradient-bg"
          onClick={() => navigate("/resume/builder")}
        >
          Create New Resume
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="manage">Manage Resumes</TabsTrigger>
          <TabsTrigger value="builder">Resume Builder</TabsTrigger>
          <TabsTrigger value="tailor">Resume Tailoring</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Resumes</CardTitle>
              <CardDescription>Access and manage your saved resumes</CardDescription>
            </CardHeader>
            <CardContent>
              {mockResumes.length > 0 ? (
                <div className="space-y-4">
                  {mockResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="bg-muted/60 p-2 rounded mr-4">
                          <FileText className="h-6 w-6 text-brand-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">{resume.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Last updated: {resume.lastUpdated}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-4 text-right">
                          <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                            ATS Score: {resume.atsScore}%
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/resume/builder/${resume.id}`)}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/resume/tailor/${resume.id}`)}>
                            <FileCheck className="h-4 w-4 mr-1" /> Tailor
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No resumes yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first resume or upload an existing one
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button onClick={() => navigate("/resume/builder")}>
                      Create New Resume
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" /> Upload Resume
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume Tips</CardTitle>
              <CardDescription>
                Best practices for creating an effective resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                <li>Keep your resume to 1-2 pages maximum</li>
                <li>Use bullet points to highlight achievements</li>
                <li>Include metrics and quantifiable results</li>
                <li>Customize your resume for each job application</li>
                <li>Use keywords from the job description to pass ATS</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resume Builder</CardTitle>
              <CardDescription>
                Build an ATS-optimized resume section by section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <h3 className="font-medium text-lg mb-2">
                  Create a professional resume in minutes
                </h3>
                <p className="text-muted-foreground mb-4">
                  Click below to start building your resume
                </p>
                <Button onClick={() => navigate("/resume/builder")}>
                  Start Building
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tailor">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resume Tailoring</CardTitle>
              <CardDescription>
                Optimize your resume for specific job descriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <h3 className="font-medium text-lg mb-2">
                  Tailor your resume to match job requirements
                </h3>
                <p className="text-muted-foreground mb-4">
                  Paste a job description to get keyword suggestions and optimization tips
                </p>
                <Button onClick={() => navigate("/resume/tailor")}>
                  Tailor Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumePage;
