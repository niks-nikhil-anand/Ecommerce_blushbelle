"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Loader from '@/components/loader/loader';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { AiOutlineDown, AiOutlineClose } from 'react-icons/ai';
import { FaPinterest , FaInstagram} from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import ReviewProductPage from '@/components/frontend/ui/ReviewProductPage';
import { FaCheckCircle, FaCheckSquare } from "react-icons/fa";
import RelatedBlogs from '@/components/frontend/ui/RelatedBlogs';
import RelatedProducts from '@/components/frontend/ui/RelatedProducts';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';






const ProductDetail = () => {
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [idFromURL, setIdFromURL] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [activeTab, setActiveTab] = useState("Descriptions");

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
                    console.log(response.data)
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


    const percentageOff = ((originalPrice - salePrice) / originalPrice) * 100;

    const ShareButtons = ({ url, title }) => {
      return (
        <div className="flex space-x-4">
          {/* Facebook */}
          <FacebookShareButton url={url} quote={title}>
            <FaFacebook size={32} className="text-blue-600 cursor-pointer" />
          </FacebookShareButton>
    
          {/* Twitter */}
          <TwitterShareButton url={url} title={title}>
            <FaTwitter size={32} className="text-blue-400 cursor-pointer" />
          </TwitterShareButton>
    
          {/* WhatsApp */}
          <WhatsappShareButton url={url} title={title} separator=" - ">
            <FaWhatsapp size={32} className="text-green-500 cursor-pointer" />
          </WhatsappShareButton>
        </div>
      );
    };
    

    return (
      <div className='my-5'>
      <div className="flex flex-col md:flex-row w-full px-6 lg:px-12 bg-white">
  {/* Image Section */}
  <div className="w-full md:w-[49%] h-full flex justify-start">
    {/* Thumbnail Column (Desktop) */}
    <motion.div 
      className="hidden md:flex flex-col gap-5"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {images.length > 0 ? (
        images.map((image, index) => (
          <motion.div
            key={index}
            className="w-[5rem] h-[5rem] sm:w-[6rem] sm:h-[6rem] overflow-hidden rounded-lg shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={image}
              alt={`Product Image ${index + 1}`}
              width={240}
              height={240}
              className="rounded object-cover p-5"
              onClick={() => setCurrentImageIndex(index)}
            />
          </motion.div>
        ))
      ) : (
        <div className="col-span-5 flex items-center justify-center text-gray-500">
          No images available
        </div>
      )}
    </motion.div>

    {/* Preview Image Container */}
    <motion.div 
      className="w-full md:w-[20rem] h-[10rem] md:h-[20rem] flex justify-center items-center overflow-hidden mb-4 rounded-lg relative m-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={currentImage}
        alt={name}
        className="object-contain w-full h-full cursor-pointer"
        onClick={toggleFullScreen}
        key={currentImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Mobile Slider Controls */}
      <motion.div 
        className="flex justify-between w-full md:hidden absolute top-1/2 transform -translate-y-1/2 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          onClick={prevImage}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white/80 rounded-full shadow-lg"
        >
          <FaRegArrowAltCircleLeft className="text-2xl text-gray-800" />
        </motion.button>
        <motion.button
          onClick={nextImage}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white/80 rounded-full shadow-lg"
        >
          <FaRegArrowAltCircleRight className="text-2xl text-gray-800" />
        </motion.button>
      </motion.div>
    </motion.div>
  </div>

  {/* Product Details Section */}
  <div className="w-full md:w-1/2 max-w-xl lg:max-w-3xl bg-white rounded-3xl px-2 sm:px-4 py-6">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    {/* Product Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
      <motion.h1 
        className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-0"
        whileHover={{ x: 5 }}
      >
        {product.name}
      </motion.h1>
      <motion.span
        className={`text-base sm:text-sm font-semibold px-3 py-1 rounded-lg shadow-md ${
          product.stock > 0 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
        }`}
        whileHover={{ scale: 1.05 }}
      >
        {product.stock > 0 ? "In Stock" : "Out of Stock"}
      </motion.span>
    </div>

    {/* Price Section */}
    <motion.div 
      className="flex flex-wrap items-center mt-3 gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <span className="text-xs sm:text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
      <h1 className="text-lg md:text-xl font-bold text-green-600">₹{product.salePrice}</h1>
      <span className="text-sm md:text-base text-red-500 font-semibold">
        {Math.round(percentageOff)}% Off
      </span>
    </motion.div>

    <hr className="my-4" />

    {/* Social Sharing */}
    <motion.div 
  className="flex items-center mt-4 space-x-3"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5 }}
>
  <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">Share item:</span>
  <ShareButtons url={window.location.href} title={name} />
</motion.div>


    {/* Description */}
    <motion.p
      className="text-xs sm:text-sm md:text-base text-gray-600 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      Brain Bite is a powerful supplement designed to boost cognitive function, memory, and focus. Made with natural ingredients.
    </motion.p>

    {/* Quantity Selector */}
    <div className="flex flex-col md:flex-row items-start md:items-center mt-6 gap-4 md:gap-6">
      <div className="flex items-center">
        <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium whitespace-nowrap">
          Quantity:
        </span>
        <div className="flex items-center ml-3 md:ml-4">
          <motion.button 
            onClick={decreaseQuantity} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-2 sm:px-3 py-1.5 md:px-4 bg-gray-200 text-gray-700 rounded-l-lg hover:bg-gray-300 transition-colors active:bg-gray-400"
          >
            <AiOutlineMinus className="text-xs sm:text-sm" />
          </motion.button>
          
          <motion.span 
            key={quantity}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="px-2 sm:px-3 py-1.5 md:px-4 bg-gray-200 text-gray-700 text-xs sm:text-sm md:text-base min-w-[30px] sm:min-w-[36px] md:min-w-[40px] text-center"
          >
            {quantity}
          </motion.span>
          
          <motion.button 
            onClick={increaseQuantity} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-2 sm:px-3 py-1.5 md:px-4 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 transition-colors active:bg-gray-400"
          >
            <AiOutlinePlus className="text-xs sm:text-sm" />
          </motion.button>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="w-full md:w-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full md:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition text-sm sm:text-base md:text-lg font-semibold"
          onClick={handleAddToCart}
        >
          Add to Cart
        </motion.button>
      </motion.div>
    </div>

    {/* Categories & Tags */}
    <motion.div 
      className="mt-6 space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      <div className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">
        Category: <span className="font-normal">{product.category.name}</span>
      </div>
      <div className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">
        Tags: <span className="font-normal">{product.tags.join(', ')}</span>
      </div>
    </motion.div>
  </motion.div>
</div>
</div>
<div>



</div>
          {/* Additional Banner */}
          <div className="p-3 sm:p-6 md:p-8 bg-white max-w-5xl mx-auto">
  {/* Toggle Menu - Responsive */}
  <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-300 mb-4 sm:mb-6">
    {["Descriptions", "Additional Information", "Customer Feedback"].map((tab) => (
      <motion.button
        key={tab}
        onClick={() => setActiveTab(tab)}
        whileHover={{ scale: 1.05 }}
        className={`w-full sm:w-auto px-2 sm:px-4 py-2 text-sm sm:text-base md:text-lg font-medium transition-all ${
          activeTab === tab 
            ? "border-b-2 border-green-500 text-green-600" 
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        {tab}
      </motion.button>
    ))}
  </div>

  {/* Section Content */}
  {activeTab === "Descriptions" && (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row items-start gap-4 sm:gap-6"
    >
      {/* Left Section - Text */}
      <div className="flex-1">
        <p 
          className="text-xs sm:text-sm md:text-base text-gray-700 mb-4"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />

        {/* Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-2 bg-gray-100 p-2 sm:p-3 rounded-md"
          >
            <FaCheckCircle className="text-green-500 text-sm sm:text-base" />
            <span className="text-xs sm:text-sm md:text-base text-gray-800 font-medium">
              {Math.round(percentageOff)}% Discount
            </span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-2 bg-gray-100 p-2 sm:p-3 rounded-md"
          >
            <FaCheckCircle className="text-green-500 text-sm sm:text-base" />
            <span className="text-xs sm:text-sm md:text-base text-gray-800 font-medium">
              100% Organic
            </span>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Image */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex justify-center mt-4 sm:mt-0 w-full"
      >
        <Image
          src={product.descriptionImage}
          alt="BrainBite Supplement"
          width={400}
          height={300}
          className="rounded-lg object-cover w-full sm:w-[90%] md:w-auto"
        />
      </motion.div>
    </motion.div>
  )}

  {/* Additional Information Section */}
  {activeTab === "Additional Information" && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-gray-700 p-3 sm:p-4 md:p-6"
    >
      <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Additional Information</h3>
      <p 
        className="text-xs sm:text-sm md:text-base"
        dangerouslySetInnerHTML={{ __html: product.additionalInfo }}
      />
    </motion.div>
  )}

  {/* Customer Feedback Section */}
  {activeTab === "Customer Feedback" && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-gray-700 p-3 sm:p-4 md:p-6"
    >
      <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Customer Feedback</h3>
      <ReviewProductPage/>
    </motion.div>
  )}
</div>

<div className='px-[2rem] py-[1rem] '>
  <RelatedBlogs/>
</div>
<div className='px-[1rem] py-[1rem] '>
  <RelatedProducts/>
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

