"use client"
import React, { useState } from "react";
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "../../../../public/logo/cleanvedaLogo.png";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 shadow-md px-6 py-3"
    >
      <div className="flex items-center justify-between">
        {/* Mobile Header Section */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          {/* Mobile Menu Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden"
          >
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 text-2xl focus:outline-none"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </motion.div>

          {/* Logo - Centered on mobile */}
          <div className="lg:flex lg:items-center mx-4 lg:mx-0">
            <Image src={logo} alt="Cleanveda Logo" width={120} height={50} />
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <FiShoppingCart className="text-gray-700 text-2xl cursor-pointer" />
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                0
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <FiUser className="text-gray-700 text-2xl cursor-pointer" />
            </motion.div>
          </div>
        </div>

        {/* Desktop Menu Section */}
        <ul className="hidden lg:flex space-x-6 text-gray-700 font-medium">
          <Link href="/">
            <li className="hover:text-green-600 transition cursor-pointer">Home</li>
          </Link>
          <li className="hover:text-green-600 transition cursor-pointer">Students</li>
          <li className="hover:text-green-600 transition cursor-pointer">
            Health-Conscious Individuals
          </li>
          <li className="hover:text-green-600 transition cursor-pointer">Parents</li>
          <li className="hover:text-green-600 transition cursor-pointer">Brain Booster</li>
          <li className="hover:text-green-600 transition cursor-pointer">Immunity Booster</li>
        </ul>

        {/* Desktop Icons Section */}
        <div className="hidden lg:flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer"
          >
            <Link href={"/product/cart"}>
            <FiShoppingCart className="text-gray-700 text-2xl cursor-pointer" />
            </Link>
            
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <FiSearch className="text-gray-700 text-2xl cursor-pointer" />
          </motion.div>

          <Link href="/auth/signIn">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Sign In
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden mt-4"
        >
          <ul className="flex flex-col space-y-4 text-gray-700 font-medium">
            <Link href={"/"}>
            <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">Home</motion.li>
            </Link>
            <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">Students</motion.li>
            <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">
              Health-Conscious Individuals
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">Parents</motion.li>
            <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">Brain Booster</motion.li>
            <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">Immunity Booster</motion.li>
          </ul>

          <div className="mt-6 border-t pt-4">
            <Link href="/auth/signIn">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;