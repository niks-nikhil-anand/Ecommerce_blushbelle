"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from 'next/navigation';

const EmailOTPLogin = () => {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendEmailOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login/sendOTP', { email });

      if (response.status === 200) {
        toast.success("OTP sent successfully!");
        setOtpSent(true);
        setCountdown(60);
      }
    } catch (error) {
      console.error("Error sending email OTP:", error);
      toast.error(
        error?.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithEmailOTP = async (e) => {
    e.preventDefault();

    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login/loginWithOTP', { email, otp: otpValue });

      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        setOtpValue('');
        console.log(response)
        router.push(`/users/${response.data.userId}`);
      }
    } catch (error) {
      console.error("Error verifying email OTP:", error);
      toast.error(
        error?.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLoginWithEmailOTP} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="email-otp" className="text-gray-700 font-medium">Email</Label>
        <div className="flex space-x-3">
          <Input
            id="email-otp"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg h-12 px-4 bg-gray-50 border-gray-300 focus:border-green-500 flex-1"
            required
          />
          <Button 
            type="button"
            onClick={handleSendEmailOtp}
            variant="outline"
            className="text-green-700 border-green-700 hover:bg-green-50 h-12 px-5 font-medium whitespace-nowrap"
            disabled={countdown > 0 || loading}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : otpSent ? 'Resend OTP' : 'Send OTP'}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="otp" className="text-gray-700 font-medium">Enter 6-digit OTP Code</Label>
        <div className="flex justify-center">
          <InputOTP 
            maxLength={6} 
            value={otpValue} 
            onChange={setOtpValue}
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="h-14 w-14 text-lg font-semibold border-gray-300 focus:border-green-500 rounded-md"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          We've sent a 6-digit code to your email address. Please enter it above.
        </p>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="pt-2"
      >
        <Button 
          type="submit" 
          className="w-full bg-green-700 hover:bg-green-600 text-white h-12 text-base font-medium rounded-lg" 
          disabled={loading || otpValue.length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify & Login'}
        </Button>
      </motion.div>
    </form>
  );
};

export default EmailOTPLogin;
