
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { InterviewConfig, ChatMessage } from "../InterviewSessionPage";
import { useToast } from "@/components/ui/use-toast";

interface TextChatInterfaceProps {
  config: InterviewConfig;
  onAddMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

const TextChatInterface = ({ config, onAddMessage }: TextChatInterfaceProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentChat, setCurrentChat] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat]);

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

  const startInterview = () => {
    const introMessage = `Hello! I'm your AI technical interviewer for the ${config.position} position${config.companyName ? ` at ${config.companyName}` : ''}. 

I have ${config.experienceLevel} years of experience and will be conducting this ${config.interviewType} interview which should take approximately ${config.duration} minutes.

Let's begin with you introducing yourself and telling me about your background relevant to this role. What drew you to apply for this position?`;

    const aiMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'interviewer',
      content: introMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setCurrentChat([aiMessage]);
    onAddMessage(aiMessage);
    setIsInterviewStarted(true);

    toast({
      title: "Interview Started",
      description: "Please introduce yourself to begin the interview.",
    });
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'candidate',
      content: message.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setCurrentChat(prev => [...prev, userMessage]);
    onAddMessage(userMessage);
    setMessage("");
    setIsLoading(true);

    try {
      // Simulate AI response - in real implementation, call your AI service
      setTimeout(() => {
        const aiResponse = `Thank you for your response. Based on what you've shared, I'd like to ask you a technical question relevant to the ${config.position} role. 

Can you explain the difference between synchronous and asynchronous programming, and provide an example of when you would use each approach in a real-world application?

Please walk me through your thought process and provide code examples if possible.`;

        const aiMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'interviewer',
          content: aiResponse,
          timestamp: new Date(),
          type: 'text'
        };

        setCurrentChat(prev => [...prev, aiMessage]);
        onAddMessage(aiMessage);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to get response from interviewer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 flex flex-col p-0">
        {!isInterviewStarted ? (
          // Pre-interview state
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Bot className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Text Interview Ready</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start your text-based technical interview. You'll communicate with the AI interviewer through written messages.
            </p>
            <Button onClick={startInterview} className="px-8">
              Start Text Interview
            </Button>
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentChat.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'candidate' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'interviewer' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'candidate' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {msg.role === 'candidate' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response here..."
                  className="min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!message.trim() || isLoading}
                  size="lg"
                  className="px-6"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TextChatInterface;
