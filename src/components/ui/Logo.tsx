
import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

const Logo = ({ collapsed = false, className }: LogoProps) => {
  return (
    <div className={cn("flex items-center animate-fade-in", className)}>
      <div className="flex items-center justify-center rounded-md bg-brand-500 text-white font-bold h-9 w-9 transition-all duration-200 hover:scale-110 hover:shadow-lg">
        <span className="animate-scale-in">SM</span>
      </div>
      {!collapsed && (
        <span className="ml-2 text-xl font-bold tracking-tight text-foreground animate-fade-in">
          Smart<span className="text-brand-500 transition-colors duration-200">Mock</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
