
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InterviewForm from "./components/InterviewForm";

const NewInterviewPage = () => {
  const [searchParams] = useSearchParams();
  const initialInterviewType = searchParams.get("type") || "";

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 animate-scale-in">
        <h1 className="text-3xl font-bold transition-colors duration-200">Set Up Your Interview</h1>
        <p className="text-muted-foreground mt-1 transition-colors duration-200">
          Customize your practice interview session
        </p>
      </div>

      <Card className="transition-all duration-300 hover:shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle className="transition-colors duration-200">Interview Configuration</CardTitle>
          <CardDescription className="transition-colors duration-200">
            Provide details about the position and interview type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InterviewForm initialInterviewType={initialInterviewType} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewInterviewPage;
