import React from 'react';
import MainBanner from '../../../../public/frontend/ProductIngredients/Group_7.png';
import icon1 from '../../../../public/frontend/ProductIngredients/icon1.png';
import icon2 from '../../../../public/frontend/ProductIngredients/icon2.png';
import icon3 from '../../../../public/frontend/ProductIngredients/icon3.png';
import icon4 from '../../../../public/frontend/ProductIngredients/icon4.png';
import Image from 'next/image';

const ProductIngredients = () => {
  return (
    <div className="flex flex-col md:flex-row bg-white px-6 md:px-16 py-10 md:py-20 gap-10 justify-center items-center">
      {/* Left Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full md:w-[40rem]">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <Image src={icon1} className="w-10 h-10 md:w-12 md:h-12 mb-4" alt="icon" />
          <h1 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
            100% Plant-Based Formula
          </h1>
          <p className="text-sm md:text-[13px] text-gray-600">
            Natural ingredients for safe and effective results.
          </p>
        </div>
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <Image src={icon2} className="w-10 h-10 md:w-12 md:h-12 mb-4" alt="icon" />
          <h1 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
            Stress-Free Thinking
          </h1>
          <p className="text-sm md:text-[13px] text-gray-600">
            Helps reduce mental fatigue and supports clear, calm thinking.
          </p>
        </div>

        {/* Show MainBanner only on smaller screens */}
        <div className="w-[250px] flex justify-center items-center md:hidden ml-7">
          <Image
            src={MainBanner}
            className="max-w-full h-auto"
            height={500}
            width={500}
            alt="Main Banner"
          />
        </div>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <Image src={icon3} className="w-10 h-10 md:w-12 md:h-12 mb-4" alt="icon" />
          <h1 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
            Enhances Cognitive Stamina
          </h1>
          <p className="text-sm md:text-[13px] text-gray-600">
            Fuel your brain for longer-lasting energy and productivity.
          </p>
        </div>
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <Image src={icon4} className="w-10 h-10 md:w-12 md:h-12 mb-4" alt="icon" />
          <h1 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
            Boosts Mental Clarity
          </h1>
          <p className="text-sm md:text-[13px] text-gray-600">
            Say goodbye to brain fog and experience sharp focus.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-[150px] md:w-[296px] justify-center items-center hidden md:flex">
        <Image
          src={MainBanner}
          className="max-w-full h-auto"
          height={500}
          width={500}
          alt="Main Banner"
        />
      </div>
    </div>
  );
};

export default ProductIngredients;
