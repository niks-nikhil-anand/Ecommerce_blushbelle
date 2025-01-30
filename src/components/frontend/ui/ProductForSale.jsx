"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaRegHeart } from "react-icons/fa";
import Image from 'next/image';
import Loader from '@/components/loader/loader';
import { FiArrowRight } from 'react-icons/fi'; // Importing the arrow icon from react-icons
import { motion } from 'framer-motion';



const ProductCard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev < 100) return prev + 1;
                    clearInterval(interval);
                    return 100;
                });
            }, 30);
        }

        axios.get('/api/admin/dashboard/product/addProduct')
            .then(response => {
                console.log(response.data)
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the product data!", error);
                setLoading(false);
            });
    }, [loading]);

    if (loading) {
        return (
            <Loader />
        );
    }

    if (products.length === 0) {
        return <div>No products found.</div>;
    }

    const truncateText = (text, limit) => {
        return text.length > limit ? `${text.substring(0, limit)}...` : text;
    };

    const handleCardClick = (id) => {
        router.push(`/product/${id}`);
    };

    const handleWishlistClick = () => {
        router.push('/auth/signIn');
    };

    return (
      <div className="my-20 flex flex-col  w-full relative"> 
      <div className='flex gap-4 hover:cursor-pointer px-22 py-3 w-full justify-between'>
      <h2 className="text-sm sm:text-xl md:text-2xl mb-4 font-bold text-gray-900">
      Top Selling Products
    </h2>
    <div className="flex items-center justify-center text-blue-500 hover:text-blue-700">
      <p className="mr-2 text-sm font-medium">View All</p>
      <FiArrowRight className="text-lg" /> {/* Add the arrow icon */}
    </div>
      </div>
   
    <div className="flex gap-4 hover:cursor-pointer justify-center px-2 py-3 overflow-x-auto snap-x snap-mandatory sm:flex-wrap  ">
      {products.map((product) => (
        <motion.div
          key={product.id}
          className="relative flex-shrink-0 snap-center flex flex-col items-center bg-white  rounded-xl p-4 border hover:shadow-lg transition-all duration-300"
        >
          <div className="flex flex-col items-center">
          <Image
          src={product.featuredImage}
          alt={product.name}
          width={100} // adjust width based on your design
          height={100} // adjust height based on your design
          className="rounded-full" // optional: add styles to the image (e.g., rounded corners)
        />
            <p className="mt-2 text-lg font-medium text-gray-700">{product.name}</p>
          </div>
        </motion.div>
      ))}
    </div>
    </div>
      

    );
};


export default ProductCard;
