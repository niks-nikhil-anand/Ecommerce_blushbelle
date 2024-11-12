"use client";
import React from 'react';
import banner1 from '../../../../../public/frontend/Banner/EvergreenMod-Desktop.webp';

const ProductBanner = () => {

  return (
    <div
  className="relative w-full h-[100vh] md:h-[110vh] overflow-hidden"
  style={{
    backgroundImage: `url(${banner1.src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className="absolute inset-0 bg-black opacity-30" />
  <div className="absolute top-[8rem] md:top-1/2  md:right-[3rem] transform md:-translate-y-1/2 p-5">
    <h1 className="text-3xl md:text-5xl lg:text-6xl text-[#D07021]">A Formula Forged in 
    </h1>
    <h1 className="text-3xl md:text-4xl lg:text-5xl ml-5 text-[#D07021]">Nature’s Laboratory.</h1>
    <p className="mt-10 text-lg md:text-xl lg:text-2xl w-[15rem] md:w-[30rem] lg:w-[40rem] text-blue-400">
    To experience the full benefits of BrainBite, we recommend a consistent regimen over six months. Here’s how to incorporate it into your daily routine.
    </p>
  </div>
</div>

  );
}

export default ProductBanner;
