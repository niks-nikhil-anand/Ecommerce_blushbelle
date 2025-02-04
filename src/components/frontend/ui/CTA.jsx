"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaPinterest, FaInstagram } from "react-icons/fa";
import toast from 'react-hot-toast';

const CTA = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/dashboard/newsLetter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Subscription successful!');
        setFormData({ email: '' });
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center py-5 px-5 bg-gray-100 space-y-6 md:space-y-0 md:space-x-6">
    {/* Text Section */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-start items-center md:items-baseline text-center md:text-left"
    >
      <h2 className="text-xl sm:text-2xl font-semibold">Subscribe to our Newsletter</h2>
      <p className="text-gray-600 mt-2 max-w-sm">
        Pellentesque eu nibh eget mauris congue mattis mattis nec tellus.
        Phasellus imperdiet elit eu magna.
      </p>
    </motion.div>
  
    {/* Form Section */}
    <motion.form
      onSubmit={handleSubscribe}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row items-center w-full max-w-xs sm:max-w-sm md:max-w-[25rem] space-y-4 md:space-y-0"
    >
      <input
        type="email"
        name="email"
        placeholder="Your email address"
        value={formData.email}
        onChange={handleChange}
        className="flex-1 px-4 py-[0.6rem] border border-gray-300 rounded-full md:rounded-l-full focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <button
        type="submit"
        className={`px-6 py-3 md:ml-4 bg-green-500 text-white font-medium rounded-full md:rounded-r-full hover:bg-green-600 transition duration-200 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
    </motion.form>
  
    {/* Social Media Section */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex justify-center space-x-4 text-gray-500"
    >
      <FaFacebook className="cursor-pointer hover:text-green-500 transition duration-200" />
      <FaTwitter className="cursor-pointer hover:text-green-500 transition duration-200" />
      <FaPinterest className="cursor-pointer hover:text-green-500 transition duration-200" />
      <FaInstagram className="cursor-pointer hover:text-green-500 transition duration-200" />
    </motion.div>
  </div>
  
  );
};

export default CTA;
