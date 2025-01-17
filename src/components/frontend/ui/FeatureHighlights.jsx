import React from 'react';
import Image from 'next/image';
import { FaShippingFast, FaHeadphonesAlt, FaLock, FaUndo } from 'react-icons/fa';
import topWave from '../../../../public/frontend/heroSection/children/topWave.png';
import bottomWave from '../../../../public/frontend/heroSection/children/bottomWave.png';

const FeatureHighlights = () => {
  return (
    <div className="relative bg-[#0D9B4D] text-white mt-2">
      {/* Top Wave */}
      <div className="absolute top-[-25px] left-0 w-full">
        <Image src={topWave} alt="Top Wave" layout="responsive" objectFit="cover" priority />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-7 flex flex-wrap justify-around items-center space-y-6 md:space-y-0">
        {/* Free Shipping */}
        <div className="flex items-center space-x-4">
          <FaShippingFast size={28} />
          <div>
            <h3 className="font-bold text-lg">Free Shipping</h3>
            <p className="text-sm">Free shipping on all your orders</p>
          </div>
        </div>

        {/* Customer Support */}
        <div className="flex items-center space-x-4">
          <FaHeadphonesAlt size={28} />
          <div>
            <h3 className="font-bold text-lg">Customer Support 24/7</h3>
            <p className="text-sm">Instant access to Support</p>
          </div>
        </div>

        {/* Secure Payment */}
        <div className="flex items-center space-x-4">
          <FaLock size={28} />
          <div>
            <h3 className="font-bold text-lg">100% Secure Payment</h3>
            <p className="text-sm">We ensure your money is safe</p>
          </div>
        </div>

        {/* Money-Back Guarantee */}
        <div className="flex items-center space-x-4">
          <FaUndo size={28} />
          <div>
            <h3 className="font-bold text-lg">Money-Back Guarantee</h3>
            <p className="text-sm">30 Days Money-Back Guarantee</p>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-[-30px] left-0 w-full">
        <Image src={bottomWave} alt="Bottom Wave" layout="responsive" objectFit="cover" priority />
      </div>
    </div>
  );
};

export default FeatureHighlights;
