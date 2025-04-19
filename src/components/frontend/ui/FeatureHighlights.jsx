"use client"
import React from 'react';
import Image from 'next/image';
import { FaShippingFast, FaHeadphonesAlt, FaLock, FaUndo } from 'react-icons/fa';
import topWave from '../../../../public/frontend/heroSection/children/topWave.png';
import bottomWave from '../../../../public/frontend/heroSection/children/bottomWave.png';

const FeatureHighlights = () => {
  return (
    <div className="relative bg-[#0D9B4D] text-white py-8 md:py-10">
      {/* Top Wave */}
      <div className="absolute top-[1px] left-0 w-full transform -translate-y-full">
        <Image 
          src={topWave} 
          alt="Top Wave" 
          className="w-full" 
          priority 
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-2 md:py-4 lg:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
          {/* Free Shipping */}
          <div className="flex items-center space-x-4 justify-center sm:justify-start">
            <FaShippingFast className="text-3xl md:text-4xl flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg md:text-xl">Free Shipping</h3>
              <p className="text-sm md:text-base">Free shipping on all your orders</p>
            </div>
          </div>

          {/* Customer Support */}
          <div className="flex items-center space-x-4 justify-center sm:justify-start">
            <FaHeadphonesAlt className="text-3xl md:text-4xl flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg md:text-xl">Customer Support 24/7</h3>
              <p className="text-sm md:text-base">Instant access to Support</p>
            </div>
          </div>

          {/* Secure Payment */}
          <div className="flex items-center space-x-4 justify-center sm:justify-start">
            <FaLock className="text-3xl md:text-4xl flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg md:text-xl">100% Secure Payment</h3>
              <p className="text-sm md:text-base">We ensure your money is safe</p>
            </div>
          </div>

          {/* Money-Back Guarantee */}
          <div className="flex items-center space-x-4 justify-center sm:justify-start">
            <FaUndo className="text-3xl md:text-4xl flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg md:text-xl">Money-Back Guarantee</h3>
              <p className="text-sm md:text-base">30 Days Money-Back Guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-[2px] left-0 w-full transform translate-y-full">
        <Image 
          src={bottomWave} 
          alt="Bottom Wave" 
          className="w-full" 
          priority 
        />
      </div>
    </div>
  );
};

export default FeatureHighlights;