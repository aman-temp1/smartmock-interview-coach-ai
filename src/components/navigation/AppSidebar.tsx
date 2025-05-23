
import { NavLink, useLocation } from "react-router-dom";
import { Calendar, Settings, User, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "../ui/Logo";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Interviews", url: "/interviews", icon: Calendar },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const isExpanded = navItems.some((item) => isActive(item.url));

  return (
    <Sidebar collapsible="icon" className="transition-all duration-300">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center justify-between p-2">
          <Logo collapsed={state === "collapsed"} />
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup open={isExpanded}>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink 
                      to={item.url} 
                      className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
                    >
                      <item.icon className="h-4 w-4 transition-transform duration-200" />
                      <span className="transition-opacity duration-200">
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
