import React from 'react';
import Image from 'next/image';
import waveBg from '../../../../public/frontend/WhyChooseBrainbite/waveBg.png';
import iconBg from '../../../../public/frontend/WhyChooseBrainbite/iconBg.png';
import step1 from '../../../../public/frontend/WhyChooseBrainbite/01.png';
import step2 from '../../../../public/frontend/WhyChooseBrainbite/02.png';
import step3 from '../../../../public/frontend/WhyChooseBrainbite/03.png';
import step4 from '../../../../public/frontend/WhyChooseBrainbite/04.png';
import vector from '../../../../public/frontend/WhyChooseBrainbite/vector.png';

const steps = [
  {
    id: 1,
    icon: step1,
    title: "No Artificial Additives",
    description: "Free from chemicals, preservatives, and fillers."
  },
  {
    id: 2,
    icon: step2,
    title: "Vegan-Friendly",
    description: "Suitable for plant-based lifestyles."
  },
  {
    id: 3,
    icon: step3,
    title: "Safe & Tested",
    description: "Formulated with quality ingredients for ultimate safety."
  },
  {
    id: 4,
    icon: step4,
    title: "Fast Results",
    description: "Feel the difference in focus and energy within days."
  }
];

const StepCard = ({ icon, id, title, description }) => (
  <div className="text-center flex flex-col items-center">
    <div className="relative inline-block p-6 rounded-full mb-4 w-24 h-24">
      <div className="absolute inset-0">
        <Image
          src={iconBg}
          alt="Icon Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="rounded-full"
        />
      </div>
      <div className="relative z-10 flex justify-center items-center">
        <Image
          src={icon}
          alt={`Step ${id} Icon`}
          width={50}
          height={50}
          objectFit="contain"
        />
      </div>
    </div>
    <p className="text-white">{title}</p>
    <p className="text-gray-200 text-sm mt-2">{description}</p>
  </div>
);

const WhyChooseBrainbite = () => {
  return (
    <div className="relative pt-[14rem] mb-60 hidden md:block">
      <div className="absolute inset-0 z-[-1]">
        <Image
          src={waveBg}
          alt="Background Wave"
        />
      </div>

      <div className="text-center text-white ">
        <h2 className="text-4xl font-bold">WHY CHOOSE BRAINBITE?</h2>
        <p className="mt-2 max-w-3xl mx-auto">
          BrainBite™ SmartTab is a 100% plant-based brain supplement, designed to enhance mental health and elevate your mental performance. Whether you&apos;re a student, professional, or anyone seeking to enhance focus, boost energy, and mental clarity, BrainBite™ is your go-to solution.
        </p>
      </div>

      <div className="flex items-center justify-center gap-8 max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between w-full relative">
        {steps.map((step, index) => (
            <StepCard
              key={step.id}
              icon={step.icon}
              id={step.id}
              title={step.title}
              description={step.description}
              className="relative"
            />
          ))}
          <div className=" absolute mt-[-75px] flex justify-center ml-[10rem] mr-[10rem]">
        <Image
          src={vector}
          alt="Vector Image"
          objectFit="contain"
        />
      </div>
        </div>
      </div>
       {/* Add Vector Image Below the Steps */}
       
    </div>
  );
};

export default WhyChooseBrainbite;
