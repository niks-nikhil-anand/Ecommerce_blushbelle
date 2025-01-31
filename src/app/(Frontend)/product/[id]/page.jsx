"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Loader from '@/components/loader/loader';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { AiOutlineDown, AiOutlineClose } from 'react-icons/ai';
import { FaFacebook, FaTwitter, FaPinterest, FaInstagram } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";

import { AiOutlineHeart } from "react-icons/ai";
import ReviewProductPage from '@/components/frontend/ui/ReviewProductPage';




const ProductDetail = () => {
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [idFromURL, setIdFromURL] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);



    useEffect(() => {
        const urlPath = window.location.pathname;
        const id = urlPath.substring(urlPath.lastIndexOf('/') + 1);
        setIdFromURL(id);

        if (id) {
            const interval = setInterval(() => {
                setProgress(prev => (prev < 100 ? prev + 1 : prev));
            }, 10); 

            axios.get(`/api/admin/dashboard/product/${id}`)
                .then(response => {
                    clearInterval(interval);
                    setProduct(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching product data:", error);
                    clearInterval(interval);
                    setLoading(false);
                });
        }
    }, []);

    if (loading) {
        return (
            <Loader/>
        );
    }

    const handleAddToCart = () => {
      const cartData = {
        id: idFromURL,
        quantity: quantity
      };
    
      // Retrieve the existing cart from localStorage
      let existingCart = localStorage.getItem('cart');
    
      try {
        // Parse the cart if it exists and is valid JSON, otherwise initialize an empty array
        existingCart = existingCart ? JSON.parse(existingCart) : [];
      } catch (e) {
        // If parsing fails, initialize as an empty array
        existingCart = [];
      }
    
      // Ensure existingCart is an array
      if (!Array.isArray(existingCart)) {
        existingCart = [];
      }
    
      // Check if the product is already in the cart
      const existingProductIndex = existingCart.findIndex((item) => item.id === idFromURL);
    
      if (existingProductIndex !== -1) {
        // If the product is already in the cart, update its quantity
        existingCart[existingProductIndex].quantity += quantity;
      } else {
        // If the product is not in the cart, add it
        existingCart.push(cartData);
      }
    
      // Update the cart in localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
    
      // Navigate to the cart page
      setAddedToCart(true);
      router.push("/product/cart")
    };

    
    
    
    const increaseQuantity = () => {
      setQuantity(prevQuantity => prevQuantity + 1);
    };
    
    const decreaseQuantity = () => {
      setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };


    const nextImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    };
  
    const prevImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    };
  
    const toggleFullScreen = () => {
      setIsFullScreen(!isFullScreen);
    };


    const toggleOpen = () => {
      setIsOpen(!isOpen);
    };

    if (!product) {
        return <div>Product not found.</div>;
    }
    const { name, description, images, salePrice, originalPrice, featuredImage, ratings, descriptionImage , servingPerBottle , suggestedUse , ingredients , productHighlights } = product;
    const averageRating = ratings?.average || 4.2;
    const allImages = [ ...(images || [])];


    const currentImage = images[currentImageIndex];


    

    return (
      <div>
      <motion.div 
            className="flex flex-col lg:flex-row  p-4 sm:p-6 bg-white w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
>
<div className="flex flex-col md:flex-row w-full px-6 lg:px-12  bg-white">
<div className="w-full md:w-[49%] h-full flex flex-col items-center ">
        {/* Preview Image */}
        <div className="w-full md:w-[30rem] h-[20rem] md:h-[40rem] flex justify-center items-center overflow-hidden mb-4  rounded-lg relative">
          <img
            src={currentImage}
            alt={name}
            className="object-contain w-full h-full cursor-pointer"
            
            onClick={toggleFullScreen} // Open full-screen on click
            
          />
        </div>

        {/* Manual Image Slider Controls */}
                  <div className="flex justify-between w-full md:hidden absolute top-1/2 transform -translate-y-1/2 left-0 right-0">
          <button onClick={prevImage} className="p-2 rounded-l text-black text-2xl">
            <FaRegArrowAltCircleLeft />
          </button>
          <button onClick={nextImage} className="p-2 rounded-l text-black text-2xl">
            <FaRegArrowAltCircleRight />
          </button>
        </div>


        {/* Thumbnail Images (Optional) */}
        <div className="md:flex gap-2 overflow-x-auto w-full hidden">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} className="w-[5rem] h-[5rem] sm:w-[6rem] sm:h-[6rem] overflow-hidden rounded-lg shadow-lg cursor-pointer">
                <img
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                  onClick={() => setCurrentImageIndex(index)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-5 flex items-center justify-center text-gray-500">
              No images available
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="w-full md:w-1/2 max-w-xl lg:max-w-3xl bg-white rounded-3xl px-6 sm:px-10 py-6">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Product Title */}
          <h1 className="text-3xl font-bold mb-2">Brain Bite</h1>
          <span className="text-green-600 text-sm font-semibold bg-green-100 px-2 py-1 rounded-lg">In Stock</span>

          {/* Ratings & Reviews */}
          <div className="flex items-center mt-2">
            <span className="text-yellow-500 text-lg">★★★★★</span>
            <span className="text-gray-500 ml-2">10 Reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-center mt-3">
            <span className="text-gray-400 text-xl line-through">$48.00</span>
            <span className="text-red-500 text-xl font-semibold ml-2">64% Off</span>
          </div>
          <h1 className="text-3xl font-bold text-green-600">$17.28</h1>

          {/* Brand */}
          <div className="flex items-center mt-4">
            <span className="text-gray-700 font-medium">Brand:</span>
            <span className="ml-2 bg-gray-100 px-3 py-1 rounded-md">HealthGenix</span>
          </div>

          {/* Share Icons */}
          <div className="flex items-center mt-4 space-x-3">
            <span className="text-gray-700 font-medium">Share item:</span>
            <FaFacebook className="text-blue-600 cursor-pointer" />
            <FaTwitter className="text-blue-400 cursor-pointer" />
            <FaPinterest className="text-red-500 cursor-pointer" />
            <FaInstagram className="text-pink-500 cursor-pointer" />
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mt-4">
            Brain Bite is a powerful supplement designed to boost cognitive function, memory, and focus. Made with natural ingredients.
          </p>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center mt-6">
            <span className="text-gray-700 font-medium">Quantity:</span>
            <div className="flex items-center border rounded-full py-2 px-5 mx-4">
              <button className="px-3 py-1">-</button>
              <input type="number" className="w-8 text-center bg-transparent border-none" value={1} readOnly />
              <button className="px-3 py-1">+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition text-lg font-semibold"
            >
              Add to Cart
            </motion.button>
            <AiOutlineHeart className="text-3xl ml-4 text-gray-500 cursor-pointer" />
          </div>

          {/* Categories & Tags */}
          <div className="mt-6">
            <span className="text-gray-700 font-medium">Category:</span>
            <span className="ml-2 text-gray-600">Supplements</span>
          </div>
          <div className="mt-2">
            <span className="text-gray-700 font-medium">Tags:</span>
            <span className="ml-2 text-gray-600">Health, Brain Booster</span>
          </div>
        </motion.div>
      </div>
    </div>
      

</motion.div>
<div>



</div>
          {/* Additional Banner */}
          <div className="flex flex-col md:flex-row items-center p-4 md:p-8 mt-10 bg-[#e0d2ff]">
<div className="flex w-full flex-col md:flex-row justify-between">
  {/* Image Section */}
  <div className="w-full md:w-1/2 mb-6 md:mb-0 md:mr-8">
    <Image
      src={descriptionImage}
      alt="Banner Image"
      className="w-full h-[20rem] md:h-[30rem] object-cover rounded-xl"
      width={500}
      height={300}
    />
  </div>

  {/* Text Section */}
  <div className="flex flex-col justify-start w-full md:w-1/2">
    <h1 className="text-xl md:text-3xl lg:text-4xl text-[#D07021] mb-4">
      {name}
    </h1>
    <p className="text-black-100 text-base md:text-lg lg:text-xl leading-relaxed">
      {description}
    </p>
  </div>
</div>
</div>
          <div>
            <ReviewProductPage/>
          </div>
         

          {isFullScreen && (
        <motion.div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-2 rounded-lg" style={{ width: '80vw', height: '80vh' }}>
            <img src={currentImage} alt="Full Size Product" className="object-contain w-full h-full" />
            <AiOutlineClose className="absolute top-2 right-2 text-2xl text-gray-600 cursor-pointer" onClick={toggleFullScreen} />
            
            {/* Navigation Controls */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4">
              <button onClick={prevImage} className="text-black text-2xl">
                <AiOutlineLeft />
              </button>
              <button onClick={nextImage} className="text-black text-2xl">
                <AiOutlineRight />
              </button>
            </div>
          </div>
        </motion.div>
      )}
      </div>
  );
};


export default ProductDetail;



