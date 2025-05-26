
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InterviewerCardProps {
  id: string;
  name: string;
  gender: string;
  description?: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const InterviewerCard = ({ 
  id, 
  name, 
  gender, 
  description,
  isSelected, 
  onSelect 
}: InterviewerCardProps) => {
  const getAvatar = (gender: string) => {
    const baseClasses = "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg";
    
    switch (gender.toLowerCase()) {
      case 'male':
        return <div className={`${baseClasses} bg-blue-500`}>👨</div>;
      case 'female':
        return <div className={`${baseClasses} bg-pink-500`}>👩</div>;
      default:
        return <div className={`${baseClasses} bg-gray-500`}>🤖</div>;
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected ? "ring-2 ring-brand-500 bg-brand-50" : "hover:border-brand-200"
      )}
      onClick={() => onSelect(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {getAvatar(gender)}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{gender}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          {isSelected && (
            <div className="flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewerCard;
