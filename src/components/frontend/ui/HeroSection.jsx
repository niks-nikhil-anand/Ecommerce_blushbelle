"use client"
"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'

const sliderData = [
  {
    title: "BrainBite – Genius",
    description: "Target Audience: Parents of School-going Children, 2-16 years old",
    backgroundImageUrl: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGNoaWxkcmVufGVufDB8fDB8fHww",
    buttonText: "Learn More"
  },
  {
    title: "BrainBite – Memory & Focus",
    description: "Target Audience: Mature Students, Preparing for Exams like IIT, JEE, NEET",
    backgroundImageUrl: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGNoaWxkcmVufGVufDB8fDB8fHww",
    buttonText: "Explore Now"
  },
  {
    title: "BrainBite – IQ Max",
    description: "Target Audience: Modern People, Working Women, Professionals, Stressed Individuals",
    backgroundImageUrl: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGNoaWxkcmVufGVufDB8fDB8fHww",
    buttonText: "Start Now"
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  };

  const { title, description, backgroundImageUrl, buttonText } = sliderData[currentSlide];

  return (
    <div className="relative w-full h-screen bg-blue-500">
      {/* Background Image */}
      <img
        src={backgroundImageUrl} 
        alt="Learning Image"
        className="absolute inset-0 object-cover w-full h-full opacity-60"
      />

      {/* Content Container */}
      <div className="flex items-center justify-center w-full h-full px-6">
        <motion.div
          className="text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <h1 className="text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl mb-6">{description}</p>
          
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 pl-4">
        <button onClick={prevSlide} className="text-white text-3xl">{"<"}</button>
      </div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 pr-4">
        <button onClick={nextSlide} className="text-white text-3xl">{">"}</button>
      </div>
    </div>
  );
};

export default HeroSection;
