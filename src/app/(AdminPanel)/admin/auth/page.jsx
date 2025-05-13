"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import Image from "next/image";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/admin/auth', {
        email,
        password,
        rememberMe,
      });

      if (response.status === 200) {
        // Clear the form fields
        setEmail('');
        setPassword('');
        setRememberMe(false);

        // Show success toast notification
        toast.success('Credentials verified, redirecting to the dashboard');
        
        // Redirect after a short delay to allow toast to be seen
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      // Show error toast notification
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSignIn = async (provider) => {
    try {
      console.log("Attempting to sign in with provider:", provider);
      const result = await signIn(provider);
      console.log("Sign-in result:", result);
  
      if (result?.error) {
        console.error("Sign-in error:", result.error);
        throw new Error(result.error);
      } else {
        console.log("User signed in successfully:", result);
      }
    } catch (error) {
      console.error("Error during sign-in:", error.message);
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
          <CardTitle className="text-2xl font-bold text-green-800">Welcome Back 👋</CardTitle>
          <CardDescription className="text-green-600">
            Access your CleanVeda Nutrition admin dashboard and manage with ease
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md h-10 px-3 bg-white border-gray-300 focus:border-green-500"
                required
              />
            </div>
            
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-md h-10 px-3 pr-10 bg-white border-gray-300 focus:border-green-500"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {/* Remember Me */}
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe}
                onCheckedChange={() => setRememberMe(!rememberMe)}
                className="text-green-600 border-gray-400 data-[state=checked]:bg-green-600"
              />
              <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                Remember Me
              </Label>
            </div>
            
            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-2"
            >
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white h-10 text-base font-medium rounded-md shadow-sm" 
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </motion.div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleProviderSignIn("google")}
              className="flex items-center justify-center space-x-2 h-10 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Image src="/IconHub/GoogleIcons.png" alt="Google" width={18} height={18} />
              <span className="font-medium text-sm">Google</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleProviderSignIn("facebook")}
              className="flex items-center justify-center space-x-2 h-10 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Image src="/IconHub/facebookIcon.png" alt="Facebook" width={18} height={18} />
              <span className="font-medium text-sm">Facebook</span>
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 text-center">
          <div className="flex justify-between w-full text-sm">
            <Link href="/auth/forgotPassword" className="font-medium text-green-600 hover:text-green-500">
              Forgot your password?
            </Link>
            <Link href="/auth/register" className="font-medium text-green-600 hover:text-green-500">
              Register here
            </Link>
          </div>
          <p className="text-xs text-gray-500">
            Secure login for CleanVeda Nutrition administrators
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AdminLoginForm;