"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import HeroSection01 from "../../../../public/frontend/heroSection01.webp";
import HeroSectionMobileView from "../../../../public/frontend/heroSectionMobile01.webp";
import waveWhite from "../../../../public/frontend/SvgAssets/wave-white.svg";



const HeroSection = () => {
  return (
    <div className="relative w-full h-[85vh]  sm:h-[55vh] md:h-[75vh] lg:h-[90vh] flex items-center justify-center bg-beige md:flex">
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hidden md:flex">
        <Image
          src={HeroSection01}
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          priority
        />
        </div>
        <div className=" md:hidden">
        <Image
          src={HeroSectionMobileView}
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          priority
        />
        </div>
        

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-start top-7 sm:items-start sm:justify-center pl-0  sm:pl-12 md:pl-20 lg:pl-28 text-center sm:text-left">
  <motion.div
    className="flex flex-col items-center sm:items-start"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1, delay: 0.5 }}
  >
    <div className="text-red-500 text-5xl text-[6rem] md:text-[12rem] lg:text-[18rem] font-bold italic leading-none">
      50%
      <span className="block text-[0.5em] sm:text-[0.7em] md:text-[1rem] lg:text-[2rem]">
        Off
      </span>
    </div>
  </motion.div>

  <motion.p
    className="text-red-500 text-sm sm:text-xl md:text-3xl lg:text-4xl mt-4"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1, delay: 1 }}
  >
    BrainBite -  IQ Max 
  </motion.p>
</div>
      </motion.div>
      {/* Wavy white image */}
      <div className="absolute w-full md:bottom-[-4rem]  bottom-[-1.7rem] right-0 left-0 z-0">
        <Image src={waveWhite} alt="Wave" layout="responsive" priority />
      </div>
    </div>
  );
};

export default HeroSection;