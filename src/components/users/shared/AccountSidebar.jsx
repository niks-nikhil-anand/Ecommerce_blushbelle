"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiBell,
  FiSettings,
  FiMapPin,
  FiLogOut,
} from "react-icons/fi";

const AccountSidebar = ({ className }) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch user details from cookies
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users/userDetails/cookies");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      toast.loading("Logging out...");
      await fetch("/api/users/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.dismiss();
      toast.success("Logged out successfully!");
      window.location.href = "/";
    } catch (error) {
      toast.dismiss();
      toast.error("Logout failed. Please try again.");
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    {
      title: "Profile",
      icon: <FiUser className="mr-3 text-xl" />,
      path: "/account/profile",
      active: pathname === "/account/profile",
    },
    {
      title: "Order History",
      icon: <FiShoppingBag className="mr-3 text-xl" />,
      path: "/account/order-history",
      active: pathname === "/account/order-history",
    },
    {
      title: "Wishlist",
      icon: <FiHeart className="mr-3 text-xl" />,
      path: "/account/wishlist",
      active: pathname === "/account/wishlist",
    },
    {
      title: "All Addresses",
      icon: <FiMapPin className="mr-3 text-xl" />,
      path: "/account/addresses",
      active: pathname === "/account/addresses",
    },
    {
      title: "Notifications",
      icon: <FiBell className="mr-3 text-xl" />,
      path: "/account/notifications",
      active: pathname === "/account/notification",
    },
    {
      title: "Settings",
      icon: <FiSettings className="mr-3 text-xl" />,
      path: "/account/settings",
      active: pathname === "/account/settings",
    },
  ];

  return (
    <div
      className={`${className} bg-white rounded-lg shadow-md h-screen max-h-[70vh]`}
    >
      <div className="p-4 border-b border-green-100">
        <h2 className="text-xl font-semibold text-green-700">Account</h2>
        <p className="text-sm text-gray-500">Welcome, {user?.fullName}</p>
      </div>

      <div className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.path}>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center py-2 px-4 rounded-md transition-colors duration-300 ${
                    item.active
                      ? "bg-green-100 text-green-700 font-medium"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </motion.div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="absolute bottom-2 left-0 right-0 px-4">
          <motion.div
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center py-2 px-4 text-red-500 hover:bg-red-50 rounded-md transition-colors duration-300 cursor-pointer"
            onClick={handleLogout}
          >
            <FiLogOut className="mr-3 text-xl" />
            <span>Logout</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AccountSidebar;
