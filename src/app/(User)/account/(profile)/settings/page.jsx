"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { FiMenu, FiX, FiUser, FiLock, FiBell, FiGlobe, FiCreditCard, FiShield } from "react-icons/fi";
import AccountSidebar from "@/components/users/shared/AccountSidebar";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Form states
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567"
  });
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    accountAlerts: true
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    dataCollection: true,
    thirdPartySharing: false,
    cookiePreferences: "essential"
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationToggle = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePrivacyToggle = (setting) => {
    setPrivacy(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSaveProfile = () => {
    // This would call an API to save the profile in a real app
    alert("Profile saved successfully!");
  };

  const handleSaveSettings = () => {
    // This would call an API to save settings in a real app
    alert("Settings saved successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 md:hidden">
        <h1 className="text-2xl font-bold text-black">Account Settings</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-black"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile sidebar - shown/hidden based on state */}
        {sidebarOpen && (
          <div className="md:hidden w-full">
            <AccountSidebar className="w-full" />
          </div>
        )}
        
        {/* Desktop sidebar - always visible on md+ screens */}
        <div className="hidden md:block md:w-1/4 lg:w-1/5">
          <AccountSidebar className="sticky top-24" />
        </div>

        {/* Main content area */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-black">
              <CardHeader>
                <CardTitle className="text-2xl text-black">Account Settings</CardTitle>
                <CardDescription className="text-gray-700">
                  Manage your account preferences and settings
                </CardDescription>
                
                <Tabs
                  defaultValue="profile"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="mt-4"
                >
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-black data-[state=active]:text-white">
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-black data-[state=active]:text-white">
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="data-[state=active]:bg-black data-[state=active]:text-white">
                      Privacy
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-black data-[state=active]:text-white">
                      Security
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile" className="mt-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2 space-y-2">
                          <Label htmlFor="firstName" className="text-black">First Name</Label>
                          <Input 
                            id="firstName" 
                            name="firstName" 
                            placeholder="First Name" 
                            value={profile.firstName}
                            onChange={handleProfileChange}
                            className="border-gray-300 focus:border-black focus:ring-black"
                          />
                        </div>
                        <div className="w-full md:w-1/2 space-y-2">
                          <Label htmlFor="lastName" className="text-black">Last Name</Label>
                          <Input 
                            id="lastName" 
                            name="lastName" 
                            placeholder="Last Name" 
                            value={profile.lastName}
                            onChange={handleProfileChange}
                            className="border-gray-300 focus:border-black focus:ring-black"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-black">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          placeholder="Email Address" 
                          value={profile.email}
                          onChange={handleProfileChange}
                          className="border-gray-300 focus:border-black focus:ring-black"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-black">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          placeholder="Phone Number" 
                          value={profile.phone}
                          onChange={handleProfileChange}
                          className="border-gray-300 focus:border-black focus:ring-black"
                        />
                      </div>

                      <div className="pt-4">
                        <Button 
                          className="bg-black text-white hover:bg-gray-800"
                          onClick={handleSaveProfile}
                        >
                          Save Profile
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notifications" className="mt-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base text-black">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive email notifications from our system</p>
                        </div>
                        <Switch 
                          checked={notifications.emailNotifications}
                          onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                          className="data-[state=checked]:bg-black"
                        />
                      </div>
                      <Separator className="bg-gray-200" />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base text-black">Order Updates</Label>
                          <p className="text-sm text-gray-500">Receive updates about your orders</p>
                        </div>
                        <Switch 
                          checked={notifications.orderUpdates}
                          onCheckedChange={() => handleNotificationToggle('orderUpdates')}
                          className="data-[state=checked]:bg-black"
                        />
                      </div>
                      <Separator className="bg-gray-200" />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base text-black">Promotions and Offers</Label>
                          <p className="text-sm text-gray-500">Receive promotional emails and special offers</p>
                        </div>
                        <Switch 
                          checked={notifications.promotions}
                          onCheckedChange={() => handleNotificationToggle('promotions')}
                          className="data-[state=checked]:bg-black"
                        />
                      </div>
                      <Separator className="bg-gray-200" />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base text-black">Newsletter</Label>
                          <p className="text-sm text-gray-500">Subscribe to our weekly newsletter</p>
                        </div>
                        <Switch 
                          checked={notifications.newsletter}
                          onCheckedChange={() => handleNotificationToggle('newsletter')}
                          className="data-[state=checked]:bg-black"
                        />
                      </div>
                      <Separator className="bg-gray-200" />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base text-black">Security and Account Alerts</Label>
                          <p className="text-sm text-gray-500">Important notifications about your account security</p>
                        </div>
                        <Switch 
                          checked={notifications.accountAlerts}
                          onCheckedChange={() => handleNotificationToggle('accountAlerts')}
                          className="data-[state=checked]:bg-black"
                        />
                      </div>

                      <div className="pt-4">
                        <Button 
                          className="bg-black text-white hover:bg-gray-800"
                          onClick={handleSaveSettings}
                        >
                          Save Notification Settings
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="privacy" className="mt-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base text-black">Profile Visibility</Label>
                          <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                        </div>
                        <Switch 
                          checked={privacy.profileVisibility}
                          onCheckedChange={() => handlePrivacyToggle('profileVisibility')}
                          className="data-[state=checked]:bg-black"
                        />
                      </div>
                      <Separator className="bg-gray-200" />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base text-black">Data Collection</Label>
                          <p className="text-sm text-gray-500">Allow us to collect usage data to improve our services</p>
                        </div>
                        <Switch 
                          checked={privacy.dataCollection}
                          onCheckedChange={() => handlePrivacyToggle('dataCollection')}
                          className="data-[state=checked]:bg-black"
                        />
                      </div>
                      <Separator className="bg-gray-200" />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base text-black">Third-Party Data Sharing</Label>
                          <p className="text-sm text-gray-500">Allow sharing your data with trusted partners</p>
                        </div>
                        <Switch 
                          checked={privacy.thirdPartySharing}
                          onCheckedChange={() => handlePrivacyToggle('thirdPartySharing')}
                          className="data-[state=checked]:bg-black"
                        />
                      </div>

                      <div className="pt-4">
                        <Button 
                          className="bg-black text-white hover:bg-gray-800"
                          onClick={handleSaveSettings}
                        >
                          Save Privacy Settings
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="mt-6 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-black">Current Password</Label>
                        <Input 
                          id="currentPassword" 
                          type="password" 
                          placeholder="Enter your current password"
                          className="border-gray-300 focus:border-black focus:ring-black"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-black">New Password</Label>
                        <Input 
                          id="newPassword" 
                          type="password" 
                          placeholder="Enter new password"
                          className="border-gray-300 focus:border-black focus:ring-black"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-black">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          placeholder="Confirm new password"
                          className="border-gray-300 focus:border-black focus:ring-black"
                        />
                      </div>

                      <div className="pt-2">
                        <p className="text-sm text-gray-500 mb-4">
                          Password must be at least 8 characters long and include uppercase, lowercase, number, and special character
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-black">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base text-black">Enable 2FA</Label>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                          <Switch className="data-[state=checked]:bg-black" />
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button 
                          className="bg-black text-white hover:bg-gray-800"
                        >
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardHeader>

              <CardContent>
                {/* CardContent is now empty as TabsContent components moved inside Tabs */}
              </CardContent>

              <CardFooter className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between gap-4">
                <Button 
                  variant="outline" 
                  className="border-black hover:bg-gray-100 hover:text-black w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto"
                  onClick={handleSaveSettings}
                >
                  Save All Settings
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;