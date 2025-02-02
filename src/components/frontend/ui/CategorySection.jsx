"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Loader from '@/components/loader/loader';
import { FiArrowRight } from 'react-icons/fi'; // Importing the arrow icon from react-icons
import Image from 'next/image';
import AbsoluteImage from '../../../../public/frontend/others/category.png';

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
    <div className="my-20 flex flex-col w-full relative px-4 sm:px-8">
  {/* Header Section */}
  <div className="flex items-center justify-between w-full py-3">
    <h2 className="text-sm sm:text-xl md:text-2xl font-bold text-gray-900">
      Popular Categories
    </h2>
    <div className="flex items-center text-blue-500 hover:text-blue-700 cursor-pointer">
      <p className="mr-2 text-sm font-medium">View All</p>
      <FiArrowRight className="text-lg" />
    </div>
  </div>

  {/* Categories Section */}
  <div className="flex gap-4 px-2 py-3 overflow-x-auto snap-x snap-mandatory sm:overflow-visible sm:flex-wrap sm:justify-center">
    {displayedCategories.map((category) => (
      <motion.div
        key={category.id}
        className="relative flex-shrink-0 snap-center flex flex-col items-center bg-white rounded-xl p-4 border hover:shadow-lg transition-all duration-300 w-[40%]  sm:w-auto"
      >
       <Image
        src={category.image}
        alt={category.name}
        width={100}
        height={100}
        className="rounded-full w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24"
      />
        <p className="mt-2 text-sm sm:text-lg font-medium text-gray-700 text-center">{category.name}</p>
      </motion.div>
    ))}
  </div>

  {/* Absolute Positioned Image */}
  <div className="absolute bottom-[-60px] right-2 sm:right-[-18px] p-4 w-[80px] sm:w-[150px]">
    <Image src={AbsoluteImage} alt="Category Image" width={150} height={150} />
  </div>
</div>

  );
};

export default CategoriesSection;
