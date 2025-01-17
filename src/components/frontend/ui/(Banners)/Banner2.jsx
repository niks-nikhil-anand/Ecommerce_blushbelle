"use client";
import React, { useState, useEffect } from 'react';
import banner1 from '../../../../../public/frontend/Banner/Banner2.webp';
import banner2 from '../../../../../public/frontend/Banner/Group_520_mobile.webp'; 
import waveWhite from '../../../../../public/frontend/SvgAssets/wave-white.svg'; 
import Image from 'next/image';

const Banner2 = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768); 
  };

  useEffect(() => {
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="relative w-full h-[110vh] overflow-hidden"
      style={{
        backgroundImage: `url(${isMobile ? banner2.src : banner1.src})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
        <div className="absolute inset-0 opacity-50" />
      <div className="absolute md:top-1/2 top-[10rem] md:right-[3rem] transform -translate-y-1/2  p-5">
      <h1 className="text-3xl md:text-7xl text-[#D07021]">Cognitive Excellence</h1>
        <h1 className="text-3xl md:text-4xl ml-5 text-[#D07021]">Rooted in Nature</h1>
        <p className="mt-10 text-lg md:text-xl w-[20rem] md:w-[40rem] lg:w-[50rem] text-black">
          At CleanVeda, we blend the finest natural ingredients with cutting-edge science to craft BrainBite — a clean, effective supplement designed to unlock your mental potential and elevate your daily performance.
        </p>
      </div>
    </div>
  );
}

export default Banner2;
