"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import bg from "../../../../public/frontend/products/genuisKid/bg.png";
import titleSvg from "../../../../public/frontend/products/genuisKid/title_shape.png";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const HomePageProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/admin/dashboard/product/addProduct");
        
        // Filter products where isShowOnHomePage is true
        const homePageProducts = response.data.filter(product => product.isShowOnHomePage === true);
        setProducts(homePageProducts);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = (productId) => {
    // Add your buy now logic here
    console.log("Buy now clicked for product:", productId);
    // You can redirect to checkout page or add to cart
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = (originalPrice, salePrice) => {
    if (originalPrice <= salePrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-10 sm:space-y-24 rounded-md">
        {[1, 2, 3].map((index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={index} className={`relative flex flex-col ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'} items-center justify-between bg-gray-50 p-4 sm:p-6 md:p-8 rounded-sm shadow-lg max-w-5xl mx-auto`}>
              {/* Image Skeleton */}
              <div className="relative z-10 mt-4 sm:mt-0">
                <Skeleton className="w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 rounded-lg" />
              </div>
              
              {/* Content Skeleton */}
              <div className="max-w-md z-10 mt-6 sm:mt-0 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                  <Skeleton className="h-10 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (error) {
    return null
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-10 sm:space-y-24  mt-5 md:mt-20">
      {products.map((product, index) => {
        const isEven = index % 2 === 0;
        const discountPercentage = calculateDiscountPercentage(product.originalPrice, product.salePrice);
        const hasDiscount = discountPercentage > 0;
        
        return (
          <div key={product._id} className={`relative flex flex-col ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'} items-center justify-between bg-gray-50 p-4 sm:p-6 md:p-8 rounded-sm shadow-lg max-w-5xl mx-auto`}>
            {/* Background Image - Only show for odd products (not even) */}
            {isEven && (
              <div
                className={`absolute top-[-50px] sm:top-[-100px] ${isEven ? 'left-[-50px] sm:left-[-100px]' : 'right-[-50px] sm:right-[-100px]'} w-[200px] sm:w-[330px] h-[200px] sm:h-[330px] bg-no-repeat bg-contain hidden sm:block`}
                style={{ backgroundImage: `url(${bg.src})` }}
              ></div>
            )}
          
            {/* Product Image Section */}
            <div className="relative z-10 mt-4 sm:mt-0">
              <Image
                src={product.featuredImage}
                alt={product.name}
                width={256}
                height={256}
                className="w-48 sm:w-60 h-auto drop-shadow-lg mx-auto sm:mx-0"
              />
              
              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>
          
            {/* Content Section */}
            <div className={`max-w-md z-10 text-center sm:text-left mt-6 sm:mt-0`}>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{product.name}</h2>
              <div className={`mb-3 sm:mb-4 flex justify-center sm:justify-start`}>
                <Image
                  src={titleSvg}
                  alt={`${product.name} Title`}
                  width={40}
                  height={40}
                  className="w-8 sm:w-10 h-auto drop-shadow-lg"
                />
              </div>
              <div className="text-black mb-4 text-xs sm:text-sm md:text-base leading-relaxed px-2 sm:px-4">
                {product.purpose}
              </div>
              
              {/* Price Section */}
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">
                    ₹{product.salePrice.toLocaleString()}
                  </div>
                  {hasDiscount && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded">
                        Save ₹{(product.originalPrice - product.salePrice).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Buy Now Button */}
              <div className="mb-4">
                <button 
                  onClick={() => handleBuyNow(product._id)}
                  disabled={product.stock <= 0}
                  className={`px-6 py-3 rounded-full font-semibold text-lg shadow-md transition-all duration-200 ${
                    product.stock <= 0 
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {product.stock <= 0 ? 'Out of Stock' : 'Buy Now'}
                </button>
              </div>

              {/* Stock Status */}
              {product.stock > 0 && product.stock <= 10 && (
                <div className="text-orange-600 text-sm font-semibold mb-3">
                  Only {product.stock} left in stock!
                </div>
              )}
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className={`flex flex-wrap gap-2 justify-center sm:justify-start`}>
                  {product.tags.slice(0, 4).map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HomePageProductGrid;