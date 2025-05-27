import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAudioStreaming } from "@/hooks/useAudioStreaming";
import AudioVisualization from "@/components/AudioVisualization";
import { Volume2, VolumeX, Mic, MicOff, Wifi, WifiOff } from "lucide-react";
import logo from "@/assets/images/logo.webp";

const InterviewSessionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [question, setQuestion] = useState("");
  const [timer, setTimer] = useState(30 * 60); // 30 minutes in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Audio streaming with enhanced state
  const { 
    isPlaying, 
    isLoading, 
    isConnecting, 
    error, 
    generateSpeech, 
    stopAudio 
  } = useAudioStreaming();
  
  const [selectedVoice, setSelectedVoice] = useState(() => 
    localStorage.getItem('interview-voice') || 'zephyr'
  );
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [textResponse, setTextResponse] = useState("");

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
      setQuestion("Hello! I'm excited to interview you today. Let me start by introducing myself and this interview process, and then I'd like you to tell me about yourself and your background.");
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

  // Generate speech for new questions with enhanced feedback
  useEffect(() => {
    if (isAudioEnabled && question && !isListening && !isPlaying && !isConnecting) {
      const generateQuestionSpeech = async () => {
        try {
          await generateSpeech(question, selectedVoice);
        } catch (error) {
          console.error('Failed to generate speech:', error);
          toast({
            title: "Audio Generation Failed",
            description: "Continuing with text-only mode. Audio will be simulated.",
            variant: "destructive",
          });
        }
      };
      
      generateQuestionSpeech();
    }
  }, [question, selectedVoice, isAudioEnabled, generateSpeech, isListening, isPlaying, isConnecting, toast]);

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
        "That's great! Can you tell me about a challenging project you worked on recently and how you overcame any obstacles?",
        "How do you handle working under pressure or tight deadlines? Can you give me a specific example?",
        "What interests you most about this role and our company? What do you know about our mission?",
        "Do you have any questions for me about the position, our team, or the company culture?"
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
    if (isAudioEnabled && (isPlaying || isConnecting)) {
      stopAudio();
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleMicrophone = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Microphone Activated",
        description: "You can now speak your response.",
      });
    }
  };

  const handleTextSubmit = () => {
    if (textResponse.trim()) {
      // Simulate processing the text response
      setTranscript(textResponse);
      setTextResponse("");
      toast({
        title: "Response Recorded",
        description: "Your text response has been recorded.",
      });
    }
  };

  // Enhanced audio status indicator
  const getAudioStatusIcon = () => {
    if (isConnecting) return <Wifi className="h-4 w-4 animate-pulse" />;
    if (isAudioEnabled) return <Volume2 className="h-4 w-4" />;
    return <VolumeX className="h-4 w-4" />;
  };

  const getAudioStatusText = () => {
    if (isConnecting) return 'Connecting...';
    if (isLoading) return 'Generating...';
    if (isAudioEnabled) return 'Audio On';
    return 'Audio Off';
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
            {getAudioStatusIcon()}
            {getAudioStatusText()}
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
                  <img src={logo} alt="Company Logo" className="h-full w-full" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium mb-2">{question}</p>
                  
                  {isAudioEnabled && (
                    <div className="mt-3">
                      {isConnecting && (
                        <div className="flex items-center space-x-2">
                          <Wifi className="h-4 w-4 animate-pulse text-brand-500" />
                          <span className="text-sm text-muted-foreground">Connecting to speech service...</span>
                        </div>
                      )}
                      {isLoading && !isConnecting && (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-500"></div>
                          <span className="text-sm text-muted-foreground">Generating speech...</span>
                        </div>
                      )}
                      {!isLoading && !isConnecting && (
                        <AudioVisualization isPlaying={isPlaying} voice={selectedVoice} />
                      )}
                      {error && (
                        <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded mt-2">
                          <div className="flex items-center gap-2">
                            <WifiOff className="h-4 w-4" />
                            <span>Audio streaming: {error}</span>
                          </div>
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
                  <div className="text-center mb-4 flex items-center justify-center gap-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-100 text-brand-800">
                      <span className="w-2 h-2 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
                      Microphone active
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleMicrophone}
                      className="flex items-center gap-2"
                    >
                      <MicOff className="h-4 w-4" />
                      Stop Recording
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/20 rounded-lg">
                  <p className="text-xl font-medium mb-4">Ready to start your interview?</p>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Click the button below to enable your microphone and begin the interview session.
                  </p>
                  <div className="flex gap-4">
                    <Button className="gradient-bg" size="lg" onClick={requestMicrophoneAccess}>
                      <Mic className="h-4 w-4 mr-2" />
                      Enable Microphone & Start
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <Textarea
                placeholder="Type your response here (for technical questions or if voice isn't working)..."
                className="min-h-[100px]"
                value={textResponse}
                onChange={(e) => setTextResponse(e.target.value)}
              />
              
              <div className="flex justify-end">
                <Button onClick={handleTextSubmit} disabled={!textResponse.trim()}>
                  Submit Text Response
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSessionPage;
