import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Sidebar from "../dashboard/Sidebar";
import { useAppStore } from "@/dashboard/lib/store"; // Corrected import path

const SettingsPage = () => {
  // const { settings, updateSettings } = useAppStore(); // Settings state was removed
  // TODO: Refactor this component if settings need to be managed via API/DB
  // Using placeholder/default values for now to avoid breaking the UI structure
  const settings = {
    general: { companyName: '', adminEmail: '', timezone: '', dateFormat: '', darkMode: false },
    commission: { defaultRate: 0, minRate: 0, maxRate: 0, payoutThreshold: 0, autoApprove: false, tieredRates: false },
    notifications: { email: false, newClient: false, commission: false, agentActivity: false, notificationEmail: '' }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Settings</h1>
            <Button>Save Changes</Button>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="commission">Commission</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6">
              <Card className="w-full bg-white p-6">
                <h2 className="text-2xl font-bold mb-6">General Settings</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        placeholder="Your Company Name"
                        defaultValue={settings.general.companyName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Admin Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@example.com"
                        defaultValue={settings.general.adminEmail}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Default Timezone</Label>
                      <select
                        id="timezone"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue={settings.general.timezone}
                      >
                        <option value="America/New_York">
                          Eastern Time (ET)
                        </option>
                        <option value="America/Chicago">
                          Central Time (CT)
                        </option>
                        <option value="America/Denver">
                          Mountain Time (MT)
                        </option>
                        <option value="America/Los_Angeles">
                          Pacific Time (PT)
                        </option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <select
                        id="dateFormat"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue={settings.general.dateFormat}
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableDarkMode"
                      checked={settings.general.darkMode}
                    />
                    <Label htmlFor="enableDarkMode">Enable Dark Mode</Label>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="commission" className="mt-6">
              <Card className="w-full bg-white p-6">
                <h2 className="text-2xl font-bold mb-6">Commission Settings</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="defaultCommissionRate">
                        Default Commission Rate (%)
                      </Label>
                      <Input
                        id="defaultCommissionRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        defaultValue={settings.commission.defaultRate.toString()}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minCommissionRate">
                        Minimum Commission Rate (%)
                      </Label>
                      <Input
                        id="minCommissionRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        defaultValue={settings.commission.minRate.toString()}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxCommissionRate">
                        Maximum Commission Rate (%)
                      </Label>
                      <Input
                        id="maxCommissionRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        defaultValue={settings.commission.maxRate.toString()}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payoutThreshold">
                        Payout Threshold (R)
                      </Label>
                      <Input
                        id="payoutThreshold"
                        type="number"
                        min="0"
                        step="10"
                        defaultValue={settings.commission.payoutThreshold.toString()}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoApproveCommissions"
                      checked={settings.commission.autoApprove}
                    />
                    <Label htmlFor="autoApproveCommissions">
                      Automatically Approve Commissions
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="tieredCommissions"
                      checked={settings.commission.tieredRates}
                    />
                    <Label htmlFor="tieredCommissions">
                      Enable Tiered Commission Rates
                    </Label>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card className="w-full bg-white p-6">
                <h2 className="text-2xl font-bold mb-6">
                  Notification Settings
                </h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">
                          Receive email notifications for important events
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={settings.notifications.email}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          New Client Notifications
                        </h3>
                        <p className="text-sm text-gray-500">
                          Get notified when a new client is registered
                        </p>
                      </div>
                      <Switch
                        id="newClientNotifications"
                        checked={settings.notifications.newClient}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          Commission Notifications
                        </h3>
                        <p className="text-sm text-gray-500">
                          Get notified when commissions are earned or paid
                        </p>
                      </div>
                      <Switch
                        id="commissionNotifications"
                        checked={settings.notifications.commission}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          Agent Activity Notifications
                        </h3>
                        <p className="text-sm text-gray-500">
                          Get notified about agent login and activity
                        </p>
                      </div>
                      <Switch
                        id="agentActivityNotifications"
                        checked={settings.notifications.agentActivity}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notificationEmail">
                      Notification Email Address
                    </Label>
                    <Input
                      id="notificationEmail"
                      type="email"
                      placeholder="notifications@example.com"
                      defaultValue={settings.notifications.notificationEmail}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="mt-6">
              <Card className="w-full bg-white p-6">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Your Name"
                        defaultValue="Admin User"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        defaultValue="admin@agentreferrals.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
