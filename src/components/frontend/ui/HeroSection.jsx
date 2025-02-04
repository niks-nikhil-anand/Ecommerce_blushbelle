"use client"
import React from 'react';
import Image from 'next/image';
import EllipseBg from '../../../../public/frontend/heroSection/EllipseBg.png';
import Group1 from '../../../../public/frontend/heroSection/Group1.png';
import leftLeaves from '../../../../public/frontend/heroSection/leftLeaves.png';
import rightLeaves from '../../../../public/frontend/heroSection/rightLeaves.png';
import tablets from '../../../../public/frontend/heroSection/tablets.png';
import Link from 'next/link';
import { motion } from "framer-motion";

{/* Background Elements */}

const HeroSection = () => {
  return (
    <div className="relative bg-[#F8F5EC] md:h-[70vh] h-[100vh]  flex items-center justify-center px-6 lg:px-16 min-w-full flex-col md:flex-row">
    {/* Content Section */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
  <Image src={leftLeaves} alt="Left Leaves" className="absolute md:top-12 top-2 left-0 w-10 lg:w-16 " />
  <Image src={rightLeaves} alt="Right Leaves" className="absolute md:top-12 top-12 right-0 w-6 lg:w-10" />
  <Image src={tablets} alt="Tablets" className="absolute md:bottom-0 bottom-2  right-0 w-22 lg:w-48 " />
  <Image src={tablets} alt="Tablets" className="absolute bottom-5 md:left-[-65px] left-[-55px] w-28 lg:w-48 " />
</div>

    <div className="flex flex-col justify-center items-start h-[500px] w-full md:w-[50%] p-6 lg:p-10 ">
      <h1 className="text-lg lg:text-3xl font-bold text-gray-800 leading-snug lg:leading-tight max-w-[35rem]">
        Boost Your Brain Power, Enhance Your Immunity, Age Gracefully with Our <span className="text-green-600">Supplements</span>
      </h1>
      <p className="mt-4 text-gray-600 text-sm lg:text-base max-w-[28rem] text-start">
        Discover a wide range of authentic Ayurvedic medicines and wellness products, delivered to your doorstep.
      </p>
      <Link href={"/product/shopAllProducts"}>
      <motion.button
        className="mt-6 px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 bg-purple-600 text-white text-sm sm:text-base lg:text-lg font-medium rounded-full hover:bg-purple-700 shadow-md transition duration-200 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: [1, 1.2, 1], 
          boxShadow: ["0px 0px 10px rgba(128, 0, 128, 0.5)", "0px 0px 20px rgba(128, 0, 128, 0.8)", "0px 0px 10px rgba(128, 0, 128, 0.5)"]
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        Shop Now
      </motion.button>
    </Link>
      
    </div>
  
    {/* Product Images Section */}
    <div className="flex justify-center items-center h-[500px] md:w-[50%] w-[75%] mb-8  lg:p-10  relative">
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
        className="relative w-45 lg:w-96 z-10"
      />
    </div>
  </div>
  
  );
};

export default HeroSection;
