
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useAudioStreaming } from "@/hooks/useAudioStreaming";
import AudioVisualization from "@/components/AudioVisualization";
import { InterviewConfig, ChatMessage } from "../InterviewSessionPage";
import { useToast } from "@/components/ui/use-toast";

interface VoiceChatInterfaceProps {
  config: InterviewConfig;
  onAddMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

const VoiceChatInterface = ({ config, onAddMessage }: VoiceChatInterfaceProps) => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  
  const { 
    isPlaying, 
    isLoading, 
    isConnecting, 
    error, 
    generateSpeech, 
    stopAudio 
  } = useAudioStreaming();

  const getInterviewPrompt = () => {
    return `You are a technical interviewer with 15 years of experience. You are conducting a ${config.interviewType} interview for the position of ${config.position}${config.companyName ? ` at ${config.companyName}` : ''}. The candidate has ${config.experienceLevel} experience level.

Your role is to:
- Act professionally and maintain a structured interview flow
- Assess the candidate's technical skills and suitability for the role
- Tailor questions to the job description and candidate's background
- Ask coding questions relevant to the job and skills
- Provide clear problem statements with examples and code templates
- Evaluate code and provide constructive feedback
- Avoid off-topic discussions
- Provide a summary at the end with strengths, areas for improvement, and overall evaluation

Interview Structure:
1. Introduction - Acknowledge the job description and candidate's background
2. Questions - Ask relevant questions based on time remaining
3. Discussions - Engage in focused discussions between coding questions
4. Evaluation - Provide marks and feedback at the end

Additional Context:
${config.companyDescription ? `Company: ${config.companyDescription}` : ''}
${config.jobDescription ? `Job Description: ${config.jobDescription}` : ''}
Interview Duration: ${config.duration} minutes
Interviewer: ${config.interviewer}

Begin with a professional introduction and start the interview.`;
  };

  const startInterview = async () => {
    try {
      const introMessage = `Hello! I'm your AI technical interviewer for the ${config.position} position. Let's begin with a brief introduction about yourself and your background relevant to this role.`;
      
      await generateSpeech(introMessage, 'kore');
      
      onAddMessage({
        role: 'interviewer',
        content: introMessage,
        type: 'audio'
      });
      
      setIsInterviewStarted(true);
      
      toast({
        title: "Interview Started",
        description: "The AI interviewer is ready. Click the microphone to respond.",
      });
    } catch (error) {
      console.error('Failed to start interview:', error);
      toast({
        title: "Error",
        description: "Failed to start the interview. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleMicrophone = () => {
    if (!isInterviewStarted) {
      toast({
        title: "Start Interview First",
        description: "Please start the interview before using the microphone.",
        variant: "destructive",
      });
      return;
    }

    setIsListening(!isListening);
    
    if (!isListening) {
      toast({
        title: "Listening",
        description: "Speak your response. Click again to stop.",
      });
      
      // Simulate recording - in real implementation, integrate with speech-to-text
      setTimeout(() => {
        if (isListening) {
          const candidateResponse = "This is a simulated candidate response from voice input.";
          onAddMessage({
            role: 'candidate',
            content: candidateResponse,
            type: 'audio'
          });
          setIsListening(false);
        }
      }, 3000);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 flex flex-col p-6">
        {!isInterviewStarted ? (
          // Pre-interview state
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Mic className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Voice Interview Ready</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start your voice-based technical interview. The AI interviewer will speak questions and you can respond using your microphone.
            </p>
            <Button 
              onClick={startInterview}
              disabled={isLoading || isConnecting}
              className="px-8"
            >
              {isLoading || isConnecting ? "Starting..." : "Start Voice Interview"}
            </Button>
          </div>
        ) : (
          // Active interview state
          <div className="flex-1 flex flex-col">
            {/* Audio Status */}
            <div className="mb-6">
              <AudioVisualization isPlaying={isPlaying} voice="kore" />
              {error && (
                <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded mt-2">
                  Audio issue: {error}
                </div>
              )}
            </div>

            {/* Interview Content Area */}
            <div className="flex-1 bg-muted/20 rounded-lg p-6 mb-6">
              {isListening ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                  </div>
                  <p className="text-lg font-medium">Listening...</p>
                  <p className="text-muted-foreground">Speak your response clearly</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">Ready for your response</p>
                  <p className="text-muted-foreground">Click the microphone button to answer</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                variant={isListening ? "destructive" : "default"}
                size="lg"
                onClick={toggleMicrophone}
                className="px-8"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={toggleAudio}
                disabled={!isPlaying}
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="h-5 w-5 mr-2" />
                    Stop Audio
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5 mr-2" />
                    Audio Ready
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceChatInterface;
