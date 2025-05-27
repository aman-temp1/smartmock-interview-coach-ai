
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Timer } from "lucide-react";
import logo from "@/assets/images/logo.webp";
import InterviewHeader from "./components/InterviewHeader";
import VoiceChatInterface from "./components/VoiceChatInterface";
import TextChatInterface from "./components/TextChatInterface";
import ChatHistory from "./components/ChatHistory";

export interface InterviewConfig {
  interviewType: string;
  position: string;
  companyName?: string;
  companyDescription?: string;
  experienceLevel: string;
  duration: string;
  interviewer: string;
  jobDescription?: string;
  resumeFile?: File | null;
}

export interface ChatMessage {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: Date;
  type: 'text' | 'audio';
}

const InterviewSessionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timer, setTimer] = useState(30 * 60); // 30 minutes default
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [activeMode, setActiveMode] = useState<'voice' | 'text'>('text');

  // Load interview configuration
  useEffect(() => {
    const storedConfig = localStorage.getItem('interview-config');
    if (storedConfig) {
      const config = JSON.parse(storedConfig);
      setInterviewConfig(config);
      if (config.duration) {
        setTimer(parseInt(config.duration) * 60);
      }
    }
  }, []);

  // Timer countdown
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndInterview = () => {
    toast({
      title: "Interview Ended",
      description: "Your interview has been ended and your performance will be analyzed.",
    });
    navigate("/interviews/feedback");
  };

  const addMessageToHistory = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, newMessage]);
  };

  if (!interviewConfig) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Interview...</h2>
          <p className="text-muted-foreground">Please wait while we set up your interview session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-muted/30">
      <InterviewHeader 
        config={interviewConfig}
        timer={timer}
        formatTime={formatTime}
        onEndInterview={handleEndInterview}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Chat History Sidebar */}
        <div className="w-80 border-r border-border bg-background">
          <ChatHistory messages={chatHistory} />
        </div>

        {/* Main Interview Area */}
        <div className="flex-1 flex flex-col">
          {/* Interview Header Card */}
          <Card className="m-4 mb-2">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <img src={logo} alt="Interviewer" className="h-full w-full rounded-full" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">AI Technical Interviewer</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Ready to conduct your {interviewConfig.interviewType} interview for {interviewConfig.position}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant={activeMode === 'voice' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveMode('voice')}
                    >
                      Voice Chat
                    </Button>
                    <Button
                      variant={activeMode === 'text' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveMode('text')}
                    >
                      Text Chat
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Interface */}
          <div className="flex-1 mx-4 mb-4">
            {activeMode === 'voice' ? (
              <VoiceChatInterface 
                config={interviewConfig}
                onAddMessage={addMessageToHistory}
              />
            ) : (
              <TextChatInterface 
                config={interviewConfig}
                onAddMessage={addMessageToHistory}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSessionPage;
