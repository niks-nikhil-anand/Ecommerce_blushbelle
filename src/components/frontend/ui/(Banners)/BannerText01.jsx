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
        If it’s going in your body, there should be no question about the contents or quality. That’s why at Zhou Nutrition, we test all of our ingredients at intake as well as all of our finished products to ensure you’re getting exactly what we promise, and nothing more or less.
      </p>
    </div>
  </div>
  
  );
};

export default BannerText01;
