
import { cn } from "@/lib/utils";
import logo from "@/assets/images/logo.webp";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

const Logo = ({ collapsed = false, className }: LogoProps) => {
  return (
    <div className={cn("flex items-center animate-fade-in hover:scale-110", className)}>
      <div className="flex items-center justify-center rounded-md text-white font-bold h-9 w-9 transition-all duration-200">
        <div>
          <img src={logo} alt="Company Logo" className="h-full w-full" />
        </div>
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
