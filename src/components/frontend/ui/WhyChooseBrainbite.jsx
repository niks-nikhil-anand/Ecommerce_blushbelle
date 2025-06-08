import React from 'react';

const steps = [
  {
    id: 1,
    number: "1",
    title: "No Artificial Additives",
    description: "Free from chemicals, preservatives, and fillers."
  },
  {
    id: 2,
    number: "2",
    title: "Vegan-Friendly",
    description: "Suitable for plant-based lifestyles."
  },
  {
    id: 3,
    number: "3",
    title: "Safe & Tested",
    description: "Formulated with quality ingredients for ultimate safety."
  },
  {
    id: 4,
    number: "4",
    title: "Fast Results",
    description: "Feel the difference in focus and energy within days."
  }
];

const StepCard = ({ number, id, title, description }) => (
  <div className="text-center flex flex-col items-center group hover:transform hover:scale-105 transition-all duration-300 ease-in-out">
    {/* Number Container - Smaller Size */}
    <div className="relative mb-4">
      <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
        {/* Inner circle with number */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center">
          <span className="text-green-600 font-bold text-lg sm:text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300">
            {number}
          </span>
        </div>
        
        {/* Glowing ring effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-300 to-green-500 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300"></div>
      </div>
    </div>

    {/* Content - Reduced spacing */}
    <div className="space-y-2 max-w-xs mx-auto px-2">
      <h3 className="text-white font-bold text-sm sm:text-base md:text-lg leading-tight group-hover:text-green-100 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-green-100 text-xs sm:text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
        {description}
      </p>
    </div>
  </div>
);

const WhyChooseBrainbite = () => {
  return (
    <section className="relative py-8 sm:py-12 md:py-16   mt-4 sm:mt-6 md:mt-8 bg-gradient-to-br from-green-600 via-green-700 to-green-800 overflow-hidden">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-5 left-5 w-20 h-20 bg-green-400/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/4 right-10 w-24 h-24 bg-green-300/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-green-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl relative z-10">
        {/* Header Section - Reduced Size */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="relative inline-block mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
              WHY CHOOSE 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-green-100 mt-1">
                BRAINBITE?
              </span>
            </h2>
            {/* Decorative underline - Smaller */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 h-0.5 bg-gradient-to-r from-green-300 to-green-400 rounded-full"></div>
          </div>
          
          <div className="max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm md:text-base text-white leading-relaxed px-2 sm:px-4">
              BrainBite™ SmartTab is a 100% plant-based brain supplement, designed to enhance mental health and elevate your mental performance. Whether you're a student, professional, or anyone seeking to enhance focus, boost energy, and mental clarity, BrainBite™ is your go-to solution.
            </p>
          </div>
        </div>

        {/* Steps Section - Compact Layout */}
        <div className="relative">
          {/* Mobile Layout (1 column) */}
          <div className="grid grid-cols-1 gap-6 sm:hidden px-2">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <StepCard
                  number={step.number}
                  id={step.id}
                  title={step.title}
                  description={step.description}
                />
                {/* Mobile connector - Dotted line */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-4">
                    <div className="w-px h-6 bg-gradient-to-b from-green-300 via-green-400 to-transparent rounded-full border-l border-dashed border-green-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tablet Layout (2x2 grid) */}
          <div className="hidden sm:grid md:hidden grid-cols-2 gap-x-8 gap-y-10 px-4 py-4">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <StepCard
                  number={step.number}
                  id={step.id}
                  title={step.title}
                  description={step.description}
                />
                {/* Tablet connectors - Dotted lines */}
                {index === 0 && (
                  <div className="absolute top-8 -right-4 w-8 h-px border-t-2 border-dashed border-green-300 rounded-full"></div>
                )}
                {index === 1 && (
                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-px h-10 border-l-2 border-dashed border-green-300 rounded-full"></div>
                )}
                {index === 2 && (
                  <div className="absolute top-8 -right-4 w-8 h-px border-t-2 border-dashed border-green-300 rounded-full"></div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Layout (horizontal) - Compact */}
          <div className="hidden md:grid grid-cols-4 gap-4 lg:gap-6 px-4 lg:px-6 py-6">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <StepCard
                  number={step.number}
                  id={step.id}
                  title={step.title}
                  description={step.description}
                />
                {/* Desktop connecting line - Dotted */}
                {index < steps.length - 1 && (
                  <div className="absolute top-8 -right-2 lg:-right-3 w-4 lg:w-6 h-px border-t-2 border-dashed border-white rounded-full hidden md:block"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom decorative wave - Smaller */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-green-900 to-transparent"></div>
    </section>
  );
};

export default WhyChooseBrainbite;