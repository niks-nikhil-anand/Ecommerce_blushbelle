import React from 'react';
import Image from 'next/image';
import Banner1 from '../../../../public/frontend/WhoWeAre/Banner1.webp';
import Banner2 from '../../../../public/frontend/WhoWeAre/Banner2.webp';
import Banner3 from '../../../../public/frontend/WhoWeAre/Banner3.webp';
import Banner4 from '../../../../public/frontend/WhoWeAre/Banner4.webp';
import { MdDirections } from "react-icons/md";


const banners = [
  { src: Banner1, label: 'Clean Ingredients' , description: 'By combining the best of nature’s nutrients with science-backed formulas, we create clean, effective supplements tailored to your unique needs.' , heading: 'We Test' },
  { src: Banner2, label: 'By Enthusiasts , For Enthusiasts' , description: 'By combining the best of nature’s nutrients with science-backed formulas, we create clean, effective supplements tailored to your unique needs.' , heading: 'Our Standards' },
  { src: Banner3, label: 'Based on the Heart Of Utah' , description: 'By combining the best of nature’s nutrients with science-backed formulas, we create clean, effective supplements tailored to your unique needs.' , heading: 'Our Home'},
  { src: Banner4, label: 'Greatness Guaranteed' , description: 'By combining the best of nature’s nutrients with science-backed formulas, we create clean, effective supplements tailored to your unique needs.' , heading: 'Money Back Guarantee'},
];

const WhoWeAre = () => {
  return (
    <div className="flex flex-col mt-5 md:mt-11">
  <h2 className="text-xl sm:text-2xl md:text-4xl mb-4 text-center font-bold text-red-500">
    Who We Are
  </h2>
  <div className="flex gap-5 hover:cursor-pointer justify-center px-2 py-3 flex-wrap">
    {banners.map((banner, index) => (
      <div
        key={index}
        className="relative h-[20rem] w-[20rem] sm:h-[18rem] sm:w-[14rem] md:h-[22rem] md:w-[18rem] lg:h-[28rem] lg:w-[22rem] overflow-hidden rounded-3xl group"
      >
        <Image
          src={banner.src}
          alt={banner.label}
          className="object-cover w-full h-full transition-transform duration-300 ease-in-out transform group-hover:scale-105"
        />
        <p className="absolute top-10 left-0 right-0 text-center text-red-500 text-base sm:text-lg md:text-xl font-medium p-1">
          {banner.label}
        </p>

        {/* Hover effect - black overlay with text and button */}
        <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4">
          <p className="mb-2 text-center text-sm sm:text-base md:text-lg font-semibold">
            {banner.heading}
          </p>
          <p className="mb-4 text-center text-xs sm:text-sm md:text-base">
            {banner.description}
          </p>
          <button className="text-xs sm:text-sm md:text-base text-black bg-white px-2 sm:px-3 py-1 sm:py-2 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2">
            Learn More
            <MdDirections className="text-lg sm:text-xl" />
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

  

  );
};

export default WhoWeAre;
