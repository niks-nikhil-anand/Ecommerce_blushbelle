"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AccountSidebar from "./AccountSidebar";
import { FiUser, FiEdit2, FiMenu, FiX } from "react-icons/fi";

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Demo profile data
  const profile = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Green Street, Eco City, EC 12345",
    avatarUrl: "https://i.pravatar.cc/300"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 md:hidden">
        <h1 className="text-2xl font-bold text-green-700">My Account</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-green-700"
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
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="mb-6 bg-green-50">
                <TabsTrigger value="personal" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                  Personal Information
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                  Security
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <Card>
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-2xl text-green-700">Personal Information</CardTitle>
                      <CardDescription>Update your personal details here</CardDescription>
                    </div>
                    <div className="mt-4 sm:mt-0 relative">
                      <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-green-200">
                        <img 
                          src={profile.avatarUrl} 
                          alt="Profile" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Button 
                        size="icon" 
                        className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 rounded-full h-8 w-8"
                      >
                        <FiEdit2 size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            defaultValue={profile.name} 
                            className="border-green-200 focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            defaultValue={profile.email} 
                            className="border-green-200 focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            defaultValue={profile.phone} 
                            className="border-green-200 focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address" 
                            defaultValue={profile.address} 
                            className="border-green-200 focus:border-green-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button className="bg-green-600 hover:bg-green-800">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-green-700">Security Settings</CardTitle>
                    <CardDescription>Manage your password and security preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input 
                            id="current-password" 
                            type="password" 
                            className="border-green-200 focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input 
                            id="new-password" 
                            type="password" 
                            className="border-green-200 focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input 
                            id="confirm-password" 
                            type="password" 
                            className="border-green-200 focus:border-green-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button className="bg-green-600 hover:bg-green-800">
                          Update Password
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;