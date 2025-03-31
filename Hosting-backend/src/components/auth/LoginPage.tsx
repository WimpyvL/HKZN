import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useSupabaseStore } from "@/lib/supabaseStore";
import { toast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAgent, setIsAgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useSupabaseStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, use these credentials
      // This is a temporary solution until the Supabase auth is fully set up
      if (email === "admin@example.com" && password === "password123") {
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
          title: "Login successful",
          description: `Welcome back, Admin!`,
        });
        window.location.href = "/";
        return;
      } else if (email === "agent@example.com" && password === "password123") {
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
          title: "Login successful",
          description: `Welcome back, Agent!`,
        });
        window.location.href = "/#/agent";
        return;
      }

      const success = await login(email, password, isAgent);

      if (success) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${isAgent ? "Agent" : "Admin"}!`,
        });

        // Use window.location.href instead of navigate to ensure a full page reload
        window.location.href = isAgent ? "/agent" : "/admin";
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign In
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agent"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={isAgent}
                onChange={() => setIsAgent(!isAgent)}
                disabled={isLoading}
              />
              <Label htmlFor="agent" className="text-sm font-normal">
                Login as Agent
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 w-full">
            <Button
              variant="default"
              className="w-full"
              onClick={() => {
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
                  title: "Login successful",
                  description: "Welcome back, Admin!",
                });
                window.location.href = "/admin";
              }}
            >
              Login as Admin
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // Set user in store to simulate login
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
                  title: "Login successful",
                  description: "Welcome back, Agent!",
                });
                window.location.href = "/agent";
              }}
            >
              Login as Agent
            </Button>
          </div>
          <div className="text-sm text-center text-gray-500">
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
