"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaShoppingCart,
  FaCog,
  FaHome,
  FaEnvelopeOpenText,
  FaNewspaper,
  FaStar,
} from "react-icons/fa";
import {
  MdCategory,
  MdOutlineLocalOffer,
  MdOutlineSubtitles,
} from "react-icons/md";
import { RiMedicineBottleLine } from "react-icons/ri";
import { FaBox } from "react-icons/fa";
import { FaTable } from "react-icons/fa6";
import { GiOpenBook } from "react-icons/gi";
import { MdOutlineLogout, MdPendingActions } from "react-icons/md";
import { GiHerbsBundle } from "react-icons/gi";
import { ImProfile } from "react-icons/im";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";
import { toast } from "react-hot-toast";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const SidebarAdmin = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/auth/logout", {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        router.push("/");
      } else {
        toast.error(`Logout failed: ${data.message}`);
      }
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  return (
    <div className="flex">
      <motion.div
        className="bg-slate-100 text-black h-screen w-72 p-5 overflow-hidden shadow-lg"
        initial={{ width: 0 }}
        animate={{ width: 260 }}
        transition={{ duration: 0.3 }}
      >
        <ScrollArea className="h-full pr-3">
          <div className="flex flex-col space-y-6">
            <h2 className="text-lg font-semibold mb-4 bg-clip-text  ">
              CleanVeda Dashboard
            </h2>

            <Link href="/admin/dashboard" passHref>
              <SidebarItem
                icon={<FaHome />}
                label="Home"
                selected={selectedItem === "Home"}
                onClick={() => setSelectedItem("Home")}
              />
            </Link>

            <div>
              <h3 className="text-sm font-medium mb-2 text-black">Orders</h3>
              <Separator className="my-2" />
              <div className="space-y-3">
                <Link href="/admin/dashboard/orders/allOrders" passHref>
                  <SidebarItem
                    icon={<FaShoppingCart />}
                    label="All Orders"
                    selected={selectedItem === "All Orders"}
                    onClick={() => setSelectedItem("All Orders")}
                  />
                </Link>

                <Link href="/admin/dashboard/orders/pendingOrders" passHref>
                  <SidebarItem
                    icon={<MdPendingActions />}
                    label="Pending Orders"
                    selected={selectedItem === "Pending Orders"}
                    onClick={() => setSelectedItem("Pending Orders")}
                  />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-black">Products</h3>
              <Separator className="my-2" />
              <div className="space-y-3">
                <Link href="/admin/dashboard/product/addProduct" passHref>
                  <SidebarItem
                    icon={<MdAdd />}
                    label="Add Product"
                    selected={selectedItem === "Add Product"}
                    onClick={() => setSelectedItem("Add Product")}
                  />
                </Link>

                <Link href="/admin/dashboard/product/allProduct" passHref>
                  <SidebarItem
                    icon={<FaBox />}
                    label="Products"
                    selected={selectedItem === "Products"}
                    onClick={() => setSelectedItem("Products")}
                  />
                </Link>
                <Link href="/admin/dashboard/Ingredient/AddIngredient" passHref>
                  <SidebarItem
                    icon={<GiHerbsBundle />}
                    label="Ingredient"
                    selected={selectedItem === "Ingredient"}
                    onClick={() => setSelectedItem("Ingredient")}
                  />
                </Link>
                <Link
                  href="/admin/dashboard/benefitsOfProduct/AddBenefitsOfProduct"
                  passHref
                >
                  <SidebarItem
                    icon={
                      <div className="flex items-center gap-1">
                        <RiMedicineBottleLine className="text-yellow-500 text-2xl" />
                      </div>
                    }
                    label="Benefits"
                    selected={selectedItem === "Benefits"}
                    onClick={() => setSelectedItem("Benefits")}
                  />
                </Link>

                <Link href="/admin/dashboard/coupon" passHref>
                  <SidebarItem
                    icon={<MdOutlineLocalOffer />}
                    label="Coupons"
                    selected={selectedItem === "Coupon"}
                    onClick={() => setSelectedItem("Coupon")}
                  />
                </Link>

                <Link href="/admin/dashboard/category/allCategory" passHref>
                  <SidebarItem
                    icon={<MdCategory />}
                    label="Categories"
                    selected={selectedItem === "Add Categories"}
                    onClick={() => setSelectedItem("Add Categories")}
                  />
                </Link>

                <Link
                  href="/admin/dashboard/subCategory/addSubCategory"
                  passHref
                >
                  <SidebarItem
                    icon={<MdOutlineSubtitles />}
                    label="Subcategories"
                    selected={selectedItem === "Subcategories"}
                    onClick={() => setSelectedItem("Subcategories")}
                  />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-black">Blog</h3>
              <Separator className="my-2" />
              <div className="space-y-3">
                <Link href="/admin/dashboard/blog/addBlog" passHref>
                  <SidebarItem
                    icon={<MdAdd />}
                    label="Add Blog"
                    selected={selectedItem === "Add Blog"}
                    onClick={() => setSelectedItem("Add Blog")}
                  />
                </Link>

                <Link href="/admin/dashboard/blog/allBlog" passHref>
                  <SidebarItem
                    icon={<GiOpenBook />}
                    label="Blogs"
                    selected={selectedItem === "Blogs"}
                    onClick={() => setSelectedItem("Blogs")}
                  />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-black">Users</h3>
              <Separator className="my-2" />
              <div className="space-y-3">
                <Link href="/admin/dashboard/users/allUsers" passHref>
                  <SidebarItem
                    icon={<FaTable />}
                    label="All Users"
                    selected={selectedItem === "All Users"}
                    onClick={() => setSelectedItem("All Users")}
                  />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-black">Messages</h3>
              <Separator className="my-2" />
              <div className="space-y-3">
                <Link href="/admin/dashboard/review/addReview" passHref>
                  <SidebarItem
                    icon={<FaPlus />}
                    label="Add Review"
                    selected={selectedItem === "Add Review"}
                    onClick={() => setSelectedItem("Add Review")}
                  />
                </Link>
                <Link href="/admin/dashboard/review/allReview" passHref>
                  <SidebarItem
                    icon={<FaStar />}
                    label="Reviews"
                    selected={selectedItem === "Reviews"}
                    onClick={() => setSelectedItem("Reviews")}
                  />
                </Link>
                <Link href="/admin/dashboard/messages/Queries" passHref>
                  <SidebarItem
                    icon={<FaEnvelopeOpenText />}
                    label="Queries"
                    selected={selectedItem === "Queries"}
                    onClick={() => setSelectedItem("Queries")}
                  />
                </Link>
                <Link href="/admin/dashboard/messages/Newsletter" passHref>
                  <SidebarItem
                    icon={<FaNewspaper />}
                    label="Newsletter"
                    selected={selectedItem === "Newsletter"}
                    onClick={() => setSelectedItem("Newsletter")}
                  />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-black">Account</h3>
              <Separator className="my-2" />
              <div className="space-y-3">
                <Link href="/admin/dashboard/accounts/profile" passHref>
                  <SidebarItem
                    icon={<ImProfile />}
                    label="Profile"
                    selected={selectedItem === "Profile"}
                    onClick={() => setSelectedItem("Profile")}
                  />
                </Link>

                <Link href="/admin/dashboard/ourStaffs" passHref>
                  <SidebarItem
                    icon={<ImProfile />}
                    label="Our Staffs"
                    selected={selectedItem === "ourStaffs"}
                    onClick={() => setSelectedItem("ourStaffs")}
                  />
                </Link>

                <Link href="/admin/dashboard/accounts/settings" passHref>
                  <SidebarItem
                    icon={<FaCog />}
                    label="Settings"
                    selected={selectedItem === "Settings"}
                    onClick={() => setSelectedItem("Settings")}
                  />
                </Link>
              </div>
            </div>

            <Button
              variant="destructive"
              className="mt-6 flex items-center gap-2 w-full bg-red-600 hover:bg-red-800"
              onClick={handleLogout}
            >
              <MdOutlineLogout className="h-4 w-4" aria-hidden="true" />
              <span>Logout</span>
            </Button>
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  );
};

const SidebarItem = ({ icon, label, selected, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      className={`flex items-center space-x-4 p-3 transition-all duration-300 shadow-sm cursor-pointer my-3
        ${
          selected
            ? "bg-gradient-to-r from-green-600 to-purple-600 text-white "
            : "hover:bg-purple-600 hover:text-white "
        }`}
    >
      <div className="w-4 h-4">{icon}</div>
      <span className="font-semibold text-sm">{label}</span>
    </motion.div>
  );
};


export default SidebarAdmin;
