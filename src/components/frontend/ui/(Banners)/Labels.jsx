"use client"
import React from 'react';
import { motion } from 'framer-motion';

const GoodnessSection = () => {
  const items = [
    { icon: '🌱', label: 'Vegan' },
    { icon: '🌾', label: 'Non-GMO' },
    { icon: '🌍', label: 'Organic' },
    { icon: '🍞', label: 'Gluten Free' },
    { icon: '🌿', label: 'Plant Based' },
    { icon: '🍬', label: 'Sugar Free' },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <motion.div 
        className="text-2xl font-bold text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Goodness, Designed Responsibly.
      </motion.div>
      
      {/* Horizontal scroll container */}
      <div className="flex overflow-x-auto space-x-8 p-4 w-full max-w-full">
        <div className="flex space-x-8 min-w-max">
          {items.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center space-y-2"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="p-6 border-2 border-black rounded-full">
                <div className="text-black text-6xl">{item.icon}</div>
              </div>
              <p className="text-gray-800 font-semibold">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoodnessSection;
