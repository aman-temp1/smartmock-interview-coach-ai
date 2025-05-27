
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChatMessage } from "../InterviewSessionPage";
import { format } from "date-fns";

interface ChatHistoryProps {
  messages: ChatMessage[];
}

const ChatHistory = ({ messages }: ChatHistoryProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm">Chat History</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {messages.length} messages
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={message.role === 'interviewer' ? 'default' : 'secondary'}>
                  {message.role === 'interviewer' ? 'AI' : 'You'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(message.timestamp, 'HH:mm')}
                </span>
              </div>
              <p className="text-sm line-clamp-3">{message.content}</p>
              {message.type === 'audio' && (
                <Badge variant="outline" className="mt-2 text-xs">
                  Audio Message
                </Badge>
              )}
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the interview to begin chatting.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistory;
