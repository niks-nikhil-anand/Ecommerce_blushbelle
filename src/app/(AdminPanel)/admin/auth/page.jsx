"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';



const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize router

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

        console.log("redirecting to the admin panel")
        router.push('/admin/dashboard');
        console.log("redirected")

      }
    } catch (error) {
      console.error(error);
      // Handle error (e.g., display a notification or message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-green-50 to-green-200 px-4 md:px-8 w-full flex-col py-12">
  <div className="w-full md:pl-8 md:w-3/5 bg-white shadow-lg rounded-xl p-6 md:p-8">
    {/* Form Section */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-center"
    >
      <motion.h2
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-center md:text-left text-green-800 tracking-wide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome Back to CleanVeda Nutrition
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-base md:text-lg text-center text-gray-600 mb-6"
      >
        <span className="underline decoration-dotted">Access your admin dashboard</span> 🚀
      </motion.p>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <motion.input
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="relative">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <motion.input
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter your password"
            required
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer mt-8"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye className="text-gray-500" /> : <FaEyeSlash className="text-gray-500" />}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="mr-2 accent-green-600"
          />
          <label className="text-gray-700">Remember Me</label>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 font-medium text-white rounded-lg transition-all ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-between mt-6 text-sm"
      >
        <a href="/auth/forgotPassword" className="text-green-600 hover:underline">
          Forgot your password?
        </a>
        <a href="/auth/register" className="text-green-600 hover:underline">
          Register here
        </a>
      </motion.div>
    </motion.div>
  </div>
</div>

  );
};

export default AdminLoginForm;
