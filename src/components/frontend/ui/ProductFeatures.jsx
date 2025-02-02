import React from 'react';
import Image from 'next/image';

import BgImage from '../../../../public/frontend/ProductFeatures/Bg.png';
import BottomWave from '../../../../public/frontend/ProductFeatures/BottomWave.png';
import TopWave from '../../../../public/frontend/ProductFeatures/TopWave.png';
import GenuisKidProduct from '../../../../public/frontend/ProductFeatures/GenuisKidProduct.png';

import Brain from '../../../../public/frontend/ProductFeatures/Brain.png';
import Focus from '../../../../public/frontend/ProductFeatures/Focus.png';
import Head from '../../../../public/frontend/ProductFeatures/Head.png';
import Plant from '../../../../public/frontend/ProductFeatures/Plant.png';
import Stress from '../../../../public/frontend/ProductFeatures/Stress.png';

const ProductFeatures = () => {
  return (
    <div
      className="relative w-full max-h-[80vh] bg-cover bg-center py-10 hidden md:block"
      style={{ backgroundImage: `url(${BgImage.src})` }}
    >
      {/* Top Wave */}
      <div className="absolute top-[-20px] hidden md:flex left-0 w-full ">
        <Image src={TopWave} alt="Top Wave" layout="responsive" priority />
      </div>

      {/* Product and Features */}
      <div className="relative flex flex-col items-center justify-center px-6 py-12 lg:px-20">
        {/* Center Product */}
        <div className="relative flex-col items-center z-10 hidden md:flex">
          <Image
            src={GenuisKidProduct}
            alt="Genius Kids Product"
            width={250}
            height={400}
            priority
          />
        </div>

        {/* Feature Points */}
        <div className="absolute inset-0 flex flex-wrap items-center justify-around text-center gap-6 px-4 lg:px-0 lg:text-left">
          {/* Left Features */}
          <div className="flex flex-col items-end space-y-8 lg:pr-8 lg:items-start">
            <Feature
              icon={Brain}
              title="Fuel Cognitive Energy Brain Stamina"
              description="Learn better and be more alert. Supports logic and mental skills."
            />
            <Feature
              icon={Focus}
              title="Ignites Unstoppable Focus & Clarity"
              description="Learn better and be more alert. Supports logic and mental skills."
            />
            <Feature
              icon={Stress}
              title="Fosters Stress-Free Clear Thinking"
              description="Learn better and be more alert. Supports logic and mental skills."
            />
          </div>

          

          {/* Right Features */}
          <div className="flex flex-col items-start space-y-8 lg:pl-8 lg:items-start">
            <Feature
              icon={Plant}
              title="100% Plant Based & Safe for Kids"
              description="Learn better and be more alert. Supports logic and mental skills."
            />
            <Feature
              icon={Head}
              title="Enhances Brain Growth"
              description="Learn better and be more alert. Supports logic and mental skills."
            />
            <Feature
              icon={Focus}
              title="Improves Focus & Concentration"
              description="Learn better and be more alert. Supports logic and mental skills."
            />
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute md:bottom-[-30px] hidden md:flex left-0 w-full">
        <Image src={BottomWave} alt="Bottom Wave" layout="responsive" priority />
      </div>
    </div>
  );
};

// Feature Component
const Feature = ({ icon, title, description }) => (
  <div className="flex items-center max-w-[20rem] flex-wrap md:flex-nowrap">
  <div className="flex-shrink-0 mr-5 p-2 rounded-full border-2 border-dotted border-white mb-4 md:mb-0">
    <Image src={icon} alt={title} width={30} height={30} />
  </div>

  <div>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="text-sm text-white opacity-80">{description}</p>
  </div>
</div>

);

export default ProductFeatures;
