"use client"
import React, { useState } from "react";
import { FiShoppingCart, FiSearch, FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "../../../../public/logo/cleanvedaLogo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md px-6 py-3"
    >
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <Image src={logo} alt="Cleanveda Logo" width={120} height={50} />
        </div>

        {/* Hamburger Menu Icon (for mobile and tablet view) */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 text-2xl focus:outline-none"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Desktop Menu Section */}
        <ul className="hidden lg:flex space-x-6 text-gray-700 font-medium">
          <li className="hover:text-green-600 transition cursor-pointer">Home</li>
          <li className="hover:text-green-600 transition cursor-pointer">Students</li>
          <li className="hover:text-green-600 transition cursor-pointer">
            Health-Conscious Individuals
          </li>
          <li className="hover:text-green-600 transition cursor-pointer">Parents</li>
          <li className="hover:text-green-600 transition cursor-pointer">Brain Booster</li>
          <li className="hover:text-green-600 transition cursor-pointer">Immunity Booster</li>
        </ul>

        {/* Icons Section */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Cart Icon */}
          <div className="relative">
            <FiShoppingCart className="text-gray-700 text-2xl cursor-pointer hover:text-green-600 transition" />
            <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              0
            </div>
          </div>

          {/* Search Icon */}
          <FiSearch className="text-gray-700 text-2xl cursor-pointer hover:text-green-600 transition" />
        </div>
      </div>

      {/* Mobile and Tablet Menu Section */}
      {isMenuOpen && (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden flex flex-col mt-4 space-y-4 text-gray-700 font-medium"
        >
          <li className="hover:text-green-600 transition cursor-pointer">Home</li>
          <li className="hover:text-green-600 transition cursor-pointer">Students</li>
          <li className="hover:text-green-600 transition cursor-pointer">
            Health-Conscious Individuals
          </li>
          <li className="hover:text-green-600 transition cursor-pointer">Parents</li>
          <li className="hover:text-green-600 transition cursor-pointer">Brain Booster</li>
          <li className="hover:text-green-600 transition cursor-pointer">Immunity Booster</li>
          {/* Icons for mobile */}
          <div className="flex items-center space-x-4 mt-4">
            {/* Cart Icon */}
            <div className="relative">
              <FiShoppingCart className="text-gray-700 text-2xl cursor-pointer hover:text-green-600 transition" />
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                0
              </div>
            </div>
            {/* Search Icon */}
            <FiSearch className="text-gray-700 text-2xl cursor-pointer hover:text-green-600 transition" />
          </div>
        </motion.ul>
      )}
    </motion.nav>
  );
};

export default Navbar;
