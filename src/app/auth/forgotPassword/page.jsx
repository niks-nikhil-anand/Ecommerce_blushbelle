"use client";
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const notifyLoading = () => {
    return toast.loading("Sending email...", {
      position: "bottom-right",
    });
  };

  const notifySuccess = () => {
    toast.success("Email is sent to reset Password", {
      position: "bottom-right",
    });
  };

  const notifyError = (message) => {
    toast.error(`Error: ${message}`, {
      position: "bottom-right",
    });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    setLoading(true);
    const toastId = notifyLoading();
    try {
      const response = await fetch('/api/auth/forgotPassword', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setEmail('');
        setLoading(false);
        toast.dismiss(toastId);
        notifySuccess();
      } else {
        toast.dismiss(toastId);
        notifyError('Something went wrong.');
        setLoading(false);
      }
    } catch (error) {
      console.log(formData);
      toast.dismiss(toastId);
      notifyError('Request failed.');
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
          <CardTitle className="text-2xl font-bold text-green-800">Forgot Password</CardTitle>
          <CardDescription className="text-green-600">
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email" className="block mb-1">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full"
                placeholder="Enter your email address"
                required
              />
            </div>
            <motion.button 
              type="submit" 
              className={`w-full py-3 mt-4 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-600'} text-sm md:text-base`}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
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
            Remembered your password?{' '}
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
}