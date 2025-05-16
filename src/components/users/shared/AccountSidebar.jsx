"use client"
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FiUser, 
  FiShoppingBag, 
  FiHeart, 
  FiBell, 
  FiSettings,
  FiLogOut
} from "react-icons/fi";

const AccountSidebar = ({ className }) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

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

  const menuItems = [
    {
      title: "Profile",
      icon: <FiUser className="mr-3 text-xl" />,
      path: "/account",
      active: pathname === "/account"
    },
    {
      title: "Order History",
      icon: <FiShoppingBag className="mr-3 text-xl" />,
      path: "/account/orders",
      active: pathname === "/account/orders"
    },
    {
      title: "Wishlist",
      icon: <FiHeart className="mr-3 text-xl" />,
      path: "/account/wishlist",
      active: pathname === "/account/wishlist"
    },
    {
      title: "Notifications",
      icon: <FiBell className="mr-3 text-xl" />,
      path: "/account/notifications",
      active: pathname === "/account/notifications"
    },
    {
      title: "Settings",
      icon: <FiSettings className="mr-3 text-xl" />,
      path: "/account/settings",
      active: pathname === "/account/settings"
    }
  ];

  return (
    <div className={`${className} bg-white rounded-lg shadow-md`}>
      <div className="p-4 border-b border-green-100">
        <h2 className="text-xl font-semibold text-green-700">Account</h2>
        <p className="text-sm text-gray-500">Manage your account</p>
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
        
        <div className="mt-8 pt-4 border-t border-green-100">
          <Link href="/auth/signIn">
            <motion.div
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center py-2 px-4 text-red-500 hover:bg-red-50 rounded-md transition-colors duration-300"
            >
              <FiLogOut className="mr-3 text-xl" />
              <span>Logout</span>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountSidebar;