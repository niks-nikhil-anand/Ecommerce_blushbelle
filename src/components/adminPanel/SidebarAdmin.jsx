"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {  FaPlus, FaShoppingCart, FaCog, FaHome , FaEnvelopeOpenText, FaNewspaper , FaStar } from "react-icons/fa";
import {  MdCategory, MdOutlineLocalOffer } from "react-icons/md";
import { FaBox, FaBoxes } from "react-icons/fa";
import { FaTable } from "react-icons/fa6";
import { GiOpenBook } from "react-icons/gi";
import { MdOutlineLogout, MdPendingActions, MdOutlineRateReview } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdAdd } from "react-icons/md";
import { toast } from 'react-hot-toast';

const SidebarAdmin = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        router.push('/');
      } else {
        alert(`Logout failed: ${data.message}`);
      }
    } catch (error) {
      alert(`Logout failed: ${error.message}`);
    }
  };

  return (
    <div className="flex">
    <motion.div
  className="bg-gray-150 text-black h-screen p-5  overflow-y-auto"
  style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0, 0, 0, 0.5) rgba(255, 255, 255, 0.3)" }}
>
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-semibold mb-4">
            CleanVeda Dashboard
          </h2>

          <Link href="/admin/dashboard" passHref>
            <SidebarItem icon={<FaHome />} label="Home" selected={selectedItem === 'Home'} onClick={() => setSelectedItem('Home')} />
          </Link>

          <h3 className="text-sm font-medium mt-4 mb-2 text-black">Orders</h3>
          <Link href="/admin/dashboard/orders/allOrders" passHref>
            <SidebarItem icon={<FaShoppingCart />} label="All Orders" selected={selectedItem === 'All Orders'} onClick={() => setSelectedItem('All Orders')} />
          </Link>


          <Link href="/admin/dashboard/orders/pendingOrders" passHref>
            <SidebarItem icon={<MdPendingActions />} label="Pending Orders" selected={selectedItem === 'Pending Orders'} onClick={() => setSelectedItem('Pending Orders')} />
          </Link>

          <h3 className="text-sm font-medium mt-4 mb-2 text-black">Products</h3>
          <Link href="/admin/dashboard/product/addProduct" passHref>
                  <SidebarItem 
                    icon={<MdAdd />} 
                    label="Add Product" 
                    selected={selectedItem === 'Add Product'} 
                    onClick={() => setSelectedItem('Add Product')} 
                  />
                </Link>

                <Link href="/admin/dashboard/product/allProduct" passHref>
                  <SidebarItem 
                    icon={<FaBox />} 
                    label="Products" 
                    selected={selectedItem === 'Products'} 
                    onClick={() => setSelectedItem('Products')} 
                  />
                </Link>

                <Link href="/admin/dashboard/product/addStocks" passHref>
                  <SidebarItem 
                  icon={<FaBoxes />} 
                  label="Add Stocks" 
                  selected={selectedItem === 'Add Stocks'} 
                  onClick={() => setSelectedItem('Add Stocks')} 
                />
              </Link>

              <Link href="/admin/dashboard/coupon" passHref>
                <SidebarItem 
                  icon={<MdOutlineLocalOffer />} 
                  label="Coupons" 
                  selected={selectedItem === 'Coupon'} 
                  onClick={() => setSelectedItem('Coupon')} 
                />
              </Link>

              <Link href="/admin/dashboard/category/allCategory" passHref>
                <SidebarItem 
                  icon={<MdCategory />} 
                  label="Categories" 
                  selected={selectedItem === 'Add Categories'} 
                  onClick={() => setSelectedItem('Add Categories')} 
                />
              </Link>

          

          <h3 className="text-sm font-medium mt-4 mb-2 text-black">Blog</h3>
          <Link href="/admin/dashboard/blog/addBlog" passHref>
            <SidebarItem icon={<MdAdd />} label="Add Blog" selected={selectedItem === 'Add Blog'} onClick={() => setSelectedItem('Add Blog')} />
          </Link>
          
          <Link href="/admin/dashboard/blog/allBlog" passHref>
            <SidebarItem icon={<GiOpenBook />} label="Blogs" selected={selectedItem === 'Blogs'} onClick={() => setSelectedItem('Blogs')} />
          </Link>

          <h3 className="text-sm font-medium mt-4 mb-2 text-black">Users</h3>
          <Link href="/admin/dashboard/users/allUsers" passHref>
            <SidebarItem icon={<FaTable />} label="All Users" selected={selectedItem === 'All Users'} onClick={() => setSelectedItem('All Users')} />
          </Link>
          

          <h3 className="text-sm font-medium mt-4 mb-2 text-black">Messages</h3>
          <Link href="/admin/dashboard/review/addReview" passHref>
            <SidebarItem icon={<FaPlus />} label="Add Review" />
          </Link>
          <Link href="/admin/dashboard/review/allReview" passHref>
            <SidebarItem icon={<FaStar />} label="Reviews" />
          </Link>
          <Link href="/admin/dashboard/messages/Feedback" passHref>
            <SidebarItem icon={<FaEnvelopeOpenText />} label="Feedbacks" />
          </Link>
          <Link href="/admin/dashboard/messages/Newsletter" passHref>
            <SidebarItem icon={<FaNewspaper />} label="Newsletter" />
          </Link>


          <h3 className="text-sm font-medium mt-4 mb-2 text-black">Account</h3>
          <Link href="/admin/dashboard/profile" passHref>
            <SidebarItem icon={<ImProfile />} label="Profile" selected={selectedItem === 'Profile'} onClick={() => setSelectedItem('Profile')} />
          </Link>

          <Link href="/admin/dashboard/ourStaff" passHref>
            <SidebarItem icon={<ImProfile />} label="Our Staff" selected={selectedItem === 'ourStaff'} onClick={() => setSelectedItem('ourStaff')} />
          </Link>

          <Link href="/settings" passHref>
            <SidebarItem icon={<FaCog />} label="Settings" selected={selectedItem === 'Settings'} onClick={() => setSelectedItem('Settings')} />
          </Link>

          <button
            className="mt-6 flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-red-700 shadow-md"
            onClick={handleLogout}
          >
            <MdOutlineLogout className="h-4 w-4" aria-hidden="true" />
            <span className="ml-2">Logout</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const SidebarItem = ({ icon, label, selected, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 shadow-sm cursor-pointer ${selected ? "bg-gray-600 text-white" : "hover:bg-green-500 border-gray-200 border-2 hover:text-white"}`}
    >
      <div className="w-4 h-4">{icon}</div>
      <span className="font-semibold text-sm">{label}</span>
    </motion.div>
  );
};

export default SidebarAdmin;
