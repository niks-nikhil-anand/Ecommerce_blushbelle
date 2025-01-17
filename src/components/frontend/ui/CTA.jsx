"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaPinterest, FaInstagram } from "react-icons/fa";

const CTA = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/dashboard/newsLetter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert("Subscribed successfully!");
        setEmail("");
      } else {
        alert("Failed to subscribe.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center py-7 px-5 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" mb-6 flex flex-col justify-start items-baseline"
      >
        <h2 className="text-2xl font-semibold">Subscribe our Newsletter</h2>
        <p className="text-gray-600 mt-2 max-w-md">
          Pellentesque eu nibh eget mauris congue mattis mattis nec tellus.
          Phasellus imperdiet elit eu magna.
        </p>
      </motion.div>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center w-full max-w-[25rem]"
      >
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 transition duration-200"
        >
          Subscribe
        </button>
      </motion.form>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex space-x-4 text-gray-500 mx-5"
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
