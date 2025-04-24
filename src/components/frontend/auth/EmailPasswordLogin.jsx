// EmailPasswordLogin.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const EmailPasswordLogin = ({ email, setEmail, router }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoginWithPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
        rememberMe,
      });

      if (response.status === 200) {
        toast.success("Login successful!");
        setEmail('');
        setPassword('');
        setRememberMe(false);
        router.push(`/users/${response.data.userId}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

export default EmailPasswordLogin;
