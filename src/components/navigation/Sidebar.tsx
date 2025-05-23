
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calendar, Settings, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../ui/Logo";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-border flex-shrink-0 transition-all duration-300 overflow-hidden sticky top-0 z-30",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-center h-16 border-b border-border">
          <Logo collapsed={collapsed} />
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            <NavItem
              to="/"
              icon={<User className="h-5 w-5" />}
              label="Dashboard"
              collapsed={collapsed}
            />
            <NavItem
              to="/interviews"
              icon={<Calendar className="h-5 w-5" />}
              label="Interviews"
              collapsed={collapsed}
            />
            <NavItem
              to="/resume"
              icon={<FileText className="h-5 w-5" />}
              label="Resume"
              collapsed={collapsed}
            />
            <NavItem
              to="/settings"
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              collapsed={collapsed}
            />
          </ul>
        </nav>

        <div className="mt-auto p-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start transition-all duration-200 hover:scale-105"
            onClick={toggleSidebar}
          >
            {collapsed ? (
              <span className="animate-fade-in">→</span>
            ) : (
              <span className="flex items-center animate-fade-in">
                <span className="mr-2">←</span>
                <span>Collapse</span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon, label, collapsed }: NavItemProps) => {
  return (
    <li className="animate-fade-in">
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center p-2 rounded-md transition-all duration-200",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium animate-scale-in"
              : "text-sidebar-foreground",
            collapsed ? "justify-center" : "justify-start"
          )
        }
      >
        <span className="flex-shrink-0 transition-transform duration-200">{icon}</span>
        {!collapsed && <span className="ml-3 animate-fade-in">{label}</span>}
      </NavLink>
    </li>
  );
};

export default Sidebar;
