import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAudioStreaming } from "@/hooks/useAudioStreaming";
import AudioVisualization from "@/components/AudioVisualization";
import { Volume2, VolumeX } from "lucide-react";
import logo from "@/assets/images/logo.webp";

const InterviewSessionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [question, setQuestion] = useState("");
  const [timer, setTimer] = useState(30 * 60); // 30 minutes in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Audio streaming
  const { isPlaying, isLoading, error, generateSpeech, stopAudio } = useAudioStreaming();
  const [selectedVoice, setSelectedVoice] = useState(() => 
    localStorage.getItem('interview-voice') || 'zephyr'
  );
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Get interview configuration
  const [interviewConfig, setInterviewConfig] = useState<any>(null);

  useEffect(() => {
    // Load interview configuration and prompt
    const storedConfig = localStorage.getItem('interview-config');
    const storedPrompt = localStorage.getItem('interview-prompt');
    
    if (storedConfig) {
      setInterviewConfig(JSON.parse(storedConfig));
    }
    
    if (storedPrompt) {
      // Set initial question as introduction from the prompt
      setQuestion("Hello! I'm excited to interview you today. Let me introduce myself and then I'd like you to tell me about yourself and your background.");
    } else {
      // Fallback if no stored prompt
      setQuestion("Hello! Welcome to your interview session. Please tell me about yourself and your experience.");
    }
  }, []);

  // Set timer based on configured duration
  useEffect(() => {
    if (interviewConfig?.duration) {
      setTimer(parseInt(interviewConfig.duration) * 60);
    }
  }, [interviewConfig]);

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

  // Generate speech for new questions
  useEffect(() => {
    if (isAudioEnabled && question && !isListening) {
      generateSpeech(question, selectedVoice).catch(console.error);
    }
  }, [question, selectedVoice, isAudioEnabled, generateSpeech, isListening]);

  // Simulate microphone access
  const requestMicrophoneAccess = () => {
    toast({
      title: "Microphone Access",
      description: "Please allow access to your microphone to continue.",
    });
    
    // Simulate a microphone access delay
    setTimeout(() => {
      setIsListening(true);
      
      // Simulate interview progression with more realistic questions
      const questionTimers = [15000, 35000, 55000, 75000];
      const followUpQuestions = [
        "That's great! Can you tell me about a challenging project you worked on recently?",
        "How do you handle working under pressure or tight deadlines?",
        "What interests you most about this role and our company?",
        "Do you have any questions for me about the position or our team?"
      ];
      
      questionTimers.forEach((delay, index) => {
        setTimeout(() => {
          if (index < followUpQuestions.length) {
            setCurrentQuestionIndex(index + 1);
            setQuestion(followUpQuestions[index]);
            setTranscript("");
          }
        }, delay);
      });
    }, 1500);
  };

  // Handle stopping the interview
  const handleEndInterview = () => {
    stopAudio();
    toast({
      title: "Interview Ended",
      description: "Your interview has been ended and your performance will be analyzed.",
    });
    navigate("/interviews/feedback");
  };

  const toggleAudio = () => {
    if (isAudioEnabled && isPlaying) {
      stopAudio();
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  return (
    <div className="flex flex-col h-screen bg-muted/30">
      <div className="bg-background p-4 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">
            {interviewConfig?.interviewType ? 
              `${interviewConfig.interviewType.charAt(0).toUpperCase() + interviewConfig.interviewType.slice(1)} Interview` : 
              'Interview Session'
            }
          </h1>
          <p className="text-sm text-muted-foreground">
            {interviewConfig?.position || 'Position'} 
            {interviewConfig?.companyName && ` at ${interviewConfig.companyName}`}
            {interviewConfig?.interviewer && ` • Interviewer: ${interviewConfig.interviewer}`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAudio}
            className="flex items-center gap-2"
          >
            {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {isAudioEnabled ? 'Audio On' : 'Audio Off'}
          </Button>
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
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <div><img src={logo} alt="Company Logo" className="h-full w-full" /></div>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium mb-2">{question}</p>
                  
                  {isAudioEnabled && (
                    <div className="mt-3">
                      {isLoading && (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-500"></div>
                          <span className="text-sm text-muted-foreground">Generating speech...</span>
                        </div>
                      )}
                      {!isLoading && (
                        <AudioVisualization isPlaying={isPlaying} voice={selectedVoice} />
                      )}
                      {error && (
                        <div className="text-sm text-destructive">
                          Audio error: {error}
                        </div>
                      )}
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
