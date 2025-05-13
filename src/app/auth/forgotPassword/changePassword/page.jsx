"use client";
import React, { useState, Suspense } from 'react';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/loader/loader';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ChangePassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [reenterNewPassword, setReenterNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const notifyLoading = () => {
    return toast.loading("Changing password...", {
      position: "bottom-right",
      id: 'loadingToast'
    });
  };

  const notifySuccess = () => {
    toast.dismiss('loadingToast');
    toast.success("Password changed successfully!", {
      position: "bottom-right"
    });
  };

  const notifyError = (message) => {
    toast.dismiss('loadingToast');
    toast.error(`Error: ${message}`, {
      position: "bottom-right"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== reenterNewPassword) {
      toast.error("Passwords do not match", {
        position: "bottom-right"
      });
      return;
    }

    const formData = new FormData();
    formData.append('newPassword', newPassword);
    formData.append('token', token);
    setLoading(true);
    notifyLoading();

    try {
      const response = await fetch('/api/auth/forgotPassword/changePassword', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setNewPassword('');
        setReenterNewPassword('');
        notifySuccess();
      } else {
        notifyError('Something went wrong.');
      }
    } catch (error) {
      notifyError(error.message || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-4"
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-800">Reset Password</CardTitle>
          <CardDescription className="text-green-600">
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <Label htmlFor="newPassword" className="block mb-1">New Password</Label>
              <Input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full"
                placeholder="Enter your new password"
                required
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="reenterNewPassword" className="block mb-1">Confirm Password</Label>
              <Input
                type="password"
                id="reenterNewPassword"
                value={reenterNewPassword}
                onChange={(e) => setReenterNewPassword(e.target.value)}
                className="w-full"
                placeholder="Confirm your new password"
                required
              />
            </div>
            
            <motion.button 
              type="submit" 
              className={`w-full py-3 mt-4 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-600'} text-sm md:text-base`}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </motion.button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/auth/signIn" className="font-medium text-green-600 hover:text-green-500">
              Sign In
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-medium text-green-600 hover:text-green-500">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const ChangePasswordWrapper = () => (
  <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Loader/></div>}>
    <ChangePassword />
  </Suspense>
);

export default ChangePasswordWrapper;