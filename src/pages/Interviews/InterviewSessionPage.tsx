
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const InterviewSessionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [question, setQuestion] = useState("Tell me about yourself and your experience.");
  const [timer, setTimer] = useState(30 * 60); // 30 minutes in seconds
  const [audioAnimation, setAudioAnimation] = useState(false);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle timer countdown
  useEffect(() => {
    if (timer <= 0) {
      toast({
        title: "Interview Completed",
        description: "Time's up! Your interview has been completed.",
      });
      navigate("/interviews/feedback");
      return;
    }
    
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timer, toast, navigate]);

  // Simulate microphone access
  const requestMicrophoneAccess = () => {
    toast({
      title: "Microphone Access",
      description: "Please allow access to your microphone to continue.",
    });
    
    // Simulate a microphone access delay
    setTimeout(() => {
      setIsListening(true);
      setAudioAnimation(true);
      
      // Simulate new questions after delays
      setTimeout(() => {
        setAudioAnimation(false);
        setTranscript("");
        setQuestion("What are your greatest strengths and how do they relate to this position?");
      }, 15000);
      
      setTimeout(() => {
        setAudioAnimation(false);
        setTranscript("");
        setQuestion("Describe a challenging project you worked on and how you handled it.");
      }, 35000);
    }, 1500);
  };

  // Handle stopping the interview
  const handleEndInterview = () => {
    toast({
      title: "Interview Ended",
      description: "Your interview has been ended and your performance will be analyzed.",
    });
    navigate("/interviews/feedback");
  };

  return (
    <div className="flex flex-col h-screen bg-muted/30">
      <div className="bg-background p-4 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">General Interview</h1>
          <p className="text-sm text-muted-foreground">Frontend Developer Position</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-background border border-border rounded-md px-3 py-1">
            <span className="text-sm font-medium">{formatTime(timer)}</span>
          </div>
          <Button variant="outline" size="sm">
            Pause
          </Button>
          <Button variant="destructive" size="sm" onClick={handleEndInterview}>
            End Interview
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto flex flex-col h-full">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-700 font-medium">AI</span>
                </div>
                <div>
                  <p className="text-lg font-medium mb-2">{question}</p>
                  
                  {audioAnimation && (
                    <div className="flex items-end h-8 space-x-1 mt-2">
                      <div className="wave-bar h-3 animate-wave-1"></div>
                      <div className="wave-bar h-5 animate-wave-2"></div>
                      <div className="wave-bar h-7 animate-wave-3"></div>
                      <div className="wave-bar h-4 animate-wave-4"></div>
                      <div className="wave-bar h-6 animate-wave-5"></div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex-1 flex flex-col">
            <div className="flex-1 mb-4">
              {isListening ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 bg-muted/20 rounded-lg p-4 mb-4 overflow-auto">
                    <p className="text-muted-foreground">
                      {transcript || "Listening to your response..."}
                    </p>
                  </div>
                  <div className="text-center mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-100 text-brand-800">
                      <span className="w-2 h-2 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
                      Microphone active
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/20 rounded-lg">
                  <p className="text-xl font-medium mb-4">Ready to start your interview?</p>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Click the button below to enable your microphone and begin the interview session.
                  </p>
                  <Button className="gradient-bg" size="lg" onClick={requestMicrophoneAccess}>
                    Enable Microphone & Start
                  </Button>
                </div>
              )}
            </div>
            
            <Textarea
              placeholder="Type your response here (for technical questions or if voice isn't working)..."
              className="min-h-[100px]"
            />
            
            <div className="flex justify-end mt-4">
              <Button>Submit Text Response</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSessionPage;
