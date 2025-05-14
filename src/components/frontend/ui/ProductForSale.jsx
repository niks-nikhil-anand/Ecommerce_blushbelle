"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "react-hot-toast";
import ProductCard from "./ProductCard";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/dashboard/product/addProduct");

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      if (Array.isArray(data)) {
        setProducts(data);
        setError(null);
      } else {
        throw new Error("Invalid product data format");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleViewAllClick = () => {
    router.push("/product/shopAllProducts");
  };

  const handleRetryClick = () => {
    fetchProducts();
  };

  return (
    <div className="w-full px-4 sm:px-8 py-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-green-800">Featured Products</h2>
          <p className="text-sm text-gray-500 mt-1">Discover our most loved Ayurvedic products</p>
        </div>
        <Button
          variant="ghost"
          className="flex items-center text-green-600 font-medium"
          onClick={handleViewAllClick}
        >
          View All
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
              <Skeleton className="h-48 w-full rounded-md mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-2">No products found at the moment</p>
          <p className="text-gray-400 text-sm mb-4">Check back later for our amazing products</p>
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProductSection;