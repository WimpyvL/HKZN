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
// import { useSupabaseStore } from "@/lib/supabaseStore"; // Removed Supabase store import
import { toast } from "@/components/ui/use-toast";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAgent: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  // const { register } = useSupabaseStore(); // Removed Supabase store usage
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // try {
      // const success = await register(formData); // Removed call to Supabase register function

      // Placeholder logic - assumes registration always fails for now
      // You need to replace this with your actual registration logic
      toast({
        title: "Registration Temporarily Disabled",
        description:
          "Account creation is currently unavailable.",
        variant: "destructive",
      });

      // if (success) {
      //   toast({
      //     title: "Registration successful",
      //     description: "Your account has been created. Please log in.",
      //   });
      //   navigate("/login");
      // } else {
      //   toast({
      //     title: "Registration failed",
      //     description:
      //       "There was a problem creating your account. Please try again.",
      //     variant: "destructive",
      //   });
      // }
    // } catch (error) {
    //   toast({
    //     title: "Registration error",
    //     description: "An error occurred during registration. Please try again.",
    //     variant: "destructive",
    //   });
    // } finally {
      setIsLoading(false);
    // }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAgent"
                name="isAgent"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={formData.isAgent}
                onChange={handleChange}
                disabled={isLoading}
              />
              <Label htmlFor="isAgent" className="text-sm font-normal">
                Register as Agent
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
