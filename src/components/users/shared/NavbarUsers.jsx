"use client"
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiUser, FiShoppingBag } from "react-icons/fi";
import { AiOutlineUp, AiOutlineDown } from "react-icons/ai";
import Image from 'next/image';
import logo from "../../../../public/logo/cleanvedaLogo.png";
import Link from "next/link";
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [userId, setUserId] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/product/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleAccountDropdown = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/userDetails/cookies');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setUserId(data._id);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      toast.loading('Logging out...');
      await fetch('/api/users/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.dismiss();
      toast.success('Logged out successfully!');
      window.location.href = '/';
    } catch (error) {
      toast.dismiss();
      toast.error('Logout failed. Please try again.');
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md px-6 py-3"
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
            <Link href={"/"}>
              <Image src={logo} alt="Cleanveda Logo" width={120} height={50} />
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link href={`/users/${userId}/cart`}>
                <FiShoppingCart className="text-gray-700 text-2xl cursor-pointer" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <FiUser className="text-gray-700 text-2xl cursor-pointer" />
            </motion.div>
          </div>
        </div>

        <ul className="space-x-6 p-4 rounded-lg hidden md:flex">
          {[
            { name: "Home", link: "/" },
            { name: "Students", link: "/students" },
            { name: "Immunity Booster", link: "/immunity-booster" },
            { name: "Brain Booster", link: "/brain-booster" },
          ].map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer text-gray-700 font-semibold transition-colors duration-300 hover:text-green-600"
            >
              <Link href={item.link}>{item.name}</Link>
            </motion.li>
          ))}
        </ul>

        {/* Desktop Icons Section */}
        <div className="hidden lg:flex items-center space-x-4">
          <motion.div
            initial={{ width: "150px" }}
            animate={{ width: isSearchFocused ? "250px" : "150px" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 text-black bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              aria-label="Search products"
              autoComplete="on"
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </motion.div>

          <div className="flex items-center space-x-6 relative z-50">
            {/* Account Starts from here */}
            <div className="relative">
              <button
                onClick={toggleAccountDropdown}
                className="text-lg font-medium hover:text-gray-700 focus:outline-none flex items-center"
              >
                <FiUser className="w-6 h-6 cursor-pointer" />
                {isAccountOpen ? <AiOutlineUp className="ml-2" /> : <AiOutlineDown className="ml-2" />}
              </button>
              {isAccountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-[-3rem] mt-7 w-[10rem] bg-white shadow-xl rounded-b-3xl py-5 px-5 z-50"
                  style={{ zIndex: 100 }}
                >
                  <ul className="space-y-4">
                    <li className="flex items-center space-x-3">
                      <span>📦</span>
                      <Link href={`/users/${userId}/accounts/ordersHistory`} className="hover:text-blue-600">
                        Orders
                      </Link>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span>❤️</span>
                      <Link href={`/users/${userId}/accounts/wishlist`} className="hover:text-blue-600">Wishlist</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span>🏠</span>
                      <Link href={`/users/${userId}/accounts/savedAddress`} className="hover:text-blue-600">Addresses</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span>🔔</span>
                      <a href="#" className="hover:text-blue-600">Notification</a>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span>▶️</span>
                      <Link href="#" onClick={handleLogout} className="hover:text-blue-600">Logout</Link>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
            <Link href={`/users/${userId}/product/cart`}>
              <FiShoppingCart className="w-6 h-6 cursor-pointer" />
            </Link>
          </div>
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
            <Link href="/students">
              <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">Students</motion.li>
            </Link>
            <Link href="/health-conscious-individuals">
              <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">Health-Conscious Individuals</motion.li>
            </Link>
            <Link href="/parents">
              <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">Parents</motion.li>
            </Link>
            <Link href="/brain-booster">
              <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">Brain Booster</motion.li>
            </Link>
            <Link href="/immunity-booster">
              <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">Immunity Booster</motion.li>
            </Link>
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