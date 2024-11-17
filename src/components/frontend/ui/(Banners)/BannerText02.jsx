import React from 'react';
import Banner from '../../../../../public/frontend/Banner/Group_910.jpg';
import Image from 'next/image';

const BannerText02 = () => {
  return (
    <div className='flex flex-col md:flex-row items-center p-4 pb-10 md:p-8 mt-10'>
  {/* Text Section */}
  <div className='w-full md:w-1/2 mt-6 md:mt-0 md:mr-10 text-left  flex-col hidden md:flex'>
  <h1 className='text-3xl md:text-6xl font-bold text-[#D07021] mb-4'>
  Crafted with Care. Inspired by Nature.
</h1>
<p className='text-gray-600 text-base md:text-lg leading-relaxed'>
  CleanVeda is rooted in our commitment to wellness and the wonders of nature. Located amidst serene landscapes, we channel the essence of natural beauty into BrainBite, creating supplements that help you feel and perform your best every day.
</p>

  </div>

  {/* Image Section */}
  <div className='w-full md:w-1/2 mt-6 md:mt-0'>
    <Image
      src={Banner}
      alt='Banner Image'
      className='w-full h-auto object-cover rounded-lg'
    />
  </div>
  <div className='w-full md:w-1/2 mt-6 md:mt-0 md:mr-10 text-left  flex-col flex md:hidden'>
    <h1 className='text-3xl md:text-6xl font-bold text-[#D07021] mb-4'>
    Crafted with Care. Inspired by Nature.
    </h1>
    <p className='text-gray-600 text-base md:text-lg leading-relaxed'>
    CleanVeda is rooted in our commitment to wellness and the wonders of nature. Located amidst serene landscapes, we channel the essence of natural beauty into BrainBite, creating supplements that help you feel and perform your best every day.
    </p>
  </div>
</div>

  );
};

export default BannerText02;
