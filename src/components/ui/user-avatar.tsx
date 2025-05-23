
import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface UserAvatarProps {
  src?: string;
  name?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const UserAvatar = ({ src, name, fallback, size = "md", className }: UserAvatarProps) => {
  // Get the initials from the name if available
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "";

  // Determine size classes
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  return (
    <Avatar className={cn(sizeClasses[size], "transition-all duration-200 hover:scale-105 animate-fade-in", className)}>
      {src ? (
        <AvatarImage src={src} alt={name || "User avatar"} className="transition-opacity duration-200" />
      ) : null}
      <AvatarFallback className="bg-muted flex items-center justify-center transition-colors duration-200 hover:bg-muted/80">
        {fallback || initials || (
          <User className={cn({
            "h-4 w-4": size === "sm",
            "h-5 w-5": size === "md",
            "h-8 w-8": size === "lg",
            "h-12 w-12": size === "xl",
          }, "transition-transform duration-200 hover:scale-110")} />
        )}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
