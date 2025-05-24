"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

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
      </CardContent>
    </Card>
  );
};

const ProductCard = ({ product, isLoading = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  // If in loading state, show skeleton
  if (isLoading) {
    return <ProductCardSkeleton />;
  }

  const handleProductClick = () => {
    // Ensure product._id is a string before using it
    const productId = product?._id?.toString() || "";
    if (productId) {
      router.push(`/product/${productId}`);
    }
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    
    // Use product.name as a string, not an object
    const productName = typeof product?.name === 'string' ? product.name : 'Product';
    
    switch (action) {
      case "wishlist":
        toast.success(`${productName} added to your wishlist`, {
          icon: '❤️',
          duration: 2000,
        });
        break;
      case "quickview":
        // Implement quick view functionality
        toast.success(`Quick view for ${productName}`, {
          icon: '👁️',
          duration: 2000,
        });
        break;
      case "cart":
        toast.success(`${productName} added to your cart`, {
          icon: '🛒',
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

  // Safely access product properties with fallbacks
  const {
    name = "",
    category = null,
    subCategory = null,
    featuredImage = "",
    rating = 0,
    reviewCount = 0,
    salePrice = 0,
    originalPrice = 0,
    stockStatus = "",
    tags = []
  } = product || {};

  // Safe access to category and subcategory names
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
          
          {/* 3D Action buttons with enhanced styling */}
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
              className="h-10 w-10 rounded-full bg-white   hover:border-blue-200 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-2"
              style={{
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                boxShadow: '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff'
              }}
              onClick={(e) => handleActionClick(e, "quickview")}
            >
              <Eye className="h-4 w-4 drop-shadow-sm" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full bg-white hover:bg-green-50 hover:text-green-600 hover:border-green-200 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-2"
              style={{
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                boxShadow: '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff'
              }}
              onClick={(e) => handleActionClick(e, "cart")}
            >
              <ShoppingCart className="h-4 w-4 drop-shadow-sm" />
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
          
          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-base text-green-700">₹{salePrice}</span>
            {originalPrice && originalPrice > salePrice && (
              <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
            )}
          </div>
          
          {/* Rating (if available) */}
          {rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.floor(rating))}
                {'☆'.repeat(5 - Math.floor(rating))}
              </div>
              <span className="text-xs text-gray-500">
                ({reviewCount || 0})
              </span>
            </div>
          )}
          
          {/* Stock Status */}
          {stockStatus && (
            <p className={cn(
              "text-xs mt-1",
              stockStatus === "In Stock" ? "text-green-600" : "text-red-500"
            )}>
              {String(stockStatus)}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;