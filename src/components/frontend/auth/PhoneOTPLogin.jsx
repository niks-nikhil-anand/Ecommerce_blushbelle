import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from "react-hot-toast";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { useRouter } from 'next/navigation';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { firebaseApp } from '@/lib/firebaseConfig';

const PhoneOTPLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const router = useRouter();
  
  // Use ref to track if component is mounted
  const isMounted = useRef(true);
  // Use ref to hold recaptcha instance
  const recaptchaVerifierRef = useRef(null);
  // Add confirmation result ref to store the confirmation
  const confirmationResultRef = useRef(null);

  // Store verification token to persist
  const verificationToken = useRef(null);
  
  // Track if recaptcha has been initialized
  const recaptchaInitialized = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      
      // Clean up recaptcha on unmount
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
          recaptchaVerifierRef.current = null;
        } catch (error) {
          console.log("Error clearing recaptcha on unmount:", error);
        }
      }
    };
  }, []);

  // Setup recaptcha verifier only once on initial mount
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') {
      return;
    }
    
    // Skip if already initialized
    if (recaptchaInitialized.current) {
      return;
    }
    
    const initializeRecaptcha = async () => {
      // Skip if already initialized or verified
      if (recaptchaInitialized.current) {
        return;
      }
      
      // Clear container
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        console.error("Recaptcha container not found");
        return;
      }
      
      recaptchaContainer.innerHTML = '';
      
      try {
        // Initialize Firebase auth
        const auth = getAuth(firebaseApp);
        
        // Create new RecaptchaVerifier with normal size
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'normal',
          callback: (response) => {
            console.log("reCAPTCHA verified successfully", response);
            // Store token for persistence
            verificationToken.current = response;
            setRecaptchaVerified(true);
            toast.success("reCAPTCHA verification successful!");
          },
          'expired-callback': () => {
            console.log("reCAPTCHA expired");
            verificationToken.current = null;
            setRecaptchaVerified(false);
            toast.error("reCAPTCHA has expired. Please verify again.");
          }
        });
        
        // Keep reference
        recaptchaVerifierRef.current = verifier;
        
        // Render recaptcha
        await verifier.render();
        recaptchaInitialized.current = true;
        console.log("reCAPTCHA rendered successfully");
      } catch (error) {
        console.error("Error setting up reCAPTCHA:", error);
        toast.error("Error setting up verification. Please refresh the page.");
      }
    };

    // Setup with a slight delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeRecaptcha();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle phone number input with validation
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
  };

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendPhoneOtp = async (e) => {
    if (e) e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    if (!recaptchaVerified) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }
    
    setLoading(true);
    
    try {
      const auth = getAuth(firebaseApp);
      
      // Format phone number
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      console.log("Sending OTP to:", formattedPhoneNumber);
      
      // Ensure we have a valid recaptcha verifier
      if (!recaptchaVerifierRef.current) {
        throw new Error("reCAPTCHA not initialized properly. Please refresh the page.");
      }
      
      // Make sure we have a fresh RecaptchaVerifier for each send attempt
      if (recaptchaVerifierRef.current._deleted) {
        forceResetRecaptcha();
        throw new Error("reCAPTCHA instance was deleted. Please try again.");
      }
      
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhoneNumber, 
        recaptchaVerifierRef.current
      );
      
      // Store confirmation result in ref
      confirmationResultRef.current = confirmationResult;
      
      // Show OTP field in same tab
      setOtpSent(true);
      setCountdown(60);
      toast.success("OTP sent successfully to your phone!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      
      const errorMessage = getFirebaseErrorMessage(error);
      toast.error(errorMessage);
      
      // Reset recaptcha on certain errors
      if (shouldResetRecaptcha(error)) {
        forceResetRecaptcha();
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
      if (!confirmationResultRef.current) {
        throw new Error("Verification session expired. Please request a new OTP.");
      }
      
      const result = await confirmationResultRef.current.confirm(otpValue);
      const user = result.user;
      const idToken = await user.getIdToken();
      
      try {
        const response = await axios.post('/api/auth/login/firebase-login', { 
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
      } catch (apiError) {
        console.error("Backend API error:", apiError);
        toast.error("Failed to complete login process with server. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      
      if (error.code === 'auth/invalid-verification-code') {
        toast.error("Invalid verification code. Please check and try again.");
      } else if (error.code === 'auth/code-expired') {
        toast.error("Verification code has expired. Please request a new one.");
        resetVerification();
      } else {
        toast.error(`Verification failed: ${error.message || error.code || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Complete reset of captcha - only called when we truly need to reset
  const forceResetRecaptcha = () => {
    if (typeof window === 'undefined') return;
    
    // Reset verification state
    verificationToken.current = null;
    setRecaptchaVerified(false);
    recaptchaInitialized.current = false;
    
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      } catch (error) {
        console.log("Error clearing recaptcha:", error);
      }
    }
    
    // Re-initialize recaptcha
    const recaptchaDiv = document.getElementById('recaptcha-container');
    if (recaptchaDiv) {
      recaptchaDiv.innerHTML = '';
      
      // Reinitialize will happen via the useEffect
    }
  };

  const resetVerification = () => {
    setOtpValue('');
    setOtpSent(false);
    setCountdown(0);
    confirmationResultRef.current = null;
    // We DO NOT reset recaptcha verification state to maintain it
  };
  
  // Helper function to get user-friendly error messages
  const getFirebaseErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/invalid-phone-number':
        return "Invalid phone number format. Please check and try again.";
      case 'auth/quota-exceeded':
        return "SMS quota exceeded. Please try again later.";
      case 'auth/captcha-check-failed':
        return "CAPTCHA verification failed. Please try again.";
      case 'auth/invalid-app-credential':
        return "Authentication configuration error. Please check your Firebase settings or try again later.";
      case 'auth/missing-app-credential':
        return "Firebase app credential is missing. Please check your configuration.";
      case 'auth/network-request-failed':
        return "Network error. Please check your connection and try again.";
      case 'auth/missing-client-type':
        return "Authentication error. Please refresh and try again.";
      case 'auth/operation-not-allowed':
        return "Phone authentication is not enabled. Please contact the developer.";
      default:
        return `Failed to send OTP: ${error.message || error.code || "Unknown error"}`;
    }
  };
  
  // Helper function to determine if recaptcha should be reset based on error
  const shouldResetRecaptcha = (error) => {
    const resetErrorCodes = [
      'auth/captcha-check-failed',
      'auth/invalid-app-credential',
      'auth/missing-app-credential',
      'auth/network-request-failed',
      'auth/missing-client-type',
      'auth/operation-not-allowed'
    ];
    return resetErrorCodes.includes(error.code);
  };

  return (
    <form onSubmit={otpSent ? handlePhoneVerify : handleSendPhoneOtp} className="space-y-6">
      {/* Phone Number Input Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-gray-50 border border-gray-300 rounded-lg h-12 flex items-center px-3 text-gray-700">
            <Phone className="h-4 w-4 mr-2" />
            <span>+91</span>
          </div>
          {otpSent ? (
            <div className="bg-gray-50 border border-gray-300 rounded-lg h-12 flex items-center px-4 text-gray-700 flex-1">
              <span>{phoneNumber}</span>
            </div>
          ) : (
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your 10-digit mobile number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="rounded-lg h-12 px-4 bg-gray-50 border-gray-300 focus:border-green-500 flex-1"
              required
              maxLength={10}
              pattern="[0-9]{10}"
              disabled={otpSent}
            />
          )}
        </div>
        {!otpSent && <p className="text-xs text-gray-500">Enter a valid 10-digit Indian mobile number</p>}
      </div>
      
      {/* reCAPTCHA Section - Only show when OTP hasn't been sent */}
      {!otpSent && (
        <div className="space-y-3">
          <Label className="text-gray-700 font-medium">Verify you&apos;re not a robot</Label>
          
          {recaptchaVerified ? (
            <div className="flex items-center justify-center text-green-600 py-3 bg-green-50 border border-green-200 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">reCAPTCHA verification successful</span>
            </div>
          ) : (
            <div id="recaptcha-container" className="flex justify-center py-3"></div>
          )}
        </div>
      )}
      
      {/* OTP Input Section - Only show after OTP is sent */}
      {otpSent && (
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
            We&apos;ve sent a 6-digit code to your phone number. Please enter it above.
          </p>
        </div>
      )}
      
      {/* Action Button - Changes based on state */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="pt-2"
      >
        <Button 
          type="submit" 
          className="w-full bg-green-700 hover:bg-green-600 text-white h-12 text-base font-medium rounded-lg" 
          disabled={loading || 
            (otpSent ? otpValue.length !== 6 : !phoneNumber || phoneNumber.length !== 10 || !recaptchaVerified)}
        >
          {loading 
            ? (otpSent ? 'Verifying...' : 'Sending OTP...') 
            : (otpSent ? 'Verify & Login' : 'Send OTP')}
        </Button>
      </motion.div>
      
      {/* Hidden recaptcha container for persistence when in OTP verification state */}
      {otpSent && (
        <div id="recaptcha-container" className="hidden"></div>
      )}
    </form>
  );
};

export default PhoneOTPLogin;