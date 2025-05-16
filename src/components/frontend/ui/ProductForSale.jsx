"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";

const FeaturedProductSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      // This endpoint should be specifically for featured products
      const response = await fetch("/api/admin/dashboard/product/addProduct");

      if (!response.ok) throw new Error("Failed to fetch featured products");

      const data = await response.json();

      if (Array.isArray(data)) {
        setFeaturedProducts(data);
        setError(null);
      } else {
        throw new Error("Invalid product data format");
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
      setError("Failed to load featured products. Please try again.");
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const handleViewAllClick = () => {
    router.push("/product/shopAllProducts");
  };

  const handleRetryClick = () => {
    fetchFeaturedProducts();
  };

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="w-full  py-12 px-4 sm:px-8">
      {/* Section Header  bg-gradient-to-b from-green-50 to-white */}
      <div className="mx-auto">
        <div className="flex items-center mb-2">
          <Leaf className="h-5 w-5 text-green-600 mr-2" />
          <h4 className="text-sm font-medium uppercase tracking-wider text-green-600">Ayurvedic Excellence</h4>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Featured Products</h2>
          </div>
          <Button
            variant="outline"
            className="mt-4 sm:mt-0 border-green-600 text-green-600 hover:bg-green-50 flex items-center"
            onClick={handleViewAllClick}
          >
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleRetryClick}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="w-full">
                <Skeleton className="h-56 w-full rounded-md mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg mb-2">No featured products available at the moment</p>
            <p className="text-gray-400 text-sm mb-4">Check back later for our special featured products</p>
            <Button
              variant="outline"
              size="sm"
              className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
              onClick={handleRetryClick}
            >
              Refresh
            </Button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product._id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductSection;