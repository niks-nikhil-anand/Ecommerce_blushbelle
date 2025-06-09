"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaCheckCircle,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Loader from "@/components/loader/loader";
import RelatedProducts from "@/components/frontend/shared/ProductPage/RelatedProducts";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

// Import shadcn components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import BlogProductPage from "@/components/frontend/shared/ProductPage/BlogProductPage";
import IngredientProductPage from "@/components/frontend/shared/ProductPage/IngredientProductPage";
import BenefitsProductPage from "@/components/frontend/shared/ProductPage/BenefitsProductPage";
import VideoProductPage from "@/components/frontend/shared/ProductPage/VideoProductPage";
import FeaturesStrip from "@/components/frontend/shared/ProductPage/FeaturesStripProductPage";
import FaqsProductPage from "@/components/frontend/shared/ProductPage/FaqsProductPage";
import ReviewProductPage from "@/components/frontend/shared/ProductPage/ReviewProductPage";

const ProductDetail = () => {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [idFromURL, setIdFromURL] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("descriptions");
  const [quantity, setQuantity] = useState(1);
  const [selectedPack, setSelectedPack] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlPath = window.location.pathname;
    const id = urlPath.substring(urlPath.lastIndexOf("/") + 1);
    setIdFromURL(id);

    if (id) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 1 : prev));
      }, 10);

      axios
        .get(`/api/admin/dashboard/product/${id}`)
        .then((response) => {
          clearInterval(interval);
          console.log(response.data);
          setProduct(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
          clearInterval(interval);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!idFromURL) return; // Early return if no ID

      try {
        setError(null);

        const response = await fetch(
          `/api/admin/dashboard/review/product/${idFromURL}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(10000),
          }
        );

        if (!response.ok) {
          const statusCode = response.status;
          switch (statusCode) {
            case 404:
              throw new Error(`Product reviews not found (ID: ${idFromURL})`);
            case 401:
              throw new Error(
                "Unauthorized access. Please check your credentials."
              );
            case 403:
              throw new Error(
                "Access forbidden. You don't have permission to view this data."
              );
            case 500:
              throw new Error("Server error. Please try again later.");
            default:
              throw new Error(
                `Server error: ${response.statusText} (${statusCode})`
              );
          }
        }

        const data = await response.json();
        console.log("reviews", data);
        const reviewsData = Array.isArray(data) ? data : [];
        setReviews(reviewsData);
      } catch (error) {
        if (error.name === "AbortError" || error.name === "TimeoutError") {
          setError("Request timed out. Please try again.");
        } else if (error instanceof TypeError) {
          setError("Network error. Please check your internet connection.");
        } else {
          setError(error.message || "Failed to fetch reviews");
        }
        setReviews([]);
      }
    };

    fetchReviews();
  }, [idFromURL]);

  // Update quantity when pack is selected
  useEffect(() => {
    setQuantity(selectedPack);
  }, [selectedPack]);

  // Reset the "Added to Cart" status after 3 seconds
  useEffect(() => {
    let timer;
    if (addedToCart) {
      timer = setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [addedToCart]);

  if (loading) {
    return <Loader />;
  }

  const handleAddToCart = () => {
    const cartData = {
      id: idFromURL,
      quantity: quantity,
      selectedPack: selectedPack,
    };

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
      (item) => item.id === idFromURL
    );

    if (existingProductIndex !== -1) {
      // If the product is already in the cart, update its quantity
      existingCart[existingProductIndex].quantity += quantity;
    } else {
      // If the product is not in the cart, add it
      existingCart.push(cartData);
    }

    // Update the cart in localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Show the "Added to Cart" message instead of redirecting
    setAddedToCart(true);
  };

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  // Pack selection handler
  const handlePackSelection = (packNumber) => {
    setSelectedPack(packNumber);
  };

  if (!product) {
    return <div>Product not found.</div>;
  }

  const { name, images, salePrice, originalPrice, ratings, productHighlights } =
    product;

  const averageRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((acc, review) => acc + (review.rating || 0), 0) /
            reviews.length) *
            10
        ) / 10
      : 0;
  const currentImage = images[currentImageIndex];

  const percentageOff = ((originalPrice - salePrice) / originalPrice) * 100;

  // Calculate prices for different packs
  const getPackPrice = (packQuantity) => {
    const basePrice = salePrice * packQuantity;
    // Add discount for larger packs
    if (packQuantity === 2) {
      return Math.round(basePrice * 0.95); // 5% discount for 2-month pack
    } else if (packQuantity === 3) {
      return Math.round(basePrice * 0.9); // 10% discount for 3-month pack
    }
    return basePrice;
  };

  const getPackOriginalPrice = (packQuantity) => {
    return originalPrice * packQuantity;
  };

  const ShareButtons = ({ url, title }) => {
    return (
      <div className="flex space-x-4">
        <FacebookShareButton url={url} quote={title}>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors">
            <FaFacebook size={16} className="text-blue-600" />
          </div>
        </FacebookShareButton>

        <TwitterShareButton url={url} title={title}>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors">
            <FaTwitter size={16} className="text-blue-400" />
          </div>
        </TwitterShareButton>

        <WhatsappShareButton url={url} title={title} separator=" - ">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 transition-colors">
            <FaWhatsapp size={16} className="text-green-500" />
          </div>
        </WhatsappShareButton>
      </div>
    );
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="overflow-hidden border-none shadow-md">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Left: Product Images */}
              <div className="w-full lg:w-1/2 bg-gray-50 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Thumbnails */}
                  <div className="hidden md:flex flex-col gap-4 w-24">
                    {images.map((image, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full aspect-square rounded-lg overflow-hidden border-2 cursor-pointer ${
                          currentImageIndex === index
                            ? "border-green-500"
                            : "border-gray-200"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <Image
                          src={image}
                          alt={`Product thumbnail ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-contain"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Main Image */}
                  <div className="flex-1 relative">
                    <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
                      <motion.div className="w-full h-full flex items-center justify-center cursor-pointer">
                        <Image
                          src={currentImage}
                          alt={name}
                          width={500}
                          height={500}
                          className="object-contain w-full h-full p-4"
                        />
                      </motion.div>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex justify-center mt-4 md:hidden">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {images.map((image, index) => (
                            <CarouselItem key={index} className="basis-1/4">
                              <div
                                className={`aspect-square rounded-md overflow-hidden border-2 ${
                                  currentImageIndex === index
                                    ? "border-green-500"
                                    : "border-gray-200"
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                              >
                                <Image
                                  src={image}
                                  alt={`Thumbnail ${index + 1}`}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                      </Carousel>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Product Info */}
              <div className="w-full lg:w-1/2 p-6 lg:p-8">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        {product.name}
                      </h1>
                      <Badge
                        variant={product.stock > 0 ? "success" : "destructive"}
                        className="text-xs"
                      >
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(averageRating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {averageRating} ({reviews.length}{" "}
                        {reviews.length === 1 ? "review" : "reviews"})
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-green-600">
                      ₹{getPackPrice(selectedPack) * quantity}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400 line-through">
                        ₹{getPackOriginalPrice(selectedPack) * quantity}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-red-500 border-red-200 bg-red-50"
                      >
                        {Math.round(
                          ((getPackOriginalPrice(selectedPack) -
                            getPackPrice(selectedPack)) /
                            getPackOriginalPrice(selectedPack)) *
                            100
                        )}
                        % Off
                      </Badge>
                    </div>
                  </div>
                  <Separator />

                  <div>
                    <p className="text-gray-700">
                      {product.purpose.length > 150
                        ? `${product.purpose.substring(0, 150)}...`
                        : product.purpose}
                    </p>
                  </div>

                  {/* Product Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {productHighlights &&
                      productHighlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="text-green-500">
                            <FaCheckCircle size={16} />
                          </div>
                          <span className="text-sm text-gray-700">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    {!productHighlights && (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="text-green-500">
                            <FaCheckCircle size={16} />
                          </div>
                          <span className="text-sm text-gray-700">
                            100% Natural Ingredients
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-green-500">
                            <FaCheckCircle size={16} />
                          </div>
                          <span className="text-sm text-gray-700">
                            Clinically Tested
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  {/* Pack Selection */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Choose Your Pack
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[1, 2, 3].map((packNumber) => {
                        const packPrice = getPackPrice(packNumber);
                        const packOriginalPrice =
                          getPackOriginalPrice(packNumber);
                        const packDiscount = Math.round(
                          ((packOriginalPrice - packPrice) /
                            packOriginalPrice) *
                            100
                        );
                        const isSelected = selectedPack === packNumber;
                        const isPopular = packNumber === 2;

                        return (
                          <motion.div
                            key={packNumber}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                              isSelected
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 bg-white hover:border-green-300"
                            }`}
                            onClick={() => handlePackSelection(packNumber)}
                          >
                            {isPopular && (
                              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                <Badge className="bg-orange-500 text-white text-xs px-2 py-1">
                                  Popular
                                </Badge>
                              </div>
                            )}

                            <div className="text-center space-y-2">
                              <h5 className="font-semibold text-gray-800">
                                {packNumber} Month Pack
                              </h5>
                              <div className="">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                  <span className="text-2xl font-bold text-green-600">
                                    ₹{packPrice}
                                  </span>
                                  <span className="text-lg text-gray-500 line-through">
                                    ₹{packOriginalPrice}
                                  </span>{" "}
                                </div>

                                <Badge
                                  variant="outline"
                                  className="text-xs text-red-500 border-red-200"
                                >
                                  {packDiscount}% Off
                                </Badge>
                              </div>

                              {packNumber > 1 && (
                                <div className="text-xs text-green-600 font-medium">
                                  Save ₹{packOriginalPrice - packPrice}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Quantity and Add to Cart */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 mr-3">
                        Quantity:
                      </span>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={decreaseQuantity}
                          className="h-8 w-8 rounded-none"
                        >
                          <AiOutlineMinus size={14} />
                        </Button>
                        <span className="w-10 text-center text-sm">
                          {quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={increaseQuantity}
                          className="h-8 w-8 rounded-none"
                        >
                          <AiOutlinePlus size={14} />
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleAddToCart}
                        variant="outline"
                        className={`${
                          addedToCart
                            ? "border-green-600 text-green-700 bg-green-50"
                            : "border-green-600 text-green-600 hover:bg-green-50"
                        } rounded-full px-6 transition-colors w-full`}
                        disabled={addedToCart}
                      >
                        {addedToCart ? "Added to Cart" : "Add to Cart"}
                      </Button>

                      <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 transition-colors w-full">
                        Buy Now
                      </Button>
                    </div>
                  </div>

                  {/* Categories & Tags */}
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-wrap gap-1">
                      <span className="text-gray-700 font-medium">
                        Category:
                      </span>
                      <Badge variant="secondary" className="font-normal">
                        {product.category?.name || "Supplements"}
                      </Badge>
                    </div>
                  </div>

                  {/* Share */}
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 font-medium mr-3">
                      Share:
                    </span>
                    <ShareButtons url={window.location.href} title={name} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Tabs defaultValue="descriptions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:p-5 p-2 gap-1">
              <TabsTrigger
                value="descriptions"
                className="text-xs sm:text-sm md:text-base px-1 py-1.5"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="text-xs sm:text-sm md:text-base px-1 py-1.5"
              >
                Specifications
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="descriptions"
              className="mt-6 bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                  <div className="prose max-w-none">
                    <div
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <div className="rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={product.descriptionImage || product.featuredImage}
                      alt="Product description"
                      width={500}
                      height={350}
                      className="w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="specifications"
              className="mt-6 bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">
                  Product Specifications
                </h3>

                <div className="grid grid-cols-1 gap-y-4">
                  <div className="border-b pb-2">
                    <div className="text-sm font-medium text-gray-500">
                      Purpose
                    </div>
                    <div>{product.purpose}</div>
                  </div>

                  <div className="border-b pb-2">
                    <div className="text-sm font-medium text-gray-500">
                      Suggested Use
                    </div>
                    <div>{product.suggestedUse}</div>
                  </div>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.additionalInfo && (
                  <div>
                    <h4 className=" mb-2 font-bold">Additional Information</h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.additionalInfo,
                      }}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div>
        <div className="">
          <FeaturesStrip />
        </div>
        <div className="">
          <VideoProductPage />
        </div>
        <div className="mt-16">
          <BenefitsProductPage />
          <div className="flex justify-center ">
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-12 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Buy Now
            </Button>
          </div>
        </div>
        <div className="mt-16">
          <IngredientProductPage />
        </div>
        <div className="mt-16">
          <FaqsProductPage />
        </div>
        <div className="mt-16">
          <BlogProductPage />
        </div>
        <div className="mt-16">
          <ReviewProductPage reviews={reviews} />
        </div>

        {/* Related Sections */}
        <div className="mt-16">
          <RelatedProducts />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
