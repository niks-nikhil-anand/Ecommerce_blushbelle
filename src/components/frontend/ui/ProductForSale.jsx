"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Eye, Lock, ArrowRight, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/admin/dashboard/product/addProduct")
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the product data!", error);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (id) => {
    router.push(`/product/${id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    router.push("/auth/signIn");
  };

  const handleViewAllClick = () => {
    router.push("/products");
  };

  return (
    <div className="w-full px-4 sm:px-8 py-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Top Selling Products</h2>
        <Button 
          variant="ghost" 
          className="flex items-center text-blue-600 font-medium"
          onClick={handleViewAllClick}
        >
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Products Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="w-full overflow-hidden">
              <div className="p-6">
                <div className="flex justify-center">
                  <Skeleton className="h-40 w-40 rounded" />
                </div>
                <Skeleton className="h-4 w-3/4 mt-4" />
                <div className="flex items-center gap-2 mt-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-4 w-1/2 mt-2" />
              </div>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-x-auto pb-4 sm:overflow-visible">
          {products.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className="w-full h-full overflow-hidden cursor-pointer relative group"
                onClick={() => handleCardClick(product._id)}
              >
                {product.discount && (
                  <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 z-10">
                    {product.discount}
                  </Badge>
                )}
                
                <CardContent className="p-6">
                  <div className="relative flex justify-center mb-4">
                    <div className="w-full h-40 flex items-center justify-center">
                      <Image
                        src={product.featuredImage}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Action buttons overlay */}
                    <div className="absolute right-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-full bg-white"
                        onClick={handleWishlistClick}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-full bg-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-sm">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-base">₹{product.salePrice}</span>
                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </CardContent>
                
                {product.locked && (
                  <div className="absolute bottom-3 right-3 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCard;