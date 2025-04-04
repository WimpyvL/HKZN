import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  UserPlus,
  Receipt,
  Settings,
  BarChart3,
  LogOut,
  Package,
  ClipboardList, // Import ClipboardList icon
} from "lucide-react";
import { useAppStore } from "@/lib/store"; // Corrected import
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

const Sidebar = ({ className, isCollapsed = false }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const { logout, isAuthenticated, currentUser } = useAppStore(); // Corrected hook name
  const location = useLocation();
  const navigate = useNavigate();

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    // Add the new Quotes link here
    {
      name: "Quotes",
      path: "/quotes",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    { name: "Agents", path: "/agents", icon: <Users className="h-5 w-5" /> },
    {
      name: "Clients",
      path: "/clients",
      icon: <UserPlus className="h-5 w-5" />,
    },
    {
      name: "Products",
      path: "/products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      name: "Commissions",
      path: "/commissions",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const agentLinks = [
    {
      name: "Dashboard",
      path: "/agent",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "My Clients",
      path: "/agent/clients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Register Client",
      path: "/agent/register-client",
      icon: <UserPlus className="h-5 w-5" />,
    },
    {
      name: "Products",
      path: "/agent/products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Commissions",
      path: "/agent/commissions",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/agent/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Always use admin links for the admin sidebar
  const navItems: NavItem[] = adminLinks.map((link) => ({
    label: link.name,
    icon: link.icon,
    href: link.path,
  }));

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
          {collapsed ? "AR" : "Agent Referrals"}
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
          const isActive = location.pathname === item.href;
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

export default Sidebar;
