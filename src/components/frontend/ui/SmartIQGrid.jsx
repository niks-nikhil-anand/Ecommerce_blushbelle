import React from "react";
import productImage from "../../../../public/frontend/products/smartIQ/product.png";
import bg from "../../../../public/frontend/products/smartIQ/bg.png";
import ingredients from "../../../../public/frontend/products/smartIQ/ingredients.png";

const SmartIQGrid = () => {
  return (
    <div className="relative flex items-center justify-between bg-gray-50 p-8 rounded-sm shadow-lg max-w-4xl mx-auto">
      {/* Background Image */}
      <div
        className="absolute top-[-100px] right-[-100px] w-330 h-330 bg-no-repeat bg-contain"
        style={{ backgroundImage: `url(${bg.src})` }}
      ></div>

      {/* Left Content */}
      <div className="max-w-md z-10">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">BRAIN BITE</h2>
        <div className="text-green-500 font-semibold text-lg mb-2">Smart IQ</div>
        <p className="text-gray-600 mb-6">
          BrainBite™ Smart IQ is a 100% plant-based brain supplement, designed with a science-backed formula to elevate your mental performance. Whether you’re a student, professional, or anyone looking to enhance focus, cognitive energy, and mental clarity, BrainBite™ is your go-to solution.
        </p>
        <div className="flex items-center mb-4">
          <button className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-purple-700 focus:outline-none">
            Order Now
          </button>
          <div className="ml-6 text-xl font-bold text-gray-800">
            $56.99 <span className="line-through text-orange-500">$59.99</span>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="relative z-10">
        <img
          src={productImage.src}
          alt="BrainBite Smart IQ"
          className="w-64 h-auto drop-shadow-lg"
        />
        <img
          src={ingredients.src}
          alt="Ingredients"
          className="absolute bottom-0 left-[-50px] w-32 h-auto drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default SmartIQGrid;
