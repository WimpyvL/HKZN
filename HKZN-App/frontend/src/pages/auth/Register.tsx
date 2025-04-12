import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import useAuth from '@/contexts/auth/useAuth'; // Import the updated hook
import { Loader2 } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Use loading state from the auth context
  const { register, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false); // Local submitting state

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Registration Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    // Consider adding password strength validation here if needed

    setIsSubmitting(true);

    try {
      // Call the register function from the AuthContext
      // AuthProvider handles the global loading state
      const error = await register({ email, password }); // Call Supabase register

      if (error) {
        throw error; // Throw error to be caught below
      }

      // Registration successful (or initiated if email confirmation is required)
      toast({
        title: "Registration Successful",
        description: "Please check your email for a confirmation link (if required) or proceed to login.",
      });
      navigate("/auth/login"); // Redirect to login page

    } catch (error: unknown) {
      let errorMessage = "Registration failed. Please try again.";
      if (error instanceof Error) {
        // Use Supabase error message
        errorMessage = error.message;
      }
      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Reset local submitting state
    }
  };

  // Determine if the button should be disabled
  const isButtonDisabled = authLoading || isSubmitting;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegisterSubmit}>
          <CardContent className="space-y-4">
            {/* Add Name fields if needed */}
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
                minLength={6} // Example: Enforce minimum length
                disabled={isButtonDisabled}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isButtonDisabled}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isButtonDisabled}>
               {(authLoading || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register
            </Button>
             <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/auth/login" className="font-medium text-hosting-orange hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
