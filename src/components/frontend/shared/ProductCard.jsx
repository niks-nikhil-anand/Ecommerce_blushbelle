"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Eye, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { FaCartPlus } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";


// ProductCardSkeleton component for loading state
const ProductCardSkeleton = () => {
  return (
    <Card className="w-full h-full overflow-hidden shadow-sm">
      <div className="pt-4 px-6">
        <Skeleton className="w-full h-60 rounded" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-5 w-3/4 mb-3" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-1/3 mt-2" />
        <Skeleton className="h-16 w-full mt-3 rounded" />
      </CardContent>
    </Card>
  );
};

const ReviewsSkeleton = () => (
  <div className="mt-4 space-y-2">
    <Skeleton className="h-4 w-32 mb-2" />
    <div className="space-y-2">
      {[1, 2].map((i) => (
        <div key={i} className="p-2 border rounded">
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-3 w-24 mb-1" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  </div>
);

const ProductCard = ({ product, isLoading = false, showReviews = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const router = useRouter();

  // Check if product is already in cart on component mount
  useEffect(() => {
    const checkCartStatus = () => {
      try {
        const existingCart = localStorage.getItem("cart");
        if (existingCart) {
          const cartItems = JSON.parse(existingCart);
          const isInCart = Array.isArray(cartItems) && 
            cartItems.some(item => item.id === product?._id?.toString());
          setIsAddedToCart(isInCart);
        }
      } catch (error) {
        console.error("Error checking cart status:", error);
      }
    };

    if (product?._id) {
      checkCartStatus();
    }
  }, [product?._id]);

  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?._id || !showReviews) return;
      
      setReviewsLoading(true);
      try {
        const response = await fetch(`/api/admin/dashboard/review/${product._id}`);
        if (response.ok) {
          const reviewData = await response.json();
          const reviewArray = Array.isArray(reviewData) ? reviewData : reviewData.reviews || [];
          setReviews(reviewArray.slice(0, 2)); // Show only 2 reviews in card
          setTotalReviews(reviewArray.length);
          
          // Calculate average rating
          if (reviewArray.length > 0) {
            const avgRating = reviewArray.reduce((acc, review) => acc + (review.rating || 0), 0) / reviewArray.length;
            setAverageRating(Math.round(avgRating * 10) / 10);
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [product?._id, showReviews]);

  // If in loading state, show skeleton
  if (isLoading) {
    return <ProductCardSkeleton />;
  }

  const handleProductClick = () => {
    const productId = product?._id?.toString() || "";
    if (productId) {
      router.push(`/product/${productId}`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    const productId = product?._id?.toString();
    const productName = typeof product?.name === 'string' ? product.name : 'Product';
    
    if (!productId) {
      toast.error("Product ID not found");
      return;
    }

    try {
      let existingCart = localStorage.getItem("cart");
      existingCart = existingCart ? JSON.parse(existingCart) : [];
      
      if (!Array.isArray(existingCart)) {
        existingCart = [];
      }

      const existingProductIndex = existingCart.findIndex(
        (item) => item.id === productId
      );

      if (existingProductIndex !== -1) {
        existingCart[existingProductIndex].quantity += 1;
        toast.success(`${productName} quantity updated in cart`, {
          icon: '🛒',
          duration: 2000,
        });
      } else {
        const cartData = {
          id: productId,
          quantity: 1,
          selectedPack: 1,
          name: productName,
          price: product?.salePrice || 0,
          image: product?.featuredImage || "",
          addedAt: new Date().toISOString()
        };
        existingCart.push(cartData);
        toast.success(`${productName} added to your cart`, {
          icon: '🛒',
          duration: 2000,
        });
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));
      setIsAddedToCart(true);

      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { cart: existingCart } 
      }));

    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    
    const productName = typeof product?.name === 'string' ? product.name : 'Product';
    
    switch (action) {
      case "wishlist":
        toast.success(`${productName} added to your wishlist`, {
          icon: '❤️',
          duration: 2000,
        });
        break;
      case "quickview":
        toast.success(`Quick view for ${productName}`, {
          icon: '👁️',
          duration: 2000,
        });
        break;
      default:
        break;
    }
  };

  const calculateDiscount = () => {
    if (product?.originalPrice && product?.salePrice) {
      const discount = ((product.originalPrice - product.salePrice) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return null;
  };

  const renderStars = (rating) => {
    const validRating = Math.max(0, Math.min(5, rating || 0));
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < validRating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recently";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Recently";
    }
  };

  const limitText = (text, wordLimit = 15) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Safely access product properties with fallbacks
  const {
    name = "",
    category = null,
    subCategory = null,
    featuredImage = "",
    salePrice = 0,
    originalPrice = 0,
    tags = []
  } = product || {};

  const categoryName = category?.name || "";
  const subCategoryName = subCategory?.name || "";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card 
        className="w-full h-full overflow-hidden cursor-pointer relative group shadow-sm hover:shadow-md transition-all duration-300"
        onClick={handleProductClick}
      >
        {/* Discount Badge */}
        {calculateDiscount() && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-500 z-10">
            {calculateDiscount()}% OFF
          </Badge>
        )}
        
        {/* Product Tags */}
        {tags.includes("organic") && (
          <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-500 z-10">
            Organic
          </Badge>
        )}
        
        {/* Product Image */}
        <div className="relative overflow-hidden pt-4 px-6">
          <div className="w-full h-60 flex items-center justify-center relative">
            {!imageLoaded && featuredImage && (
              <Skeleton className="absolute inset-0 w-full h-full rounded" />
            )}
            
            {featuredImage ? (
              <Image
                src={featuredImage}
                alt={String(name)}
                width={250}
                height={250}
                className={cn(
                  "object-contain w-full h-full transition-transform duration-500 group-hover:scale-110",
                  !imageLoaded && "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            ) : (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded">
                <p className="text-gray-400 text-sm">No image</p>
              </div>
            )}
          </div>
          
          {/* 3D Action buttons */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 py-2 bg-gradient-to-t from-white via-white/95 to-transparent"
            initial={{ y: 60, opacity: 0 }}
            animate={{ 
              y: isHovered ? 0 : 60,
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-2"
              style={{
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                boxShadow: '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff'
              }}
              onClick={(e) => handleActionClick(e, "wishlist")}
            >
              <Heart className="h-4 w-4 drop-shadow-sm" />
            </Button>
            
            <Button
              size="icon"
              variant="outline"
              className={cn(
                "h-10 w-10 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-2",
                isAddedToCart
                  ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                  : "bg-white hover:bg-green-50 hover:text-green-600 hover:border-green-200"
              )}
              style={{
                background: isAddedToCart 
                  ? 'linear-gradient(145deg, #f0fdf4, #dcfce7)' 
                  : 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                boxShadow: '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff'
              }}
              onClick={handleAddToCart}
            >
              {isAddedToCart ? (
                <BsCartCheckFill className="h-4 w-4 drop-shadow-sm" />
              ) : (
                <FaCartPlus className="h-4 w-4 drop-shadow-sm" />
              )}
            </Button>
            
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-2"
              style={{
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                boxShadow: '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff'
              }}
              onClick={(e) => handleActionClick(e, "quickview")}
            >
              <Eye className="h-4 w-4 drop-shadow-sm" />
            </Button>
          </motion.div>
        </div>
        
        {/* Product Info */}
        <CardContent className="p-4">
          {/* Category and Subcategory */}
          <div className="space-y-1 mb-2">
            {categoryName && (
              <p className="text-xs text-gray-500">
                {String(categoryName)}
              </p>
            )}
            {subCategoryName && (
              <p className="text-xs text-gray-400 font-medium">
                {String(subCategoryName)}
              </p>
            )}
          </div>
          
          {/* Product Name */}
          <h3 className="font-medium text-sm line-clamp-2 h-10 mb-2">{String(name)}</h3>

           {/* Rating Display */}
          <div className="flex items-center gap-2 mt-2">
            {averageRating > 0 ? (
              <>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {renderStars(averageRating)}
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {averageRating}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </>
            ) : (
              <span className="text-xs text-gray-400">No reviews yet</span>
            )}
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-base text-green-700">₹{salePrice}</span>
            {originalPrice && originalPrice > salePrice && (
              <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
            )}
          </div>
          
         
                 

         
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;