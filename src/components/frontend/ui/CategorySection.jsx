"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Loader from '@/components/loader/loader';
import { FiArrowRight } from 'react-icons/fi'; // Importing the arrow icon from react-icons
import Image from 'next/image';

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/admin/dashboard/category')
      .then((response) => {
        // Directly handle the array if the data is not nested
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('Unexpected response format:', response);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />; // Show loader while fetching
  }

  if (!categories.length) {
    return <p className="text-center">No categories available.</p>;
  }

  const displayedCategories = categories.slice(0, 6);


  return (
    <div className="my-20 flex flex-col ">



      <div className='flex gap-4 hover:cursor-pointer px-22 py-3 w-full justify-between'>
      <h2 className="text-sm sm:text-xl md:text-2xl mb-4 font-bold text-gray-900">
      Popular Categories
    </h2>
    <div className="flex items-center justify-center text-blue-500 hover:text-blue-700">
      <p className="mr-2 text-sm font-medium">View All</p>
      <FiArrowRight className="text-lg" /> {/* Add the arrow icon */}
    </div>
      </div>
   
    <div className="flex gap-4 hover:cursor-pointer justify-center px-2 py-3 overflow-x-auto snap-x snap-mandatory sm:flex-wrap">
      {displayedCategories.map((category) => (
        <motion.div
          key={category.id}
          className="relative flex-shrink-0 snap-center flex flex-col items-center bg-white  rounded-xl p-4 border hover:shadow-lg transition-all duration-300"
        >
          <div className="flex flex-col items-center">
          <Image
          src={category.image}
          alt={category.name}
          width={100} // adjust width based on your design
          height={100} // adjust height based on your design
          className="rounded-full" // optional: add styles to the image (e.g., rounded corners)
        />
            <p className="mt-2 text-lg font-medium text-gray-700">{category.name}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
  );
};

export default CategoriesSection;
