import React from 'react';
import MainBanner from '../../../../public/frontend/ProductIngredients/Group_7.png';
import icon1 from '../../../../public/frontend/ProductIngredients/icon1.png';
import icon2 from '../../../../public/frontend/ProductIngredients/icon2.png';
import icon3 from '../../../../public/frontend/ProductIngredients/icon3.png';
import icon4 from '../../../../public/frontend/ProductIngredients/icon4.png';
import Image from 'next/image';

const ProductIngredients = () => {
  return (
    <div className="flex flex-col lg:flex-row bg-white px-4 sm:px-6 md:px-16 py-8 sm:py-10 md:py-20 gap-8 lg:gap-10 justify-center items-center">
      {/* Left Section - Features Grid */}
      <div className="w-full max-w-2xl lg:max-w-none lg:w-[40rem]">
        {/* First Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col items-center text-center">
            <Image src={icon1} className="w-10 h-10 md:w-12 md:h-12 mb-4" alt="Plant-based formula icon" />
            <h1 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
              100% Plant-Based Formula
            </h1>
            <p className="text-sm md:text-[13px] text-gray-600">
              Natural ingredients for safe and effective results.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Image src={icon2} className="w-10 h-10 md:w-12 md:h-12 mb-4" alt="Stress-free thinking icon" />
            <h1 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
              Stress-Free Thinking
            </h1>
            <p className="text-sm md:text-[13px] text-gray-600">
              Helps reduce mental fatigue and supports clear, calm thinking.
            </p>
          </div>
        </div>

        {/* Mobile Image - Centered between feature rows */}
        <div className="flex justify-center items-center mb-8 lg:hidden">
          <div className="w-[200px] sm:w-[250px] md:w-[300px]">
            <Image
              src={MainBanner}
              className="w-full h-auto"
              height={500}
              width={500}
              alt="Main Banner"
              priority
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col items-center text-center">
            <Image src={icon3} className="w-10 h-10 md:w-12 md:h-12 mb-4" alt="Cognitive stamina icon" />
            <h1 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
              Enhances Cognitive Stamina
            </h1>
            <p className="text-sm md:text-[13px] text-gray-600">
              Fuel your brain for longer-lasting energy and productivity.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Image src={icon4} className="w-10 h-10 md:w-12 md:h-12 mb-4" alt="Mental clarity icon" />
            <h1 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
              Boosts Mental Clarity
            </h1>
            <p className="text-sm md:text-[13px] text-gray-600">
              Say goodbye to brain fog and experience sharp focus.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Desktop Image */}
      <div className="hidden lg:flex justify-center items-center">
        <div className="w-[250px] xl:w-[296px]">
          <Image
            src={MainBanner}
            className="w-full h-auto"
            height={500}
            width={500}
            alt="Main Banner"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default ProductIngredients;