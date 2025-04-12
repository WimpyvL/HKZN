import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Removed useLocation for now
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import useAuth from '@/contexts/auth/useAuth'; // Import the updated hook
import { Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Get user and loading state from auth context (profile removed)
  const { login, user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false); // Local submitting state for button

  const navigate = useNavigate();
  // const location = useLocation(); // Keep if needed for redirecting to original 'from' page based on role
  const { toast } = useToast();

  // const from = location.state?.from?.pathname || "/dashboard"; // Keep if needed

  // Effect to handle navigation after successful login based on role
  useEffect(() => {
    // Wait for auth loading to finish AND user object to be populated
    // Role check now uses user.app_metadata
    if (!authLoading && user) {
      // Determine target path based on role from app_metadata
      let targetPath = '/'; // Default fallback to home page
      const userRole = user.app_metadata?.role; // Safely access role

      if (userRole === 'admin') {
        targetPath = '/admin/dashboard'; // Specific path for admin
      } else if (userRole === 'agent') {
        targetPath = '/agent/dashboard'; // Specific path for agent
      }

      // Check if already submitting to prevent double toast/redirect if effect runs quickly
      // (May need adjustment if isSubmitting logic changes)
      if (!isSubmitting) {
          toast({ title: "Login Successful", description: `Redirecting to ${targetPath}...` });
          navigate(targetPath, { replace: true });
      }
    }
    // Remove profile from dependency array, role check now depends only on user
  }, [user, authLoading, navigate, toast, isSubmitting]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Indicate submission attempt

    try {
      // Call the login function from the AuthContext
      // AuthProvider now handles setting the global loading state
      // We expect handleLogin in AuthProvider to return the error if one occurs
      const error = await login({ email, password });

      if (error) {
        // Use the error returned from the login attempt
        throw error;
      }
      // Don't navigate here; the useEffect hook handles navigation on user state change.
      // If login is successful, the onAuthStateChange listener in AuthProvider
      // will update the user state, triggering the useEffect above.
      // Reset submitting state only if login was successful (handled by useEffect navigation)
      // setIsSubmitting(false); // Let useEffect handle this implicitly

    } catch (error: unknown) {
      let errorMessage = "Login failed. Please check your credentials.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
       setIsSubmitting(false); // Reset submitting state only on error
    }
    // No finally block needed to reset isSubmitting if successful, as navigation occurs
  };

  // Determine if the button should be disabled
  const isButtonDisabled = authLoading || isSubmitting;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLoginSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isButtonDisabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isButtonDisabled}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isButtonDisabled}>
              {(authLoading || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
             <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/auth/register" className="font-medium text-hosting-orange hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
