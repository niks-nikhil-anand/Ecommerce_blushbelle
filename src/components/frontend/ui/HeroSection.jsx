import React from 'react';
import Image from 'next/image';
import EllipseBg from '../../../../public/frontend/heroSection/EllipseBg.png';
import Group1 from '../../../../public/frontend/heroSection/Group1.png';
import leftLeaves from '../../../../public/frontend/heroSection/leftLeaves.png';
import rightLeaves from '../../../../public/frontend/heroSection/rightLeaves.png';
import tablets from '../../../../public/frontend/heroSection/tablets.png';
{/* Background Elements */}

const HeroSection = () => {
  return (
    <div className="relative bg-[#F7F6F2] h-[70vh] flex items-center justify-center px-6 lg:px-16 min-w-full">
    {/* Content Section */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
  <Image src={leftLeaves} alt="Left Leaves" className="absolute top-12 left-0 w-28 lg:w-16" />
  <Image src={rightLeaves} alt="Right Leaves" className="absolute top-12 right-0 w-28 lg:w-10" />
  <Image src={tablets} alt="Tablets" className="absolute bottom-0 right-0 w-36 lg:w-48 " />
</div>

    <div className="flex flex-col justify-center items-start h-[500px] w-[50%] p-6 lg:p-10 ">
      <h1 className="text-xl lg:text-3xl font-bold text-gray-800 leading-snug lg:leading-tight max-w-[35rem]">
        Boost Your Brain Power, Enhance Your Immunity, Age Gracefully with Our <span className="text-green-600">Supplements</span>
      </h1>
      <p className="mt-4 text-gray-600 text-sm lg:text-base max-w-[28rem] text-start">
        Discover a wide range of authentic Ayurvedic medicines and wellness products, delivered to your doorstep.
      </p>
      <button className="mt-6 px-8 py-3 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 shadow-md">
        Shop Now
      </button>
    </div>
  
    {/* Product Images Section */}
    <div className="flex justify-center items-center h-[500px] w-[50%] p-6 lg:p-10  relative">
      {/* Ellipse Background */}
      <div className="absolute">
        <Image
          src={EllipseBg}
          alt="Ellipse Background"
          className="w-[400px] lg:w-[380px]"
          height={600}
        />
      </div>
  
      {/* Main Product */}
      <Image
        src={Group1}
        alt="Main Product"
        className="relative w-40 lg:w-96 z-10"
      />
    </div>
  </div>
  
  );
};

export default HeroSection;
