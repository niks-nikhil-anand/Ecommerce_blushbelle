import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { SiMastercard, SiVisa, SiApplepay } from "react-icons/si";
import ApplePay from '../../../../public/icons/Method=ApplePay.png'
import Discover from '../../../../public/icons/Discover.png'
import Mastercard from '../../../../public/icons/Mastercard.png'
import Visa from '../../../../public/icons/visa-logo.png'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* About Us */}
          <div>
            <h3 className="text-lg font-bold mb-4">About US</h3>
            <p className="text-sm text-gray-400 mb-4">
              Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis
              dui, eget bibendum magna congue nec.
            </p>
            <p className="text-sm">
              <span className="text-green-500">(219) 555–0114</span> or{" "}
              <span className="text-green-500">Cleanveda@gmail.com</span>
            </p>
          </div>

          {/* My Account */}
          <div>
            <h3 className="text-lg font-bold mb-4">My Account</h3>
            <ul className="text-sm space-y-2 text-gray-400">
              <li>My Account</li>
              <li>Order History</li>
              <li>Shopping Cart</li>
              <li>Wishlist</li>
            </ul>
          </div>

          {/* Helps */}
          <div>
            <h3 className="text-lg font-bold mb-4">Helps</h3>
            <ul className="text-sm space-y-2 text-gray-400">
              <li>Contact</li>
              <li>FAQs</li>
              <li>Terms & Condition</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Proxy */}
          <div>
            <h3 className="text-lg font-bold mb-4">Proxy</h3>
            <ul className="text-sm space-y-2 text-gray-400">
              <li>About</li>
              <li>Shop</li>
              <li>Product</li>
              <li>Track Order</li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="text-sm space-y-2 text-gray-400">
              <li>Fruit & Vegetables</li>
              <li>Meat & Fish</li>
              <li>Bread & Bakery</li>
              <li>Beauty & Health</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          {/* Footer Bottom */}
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            Clean Veda © 2025. All Rights Reserved
          </p>
          <div className="flex space-x-4">
            <SiApplepay className="text-gray-400 text-xl" />
            <SiVisa className="text-gray-400 text-xl" />
            <SiMastercard className="text-gray-400 text-xl" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
