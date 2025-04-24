import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from "react-hot-toast";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { firebaseApp } from '@/lib/firebaseConfig';


const PhoneOTPLogin = ({ router }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [phoneTabMode, setPhoneTabMode] = useState('input'); // 'input' or 'verify'

  // Initialize Firebase auth
  const auth = getAuth(firebaseApp);

  // Setup recaptcha verifier on component mount
  useEffect(() => {
    // Only set up recaptcha when in input mode
    if (phoneTabMode === 'input' && !window.recaptchaVerifier) {
      try {
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'normal',
          'callback': () => {
            setRecaptchaVerified(true);
          },
          'expired-callback': () => {
            setRecaptchaVerified(false);
            toast.error("reCAPTCHA has expired. Please verify again.");
          }
        });
        
        window.recaptchaVerifier = recaptchaVerifier;
        // Render the recaptcha
        recaptchaVerifier.render();
      } catch (error) {
        console.error("Error initializing recaptcha:", error);
        toast.error("Error initializing security verification. Please refresh the page.");
      }
    }
    
    return () => {
      // Cleanup when component unmounts or tab changes
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.error("Error clearing recaptcha:", error);
        }
        window.recaptchaVerifier = null;
      }
    };
  }, [phoneTabMode, auth]);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const resetCaptcha = () => {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (error) {
        console.error("Error clearing recaptcha:", error);
      }
      window.recaptchaVerifier = null;
      setRecaptchaVerified(false);
      
      // Re-initialize recaptcha
      const recaptchaDiv = document.getElementById('recaptcha-container');
      if (recaptchaDiv) {
        recaptchaDiv.innerHTML = '';
        
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'normal',
          'callback': () => {
            setRecaptchaVerified(true);
          },
          'expired-callback': () => {
            setRecaptchaVerified(false);
          }
        });
        
        window.recaptchaVerifier = recaptchaVerifier;
        recaptchaVerifier.render();
      }
    }
  };

  const handleSendPhoneOtp = async (e) => {
    if (e) e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    if (!recaptchaVerified && !window.recaptchaVerifier) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }
    
    setLoading(true);
    try {
      // Format phone number to E.164 format (required by Firebase)
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhoneNumber, 
        window.recaptchaVerifier
      );
      
      // Store the entire confirmationResult object
      window.confirmationResult = confirmationResult;
      
      setPhoneTabMode('verify');
      setOtpSent(true);
      setCountdown(60);
      toast.success("OTP sent successfully to your phone!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      
      if (error.code === 'auth/invalid-phone-number') {
        toast.error("Invalid phone number format. Please check and try again.");
      } else if (error.code === 'auth/quota-exceeded') {
        toast.error("SMS quota exceeded. Please try again later.");
      } else if (error.code === 'auth/captcha-check-failed') {
        toast.error("CAPTCHA verification failed. Please try again.");
        // Reset recaptcha on captcha failure
        resetCaptcha();
      } else {
        toast.error(`Failed to send OTP: ${error.message}`);
        resetCaptcha();
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerify = async (e) => {
    e.preventDefault();
    
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    try {
      if (!window.confirmationResult) {
        throw new Error("Verification session expired. Please request a new OTP.");
      }
      
      // Confirm the verification code using confirmationResult stored earlier
      const result = await window.confirmationResult.confirm(otpValue);
      const user = result.user;
      const idToken = await user.getIdToken();
      
      // Sync with backend
      const response = await axios.post('/api/auth/firebase-login', { 
        idToken,
        provider: 'phone',
        phoneNumber: user.phoneNumber
      });
      
      if (response.status === 200) {
        toast.success("Phone verification successful!");
        setOtpValue('');
        setPhoneNumber('');
        router.push(`/users/${response.data.userId}`);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      
      if (error.code === 'auth/invalid-verification-code') {
        toast.error("Invalid verification code. Please check and try again.");
      } else if (error.code === 'auth/code-expired') {
        toast.error("Verification code has expired. Please request a new one.");
        setPhoneTabMode('input');
        resetCaptcha();
      } else {
        toast.error(`Verification failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetPhoneTab = () => {
    setPhoneTabMode('input');
    setOtpValue('');
    setOtpSent(false);
    setCountdown(0);
    window.confirmationResult = null;
    
    // Reset recaptcha
    resetCaptcha();
  };

  return (
    <>
      {phoneTabMode === 'input' ? (
        <form onSubmit={handleSendPhoneOtp} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
            <div className="flex items-center space-x-3">
              <div className="bg-gray-50 border border-gray-300 rounded-lg h-12 flex items-center px-3 text-gray-700">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91</span>
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your 10-digit mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="rounded-lg h-12 px-4 bg-gray-50 border-gray-300 focus:border-green-500 flex-1"
                required
                maxLength={10}
                pattern="[0-9]{10}"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Verify you're not a robot</Label>
            <div id="recaptcha-container" className="flex justify-center py-3"></div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="pt-2"
          >
            <Button 
              type="submit" 
              className="w-full bg-green-700 hover:bg-green-600 text-white h-12 text-base font-medium rounded-lg" 
              disabled={loading || !phoneNumber || phoneNumber.length !== 10 || !recaptchaVerified}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </motion.div>
        </form>
      ) : (
        <form onSubmit={handlePhoneVerify} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="phone-verify" className="text-gray-700 font-medium">Phone Number</Label>
              <Button 
                type="button" 
                variant="ghost" 
                className="text-sm text-green-600 hover:text-green-800 hover:underline p-0 h-auto"
                onClick={() => setPhoneTabMode('input')}
              >
                Change Number
              </Button>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded-lg h-12 flex items-center px-4 text-gray-700">
              <Phone className="h-4 w-4 mr-2 text-gray-500" />
              <span>+91 {phoneNumber}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="otp" className="text-gray-700 font-medium">Enter 6-digit OTP Code</Label>
              <Button 
                type="button" 
                variant="ghost" 
                className="text-sm text-green-600 hover:text-green-800 hover:underline p-0 h-auto"
                onClick={handleSendPhoneOtp}
                disabled={countdown > 0 || loading}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </Button>
            </div>
            <div className="flex justify-center">
              <InputOTP 
                maxLength={6} 
                value={otpValue} 
                onChange={setOtpValue}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-14 w-14 text-lg font-semibold border-gray-300 focus:border-green-500 rounded-md" />
                  <InputOTPSlot index={1} className="h-14 w-14 text-lg font-semibold border-gray-300 focus:border-green-500 rounded-md" />
                  <InputOTPSlot index={2} className="h-14 w-14 text-lg font-semibold border-gray-300 focus:border-green-500 rounded-md" />
                  <InputOTPSlot index={3} className="h-14 w-14 text-lg font-semibold border-gray-300 focus:border-green-500 rounded-md" />
                  <InputOTPSlot index={4} className="h-14 w-14 text-lg font-semibold border-gray-300 focus:border-green-500 rounded-md" />
                  <InputOTPSlot index={5} className="h-14 w-14 text-lg font-semibold border-gray-300 focus:border-green-500 rounded-md" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              We've sent a 6-digit code to your phone number. Please enter it above.
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
      )}
    </>
  );
};

export default PhoneOTPLogin;