import React, { useState, useEffect } from "react";
// import { useStore } from "@/lib/store"; // Remove duplicate/incorrect import
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/dashboard/lib/store"; // Corrected import path

const AgentSettings = () => {
  const { currentUser, logout } = useAppStore(); // Corrected hook name
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newClientNotifications: true,
    commissionNotifications: true,
    marketingEmails: false,
  });

  // Redirect if not authenticated or not an agent
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.role !== "agent") {
      navigate("/");
    } else {
      // Populate form with current user data
      setProfileData((prev) => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email,
      }));
    }
  }, [currentUser, navigate]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (setting: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: "Password Error",
        description: "New passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would verify the current password and update to the new one
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });

    // Reset password fields
    setProfileData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update notification preferences
    toast({
      title: "Preferences Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="bg-white p-6">
            <h2 className="text-xl font-bold mb-4">Profile Information</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <Button type="submit" className="mt-4">
                Save Changes
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="bg-white p-6">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={profileData.currentPassword}
                  onChange={handleProfileChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={profileData.newPassword}
                  onChange={handleProfileChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={profileData.confirmPassword}
                  onChange={handleProfileChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="mt-4">
                Update Password
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t">
              <h2 className="text-xl font-bold mb-4">Account Actions</h2>
              <Button variant="destructive" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-white p-6">
            <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
            <form onSubmit={handleNotificationSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() =>
                      handleNotificationChange("emailNotifications")
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Client Notifications</p>
                    <p className="text-sm text-gray-500">
                      Get notified when a client is registered
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.newClientNotifications}
                    onCheckedChange={() =>
                      handleNotificationChange("newClientNotifications")
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Commission Notifications</p>
                    <p className="text-sm text-gray-500">
                      Get notified about commission payouts
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.commissionNotifications}
                    onCheckedChange={() =>
                      handleNotificationChange("commissionNotifications")
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-500">
                      Receive promotional emails and updates
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={() =>
                      handleNotificationChange("marketingEmails")
                    }
                  />
                </div>
              </div>

              <Button type="submit" className="mt-4">
                Save Preferences
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentSettings;
