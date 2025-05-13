"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const CreateAccountForm = () => {
  const router = useRouter(); 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false); 
  
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

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (!acceptedTerms) {
      toast.error("You must accept the terms and conditions!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("mobileNumber", mobileNumber);
    formData.append("password", password);

    try {
      const response = await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setFullName("");
        setEmail("");
        setMobileNumber("");
        setPassword("");
        setConfirmPassword("");
        setAcceptedTerms(false);
        toast.success("Account created successfully!");

        setTimeout(() => {
          router.push("/auth/signIn");
        }, 1000); 
      }
    } catch (error) {
      toast.error("Error creating account. Please try again.");
      console.error(error);
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
          <CardTitle className="text-2xl font-bold text-green-800">Create Account 👋</CardTitle>
          <CardDescription className="text-green-600">
            Join Cleanveda and start your wellness journey today!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleCreateAccount} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700 font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                placeholder="Enter your full name"
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-md h-10 px-3 bg-white border-gray-300 focus:border-green-500"
                required
              />
            </div>
            
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
            
            {/* Mobile Number */}
            <div className="space-y-2">
              <Label htmlFor="mobileNumber" className="text-gray-700 font-medium">
                Mobile Number
              </Label>
              <div className="flex">
                <div className="flex items-center justify-center bg-green-100 text-green-800 font-medium border border-r-0 border-gray-300 rounded-l-md px-3 h-10">
                  +91
                </div>
                <Input
                  id="mobileNumber"
                  type="tel"
                  value={mobileNumber}
                  placeholder="Mobile number"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setMobileNumber(value);
                    }
                  }}
                  className="rounded-l-none rounded-r-md h-10 px-3 bg-white border-gray-300 focus:border-green-500"
                  maxLength={10}
                  required
                />
              </div>
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
                  placeholder="Create a password"
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
            
            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="Confirm your password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
            
            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox 
                id="terms" 
                checked={acceptedTerms}
                onCheckedChange={() => setAcceptedTerms(!acceptedTerms)}
                className="text-green-600 border-gray-400 data-[state=checked]:bg-green-600"
                required
              />
              <Label htmlFor="terms" className="text-sm text-gray-600">
                I accept the{" "}
                <Link href="/termsAndConditions" className="text-green-600 hover:underline font-medium">
                  terms & conditions
                </Link>
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
                {loading ? "Creating Account..." : "Create Account"}
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
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/signIn" className="font-medium text-green-600 hover:text-green-500">
              Sign in
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            By continuing, you agree to Cleanveda&apos;s{" "}
            <Link href="/terms" className="underline hover:text-green-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-green-600">
              Privacy Policy
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CreateAccountForm;