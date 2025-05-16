"use client"
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  FiMenu, 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiHeart, 
  FiBell
} from "react-icons/fi";
import { AiOutlineUp, AiOutlineDown } from "react-icons/ai";
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Define fallback categories - memoized to avoid recreating on every render
  const fallbackCategories = useMemo(() => [
    { name: "Home", link: "/" },
    { name: "Products", link: "/products" },
    { name: "About Us", link: "/about" },
    { name: "Contact", link: "/contact" }
  ], []);

  // Memoize homeLink to avoid recreating on every render
  const homeLink = useMemo(() => "/", []);

  // Fetch user details from cookies - memoized to avoid unnecessary rerenders
  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/users/userDetails/cookies');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setIsAuthenticated(true);
      } else {
        // User is not authenticated
        setIsAuthenticated(false);
        setUserData(null);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      setIsAuthenticated(false);
      setUserData(null);
    }
  }, []);

  // Execute fetchUser when component mounts or route changes
  useEffect(() => {
    fetchUser();
  }, [fetchUser, pathname]); // Re-fetch user data when pathname changes

  // Fetch categories from API - memoized to avoid unnecessary rerenders
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard/category');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      // Take only up to 4 categories
      setCategories(data.slice(0, 4));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setLoading(false);
    }
  }, []);

  // Execute fetchCategories when component mounts
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Memoize the cart count update function
  const updateCartCount = useCallback(() => {
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
  }, []);

  // Update cart count whenever localStorage changes
  useEffect(() => {
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
  }, [updateCartCount]);

  // Memoize scroll handler
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 10) {
      setHasScrolled(true);
    } else {
      setHasScrolled(false);
    }
  }, []);

  // Add scroll event listener to detect scrolling
  useEffect(() => {
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Initial check in case page loads scrolled
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Memoize click outside handler
  const handleClickOutside = useCallback((event) => {
    if (isAccountOpen && !event.target.closest('.account-dropdown')) {
      setIsAccountOpen(false);
    }
  }, [isAccountOpen]);

  // Close account dropdown when clicking outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Memoize search function
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      const searchPath = `/product/search?q=${encodeURIComponent(searchQuery)}`;
      router.push(searchPath);
    }
  }, [searchQuery, router]);

  // Memoize key press handler
  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }, [handleSearch]);

  // Memoize account dropdown toggle
  const toggleAccountDropdown = useCallback(() => {
    setIsAccountOpen(prev => !prev);
  }, []);

  // Memoize logout function
  const handleLogout = useCallback(async () => {
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
      setIsAuthenticated(false);
      setUserData(null);
      window.location.href = '/';
    } catch (error) {
      toast.dismiss();
      toast.error('Logout failed. Please try again.');
      console.error('Logout failed:', error);
    }
  }, []);

  // Memoized display categories
  const displayCategories = useMemo(() => {
    if (loading) return fallbackCategories;
    
    if (categories.length > 0) {
      return [
        { name: "Home", link: homeLink }, 
        ...categories.map(cat => ({ 
          name: cat.name, 
          link:`/category/${cat.name.replace(/\s+/g, '-')}` 
        }))
      ];
    }
    
    return fallbackCategories;
  }, [loading, categories, homeLink, fallbackCategories]);

  // Memoize search query change handler
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Memoize search focus handlers
  const handleSearchFocus = useCallback(() => setIsSearchFocused(true), []);
  const handleSearchBlur = useCallback(() => setIsSearchFocused(false), []);

  // Memoize sheet state handler
  const handleSheetStateChange = useCallback((newState) => {
    setIsOpen(newState);
  }, []);

  // Memoize combined sheet close and logout handler
  const handleSheetCloseAndLogout = useCallback(() => {
    setIsOpen(false);
    handleLogout();
  }, [handleLogout]);

  // Memoize nav animation
  const navAnimation = useMemo(() => ({
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 }
  }), []);

  // Memoize search input animation
  const searchInputAnimation = useMemo(() => ({
    initial: { width: "150px" },
    animate: { width: isSearchFocused ? "250px" : "150px" },
    transition: { type: "spring", stiffness: 300 }
  }), [isSearchFocused]);

  // Memoize account dropdown animation
  const accountDropdownAnimation = useMemo(() => ({
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 }
  }), []);

  // Memoize nav classes
  const navClasses = useMemo(() => `shadow-md px-4 md:px-6 py-3 sticky top-0 z-50 transition-colors duration-300 ${
    hasScrolled ? "bg-white" : "bg-transparent"
  }`, [hasScrolled]);

  return (
    <motion.nav
      {...navAnimation}
      className={navClasses}
    >
      <div className="mx-auto flex items-center justify-between">
        {/* Mobile Header Section */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={handleSheetStateChange}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-green-700 text-2xl hover:bg-green-100 hover:text-green-800">
                <FiMenu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white border-r border-green-100 w-64">
              <SheetHeader className="border-b border-green-100 pb-4">
                <SheetTitle className="text-green-700 flex items-center justify-between">
                  <span>Cleanveda Menu</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-6">
                <ul className="flex flex-col space-y-4 text-gray-700 font-medium">
                  {/* Dynamic categories in mobile menu */}
                  {displayCategories.map((item, index) => (
                    <Link key={index} href={item.link} onClick={() => setIsOpen(false)}>
                      <motion.li 
                        whileHover={{ scale: 1.05 }} 
                        className="hover:text-green-700 hover:bg-green-100 transition cursor-pointer px-2 py-2 rounded-md"
                      >
                        {item.name}
                      </motion.li>
                    </Link>
                  ))}
                </ul>
                
                {/* Mobile Search in Sheet */}
                <div className="mt-4 px-2">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      className="w-full bg-gray-50 border-green-200 focus:border-green-500"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleKeyPress}
                    />
                    <Button 
                      size="icon"
                      variant="ghost" 
                      className="absolute right-0 top-0 h-full text-green-600 hover:text-green-800 hover:bg-green-100"
                      onClick={handleSearch}
                    >
                      <FiSearch />
                    </Button>
                  </div>
                </div>
                
                {/* Conditional Mobile Menu Footer */}
               {isAuthenticated ? (
                  <>
                    {/* User Account Options */}
                    <div className="mt-4 space-y-3">
                      <Link href={"/account/order-history"} onClick={() => setIsOpen(false)}>
                        <div className="flex items-center space-x-3 px-2 py-2 hover:bg-green-100 rounded-md cursor-pointer">
                          <span>📦</span>
                          <span>My Orders</span>
                        </div>
                      </Link>
                      <Link href={"/account/wishlist"} onClick={() => setIsOpen(false)}>
                        <div className="flex items-center space-x-3 px-2 py-2 hover:bg-green-100 rounded-md cursor-pointer">
                          <FiHeart className="text-green-700" />
                          <span>Wishlist</span>
                        </div>
                      </Link>
                      <Link href={"/account/savedAddress"} onClick={() => setIsOpen(false)}>
                        <div className="flex items-center space-x-3 px-2 py-2 hover:bg-green-100 rounded-md cursor-pointer">
                          <span>🏠</span>
                          <span>Addresses</span>
                        </div>
                      </Link>
                      <Link href={"/account/notifications"} onClick={() => setIsOpen(false)}>
                        <div className="flex items-center space-x-3 px-2 py-2 hover:bg-green-100 rounded-md cursor-pointer">
                          <FiBell className="text-green-700" />
                          <span>Notifications</span>
                        </div>
                      </Link>
                    </div>
                    
                    <SheetFooter className="mt-auto border-t pt-4">
                      <Button 
                        className="w-full bg-red-500 hover:bg-red-600 rounded-lg"
                        onClick={handleSheetCloseAndLogout}
                      >
                        Logout
                      </Button>
                    </SheetFooter>
                  </>
                ) : (
                  <SheetFooter className="mt-auto border-t pt-4">
                    <Link href="/auth/signIn" className="w-full" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-green-600 hover:bg-green-800 rounded-lg">
                        Sign In
                      </Button>
                    </Link>
                  </SheetFooter>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo - Centered on mobile */}
          <div className="flex items-center justify-center mx-auto lg:mx-0 lg:justify-start">
            <Link href={"/"}>
              <Image src="/logo/cleanvedaLogo.png" alt="Cleanveda Logo" width={120} height={50} priority className="object-contain" />
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link href={"/product/cart"}>
              <div className="relative">
                <FiShoppingCart className="text-green-700 text-2xl cursor-pointer hover:text-green-800" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </div>
            </Link>
            {isAuthenticated ? (
              <Link href="#" onClick={toggleAccountDropdown}>
                <FiUser className="text-green-700 text-2xl cursor-pointer hover:text-green-800" />
              </Link>
            ) : (
              <Link href="/auth/signIn">
                <FiUser className="text-green-700 text-2xl cursor-pointer hover:text-green-800" />
              </Link>
            )}
          </div>
        </div>

        {/* Desktop Navigation - Dynamic Categories */}
        <ul className="space-x-6 p-4 rounded-lg hidden lg:flex">
          {loading ? (
            // Loading skeleton
            <>
              <motion.li className="w-12 h-6 bg-gray-200 rounded animate-pulse"></motion.li>
              <motion.li className="w-20 h-6 bg-gray-200 rounded animate-pulse"></motion.li>
              <motion.li className="w-24 h-6 bg-gray-200 rounded animate-pulse"></motion.li>
              <motion.li className="w-16 h-6 bg-gray-200 rounded animate-pulse"></motion.li>
            </>
          ) : (
            // Actual categories
            displayCategories.map((item, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer text-gray-700 font-semibold transition-colors duration-300 hover:text-green-700"
              >
                <Link href={item.link}>{item.name}</Link>
              </motion.li>
            ))
          )}
        </ul>

        {/* Desktop Icons Section */}
        <div className="hidden lg:flex items-center space-x-4">
          <motion.div
            {...searchInputAnimation}
            className="relative"
          >
            <Input
              type="text"
              placeholder="Search..."
              className="w-full text-black bg-gray-100 border-green-200 focus:border-green-500"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              aria-label="Search"
              autoComplete="off"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full text-green-600 hover:text-green-800 hover:bg-green-100"
              onClick={handleSearch}
            >
              <FiSearch />
            </Button>
          </motion.div>
          
           {/* Conditional rendering based on authentication status */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-5">
              {/* Notification */}
              <Link href={"/account/notifications"}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiBell className="text-green-700 text-2xl cursor-pointer hover:text-green-800" />
                </motion.div>
              </Link>
              
              {/* Wishlist */}
              <Link href={"/account/wishlist"}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiHeart className="text-green-700 text-2xl cursor-pointer hover:text-green-800" />
                </motion.div>
              </Link>
              
              {/* Account Button */}
              <div className="relative account-dropdown">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleAccountDropdown}
                  className="text-lg font-medium hover:text-green-700 focus:outline-none flex items-center"
                >
                  <FiUser className="text-green-700 text-2xl cursor-pointer" />
                  {isAccountOpen ? <AiOutlineUp className="ml-1 text-green-700" /> : <AiOutlineDown className="ml-1 text-green-700" />}
                </motion.button>
                
                {isAccountOpen && (
                  <motion.div
                    {...accountDropdownAnimation}
                    className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg py-2 z-50 account-dropdown"
                  >
                    <ul className="space-y-1">
                      <li>
                        <Link href={"/account/order-history"}>
                          <div className="flex items-center space-x-3 px-4 py-2 hover:bg-green-100 text-gray-700">
                            <span>📦</span>
                            <span>Orders</span>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href={"/account/wishlist"}>
                          <div className="flex items-center space-x-3 px-4 py-2 hover:bg-green-100 text-gray-700">
                            <span>❤️</span>
                            <span>Wishlist</span>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href={"/account/savedAddress"}>
                          <div className="flex items-center space-x-3 px-4 py-2 hover:bg-green-100 text-gray-700">
                            <span>🏠</span>
                            <span>Addresses</span>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href={"/account/notifications"}>
                          <div className="flex items-center space-x-3 px-4 py-2 hover:bg-green-100 text-gray-700">
                            <span>🔔</span>
                            <span>Notifications</span>
                          </div>
                        </Link>
                      </li>
                      <li className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-red-100 text-red-600 w-full text-left"
                        >
                          <span>▶️</span>
                          <span>Logout</span>
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </div>
              
              {/* Cart */}
              <Link href={"/product/cart"}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <FiShoppingCart className="text-green-700 text-2xl cursor-pointer hover:text-green-800" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </Badge>
                  )}
                </motion.div>
              </Link>
            </div>
          ) : (
            // Show Sign In button for non-authenticated users
            <div className="flex items-center space-x-5">
              <Link href="/auth/signIn">
                <Button className="bg-green-600 hover:bg-green-800 rounded-xl">
                  Sign In
                </Button>
              </Link>
              
              <Link href={"/product/cart"}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <FiShoppingCart className="text-green-700 text-2xl cursor-pointer hover:text-green-800" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </Badge>
                  )}
                </motion.div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;