"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Loader from '@/components/loader/loader';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <div className="my-20 flex flex-col w-full relative px-4 sm:px-8">
    {/* Header Section */}
    <div className="flex items-center justify-between w-full py-3">
      <h2 className="text-sm sm:text-xl md:text-2xl font-bold text-gray-900">
        Popular Categories
      </h2>
      <Button variant="ghost" className="flex items-center text-blue-500 hover:text-blue-700">
        <span className="mr-2 text-sm font-medium">View All</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
    
    {/* Categories Section */}
    <div className="flex gap-4 px-2 py-3 overflow-x-auto snap-x snap-mandatory sm:overflow-visible sm:flex-wrap sm:justify-start">
      {displayedCategories.map((category) => (
        <motion.div
          key={category.id}
          whileHover={{ scale: 1.05 }}
          className="relative flex-shrink-0 snap-center"
        >
          <Card className="flex flex-col items-center p-4 w-32 sm:w-36 md:w-40 hover:shadow-lg transition-all duration-300">
            <div className="rounded-full overflow-hidden w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-sm sm:text-base font-medium text-gray-700 text-center">
              {category.name}
            </p>
          </Card>
        </motion.div>
      ))}
    </div>
    
    {/* Absolute Positioned Image */}
    <div className="absolute bottom-[-60px] right-2 sm:right-[1px] p-4 w-[80px] sm:w-[150px]">
  <Image
    src="/frontend/others/category.png"
    alt="Category Image"
    width={500} // this controls the natural size
    height={500}
    className="w-full h-auto"
  />
</div>
  </div>

  );
};

export default CategoriesSection;
