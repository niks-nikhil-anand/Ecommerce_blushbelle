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
import { Separator } from "@/components/ui/separator";
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
    <div className="flex justify-center items-center bg-gray-100 px-4 md:px-6 w-full flex-col py-16">
      <Card className="w-full md:w-3/4 lg:w-2/3 shadow-xl border-gray-200">
        <CardHeader className="space-y-2 text-center px-6 md:px-8 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CardTitle className="text-2xl md:text-3xl lg:text-4xl text-green-600 font-bold tracking-tight">
              Create Account
            </CardTitle>
            <CardDescription className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed pt-2">
              Join Cleanveda and start your wellness journey today!
            </CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-6 px-6 md:px-12 lg:px-16">
          <form onSubmit={handleCreateAccount} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-3">
              <Label htmlFor="fullName" className="text-gray-700 font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                placeholder="Enter your full name"
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-lg h-12 px-4 bg-gray-50 border-gray-300 focus:border-green-500"
                required
              />
            </div>
            
            {/* Email */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg h-12 px-4 bg-gray-50 border-gray-300 focus:border-green-500"
                required
              />
            </div>
            
            {/* Mobile Number */}
            <div className="space-y-3">
              <Label htmlFor="mobileNumber" className="text-gray-700 font-medium">
                Mobile Number
              </Label>
              <div className="flex">
                <div className="flex items-center justify-center bg-green-100 text-green-800 font-medium border border-r-0 border-green-500 rounded-l-lg px-4 h-12">
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
                  className="rounded-l-none rounded-r-lg h-12 px-4 bg-gray-50 border-gray-300 focus:border-green-500"
                  maxLength={10}
                  required
                />
              </div>
            </div>
            
            {/* Password */}
            <div className="space-y-3">
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
            
            {/* Confirm Password */}
            <div className="space-y-3">
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
            
            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="terms" 
                checked={acceptedTerms}
                onCheckedChange={() => setAcceptedTerms(!acceptedTerms)}
                className="text-green-600 border-gray-400 data-[state=checked]:bg-green-600"
                required
              />
              <Label htmlFor="terms" className="text-gray-600">
                I accept the{" "}
                <Link href="/termsAndConditions" className="text-green-700 hover:underline font-medium">
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
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white h-12 text-base font-medium rounded-lg shadow-md" 
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </motion.div>
            
            {/* Sign In Link */}
            <div className="flex justify-center pt-2">
              <Label className="text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/signIn" className="text-green-700 hover:underline font-medium">
                  Sign in
                </Link>
              </Label>
            </div>
          </form>
          
          <div className="flex items-center pt-2 justify-center">
            <span className="mx-4 text-gray-500 text-sm font-medium px-2">OR</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Button 
              variant="outline" 
              onClick={() => handleProviderSignIn("google")}
              className="flex items-center justify-center space-x-3 hover:shadow-md transition-all h-12 bg-white border-gray-300 text-gray-700"
            >
              <Image src="/IconHub/GoogleIcons.png" alt="Google" width={20} height={20} />
              <span className="font-medium">Sign up with Google</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleProviderSignIn("facebook")}
              className="flex items-center justify-center space-x-3 hover:shadow-md transition-all h-12 bg-white border-gray-300 text-gray-700"
            >
              <Image src="/IconHub/facebookIcon.png" alt="Facebook" width={20} height={20} />
              <span className="font-medium">Sign up with Facebook</span>
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

export default CreateAccountForm;