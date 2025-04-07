import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  DollarSign,
  Package,
  Settings,
  BarChart3,
  LogOut,
  UserPlus,
} from "lucide-react";
import { useAppStore } from "@/dashboard/lib/store"; // Corrected import path
import { toast } from "@/components/ui/use-toast";

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const AgentSidebar = ({ className, isCollapsed = false }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const { logout } = useAppStore(); // Corrected hook name
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
      href: "/agent/",
    },
    {
      label: "My Clients",
      icon: <Users className="w-5 h-5" />,
      href: "/agent/clients",
    },
    {
      label: "Register Client",
      icon: <UserPlus className="w-5 h-5" />,
      href: "/agent/register-client",
    },
    {
      label: "Products",
      icon: <Package className="w-5 h-5" />,
      href: "/agent/products",
    },
    {
      label: "Commissions",
      icon: <DollarSign className="w-5 h-5" />,
      href: "/agent/commissions",
    },
    {
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      href: "/agent/settings",
    },
  ];

  const handleLogout = () => {
    logout();
    // Clear local storage to ensure no data persists between sessions
    localStorage.removeItem("agent-referral-storage");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-background border-r",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b flex justify-between items-center">
        <h1
          className={cn(
            "font-bold text-foreground transition-all",
            collapsed ? "text-center text-sm" : "text-xl",
          )}
        >
          {collapsed ? "AR" : "Agent Portal"}
        </h1>
        <button
          onClick={toggleCollapse}
          className="text-gray-500 hover:text-gray-700"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          // Check if the current path starts with the item's href for better matching
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/agent" && location.pathname.includes(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
            "text-muted-foreground",
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AgentSidebar;
