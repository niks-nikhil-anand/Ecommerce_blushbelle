"use client";
import React, { useState, useEffect } from 'react';
import banner1 from '../../../../../public/frontend/Banner/Banner1.webp';
import banner2 from '../../../../../public/frontend/Banner/Banner12.webp'; 
import waveWhite from '../../../../../public/frontend/SvgAssets/wave-white.svg'; 
import Image from 'next/image';

const Banner1 = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768); 
  };

  useEffect(() => {
    handleResize(); // Set initial state
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
      <div className="absolute md:top-1/2 top-[10rem] md:left-[3rem] transform -translate-y-1/2 text-blue-400 p-5">
      <h1 className="text-3xl md:text-6xl">Cognition</h1>
      <h1 className="text-3xl md:text-4xl ml-5">Powered by Nature</h1>
      <p className="mt-10 text-lg md:text-xl w-[20rem] md:w-[40rem] lg:w-[50rem]">
        CleanVeda began with a shared vision of wellness among thinkers, innovators, and outdoor enthusiasts, all striving to unlock the full potential of body and mind through the power of nature.
      </p>
      </div>
      <div className="absolute w-full md:bottom-[-4rem]  bottom-[-1.7rem] right-0 left-0 z-0">
        <Image src={waveWhite} alt="Wave" layout="responsive" priority />
      </div>
    </div>
  );
}

export default Banner1;
