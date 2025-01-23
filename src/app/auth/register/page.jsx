  "use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Link from "next/link";
import googleIcon from "../../../../public/IconHub/GoogleIcons.png";
import facebookIcon from "../../../../public/IconHub/facebookIcon.png";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";




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
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 md:px-0 w-full flex-col py-12">
    
  
    <div className="w-full md:w-2/3 lg:w-1/2 bg-white shadow-lg rounded-2xl px-8 py-10">
    <div>
      <h1 className="text-4xl md:text-5xl text-green-700 font-bold my-6 text-center">Create Account</h1>
      <p className="text-gray-600 text-center mb-8">Join us and start your journey today!</p>
    </div>
      <form onSubmit={handleCreateAccount}>
        {/* Full Name */}
        <div className="mb-6">
          <input
            type="text"
            value={fullName}
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
  
        {/* Email */}
        <div className="mb-6">
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
  
        {/* Mobile Number */}
        <div className="mb-6">
          <div className="flex items-center">
            <span className="bg-green-200 border border-r-0 border-green-500 rounded-l-2xl px-4 py-3 text-green-700">
              +91
            </span>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  setMobileNumber(value);
                }
              }}
              placeholder="Mobile Number"
              className="w-full px-5 py-3 border border-l-0 rounded-r-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              maxLength={10}
              required
            />
          </div>
        </div>
  
        {/* Password */}
        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-5 py-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
          <div
            className="absolute inset-y-0 right-4 flex items-center text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>
  
        {/* Confirm Password */}
        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
          <div
            className="absolute inset-y-0 right-4 flex items-center text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>
  
        {/* Terms and Conditions */}
        <div className="mb-6">
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mr-2"
              required
            />
            <Link href={"/termsAndConditions"} className="text-green-700 hover:underline">
              I accept the terms & conditions
            </Link>
          </label>
        </div>
  
        {/* Submit Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-2xl transition-all duration-300 ${
              loading
                ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 shadow-md"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </motion.button>
        </div>
  
        {/* Sign In Link */}
        <div className="flex justify-between mt-6 text-center">
          <Link href={"/auth/signIn"} className="text-gray-600">
            Already have an account? <span className="text-green-600 hover:underline">Sign in</span>
          </Link>
        </div>
      </form>
  
      {/* Separator */}
      <div className="flex items-center justify-between mt-8">
        <span className="border-t border-gray-300 flex-grow"></span>
        <span className="mx-4 text-gray-500">Or</span>
        <span className="border-t border-gray-300 flex-grow"></span>
      </div>
  
      {/* Social Login */}
      <div className="flex flex-col sm:flex-row sm:justify-around mt-8 space-y-4 sm:space-y-0">
        <button
          onClick={() => handleProviderSignIn("google")}
          className="flex items-center px-5 py-3 border border-gray-300 rounded-2xl shadow-md bg-white hover:shadow-lg hover:border-gray-400"
        >
          <Image src={googleIcon} alt="Google Icon" width={24} height={24} />
          <span className="ml-3 text-gray-700 font-medium">Sign in with Google</span>
        </button>
        <button
          onClick={() => signIn("facebook")}
          className="flex items-center px-5 py-3 border border-gray-300 rounded-2xl shadow-md bg-white hover:shadow-lg hover:border-gray-400"
        >
          <Image src={facebookIcon} alt="Facebook Icon" width={24} height={24} />
          <span className="ml-3 text-gray-700 font-medium">Sign in with Facebook</span>
        </button>
      </div>
    </div>
  </div>
  

  );
};

export default CreateAccountForm;