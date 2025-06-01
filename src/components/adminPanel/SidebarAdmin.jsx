"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaHome,
  FaShoppingCart,
  FaCog,
  FaEnvelopeOpenText,
  FaNewspaper,
  FaStar,
  FaVideo,
  FaBox,
  FaTable,
  FaPlus,
  FaQuora
} from "react-icons/fa";
import {
  MdCategory,
  MdOutlineLocalOffer,
  MdOutlineSubtitles,
  MdPendingActions,
  MdAdd,
  MdOutlineLogout
} from "react-icons/md";
import { RiMedicineBottleLine } from "react-icons/ri";
import { GiOpenBook, GiHerbsBundle } from "react-icons/gi";
import { ImProfile } from "react-icons/im";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
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

  // Menu configuration
  const menuSections = [
    {
      title: "Dashboard",
      items: [
        {
          icon: <FaHome />,
          label: "Home",
          href: "/admin/dashboard"
        }
      ]
    },
    {
      title: "Orders",
      items: [
        {
          icon: <FaShoppingCart />,
          label: "All Orders",
          href: "/admin/dashboard/orders/allOrders"
        },
        {
          icon: <MdPendingActions />,
          label: "Pending Orders",
          href: "/admin/dashboard/orders/pendingOrders"
        }
      ]
    },
    {
      title: "Products",
      items: [
        {
          icon: <MdAdd />,
          label: "Add Product",
          href: "/admin/dashboard/product/addProduct"
        },
        {
          icon: <FaBox />,
          label: "All Products",
          href: "/admin/dashboard/product/allProduct"
        },
        {
          icon: <MdCategory />,
          label: "Categories",
          href: "/admin/dashboard/category/allCategory"
        },
        {
          icon: <MdOutlineSubtitles />,
          label: "Subcategories",
          href: "/admin/dashboard/subCategory/addSubCategory"
        },
        {
          icon: <GiHerbsBundle />,
          label: "Ingredients",
          href: "/admin/dashboard/Ingredient/AddIngredient"
        },
        {
          icon: <RiMedicineBottleLine />,
          label: "Benefits",
          href: "/admin/dashboard/benefitsOfProduct/AddBenefitsOfProduct"
        },
        {
          icon: <FaQuora />,
          label: "FAQs",
          href: "/admin/dashboard/faqs/AddFaqs"
        },
        {
          icon: <MdOutlineLocalOffer />,
          label: "Coupons",
          href: "/admin/dashboard/coupon"
        }
      ]
    },
    {
      title: "Content",
      items: [
        {
          icon: <MdAdd />,
          label: "Add Blog",
          href: "/admin/dashboard/blog/addBlog"
        },
        {
          icon: <GiOpenBook />,
          label: "All Blogs",
          href: "/admin/dashboard/blog/allBlog"
        },
        {
          icon: <FaVideo />,
          label: "Videos",
          href: "/admin/dashboard/video/addVideo"
        }
      ]
    },
    {
      title: "Customer Management",
      items: [
        {
          icon: <FaTable />,
          label: "All Users",
          href: "/admin/dashboard/users/allUsers"
        },
        {
          icon: <FaPlus />,
          label: "Add Review",
          href: "/admin/dashboard/review/addReview"
        },
        {
          icon: <FaStar />,
          label: "All Reviews",
          href: "/admin/dashboard/review/allReview"
        },
        {
          icon: <FaEnvelopeOpenText />,
          label: "Customer Queries",
          href: "/admin/dashboard/messages/Queries"
        },
        {
          icon: <FaNewspaper />,
          label: "Newsletter",
          href: "/admin/dashboard/messages/Newsletter"
        }
      ]
    },
    {
      title: "Administration",
      items: [
        {
          icon: <ImProfile />,
          label: "Profile",
          href: "/admin/dashboard/accounts/profile"
        },
        {
          icon: <ImProfile />,
          label: "Staff Management",
          href: "/admin/dashboard/ourStaffs"
        },
        {
          icon: <FaCog />,
          label: "Settings",
          href: "/admin/dashboard/accounts/settings"
        }
      ]
    }
  ];

  return (
    <motion.div
      className="bg-slate-100 text-black h-screen w-72 p-5 overflow-hidden shadow-lg"
      initial={{ width: 0 }}
      animate={{ width: 260 }}
      transition={{ duration: 0.3 }}
    >
      <ScrollArea className="h-full pr-3">
        <div className="flex flex-col space-y-6">
          <h2 className="text-lg font-semibold mb-4">
            CleanVeda Dashboard
          </h2>

          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm font-medium mb-2 text-black">
                {section.title}
              </h3>
              <Separator className="my-2" />
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <Link key={itemIndex} href={item.href} passHref>
                    <SidebarItem
                      icon={item.icon}
                      label={item.label}
                      selected={selectedItem === item.label}
                      onClick={() => setSelectedItem(item.label)}
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <Button
            variant="destructive"
            className="mt-6 flex items-center gap-2 w-full bg-red-600 hover:bg-red-800"
            onClick={handleLogout}
          >
            <MdOutlineLogout className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </ScrollArea>
    </motion.div>
  );
};

const SidebarItem = ({ icon, label, selected, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      className={`flex items-center space-x-4 p-3 transition-all duration-300 shadow-sm cursor-pointer my-3 rounded-lg
        ${
          selected
            ? "bg-gradient-to-r from-green-600 to-purple-600 text-white"
            : "hover:bg-purple-600 hover:text-white"
        }`}
    >
      <div className="w-4 h-4">{icon}</div>
      <span className="font-semibold text-sm">{label}</span>
    </motion.div>
  );
};

export default SidebarAdmin;