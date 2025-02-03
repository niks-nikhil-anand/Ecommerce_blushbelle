"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaRegHeart } from "react-icons/fa";
import Image from 'next/image';
import Loader from '@/components/loader/loader';
import { FiArrowRight } from 'react-icons/fi'; // Importing the arrow icon from react-icons
import { motion } from 'framer-motion';
import { FaHeart, FaEye, FaLock } from 'react-icons/fa';



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
      <div className="my-7 flex flex-col w-full relative px-4 sm:px-8">
      {/* Header Section */}
      <div className="flex items-center justify-between w-full py-3">
        <h2 className="text-sm sm:text-xl md:text-2xl font-bold text-gray-900">
          Top Selling Products
        </h2>
        <div className="flex items-center text-blue-500 hover:text-blue-700 cursor-pointer">
          <p className="mr-2 text-sm font-medium">View All</p>
          <FiArrowRight className="text-lg" />
        </div>
      </div>
    
      {/* Products Section */}
      <div className="flex gap-4 px-2 py-3 overflow-x-auto snap-x snap-mandatory sm:overflow-visible sm:flex-wrap ">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="relative flex-shrink-0 snap-center flex flex-col items-center justify-center bg-white rounded-xl p-6 border hover:shadow-lg transition-all duration-300 w-[80%] sm:w-[220px] md:w-[250px] lg:w-[280px] h-[250px] md:h-[300px] text-center group cursor-pointer"
            onClick={() => handleCardClick(product._id)}
          >
            {/* Discount Badge */}
            {product.discount && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {product.discount}
              </span>
            )}
    
            {/* Product Image */}
            <div className="relative">
              <Image
                src={product.featuredImage}
                alt={product.name}
                width={100}
                height={100}
                className="object-contain w-32 h-32 sm:w-32 sm:h-32 md:w-44 md:h-44"
              />
            </div>
    
            {/* Product Details */}
            <p className="mt-2 text-xs sm:text-sm font-semibold text-gray-800">{product.name}</p>
    
            {/* Price Section */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm sm:text-base font-bold text-black">₹{product.salePrice}</span>
              <span className="text-xs sm:text-sm font-bold text-[#999999] line-through">
                ₹{product.originalPrice}
              </span>
            </div>
    
            {/* Rating */}
            <div className="flex mt-1">
              {"★".repeat(product.rating).padEnd(5, "☆").split("").map((star, index) => (
                <span key={index} className="text-yellow-400 text-xs sm:text-sm">{star}</span>
              ))}
            </div>
    
            {/* Lock Icon */}
            {product.locked && (
              <div className="absolute bottom-2 right-2 text-gray-400">
                <FaLock size={14} />
              </div>
            )}
    
            {/* Hover Icons */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <FaHeart className="text-gray-500 hover:text-red-500 cursor-pointer" />
              <FaEye className="text-gray-500 hover:text-blue-500 cursor-pointer" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    
      

    );
};


export default ProductCard;
