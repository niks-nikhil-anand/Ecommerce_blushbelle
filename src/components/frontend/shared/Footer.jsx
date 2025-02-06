import React from "react";
import Image from "next/image"; // Use for Next.js
import ApplePay from '../../../../public/icons/Method=ApplePay.png';
import Discover from '../../../../public/icons/Discover.png';
import Mastercard from '../../../../public/icons/Mastercard.png';
import Visa from '../../../../public/icons/visa-logo.png';
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white py-10 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-2 border-b border-gray-600 pb-2">About Us</h3>
            <p className="text-sm text-gray-400">
            CleanVeda offers plant-based Ayurvedic supplements, like BrainBite™ Smart IQ, enhancing focus and mental clarity.</p>
            <p className="text-sm text-gray-300">
              <span className="text-green-500">+91 9876543210</span> <br />
              <span className="text-green-500">support@cleanveda.com</span>
            </p>
          </div>

          {/* My Account */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-2  pb-2">My Account</h3>
            <ul className="text-sm space-y-2 text-gray-400">
              <Link href={"/auth/signIn"}> 
              <li className="hover:text-gray-200 cursor-pointer">My Account</li>
              </Link>
              <Link href={"/auth/signIn"}>
              <li className="hover:text-gray-200 cursor-pointer">Order History</li>
              </Link>
              <Link href={"/auth/signIn"}>
              <li className="hover:text-gray-200 cursor-pointer">Shopping Cart</li>
              </Link>
              <Link href={"/product/shopAllProducts"}>
              <li className="hover:text-gray-200 cursor-pointer">All Products</li>
              </Link>
            </ul>
          </div>

          {/* Helps */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-2  pb-2">Helps</h3>
            <ul className="text-sm space-y-2 text-gray-400">
              <Link href={"/aboutUs"}>
              <li className="hover:text-gray-200 cursor-pointer">About Us</li>
              </Link>
              <Link href={"/contactUs"}>
              <li className="hover:text-gray-200 cursor-pointer">Contact</li>
              </Link>
              <Link href={"/FAQs"}>
              <li className="hover:text-gray-200 cursor-pointer">FAQs</li>
              </Link>
              <Link href={"/blog"}>
              <li className="hover:text-gray-200 cursor-pointer">Blogs</li>
              </Link>
            </ul>
          </div>



          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-2 pb-2">Categories</h3>
            <ul className="text-sm space-y-2 text-gray-400">
              <li className="hover:text-gray-200 cursor-pointer">Students</li>
              <li className="hover:text-gray-200 cursor-pointer">
              Health-conscious individuals
              </li>
              <li className="hover:text-gray-200 cursor-pointer">Parents</li>
              <li className="hover:text-gray-200 cursor-pointer">Brain Booster</li>
              <li className="hover:text-gray-200 cursor-pointer">Immunity Booster</li>
            </ul>
          </div>

          
          {/* Proxy */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-2  pb-2">Proxy</h3>
            <ul className="text-sm space-y-2 text-gray-400">
              <Link href={"/returnPolicy"}>
              <li className="hover:text-gray-200 cursor-pointer">Return Policy</li>
              </Link>
              <Link href={"/shippingPolicy"}>
              <li className="hover:text-gray-200 cursor-pointer">Shipping Policy</li>
              </Link>
              <Link href={"/privacyPolicy"}>
              <li className="hover:text-gray-200 cursor-pointer">Privacy Policy</li>
              </Link>
              <Link href={"/termsAndConditions"}>
              <li className="hover:text-gray-200 cursor-pointer">Terms & Condition</li>
              </Link>
            </ul>
          </div>
        </div>


        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Footer Bottom */}
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              Clean Veda © 2025. All Rights Reserved
            </p>
            <div className="flex items-center space-x-4">
              {/* Payment Icons */}
              <div className="p-2 border border-gray-500 rounded-md">
                <Image
                  src={ApplePay}
                  alt="Apple Pay"
                  className="w-8 h-8 object-contain"
                  width={32}
                  height={32}
                />
              </div>
              <div className="p-2 border border-gray-500 rounded-md">
                <Image
                  src={Visa}
                  alt="Visa"
                  className="w-8 h-8 object-contain"
                  width={32}
                  height={32}
                />
              </div>
              <div className="px-3 py-2 border border-gray-500 rounded-md">
                <Image
                  src={Mastercard}
                  alt="Mastercard"
                  className="w-4 h-8 object-contain"
                  width={32}
                  height={32}
                />
              </div>
              <div className="p-2 border border-gray-500 rounded-md">
                <Image
                  src={Discover}
                  alt="Discover"
                  className="w-8 h-8 object-contain"
                  width={32}
                  height={32}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
