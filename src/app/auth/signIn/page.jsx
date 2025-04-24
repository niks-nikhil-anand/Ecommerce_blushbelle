"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SocialLogin from '@/components/frontend/auth/SocialLogin';
import PhoneOTPLogin from '@/components/frontend/auth/PhoneOTPLogin';
import EmailOTPLogin from '@/components/frontend/auth/EmailOTPLogin';
import EmailPasswordLogin from '@/components/frontend/auth/EmailPasswordLogin';


const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('password');

  const handleTabChange = (value) => {
    setActiveTab(value);
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
          <CardTitle className="text-2xl font-bold text-green-800">Welcome Back to Cleanveda 👋</CardTitle>
          <CardDescription className="text-green-600">
            Sign in to access your personalized health journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="password">Email & Password</TabsTrigger>
              <TabsTrigger value="emailOTP">Email OTP</TabsTrigger>
              <TabsTrigger value="phoneOTP">Phone OTP</TabsTrigger>
            </TabsList>
            <TabsContent value="password">
              <EmailPasswordLogin setEmail={setEmail} />
            </TabsContent>
            <TabsContent value="emailOTP">
              <EmailOTPLogin setEmail={setEmail} />
            </TabsContent>
            <TabsContent value="phoneOTP">
              <PhoneOTPLogin />
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <SocialLogin />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-green-600 hover:text-green-500">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            By continuing, you agree to Cleanveda&apos;s{' '}
            <Link href="/terms" className="underline hover:text-green-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-green-600">
              Privacy Policy
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LoginForm;