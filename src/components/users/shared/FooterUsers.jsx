"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ApplePay from '../../../../public/icons/Method=ApplePay.png';
import Discover from '../../../../public/icons/Discover.png';
import Mastercard from '../../../../public/icons/Mastercard.png';
import Visa from '../../../../public/icons/visa-logo.png';
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import CategorySection from "@/components/frontend/shared/CategoryFooter";

const FooterUser = () => {
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user details from the API
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/userDetails/cookies');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setUserId(data._id); // Assuming the API returns an object with the `_id` field
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLinkClick = (link) => {
    console.log('User ID:', userId); // Debugging line
    if (userId) {
      // Redirect to the user-specific route
      router.push(`/users/${userId}${link}`);
    } else {
      console.log('Redirecting to default link:', link); // Debugging line
      // Fallback to the default URL
      router.push(link);
    }
  };

  return (
    <footer className="bg-[#1A1A1A] text-white py-10 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-2 pb-2">About Us</h3>
            <Separator className="bg-gray-600 mb-4" />
            <p className="text-sm text-gray-400">
              CleanVeda offers plant-based Ayurvedic supplements, like BrainBite™ Smart IQ, enhancing focus and mental clarity.
            </p>
            <p className="text-sm text-gray-300">
              <span className="text-green-500">+91 9876543210</span> <br />
              <span className="text-green-500">support@cleanveda.com</span>
            </p>
          </div>

          {/* My Account */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-2 pb-2">My Account</h3>
            <Separator className="bg-gray-600 mb-4" />
            <ul className="text-sm space-y-2 text-gray-400">
              <li>
                <div onClick={() => handleLinkClick("/product/shopAllProducts")} className="flex items-center hover:text-gray-200 cursor-pointer">
                  <span>All Products</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </li>
              <li>
                <div onClick={() => handleLinkClick("/auth/signIn")} className="flex items-center hover:text-gray-200 cursor-pointer">
                  <span>My Account</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </li>
              <li>
                <div onClick={() => handleLinkClick("/auth/signIn")} className="flex items-center hover:text-gray-200 cursor-pointer">
                  <span>Order History</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </li>
              <li>
                <div onClick={() => handleLinkClick("/auth/signIn")} className="flex items-center hover:text-gray-200 cursor-pointer">
                  <span>Shopping Cart</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </li>
            </ul>
          </div>

          {/* Helps */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-2 pb-2">Helps</h3>
            <Separator className="bg-gray-600 mb-4" />
            <ul className="text-sm space-y-2 text-gray-400">
              <li>
                <div onClick={() => handleLinkClick("/aboutUs")} className="flex items-center hover:text-gray-200 cursor-pointer">
                  <span>About Us</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </li>
              <li>
                <div onClick={() => handleLinkClick("/contactUs")} className="flex items-center hover:text-gray-200 cursor-pointer">
                  <span>Contact</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </li>
              <li>
                <div onClick={() => handleLinkClick("/FAQs")} className="flex items-center hover:text-gray-200 cursor-pointer">
                  <span>FAQs</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </li>
              <li>
                <div onClick={() => handleLinkClick("/blog")} className="flex items-center hover:text-gray-200 cursor-pointer">
                  <span>Blogs</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </li>
            </ul>
          </div>

          {/* Categories - Dynamically loaded from API */}
          <div className="space-y-4">
            <CategorySection />
          </div>

          {/* Proxy */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-2 pb-2">Proxy</h3>
            <Separator className="bg-gray-600 mb-4" />
            <ul className="text-sm space-y-2 text-gray-400">
              <li>
                <div onClick={() => handleLinkClick("/returnPolicy")} className="flex items-center hover:text-gray-200 cursor-pointer">
                  <span>Return Policy</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </li>
              <li>
                <div onClick={() => handleLinkClick("/shippingPolicy")} className="flex items-center hover:text-gray-200 cursor-pointer">
                  <span>Shipping Policy</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </li>
              <li>
                <div onClick={() => handleLinkClick("/privacyPolicy")} className="flex items-center hover:text-gray-200 cursor-pointer">
                  <span>Privacy Policy</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </li>
              <li>
                <div onClick={() => handleLinkClick("/termsAndConditions")} className="flex items-center hover:text-gray-200 cursor-pointer">
                  <span>Terms & Condition</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Footer Bottom */}
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            Clean Veda © 2025. All Rights Reserved
          </p>
          <div className="flex items-center space-x-4">
            {/* Payment Icons */}
            <Card className="bg-transparent border-gray-500">
              <CardContent className="p-2">
                <Image
                  src={ApplePay}
                  alt="Apple Pay"
                  className="w-8 h-8 object-contain"
                  width={32}
                  height={32}
                />
              </CardContent>
            </Card>
            <Card className="bg-transparent border-gray-500">
              <CardContent className="p-2">
                <Image
                  src={Visa}
                  alt="Visa"
                  className="w-8 h-8 object-contain"
                  width={32}
                  height={32}
                />
              </CardContent>
            </Card>
            <Card className="bg-transparent border-gray-500">
              <CardContent className="p-2">
                <Image
                  src={Mastercard}
                  alt="Mastercard"
                  className="w-4 h-8 object-contain"
                  width={32}
                  height={32}
                />
              </CardContent>
            </Card>
            <Card className="bg-transparent border-gray-500">
              <CardContent className="p-2">
                <Image
                  src={Discover}
                  alt="Discover"
                  className="w-8 h-8 object-contain"
                  width={32}
                  height={32}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterUser;