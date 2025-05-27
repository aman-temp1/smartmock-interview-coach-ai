
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { InterviewConfig } from "../InterviewSessionPage";

interface InterviewHeaderProps {
  config: InterviewConfig;
  timer: number;
  formatTime: (seconds: number) => string;
  onEndInterview: () => void;
}

const InterviewHeader = ({ config, timer, formatTime, onEndInterview }: InterviewHeaderProps) => {
  return (
    <div className="bg-background p-4 border-b border-border flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">
          {config.interviewType.charAt(0).toUpperCase() + config.interviewType.slice(1)} Interview
        </h1>
        <p className="text-sm text-muted-foreground">
          {config.position}
          {config.companyName && ` at ${config.companyName}`}
          {config.interviewer && ` • Interviewer: ${config.interviewer}`}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-background border border-border rounded-md px-3 py-1 flex items-center gap-2">
          <Timer className="h-4 w-4" />
          <span className="text-sm font-medium">{formatTime(timer)}</span>
        </div>
        <Button variant="outline" size="sm">
          Pause
        </Button>
        <Button variant="destructive" size="sm" onClick={onEndInterview}>
          End Interview
        </Button>
      </div>
    </div>
  );
};

export default InterviewHeader;
