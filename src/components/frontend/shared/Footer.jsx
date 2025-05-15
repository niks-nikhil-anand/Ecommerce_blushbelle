"use client"
import React from "react";
import Image from "next/image";
import ApplePay from '../../../../public/icons/Method=ApplePay.png';
import Discover from '../../../../public/icons/Discover.png';
import Mastercard from '../../../../public/icons/Mastercard.png';
import Visa from '../../../../public/icons/visa-logo.png';
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import CategorySection from "./CategoryFooter";

const Footer = () => {
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
                <Link href="/product/shopAllProducts" className="flex items-center hover:text-gray-200">
                  <span>All Products</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/auth/signIn" className="flex items-center hover:text-gray-200">
                  <span>My Account</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/auth/signIn" className="flex items-center hover:text-gray-200">
                  <span>Order History</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/auth/signIn" className="flex items-center hover:text-gray-200">
                  <span>Shopping Cart</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Helps */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-2 pb-2">Helps</h3>
            <Separator className="bg-gray-600 mb-4" />
            <ul className="text-sm space-y-2 text-gray-400">
              <li>
                <Link href="/aboutUs" className="flex items-center hover:text-gray-200">
                  <span>About Us</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/contactUs" className="flex items-center hover:text-gray-200">
                  <span>Contact</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/FAQs" className="flex items-center hover:text-gray-200">
                  <span>FAQs</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/blog" className="flex items-center hover:text-gray-200">
                  <span>Blogs</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
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
                <Link href="/returnPolicy" className="flex items-center hover:text-gray-200">
                  <span>Return Policy</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/shippingPolicy" className="flex items-center hover:text-gray-200">
                  <span>Shipping Policy</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/privacyPolicy" className="flex items-center hover:text-gray-200">
                  <span>Privacy Policy</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/termsAndConditions" className="flex items-center hover:text-gray-200">
                  <span>Terms & Condition</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
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

export default Footer;