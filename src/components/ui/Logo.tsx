
import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

const Logo = ({ collapsed = false, className }: LogoProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center justify-center rounded-md bg-brand-500 text-white font-bold h-9 w-9">
        <span>SM</span>
      </div>
      {!collapsed && (
        <span className="ml-2 text-xl font-bold tracking-tight text-foreground">
          Smart<span className="text-brand-500">Mock</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
