"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast, Toaster } from "react-hot-toast";
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="container p-6 space-y-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button className="px-6">Save All Changes</Button>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>

        {/* Store Info Tab */}
        <TabsContent value="store">
          <StoreSettings />
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="payment">
          <PaymentSettings />
        </TabsContent>

        {/* Privacy Policy Tab */}
        <TabsContent value="privacy">
          <PrivacyPolicyEditor />
        </TabsContent>

        {/* Terms & Conditions Tab */}
        <TabsContent value="terms">
          <TermsConditionsEditor />
        </TabsContent>

        {/* Shipping & Return Policies Tab */}
        <TabsContent value="policies">
          <PolicySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// General Settings Component
function GeneralSettings() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input id="site-name" placeholder="My eCommerce Site" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-email">Admin Email</Label>
            <Input id="site-email" placeholder="admin@example.com" type="email" />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="order-updates" className="text-sm font-medium">Order Updates</Label>
              <p className="text-sm text-gray-500">Receive email notifications for new orders</p>
            </div>
            <Switch id="order-updates" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="promo-emails" className="text-sm font-medium">Promotional Emails</Label>
              <p className="text-sm text-gray-500">Send promotional emails to customers</p>
            </div>
            <Switch id="promo-emails" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="inventory-alerts" className="text-sm font-medium">Inventory Alerts</Label>
              <p className="text-sm text-gray-500">Get notified when products are low in stock</p>
            </div>
            <Switch id="inventory-alerts" defaultChecked />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => toast.success("General settings saved!")}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Store Settings Component
function StoreSettings() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Store Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="store-name">Store Name</Label>
            <Input id="store-name" placeholder="Awesome Store" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-phone">Phone Number</Label>
            <Input id="store-phone" placeholder="+1 (555) 123-4567" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="store-address">Store Address</Label>
          <Input id="store-address" placeholder="123 Market St" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="store-city">City</Label>
            <Input id="store-city" placeholder="New York" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-state">State/Province</Label>
            <Input id="store-state" placeholder="NY" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-zip">ZIP/Postal Code</Label>
            <Input id="store-zip" placeholder="10001" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="store-country">Country</Label>
          <Input id="store-country" placeholder="United States" />
        </div>

        <div className="flex justify-end">
          <Button onClick={() => toast.success("Store information saved!")}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Payment Settings Component
function PaymentSettings() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Stripe</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stripe-public-key">Stripe Public Key</Label>
              <Input id="stripe-public-key" placeholder="pk_test_****" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripe-secret-key">Stripe Secret Key</Label>
              <Input id="stripe-secret-key" placeholder="sk_test_****" type="password" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">PayPal</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="paypal-email">PayPal Email</Label>
              <Input id="paypal-email" placeholder="paypal@example.com" type="email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paypal-client-id">PayPal Client ID</Label>
              <Input id="paypal-client-id" placeholder="client_id_****" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Payment Methods</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="credit-card" className="text-sm font-medium">Credit Card</Label>
              <p className="text-sm text-gray-500">Accept credit card payments</p>
            </div>
            <Switch id="credit-card" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="paypal" className="text-sm font-medium">PayPal</Label>
              <p className="text-sm text-gray-500">Accept PayPal payments</p>
            </div>
            <Switch id="paypal" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="apple-pay" className="text-sm font-medium">Apple Pay</Label>
              <p className="text-sm text-gray-500">Accept Apple Pay payments</p>
            </div>
            <Switch id="apple-pay" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => toast.success("Payment settings saved!")}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Privacy Policy Component
function PrivacyPolicyEditor() {
  const [editorContent, setEditorContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (value) => {
    setEditorContent(value);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('content', editorContent);

      const response = await axios.post('/api/admin/dashboard/policy/privacyPolicy', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        toast.success('Privacy policy updated successfully!');
      } else {
        toast.error(`Failed to update privacy policy: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <Label htmlFor="privacy-policy" className="text-sm font-medium mb-2 block">Edit Privacy Policy</Label>
              <div className="h-[500px] border rounded-md">
                <ReactQuill
                  id="privacy-policy"
                  value={editorContent}
                  onChange={handleChange}
                  className="h-[470px]"
                  theme="snow"
                />
              </div>
            </div>
            <div className="mt-8">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Saving...' : 'Save Privacy Policy'}
              </Button>
            </div>
          </motion.div>

          <div className="w-full lg:w-1/2 bg-gray-50 p-4 rounded-lg overflow-y-auto h-[500px]">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: editorContent }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Terms & Conditions Component
function TermsConditionsEditor() {
  const [editorContent, setEditorContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (value) => {
    setEditorContent(value);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('content', editorContent);

      const response = await axios.post('/api/admin/dashboard/policy/termsAndCondition', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast.success('Terms & Conditions updated successfully!');
      } else {
        toast.error(`Failed to update Terms & Conditions: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Terms & Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <Label htmlFor="terms-conditions" className="text-sm font-medium mb-2 block">Edit Terms & Conditions</Label>
              <div className="h-[500px] border rounded-md">
                <ReactQuill
                  id="terms-conditions"
                  value={editorContent}
                  onChange={handleChange}
                  className="h-[470px]"
                  theme="snow"
                />
              </div>
            </div>
            <div className="mt-8">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Saving...' : 'Save Terms & Conditions'}
              </Button>
            </div>
          </motion.div>

          <div className="w-full lg:w-1/2 bg-gray-50 p-4 rounded-lg overflow-y-auto h-[500px]">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: editorContent }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Shipping & Return Policies Component
function PolicySettings() {
  const [activePolicy, setActivePolicy] = useState("shipping");
  const [shippingPolicy, setShippingPolicy] = useState('');
  const [returnPolicy, setReturnPolicy] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShippingChange = (value) => {
    setShippingPolicy(value);
  };

  const handleReturnChange = (value) => {
    setReturnPolicy(value);
  };

  const handleSubmitShipping = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('content', shippingPolicy);

      const response = await axios.post('/api/admin/dashboard/policy/shippingPolicy', formData);

      if (response.status === 200) {
        toast.success('Shipping Policy updated successfully!');
      } else {
        toast.error(`Failed to update Shipping Policy: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReturn = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('content', returnPolicy);

      const response = await axios.post('/api/admin/dashboard/policy/returnPolicy', formData);

      if (response.status === 200) {
        toast.success('Return Policy updated successfully!');
      } else {
        toast.error(`Failed to update Return Policy: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Shipping & Return Policies</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="shipping" value={activePolicy} onValueChange={setActivePolicy} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="shipping">Shipping Policy</TabsTrigger>
            <TabsTrigger value="return">Return Policy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shipping">
            <div className="flex flex-col lg:flex-row gap-6">
              <motion.div
                className="w-full lg:w-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4">
                  <Label htmlFor="shipping-policy" className="text-sm font-medium mb-2 block">Edit Shipping Policy</Label>
                  <div className="h-[500px] border rounded-md">
                    <ReactQuill
                      id="shipping-policy"
                      value={shippingPolicy}
                      onChange={handleShippingChange}
                      className="h-[470px]"
                      theme="snow"
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <Button 
                    onClick={handleSubmitShipping}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Shipping Policy'}
                  </Button>
                </div>
              </motion.div>

              <div className="w-full lg:w-1/2 bg-gray-50 p-4 rounded-lg overflow-y-auto h-[500px]">
                <h3 className="text-lg font-medium mb-4">Preview</h3>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: shippingPolicy }}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="return">
            <div className="flex flex-col lg:flex-row gap-6">
              <motion.div
                className="w-full lg:w-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4">
                  <Label htmlFor="return-policy" className="text-sm font-medium mb-2 block">Edit Return Policy</Label>
                  <div className="h-[500px] border rounded-md">
                    <ReactQuill
                      id="return-policy"
                      value={returnPolicy}
                      onChange={handleReturnChange}
                      className="h-[470px]"
                      theme="snow"
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <Button 
                    onClick={handleSubmitReturn}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Return Policy'}
                  </Button>
                </div>
              </motion.div>

              <div className="w-full lg:w-1/2 bg-gray-50 p-4 rounded-lg overflow-y-auto h-[500px]">
                <h3 className="text-lg font-medium mb-4">Preview</h3>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: returnPolicy }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}