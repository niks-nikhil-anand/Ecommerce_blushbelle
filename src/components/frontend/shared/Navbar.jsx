"use client"
import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiUser, FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "../../../../public/logo/cleanvedaLogo.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const router = useRouter();

  // Update cart count whenever localStorage changes
  useEffect(() => {
    // Function to get cart count from localStorage
    const updateCartCount = () => {
      try {
        const cart = localStorage.getItem("cart");
        if (cart) {
          const cartItems = JSON.parse(cart);
          if (Array.isArray(cartItems)) {
            // Calculate total count by summing quantities of all items
            const totalCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
            setCartItemCount(totalCount);
          } else {
            setCartItemCount(0);
          }
        } else {
          setCartItemCount(0);
        }
      } catch (error) {
        console.error("Error parsing cart data:", error);
        setCartItemCount(0);
      }
    };

    // Initial count
    updateCartCount();

    // Listen for storage events to update cart count when localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        updateCartCount();
      }
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Check for changes every second (handles changes within the same window)
    const interval = setInterval(updateCartCount, 1000);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

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
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-gray-700 text-2xl">
                <FiMenu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-6">
                <ul className="flex flex-col space-y-4 text-gray-700 font-medium">
                  <Link href="/">
                    <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">Home</motion.li>
                  </Link>
                  <Link href="/students">
                    <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">Students</motion.li>
                  </Link>
                  <Link href="/immunity-booster">
                    <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">Immunity Booster</motion.li>
                  </Link>
                  <Link href="/brain-booster">
                    <motion.li whileHover={{ scale: 1.05 }} className="hover:text-green-600 transition cursor-pointer">Brain Booster</motion.li>
                  </Link>
                </ul>
                
                <div className="mt-6 border-t pt-4">
                  <Link href="/auth/signIn">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo - Centered on mobile */}
          <div className="lg:flex lg:items-center mx-4 lg:mx-0">
            <Link href="/">
              <Image src={logo} alt="Cleanveda Logo" width={120} height={50} />
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link href="/product/cart">
              <div className="relative">
                <FiShoppingCart className="text-gray-700 text-2xl cursor-pointer" />
                <Badge className="absolute -top-2 -right-2 bg-orange-500 h-4 w-4 p-0 flex items-center justify-center">
                  {cartItemCount}
                </Badge>
              </div>
            </Link>
            <Link href="/account">
              <FiUser className="text-gray-700 text-2xl cursor-pointer" />
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
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
            <Input
              type="text"
              placeholder="Search..."
              className="w-full text-black bg-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              aria-label="Search"
              autoComplete="off"
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </motion.div>

          <Link href="/auth/signIn">
            <Button className="bg-green-600 hover:bg-green-700">
              Sign In
            </Button>
          </Link>
          
          <div className="flex items-center space-x-3">
            <Link href="/favorites">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiHeart className="text-gray-700 text-2xl cursor-pointer" />
              </motion.div>
            </Link>
            
            <Link href="/product/cart">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <FiShoppingCart className="text-gray-700 text-2xl cursor-pointer" />
                <Badge className="absolute -top-2 -right-2 bg-orange-500 h-4 w-4 p-0 flex items-center justify-center">
                  {cartItemCount}
                </Badge>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;