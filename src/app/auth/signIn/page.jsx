"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import toast from "react-hot-toast";
import Image from "next/image";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const handleProviderSignIn = async (provider) => {
    try {
      const result = await signIn(provider);
      if (result?.error) throw new Error(result.error);
      console.log("User signed in successfully:", result);
    } catch (error) {
      console.error("Error during sign-in:", error.message);
    }
  };

  const handleLoginWithPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = { email, password, rememberMe };
    try {
      const response = await axios.post('/api/auth/login', formData, { headers: { 'Content-Type': 'application/json' } });
      if (response.status === 200) {
        const cookieResponse = await axios.get('/api/auth/userAuthTokenCookies');
        if (cookieResponse.status === 200 ) {
          toast.success("Login successful!");
          setEmail(''); setPassword(''); setRememberMe(false);
          console.log("User ID:", cookieResponse.data[0]._id);
          router.push(`/users/${cookieResponse.data[0]._id}`);
        }
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post('/api/auth/login/sendOTP', { email });
      if (response.status === 200) {
        toast.success("OTP sent successfully!");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleLoginWithOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login/loginWithOTP', { email, otp: otpInput });

      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        setOtpInput('');
        router.push(`/users/${response.data[0]._id}`);
      }
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpInputChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {  // Allow only up to 4 digits
      setOtpInput(value);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 px-4 md:px-6 w-full flex-col py-16">
      <Card className="w-full md:w-3/4 lg:w-2/3 shadow-xl border-gray-200">
        <CardHeader className="space-y-4 text-center px-6 md:px-8 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CardTitle className="text-2xl md:text-3xl lg:text-4xl text-green-600 font-bold tracking-tight">
              Welcome Back to Cleanveda
            </CardTitle>
            <CardDescription className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed pt-3">
              <span className="text-green-500">👋 Sign in</span> to access your personalized health dashboard, track your orders, and continue your wellness journey
            </CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-8 px-6 md:px-12 lg:px-16">
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="password" className="py-3">Sign In with Password</TabsTrigger>
              <TabsTrigger value="otp" className="py-3">Sign In with OTP</TabsTrigger>
            </TabsList>
            
            <TabsContent value="password" className="mt-6">
              <form onSubmit={handleLoginWithPassword} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg h-12 px-4 bg-gray-50 border-gray-300 focus:border-green-500"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <Link href="/auth/forgotPassword" className="text-sm text-green-600 hover:text-green-800 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-lg h-12 px-4 pr-12 bg-gray-50 border-gray-300 focus:border-green-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-12 w-12 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={() => setRememberMe(!rememberMe)}
                    className="text-green-600 border-gray-400 data-[state=checked]:bg-green-600"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">Remember me for 30 days</Label>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="pt-2"
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-green-700 hover:bg-green-600 text-white h-12 text-base font-medium rounded-lg" 
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </motion.div>
              </form>
            </TabsContent>
            
            <TabsContent value="otp" className="mt-6">
              <form onSubmit={handleLoginWithOTP} className="space-y-6">
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
                      onClick={handleSendOtp}
                      variant="outline"
                      className="text-green-700 border-green-700 hover:bg-green-50 h-12 px-5 font-medium"
                    >
                      Send OTP
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="otp" className="text-gray-700 font-medium">OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otpInput}
                    onChange={handleOtpInputChange}
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className="rounded-lg h-12 px-4 bg-gray-50 border-gray-300 focus:border-green-500"
                    required
                  />
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="pt-2"
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-green-700 hover:bg-green-600 text-white h-12 text-base font-medium rounded-lg" 
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </Button>
                </motion.div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center pt-2">
            <Link href="/auth/register" className="text-green-700 hover:underline text-sm md:text-base font-medium">
              Don&apos;t have an account? Create one
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <span className="mx-4 text-gray-500 text-sm font-medium px-2">OR</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Button 
              variant="outline" 
              onClick={() => handleProviderSignIn("google")}
              className="flex items-center justify-center space-x-3 hover:shadow-md transition-all h-12 bg-white border-gray-300 text-gray-700"
            >
              <Image src="/IconHub/GoogleIcons.png" alt="Google" width={20} height={20} />
              <span className="font-medium">Sign in with Google</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleProviderSignIn("facebook")}
              className="flex items-center justify-center space-x-3 hover:shadow-md transition-all h-12 bg-white border-gray-300 text-gray-700"
            >
              <Image src="/IconHub/facebookIcon.png" alt="Facebook" width={20} height={20} />
              <span className="font-medium">Sign in with Facebook</span>
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center text-sm text-gray-500 py-6">
          <p>CleanVeda Nutrition © {new Date().getFullYear()}</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;