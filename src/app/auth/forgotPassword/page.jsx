"use client";
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const notifyLoading = () => {
    toast.loading("Sending email...", {
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
        notifyError('Something went wrong.');
      }
    } catch (error) {
      console.log(formData)
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen mb-[6rem] md:mb-[0rem]">
      <div className="md:w-1/2 bg-blue-500 text-white p-10 flex flex-col justify-center items-center md:items-start">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center md:text-left">
            Forgot your password?
          </h1>
          <p className="mb-4 text-center md:text-left">
            Enter your email to reset your password.
          </p>
          
        </motion.div>
      </div>
      <div className="md:w-1/2 bg-white p-10 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email" className="block mb-1">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full"
              required
            />
          </div>
          <motion.button type="submit" className={`w-full py-3 mt-2 text-white rounded-2xl ${loading ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-600'} text-sm md:text-base`}
            whileTap={{ scale: 0.95 }}
          >
          {loading ? 'Sending...' : 'Send Reset Link'}
          </motion.button>
        </form>
        <p className="mt-4">
          Remembered your password?{' '}
          <Link href="/auth/signIn" className="text-blue-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}