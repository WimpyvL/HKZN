import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BarChart3 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import LoadingScreen from "./LoadingScreen";

const DashboardSelector = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading for a better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAdminSelect = () => {
    // Set user in store to simulate admin login
    localStorage.setItem(
      "agent-referral-storage",
      JSON.stringify({
        state: {
          currentUser: {
            id: "admin-1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
          },
          isAuthenticated: true,
        },
        version: 0,
      }),
    );

    toast({
      title: "Admin Dashboard Selected",
      description: "Loading admin dashboard...",
    });

    window.location.href = "/admin";
  };

  const handleAgentSelect = () => {
    // Set user in store to simulate agent login
    localStorage.setItem(
      "agent-referral-storage",
      JSON.stringify({
        state: {
          currentUser: {
            id: "1",
            name: "John Smith",
            email: "agent@example.com",
            role: "agent",
          },
          isAuthenticated: true,
        },
        version: 0,
      }),
    );

    toast({
      title: "Agent Dashboard Selected",
      description: "Loading agent dashboard...",
    });

    window.location.href = "/agent";
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          Agent Referral & Commission System
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Select a dashboard to continue
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="w-full hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
              <CardDescription>
                Manage agents, products, and system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• View comprehensive analytics</li>
                <li>• Manage agent profiles and commission rates</li>
                <li>• Configure product offerings</li>
                <li>• Process commission payouts</li>
                <li>• Track all sales and transactions</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleAdminSelect}>
                Enter Admin Dashboard
              </Button>
            </CardFooter>
          </Card>

          <Card className="w-full hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Agent Dashboard</CardTitle>
              <CardDescription>
                Manage clients and track your commissions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Register new clients</li>
                <li>• Browse available products</li>
                <li>• Track your commission earnings</li>
                <li>• Monitor client activity</li>
                <li>• View personal performance metrics</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleAgentSelect}
              >
                Enter Agent Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardSelector;
