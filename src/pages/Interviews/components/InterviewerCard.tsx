
import UserAvatar from "@/components/ui/user-avatar";

interface InterviewerCardProps {
  id: string;
  name: string;
  gender: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const InterviewerCard = ({ id, name, gender, isSelected, onSelect }: InterviewerCardProps) => {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg transform ${
        isSelected
          ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500 scale-105 shadow-md"
          : "border-border hover:border-brand-200 hover:bg-muted/20"
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="flex flex-col items-center text-center">
        <div className="transition-transform duration-200 hover:scale-110">
          <UserAvatar name={name} size="lg" className="mb-3" />
        </div>
        <p className="font-medium transition-colors duration-200">{name}</p>
        <p className="text-xs text-muted-foreground transition-colors duration-200">
          {gender === "male" ? "Male Voice" : "Female Voice"}
        </p>
      </div>
    </div>
  );
};

export default InterviewerCard;
