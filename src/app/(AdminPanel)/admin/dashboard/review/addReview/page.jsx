"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
  MessageSquare,
  Star,
  User,
  Mail,
  Package,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const ReviewFormComponent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    reviewTitle: "",
    review: "",
    product: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setFetchingProducts(true);
      try {
        const response = await fetch("/api/admin/dashboard/product/addProduct");
        const data = await response.json();
        console.log("Fetched products data:", data);

        if (Array.isArray(data)) {
          // Properly sanitize products based on actual data structure
          const sanitizedProducts = data.map((product) => ({
            ...product,
            name: product.name ? String(product.name) : "Unnamed Product",
            category: {
              _id: product.category?._id || "",
              name: product.category?.name || "Uncategorized"
            },
            _id: product._id ? String(product._id) : "",
            featuredImage: product.featuredImage ? String(product.featuredImage) : "",
            salePrice: product.salePrice || 0,
            originalPrice: product.originalPrice || 0,
            sku: product.sku || "",
            stock: product.stock || 0,
            status: product.status || "Active"
          }));

          setProducts(sanitizedProducts);
          setFilteredProducts(sanitizedProducts);

          // Extract unique categories from the nested structure
          const categories = [
            ...new Set(
              sanitizedProducts.map(
                (product) => product.category?.name || "Uncategorized"
              )
            ),
          ];
          setProductCategories(categories);
          
          console.log("Processed products:", sanitizedProducts);
          console.log("Available categories:", categories);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setFetchingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search term and category
  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category?.name === selectedCategory
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductSelect = (productId) => {
    setFormData({ ...formData, product: productId });
  };

  const handleRatingChange = (newRating) => {
    setFormData({ ...formData, rating: newRating });
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      rating: 5,
      reviewTitle: "",
      review: "",
      product: "",
    });
    setCurrentStep(1);
    setSearchTerm("");
    setSelectedCategory("all");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/dashboard/review/addReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      // Success - show success toast and reset form
      toast.success("Your review has been successfully submitted!");
      resetForm();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        "There was an error submitting your review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely get category text
  const getCategoryText = (product) => {
    if (product?.category?.name) {
      return product.category.name;
    }
    return "Uncategorized";
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isStep1Valid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.reviewTitle.trim() &&
    formData.review.trim();

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-gray-100 py-3">
      <div className="w-full">
        <div className="w-full">
          {/* Step 1: Review Information */}
          {currentStep === 1 && (
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3 text-gray-900">
                  <MessageSquare className="text-blue-600 w-6 h-6" />
                  Review Management - Review Information
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Share your experience and feedback to help others make better
                  purchasing decisions.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Name Field */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <User className="text-green-500 w-4 h-4" />
                      Your Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name (e.g., John Smith)"
                      className="h-12 text-base w-full"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Mail className="text-blue-500 w-4 h-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com (kept private)"
                      className="h-12 text-base w-full"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Rating Field */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Star className="text-yellow-500 w-4 h-4" />
                      Your Rating *
                    </Label>
                    <div className="flex gap-1 p-4 border rounded-lg bg-gray-50">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.div
                          key={star}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaStar
                            size={32}
                            onClick={() => handleRatingChange(star)}
                            color={
                              star <= formData.rating ? "#FFB800" : "#e4e5e9"
                            }
                            className="cursor-pointer transition-colors duration-200"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Review Title Field */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="reviewTitle"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Check className="text-purple-500 w-4 h-4" />
                      Review Title *
                    </Label>
                    <Input
                      id="reviewTitle"
                      name="reviewTitle"
                      value={formData.reviewTitle}
                      onChange={handleChange}
                      placeholder="Summarize your experience in a few words"
                      className="h-12 text-base w-full"
                      required
                    />
                  </div>
                </div>

                {/* Review Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="review"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <MessageSquare className="text-indigo-500 w-4 h-4" />
                    Your Detailed Review *
                  </Label>
                  <Textarea
                    id="review"
                    name="review"
                    value={formData.review}
                    onChange={handleChange}
                    placeholder="Share your experience with this product. What did you like or dislike? What would you want other customers to know?"
                    className="min-h-[140px] text-base resize-none w-full"
                    required
                  />
                </div>

                {/* Navigation */}
                <div className="flex justify-end pt-8 border-t">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep1Valid}
                    className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 text-base flex items-center gap-2 disabled:opacity-50"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Product Selection */}
          {currentStep === 2 && (
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3 text-gray-900">
                  <Package className="text-indigo-600 w-6 h-6" />
                  Review Management - Product Selection
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Select the product you want to review. Choose from our
                  available products below.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Selected Product Summary */}
                {formData.product && (
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Selected Product
                    </h4>
                    <div className="flex items-center gap-4">
                      {(() => {
                        const selectedProduct = products.find(
                          (p) => p._id === formData.product
                        );
                        return selectedProduct ? (
                          <>
                            {selectedProduct.featuredImage && (
                              <img
                                src={selectedProduct.featuredImage}
                                alt={selectedProduct.name}
                                className="w-16 h-16 object-cover rounded-md border"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/api/placeholder/64/64";
                                }}
                              />
                            )}
                            <div className="flex-1">
                              <h5 className="font-medium text-green-800 text-lg mb-1">
                                {selectedProduct.name}
                              </h5>
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-green-100 text-green-800 px-3 py-1">
                                  {getCategoryText(selectedProduct)}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                  SKU: {selectedProduct.sku}
                                </span>
                              </div>
                             
                            </div>
                          </>
                        ) : null;
                      })()}
                    </div>
                  </div>
                )}

                {/* Product Selection */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Package className="text-indigo-500 w-4 h-4" />
                    Select Product to Review *
                  </Label>

                  {/* Search and Filter Controls */}
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-12 text-base bg-white"
                          />
                        </div>
                      </div>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="w-48 h-12 bg-white">
                          <SelectValue placeholder="Filter by Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {productCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {fetchingProducts ? (
                      <div className="text-center py-12">
                        <Loader2 className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">
                          Loading products...
                        </p>
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg">
                          No products found
                        </p>
                        <p className="text-gray-400 mt-2">
                          {searchTerm || selectedCategory !== "all"
                            ? "Try adjusting your search or filter"
                            : "No products are available at the moment"}
                        </p>
                      </div>
                    ) : (
                      <ScrollArea className="h-96 w-full rounded-xl border bg-white">
                        <div className="p-4 grid gap-4">
                          {filteredProducts.map((product) => {
                            const productId = String(product._id || "");
                            const productName = String(
                              product.name || "Unnamed Product"
                            );
                            const productCategory = getCategoryText(product);
                            const productImage = String(product.featuredImage || "");

                            return (
                              <motion.div
                                key={productId}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div
                                  onClick={() => handleProductSelect(productId)}
                                  className={`p-4 rounded-lg cursor-pointer transition-all border ${
                                    formData.product === productId
                                      ? "border-2 border-blue-500 bg-blue-50 shadow-md"
                                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    {productImage && (
                                      <div className="w-20 h-20 rounded-md overflow-hidden  flex-shrink-0 border">
                                        <img
                                          src={productImage}
                                          alt={productName}
                                          className="object-contain w-full h-full"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/api/placeholder/80/80";
                                          }}
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-medium text-gray-900 mb-2 text-base">
                                        {productName}
                                      </h3>
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge
                                          variant="outline"
                                          className="text-xs bg-gray-100"
                                        >
                                          {productCategory}
                                        </Badge>
                                        <span className="text-xs text-gray-500">
                                          SKU: {product.sku}
                                        </span>
                                      </div>
                                    
                                    </div>
                                    {formData.product === productId && (
                                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-8 border-t">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="px-10 py-3 text-base flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !formData.product}
                    className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 text-base flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Submit Review
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewFormComponent;