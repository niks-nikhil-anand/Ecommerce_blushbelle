import React from 'react';
import Banner from '../../../../../public/frontend/Banner/Group_520.jpg';
import Image from 'next/image';

const BannerText01 = () => {
  return (
    <div className='flex flex-col md:flex-row items-center p-4 md:p-8 mt-10'>
    {/* Image Section */}
    <div className='w-full md:w-1/2'>
      <Image
        src={Banner}
        alt='Banner Image'
        className='w-full h-auto object-cover rounded-lg'
      />
    </div>
  
    {/* Text Section */}
    <div className='w-full md:w-1/2 mt-6 md:mt-0 md:ml-10 text-left flex flex-col'>
      <h1 className='text-3xl md:text-6xl font-bold text-[#D07021] mb-4'>
        Truth. Trust. Transparency.
      </h1>
      <p className='text-gray-600 text-base md:text-lg leading-relaxed'>
      At CleanVeda, we believe you deserve complete confidence in what you put into your body. That’s why BrainBite is crafted with uncompromising quality standards. Every ingredient is rigorously tested at intake, and every finished product is evaluated to ensure you get exactly what we promise — pure, effective, and trustworthy nutrition to enhance your cognitive health.
      </p>
    </div>
  </div>
  
  );
};

export default BannerText01;
