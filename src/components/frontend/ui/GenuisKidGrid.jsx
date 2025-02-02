import React from "react";
import Image from "next/image";
import productImage from "../../../../public/frontend/products/genuisKid/product.png";
import bg from "../../../../public/frontend/products/genuisKid/bg.png";
import ingredients from "../../../../public/frontend/products/genuisKid/ingredients.png";
import titleSvg from "../../../../public/frontend/products/genuisKid/title_shape.png";

const GenuisKidGrid = () => {
  return (
    <div className="relative flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-6 sm:p-8 rounded-sm shadow-lg max-w-4xl mx-auto my-10 sm:my-24">
    {/* Background Image */}
    <div
      className="absolute top-[-50px] sm:top-[-100px] left-[-50px] sm:left-[-100px] w-[200px] sm:w-[330px] h-[200px] sm:h-[330px] bg-no-repeat bg-contain hidden sm:block"
      style={{ backgroundImage: `url(${bg.src})` }}
    ></div>
  
    {/* Left Content */}
    <div className="relative z-10 mt-4 sm:mt-0">
      <Image
        src={productImage}
        alt="BrainBite Smart IQ"
        width={256}
        height={256}
        className="w-48 sm:w-60 h-auto drop-shadow-lg mx-auto sm:mx-0"
      />
      <Image
        src={ingredients}
        alt="Ingredients"
        width={128}
        height={128}
        className="absolute bottom-[-20px] sm:bottom-0 left-1/2 sm:left-[-50px] transform -translate-x-1/2 sm:translate-x-0 w-24 sm:w-32 h-auto drop-shadow-lg"
      />
    </div>
  
    {/* Right Content */}
    <div className="max-w-md z-10 text-center sm:text-left mt-6 sm:mt-0">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">BRAIN BITE</h2>
      <div className="mb-3 sm:mb-4 flex justify-center sm:justify-start">
        <Image
          src={titleSvg}
          alt="BrainBite Smart IQ Title"
          width={40}
          height={40}
          className="w-8 sm:w-10 h-auto drop-shadow-lg"
        />
      </div>
      <div className="text-green-500 font-semibold text-base sm:text-lg mb-2">Genius Kids</div>
  
      <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
        BrainBite™ Smart IQ is a 100% plant-based brain supplement, designed with a science-backed formula to elevate your mental performance. Whether you’re a student, professional, or anyone looking to enhance focus, cognitive energy, and mental clarity, BrainBite™ is your go-to solution.
      </p>
      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4">
        <button className="bg-purple-600 text-white px-5 sm:px-6 py-2 rounded-full font-semibold shadow-md hover:bg-purple-700 focus:outline-none">
          Order Now
        </button>
        <div className="mt-2 sm:mt-0 sm:ml-6 text-lg sm:text-xl font-bold text-gray-800">
          $66.99 <span className="line-through text-orange-500">$59.99</span>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default GenuisKidGrid;
