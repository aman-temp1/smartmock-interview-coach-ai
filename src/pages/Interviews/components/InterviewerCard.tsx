
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
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
          : "border-border hover:border-brand-200 hover:bg-muted/20"
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="flex flex-col items-center text-center">
        <UserAvatar name={name} size="lg" className="mb-3" />
        <p className="font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">
          {gender === "male" ? "Male Voice" : "Female Voice"}
        </p>
      </div>
    </div>
  );
};

export default InterviewerCard;
