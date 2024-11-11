"use client";
import React, { useState, Suspense } from 'react';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import Loader from '@/components/loader/loader';
import { motion } from 'framer-motion';



const ChangePassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [reenterNewPassword, setReenterNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const notifyLoading = () => {
    toast.loading("Changing password...", {
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
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append('newPassword', newPassword);
    formData.append('token', token);
    setLoading(true);
    notifyLoading();

    try {
      const response = await fetch('/api/changePassword', {
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
            Don’t worry! Just fill out the fields below to reset your password and regain access to your account.
          </p>
        </motion.div>
      </div>
      <div className='md:w-1/2 bg-white p-10 flex flex-col justify-center'>
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Your Password</h2>
      <p className="text-center text-gray-600 mb-8">
          Please enter and confirm your new password below to complete the password reset process.
        </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Re-enter New Password</label>
          <input
            type="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={reenterNewPassword}
            onChange={(e) => setReenterNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
      </div>
      
    </div>
  );
};

const ChangePasswordWrapper = () => (
  <Suspense fallback={<div><Loader/></div>}>
    <ChangePassword />
  </Suspense>
);

export default ChangePasswordWrapper;
