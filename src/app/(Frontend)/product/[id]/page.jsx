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
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineClose,
} from "react-icons/ai";
import Loader from "@/components/loader/loader";
import ReviewProductPage from "@/components/frontend/ui/ReviewProductPage";
import RelatedBlogs from "@/components/frontend/ui/RelatedBlogs";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BlogProductPage from "@/components/frontend/shared/ProductPage/BlogProductPage";
import IngredientProductPage from "@/components/frontend/shared/ProductPage/IngredientProductPage";
import BenefitsProductPage from "@/components/frontend/shared/ProductPage/BenefitsProductPage";
import VideoProductPage from "@/components/frontend/shared/ProductPage/VideoProductPage";
import FeaturesStrip from "@/components/frontend/shared/ProductPage/FeaturesStripProductPage";
import FaqsProductPage from "@/components/frontend/shared/ProductPage/FaqsProductPage";

const ProductDetail = () => {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [idFromURL, setIdFromURL] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("descriptions");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % product.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.images.length) % product.images.length
    );
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (!product) {
    return <div>Product not found.</div>;
  }

  const {
    name,
    description,
    images,
    salePrice,
    originalPrice,
    featuredImage,
    ratings,
    descriptionImage,
    servingPerBottle,
    suggestedUse,
    ingredients,
    productHighlights,
  } = product;

  const averageRating = ratings?.average || 4.2;
  const currentImage = images[currentImageIndex];
  const percentageOff = ((originalPrice - salePrice) / originalPrice) * 100;

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
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 relative">
                  <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
                    <motion.div
                      className="w-full h-full flex items-center justify-center cursor-pointer"
                      onClick={toggleFullScreen}
                    >
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
                                className="w-full h-full object-cover"
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
                      {name}
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
                      {averageRating} ({ratings?.count || 42} reviews)
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-green-600">
                    ₹{salePrice}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400 line-through">
                      ₹{originalPrice}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-red-500 border-red-200 bg-red-50"
                    >
                      {Math.round(percentageOff)}% Off
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Short Description */}
                <div>
                  <p className="text-gray-700">
                    Brain Bite is a powerful supplement designed to boost
                    cognitive function, memory, and focus. Made with natural
                    ingredients.
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
                      <div className="flex items-center gap-2">
                        <div className="text-green-500">
                          <FaCheckCircle size={16} />
                        </div>
                        <span className="text-sm text-gray-700">
                          Improves Focus
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-green-500">
                          <FaCheckCircle size={16} />
                        </div>
                        <span className="text-sm text-gray-700">
                          Enhances Memory
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                {/* Quantity and Add to Cart */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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

                  <Button
                    onClick={handleAddToCart}
                    className={`${
                      addedToCart
                        ? "bg-green-700 hover:bg-green-800"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white rounded-full px-8 transition-colors`}
                    disabled={addedToCart}
                  >
                    {addedToCart ? "Added to Cart" : "Add to Cart"}
                  </Button>
                </div>

                {/* Categories & Tags */}
                <div className="space-y-2 text-sm">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-gray-700 font-medium">Category:</span>
                    <Badge variant="secondary" className="font-normal">
                      {product.category?.name || "Supplements"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-gray-700 font-medium">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {product.tags?.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gray-50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
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

      {/* Tabs Section */}
      <div className="mt-8">
        <Tabs defaultValue="descriptions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:p-5 p-2 gap-1">
            <TabsTrigger
              value="descriptions"
              className="text-xs sm:text-sm md:text-base px-1 py-1.5"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="additionalInfo"
              className="text-xs sm:text-sm md:text-base px-1 py-1.5"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="text-xs sm:text-sm md:text-base px-1 py-1.5"
            >
               Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="descriptions"
            className="mt-6 bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              </div>

              <div className="lg:w-1/2">
                <div className="rounded-xl overflow-hidden shadow-md">
                  <Image
                    src={product.descriptionImage || currentImage}
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
            value="additionalInfo"
            className="mt-6 bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Product Specifications</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div className="border-b pb-2">
                  <div className="text-sm font-medium text-gray-500">
                    Serving Size
                  </div>
                  <div>{servingPerBottle || "1 capsule daily"}</div>
                </div>

                <div className="border-b pb-2">
                  <div className="text-sm font-medium text-gray-500">
                    Bottle Contains
                  </div>
                  <div>60 capsules (2 month supply)</div>
                </div>

                <div className="border-b pb-2">
                  <div className="text-sm font-medium text-gray-500">
                    Suggested Use
                  </div>
                  <div>{suggestedUse || "Take 1 capsule daily with food"}</div>
                </div>

                <div className="border-b pb-2">
                  <div className="text-sm font-medium text-gray-500">
                    Storage
                  </div>
                  <div>Store in a cool, dry place</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Ingredients</h4>
                <p className="text-sm text-gray-700">
                  {ingredients ||
                    "Bacopa Monnieri, Ginkgo Biloba, Lion's Mane Mushroom, Phosphatidylserine, Vitamin B Complex"}
                </p>
              </div>

              <div
                dangerouslySetInnerHTML={{
                  __html: product.additionalInfo || "",
                }}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="reviews"
            className="mt-6 bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-600">
                      {averageRating}
                    </div>
                    <div className="flex justify-center my-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${
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
                    <div className="text-sm text-gray-500">
                      Based on {ratings?.count || 42} reviews
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <div className="w-12 text-sm text-gray-600">
                          {rating} star
                        </div>
                        <div className="flex-1 mx-2">
                          <Progress
                            value={
                              rating === 5
                                ? 70
                                : rating === 4
                                ? 20
                                : rating === 3
                                ? 7
                                : rating === 2
                                ? 2
                                : 1
                            }
                            className="h-2"
                          />
                        </div>
                        <div className="w-8 text-xs text-gray-500 text-right">
                          {rating === 5
                            ? "70%"
                            : rating === 4
                            ? "20%"
                            : rating === 3
                            ? "7%"
                            : rating === 2
                            ? "2%"
                            : "1%"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:w-2/3 flex-1">
                  <ReviewProductPage />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fullscreen Image Modal */}
      {isFullScreen && (
        <Sheet open={isFullScreen} onOpenChange={setIsFullScreen}>
          <SheetContent
            side="center"
            className="w-screen h-screen flex items-center justify-center bg-black bg-opacity-90 p-0 max-w-full sm:max-w-full"
          >
            <SheetHeader className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullScreen}
                className="text-white hover:bg-white/20"
              >
                <AiOutlineClose size={24} />
              </Button>
            </SheetHeader>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={currentImage}
                alt={name}
                width={1200}
                height={1200}
                className="object-contain max-h-full max-w-full"
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={prevImage}
                className="absolute left-4 text-white hover:bg-white/20 rounded-full"
              >
                <AiOutlineLeft size={24} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextImage}
                className="absolute right-4 text-white hover:bg-white/20 rounded-full"
              >
                <AiOutlineRight size={24} />
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
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

      {/* Related Sections */}
      <div className="mt-16">
        <RelatedProducts />
      </div>
    </div>

    </div>
  );
};

export default ProductDetail;
