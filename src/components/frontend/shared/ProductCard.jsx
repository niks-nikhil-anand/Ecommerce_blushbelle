"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const discountPercentage = product.originalPrice > 0
    ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    // Here you would implement your cart logic
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error("Add to cart error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    toast.success(`${product.name} added to wishlist`);
    // Implement wishlist functionality here
  };

  const handleProductClick = () => {
    router.push(`/product/${product._id}`);
  };

  return (
    <motion.div
      className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-in-out"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">No image</p>
          </div>
        )}

        {/* Sale Badge */}
        {product.isOnSale && discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            {discountPercentage}% OFF
          </Badge>
        )}

        {/* Quick Actions */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm p-2 flex justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isLoading || product.status === "Out of stock"}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs"
          >
            <ShoppingCart className="h-3 w-3" />
            Add to Cart
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleAddToWishlist}
            className="flex items-center justify-center bg-white/80 hover:bg-white text-green-700 rounded-full h-8 w-8 p-0"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-1 text-gray-800">
          {product.name}
        </h3>
        
        <div className="flex items-center text-xs gap-1 mt-1 text-amber-500">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          <Star className="h-3 w-3 fill-amber-500/40 text-amber-500/40" />
          <span className="text-gray-500">(4)</span>
        </div>

        <div className="flex items-center mt-2 space-x-2">
          <span className="font-semibold text-green-700">₹{product.salePrice}</span>
          {product.originalPrice > product.salePrice && (
            <span className="text-gray-400 text-xs line-through">₹{product.originalPrice}</span>
          )}
        </div>

        {product.status === "Out of stock" && (
          <p className="text-xs text-red-500 mt-1">Out of stock</p>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;