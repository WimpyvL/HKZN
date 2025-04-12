import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import useAuth from '@/contexts/auth/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Populate form when profile data loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive" });
      return;
    }
    setIsUpdating(true);

    try {
      const updates = {
        id: user.id, // The user ID is the primary key
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(), // Update timestamp
        // Role is generally not updated by the user directly here
      };

      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({ title: "Success", description: "Profile updated successfully." });
      // Optionally refetch profile data if AuthProvider doesn't automatically
      // (It should if using realtime, but manual refetch might be needed otherwise)

    } catch (error: unknown) { // Use unknown instead of any
      console.error("Error updating profile:", error);
      // Type check for error message
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile.";
      toast({
        title: "Update Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
     return (
        <div className="flex justify-center items-center min-h-screen">
            <p>Please log in to view your profile.</p>
        </div>
     )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email || ''} disabled />
              <p className="text-sm text-muted-foreground">Email cannot be changed here.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isUpdating}
              />
            </div>
             <div className="space-y-2">
                <Label>Role</Label>
                <Input value={profile?.role || user.app_metadata?.role || 'N/A'} disabled />
                 <p className="text-sm text-muted-foreground">Role is assigned by an administrator.</p>
            </div>
            <Button type="submit" disabled={isUpdating || authLoading}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
