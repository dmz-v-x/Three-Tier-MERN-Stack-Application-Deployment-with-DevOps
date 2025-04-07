import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Home, BookOpen, Settings, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleNavigate = () => {
    if (onClose) onClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const sidebarItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/notes", label: "All Notes", icon: BookOpen },
    { path: "/search", label: "Search", icon: Search },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="h-screen flex flex-col py-4">
      <div className="mb-8 px-6">
        <Link to="/dashboard" className="inline-flex" onClick={handleNavigate}>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            NoteFlow
          </h1>
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-between overflow-y-auto">
        <nav className="px-2 space-y-1">
          {/* Main navigation */}
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "sidebar-item",
                    isActive(item.path) && "active"
                  )}
                  onClick={handleNavigate}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}

            {/* Create new note button */}
            <li className="mt-4 px-3">
              <Button
                className="w-full justify-start"
                onClick={() => {
                  handleNavigate();
                  window.location.href = "/notes/new";
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </li>
          </ul>
        </nav>

        {/* User profile and logout */}
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="ml-2 truncate">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
