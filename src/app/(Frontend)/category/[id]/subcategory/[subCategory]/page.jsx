"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";

// Import shadcn components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const ProductRoute = () => {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCartItems, setAddedToCartItems] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.info("[Products Fetch] Starting fetch...");
        console.log(params);

        // Replace hyphens with spaces for decoding slugs
        const category = params?.id?.replace(/-/g, " ");
        const subcategory = params?.subCategory?.replace(/-/g, " ");

        console.debug("[Params] Category:", category);
        console.debug("[Params] Subcategory:", subcategory);

        if (!category || !subcategory) {
          console.error("[Params] Missing category or subcategory.");
          return;
        }

        const apiUrl = `/api/categories/${category}/products/${subcategory}`;
        console.info("[API Request] GET", apiUrl);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          console.error("[API Response] Failed with status:", response.status);
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        console.log(data.products);
        console.info("[API Response] Fetched products:", data);

        setProducts(data.products);
      } catch (err) {
        console.error("[Fetch Error]", err.message);
        setError(err.message);
      } finally {
        console.info("[Products Fetch] Done.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params]);

  const handleCardClick = (id) => {
    if (id) {
      router.push(`/product/${id}`);
    } else {
      console.warn("Product ID is undefined");
    }
  };

  // Handle adding product to cart
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent navigating to product detail page
    
    if (!product?._id) return;
    
    const productId = product._id;
    
    // Update the addedToCartItems state
    setAddedToCartItems(prev => ({
      ...prev,
      [productId]: true
    }));
    
    // Retrieve the existing cart from localStorage
    let existingCart = localStorage.getItem("cart");

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
    const existingProductIndex = existingCart.findIndex(
      (item) => item.id === productId
    );

    // Create a cart item with relevant product data
    const cartItem = {
      id: productId,
      name: product.name,
      sku: product.sku,
      price: product.salePrice,
      image: product.featuredImage,
      quantity: 1,
      stock: product.stock
    };

    if (existingProductIndex !== -1) {
      // If the product is already in the cart, update its quantity
      existingCart[existingProductIndex].quantity += 1;
    } else {
      // If the product is not in the cart, add it
      existingCart.push(cartItem);
    }

    // Update the cart in localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    // Reset the button after 3 seconds
    setTimeout(() => {
      setAddedToCartItems(prev => ({
        ...prev,
        [productId]: false
      }));
    }, 3000);
  };

  // Product card component
  const ProductCard = ({ product }) => {
    // Safeguard for product being undefined
    if (!product || typeof product !== 'object') return null;
    
    // Safely extract values with fallbacks
    const name = typeof product.name === 'string' ? product.name : "Unnamed Product";
    const productId = product._id || "";
    const featuredImage = typeof product.featuredImage === 'string' ? product.featuredImage : "";
    const categoryName = product.category?.name || "";
    const sku = product.sku || "";
    
    // Safely handle numerical values
    const originalPrice = product.originalPrice || 0;
    const salePrice = product.salePrice || 0;
    const stock = product.stock || 0;
    
    // Calculate discount safely
    const discount = originalPrice > 0 && originalPrice > salePrice ? 
      Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

    // Status indicators
    const isOutOfStock = stock <= 0 || product.status === "Out of stock";
    const isActive = product.status === "Active";
    
    // Check if this product is currently in "added to cart" state
    const isAddedToCart = addedToCartItems[productId] === true;

    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="h-full overflow-hidden group cursor-pointer border-2 hover:border-indigo-500">
          <div onClick={() => handleCardClick(productId)} className="h-full flex flex-col">
            {/* Discount badge */}
            {discount > 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                {discount}% OFF
              </Badge>
            )}

            {/* Product Image */}
            <div className="relative h-48 overflow-hidden bg-gray-50">
              {featuredImage ? (
                <img
                  src={featuredImage}
                  alt={name}
                  className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/400/320";
                    e.target.alt = "Product image placeholder";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              
              {/* Status badges */}
              <div className="absolute bottom-2 left-2 flex gap-2">
                {isOutOfStock && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">
                    Out of Stock
                  </Badge>
                )}
                {product.isOnSale && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                    On Sale
                  </Badge>
                )}
              </div>
            </div>

            <CardHeader className="p-4 pb-0">
              <div className="flex flex-col">
                <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
                <span className="text-xs text-gray-500">SKU: {sku}</span>
              </div>
            </CardHeader>

            <CardContent className="p-4 flex-grow">
              {/* Price Section */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-black">
                  ₹{salePrice.toFixed(2)}
                </span>
                {originalPrice > salePrice && (
                  <span className="text-sm font-medium text-gray-500 line-through">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Category & Stock */}
              <div className="flex flex-wrap gap-2 mt-2">
                {categoryName && (
                  <Badge variant="outline" className="text-xs">
                    {categoryName}
                  </Badge>
                )}
              </div>              
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
              <Button
                variant="outline"
                size="sm"
                className={`w-full transition-colors duration-300 ${
                  isAddedToCart 
                    ? "bg-green-600 hover:bg-green-700 text-white border-green-500" 
                    : isOutOfStock
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white"
                }`}
                onClick={(e) => handleAddToCart(e, product)}
                disabled={isAddedToCart || isOutOfStock}
              >
                {isAddedToCart ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Added to Cart
                  </>
                ) : isOutOfStock ? (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Out of Stock
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </>
                )}
              </Button>
            </CardFooter>
          </div>
        </Card>
      </motion.div>
    );
  };

  // Loading skeleton for product cards
  const ProductCardSkeleton = () => (
    <Card className="h-full">
      <div className="h-48 relative">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="p-4 pb-0">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-1/3 mt-1" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-1/2 mt-2" />
        <div className="flex mt-2 gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 min-h-[90vh]">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(9)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 min-h-[90vh]">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 min-h-[90vh]">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {params.subCategory?.replace(/-/g, " ")} Products
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">We couldn't find any products in this category.</p>
        </div>
      )}
    </div>
  );
};

export default ProductRoute;