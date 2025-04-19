"use client";

import React, { useState, useEffect } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PencilIcon, Trash2Icon, PlusCircleIcon } from "lucide-react";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="container p-6 space-y-6 max-w-7xl mx-auto">


      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button className="px-6">Save All Changes</Button>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="shipping">Shipping Rules</TabsTrigger>
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
        
        {/* Shipping Settings Tab */}
        <TabsContent value="shipping">
          <ShippingSettings />
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

// Shipping Settings Component
function ShippingSettings() {
  const [shippingRules, setShippingRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    minPrice: 0,
    maxPrice: null,
    shippingFee: 0,
    isFreeShipping: false,
    minDays: 1,
    maxDays: 7,
    isActive: true
  });

  // Fetch shipping rules on component mount
  useEffect(() => {
    fetchShippingRules();
  }, []);

  const fetchShippingRules = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/admin/dashboard/shipping');
      setShippingRules(response.data);
    } catch (error) {
      toast.error(`Error fetching shipping rules: ${error.message}`);
      console.error('Error fetching shipping rules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Transform form data to match schema
      const payload = {
        country: formData.country,
        state: formData.state || null,
        priceRange: {
          min: parseFloat(formData.minPrice),
          max: formData.maxPrice ? parseFloat(formData.maxPrice) : null
        },
        shippingFee: parseFloat(formData.shippingFee),
        isFreeShipping: formData.isFreeShipping,
        estimatedDeliveryTime: {
          minDays: parseInt(formData.minDays),
          maxDays: parseInt(formData.maxDays)
        },
        isActive: formData.isActive
      };

      if (editingRule) {
        // Update existing rule
        await axios.put(`/api/admin/dashboard/shipping/${editingRule._id}`, payload);
        toast.success('Shipping rule updated successfully!');
      } else {
        // Create new rule
        await axios.post('/api/admin/dashboard/shipping', payload);
        toast.success('Shipping rule added successfully!');
      }
      
      // Close dialog and refresh data
      setIsOpen(false);
      resetForm();
      fetchShippingRules();
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.msg || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this shipping rule?')) {
      try {
        await axios.delete(`'/api/admin/dashboard/shipping/${id}`);
        toast.success('Shipping rule deleted successfully!');
        fetchShippingRules();
      } catch (error) {
        toast.error(`Error: ${error.response?.data?.msg || error.message}`);
      }
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      country: rule.country,
      state: rule.state || '',
      minPrice: rule.priceRange.min,
      maxPrice: rule.priceRange.max || '',
      shippingFee: rule.shippingFee,
      isFreeShipping: rule.isFreeShipping,
      minDays: rule.estimatedDeliveryTime.minDays,
      maxDays: rule.estimatedDeliveryTime.maxDays,
      isActive: rule.isActive
    });
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      country: '',
      state: '',
      minPrice: 0,
      maxPrice: null,
      shippingFee: 0,
      isFreeShipping: false,
      minDays: 1,
      maxDays: 7,
      isActive: true
    });
    setEditingRule(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Custom Switch component with 3D styling
  const Switch3D = ({ id, name, checked, onChange, activeColor = "bg-green-500", inactiveColor = "bg-gray-300" }) => {
    return (
      <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
        <input
          type="checkbox"
          name={name}
          id={id}
          checked={checked}
          onChange={onChange}
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-400 appearance-none cursor-pointer transition-transform duration-200 ease-in"
        />
        <label
          htmlFor={id}
          className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer shadow-md ${checked ? activeColor : inactiveColor}`}
          style={{
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
          }}
        ></label>
        <style jsx>{`
          .toggle-checkbox:checked {
            transform: translateX(100%);
            border-color: #2f855a;
          }
          .toggle-label {
            transition: background-color 0.2s ease;
          }
          .toggle-checkbox {
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            z-index: 1;
          }
        `}</style>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Shipping Rules</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setIsOpen(true);
            }}>
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add Shipping Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-gray-100">
            <DialogHeader className="bg-white rounded-t-lg p-4 border-b">
              <DialogTitle>{editingRule ? 'Edit Shipping Rule' : 'Add New Shipping Rule'}</DialogTitle>
              <DialogDescription>
                Define shipping costs and delivery times for different locations and order values.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 px-4 bg-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-700 font-medium">Country</Label>
                  <div className="relative">
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="India"
                      required
                      className="bg-white shadow-sm border-gray-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-gray-700 font-medium">State/Province (Optional)</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="New Delhi"
                    className="bg-white shadow-sm border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPrice" className="text-gray-700 font-medium">Min Order Value (₹)</Label>
                  <Input
                    id="minPrice"
                    name="minPrice"
                    type="number"
                    value={formData.minPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="bg-white shadow-sm border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPrice" className="text-gray-700 font-medium">Max Order Value (₹) (Optional)</Label>
                  <Input
                    id="maxPrice"
                    name="maxPrice"
                    type="number"
                    value={formData.maxPrice || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="No maximum"
                    className="bg-white shadow-sm border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingFee" className="text-gray-700 font-medium">Shipping Fee (₹)</Label>
                  <Input
                    id="shippingFee"
                    name="shippingFee"
                    type="number"
                    value={formData.shippingFee}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    disabled={formData.isFreeShipping}
                    className="bg-white shadow-sm border-gray-300"
                  />
                </div>
                <div className="flex items-center space-x-3 pt-8">
                  <Switch3D
                    id="isFreeShipping"
                    name="isFreeShipping"
                    checked={formData.isFreeShipping}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData(prev => ({
                        ...prev,
                        isFreeShipping: checked,
                        shippingFee: checked ? 0 : prev.shippingFee
                      }));
                    }}
                    activeColor="bg-blue-500"
                  />
                  <Label htmlFor="isFreeShipping" className="text-gray-800 font-medium">Free Shipping</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minDays" className="text-gray-700 font-medium">Min Delivery Time (Days)</Label>
                  <Input
                    id="minDays"
                    name="minDays"
                    type="number"
                    value={formData.minDays}
                    onChange={handleChange}
                    min="1"
                    required
                    className="bg-white shadow-sm border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDays" className="text-gray-700 font-medium">Max Delivery Time (Days)</Label>
                  <Input
                    id="maxDays"
                    name="maxDays"
                    type="number"
                    value={formData.maxDays}
                    onChange={handleChange}
                    min={formData.minDays}
                    required
                    className="bg-white shadow-sm border-gray-300"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded bg-gray-200 shadow-inner border border-gray-300">
                <Switch3D
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData(prev => ({
                      ...prev,
                      isActive: checked
                    }));
                  }}
                />
                <Label htmlFor="isActive" className="text-gray-800 font-semibold">Active</Label>
              </div>
            </div>
            <DialogFooter className="bg-white rounded-b-lg p-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsOpen(false);
                  resetForm();
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {editingRule ? 'Update' : 'Add'} Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="text-center">Loading shipping rules...</div>
          </div>
        ) : (
          <div className="rounded-md border border-gray-300 shadow-sm">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="text-gray-700">Country</TableHead>
                  <TableHead className="text-gray-700">State/Province</TableHead>
                  <TableHead className="text-gray-700">Price Range</TableHead>
                  <TableHead className="text-gray-700">Shipping Fee</TableHead>
                  <TableHead className="text-gray-700">Delivery Time</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                  <TableHead className="text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shippingRules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-600">
                      No shipping rules found. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  shippingRules.map((rule) => (
                    <TableRow key={rule._id} className="border-b border-gray-200">
                      <TableCell className="text-gray-800">{rule.country}</TableCell>
                      <TableCell className="text-gray-800">{rule.state || '-'}</TableCell>
                      <TableCell className="text-gray-800">
                        ₹{rule.priceRange.min} - {rule.priceRange.max ? `₹${rule.priceRange.max}` : 'No limit'}
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {rule.isFreeShipping ? 'Free' : `₹${rule.shippingFee.toFixed(2)}`}
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {rule.estimatedDeliveryTime.minDays} - {rule.estimatedDeliveryTime.maxDays} days
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rule.isActive 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(rule)}
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(rule._id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
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