
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InterviewForm from "./components/InterviewForm";

const NewInterviewPage = () => {
  const [searchParams] = useSearchParams();
  const initialInterviewType = searchParams.get("type") || "";

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
        <CardContent>
          <InterviewForm initialInterviewType={initialInterviewType} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewInterviewPage;
