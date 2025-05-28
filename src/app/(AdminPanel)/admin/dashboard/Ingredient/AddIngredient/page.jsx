"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Leaf,
  TestTube,
  Globe,
  Package,
  ArrowRight,
  ArrowLeft,
  Check,
  Info,
  Loader2,
  Upload,
  Camera,
  CheckCircle,
} from "lucide-react";

const AdminIngredientForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    benefits: "",
    facts: "",
    origin: "",
    chemistryName: "",
    image: "",
    product: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setFetchingProducts(true);
      try {
        const response = await fetch("/api/admin/dashboard/product/addProduct");
        const data = await response.json();

        console.log(data);
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Set empty array on error
        setProducts([]);
      } finally {
        setFetchingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // If changing image URL, update preview
    if (field === "image") {
      setImagePreview(value);
      setImageFile(null);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("Image file size must be less than 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageFile(file);

      // Simulate image upload to server
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would upload to your server/cloud storage here
      // const uploadedUrl = await uploadImageToServer(file);
      const mockUploadedUrl = `https://example.com/uploads/${file.name}`;

      setFormData((prev) => ({
        ...prev,
        image: mockUploadedUrl,
      }));
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
      setImagePreview("");
      setImageFile(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setImageFile(null);
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.includes(productId);

      if (isSelected) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
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
      benefits: "",
      facts: "",
      origin: "",
      chemistryName: "",
      image: "",
      product: [],
    });
    setSelectedProducts([]);
    setImagePreview("");
    setImageFile(null);
    setCurrentStep(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        alert("Ingredient name is required");
        return;
      }
      if (!formData.benefits.trim()) {
        alert("Benefits description is required");
        return;
      }
      if (!imageFile) {
        alert("Ingredient image is required");
        return;
      }

      // Create FormData object for multipart form submission
      const submitData = new FormData();

      // Add all form fields
      submitData.append("name", formData.name);
      submitData.append("benefits", formData.benefits);
      submitData.append("facts", formData.facts || "");
      submitData.append("origin", formData.origin || "");
      submitData.append("chemistryName", formData.chemistryName || "");

      // Add the image file
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      // Add selected products as JSON string
      if (selectedProducts.length > 0) {
        submitData.append("products", JSON.stringify(selectedProducts));
      }

      console.log("Submitting ingredient data...");

      // Make API call to create ingredient
      const response = await fetch("/api/admin/dashboard/ingredient", {
        method: "POST",
        body: submitData, // FormData doesn't need Content-Type header
      });

      // Check if the response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.msg ||
            errorData.message ||
            `Failed to create ingredient: ${response.status} ${response.statusText}`
        );
      }

      // Parse the successful response
      const result = await response.json();
      console.log("Ingredient created successfully:", result);

      // Show success message
      setShowSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);

      // Show user-friendly error message
      const errorMessage =
        error.message || "Failed to create ingredient. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to safely get category/subcategory text
  const getCategoryText = (product) => {
    if (product?.category) {
      return typeof product.category === "string"
        ? product.category
        : product.category?.name || "Category";
    }
    if (product?.subCategory) {
      return typeof product.subCategory === "string"
        ? product.subCategory
        : product.subCategory?.name || "Subcategory";
    }
    return "Uncategorized";
  };

  const isStep1Valid =
    formData.name.trim() && formData.benefits.trim() && imageFile;

  // Success Message Component
  if (showSuccess) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-50 to-gray-100 p-6">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ingredient Added Successfully!
            </h3>
            <p className="text-gray-600">
              "{formData.name}" has been created and added to the system.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="w-full">
        <div className="w-full">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3 text-gray-900">
                  <Leaf className="text-blue-600 w-6 h-6" />
                  Ingredient Management - Basic Information
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Enter the fundamental details about the ingredient including
                  its name, benefits, and core properties.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Name Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Leaf className="text-green-500 w-4 h-4" />
                    Ingredient Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter ingredient name (e.g., Turmeric, Aloe Vera)"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-12 text-base w-full"
                    required
                  />
                </div>

                {/* Benefits Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="benefits"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Check className="text-green-500 w-4 h-4" />
                    Health Benefits *
                  </Label>
                  <Textarea
                    id="benefits"
                    placeholder="Describe the health benefits and therapeutic properties..."
                    value={formData.benefits}
                    onChange={(e) =>
                      handleInputChange("benefits", e.target.value)
                    }
                    className="min-h-[140px] text-base resize-none w-full"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Facts Field */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="facts"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Info className="text-blue-500 w-4 h-4" />
                      Interesting Facts
                    </Label>
                    <Textarea
                      id="facts"
                      placeholder="Share interesting facts, historical uses, or scientific findings..."
                      value={formData.facts}
                      onChange={(e) =>
                        handleInputChange("facts", e.target.value)
                      }
                      className="min-h-[120px] text-base resize-none w-full"
                    />
                  </div>

                  <div className="space-y-6">
                    {/* Origin Field */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="origin"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                      >
                        <Globe className="text-orange-500 w-4 h-4" />
                        Origin/Source
                      </Label>
                      <Input
                        id="origin"
                        placeholder="Geographic origin (e.g., India, Amazon)"
                        value={formData.origin}
                        onChange={(e) =>
                          handleInputChange("origin", e.target.value)
                        }
                        className="h-12 text-base w-full"
                      />
                    </div>

                    {/* Chemistry Name Field */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="chemistryName"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                      >
                        <TestTube className="text-purple-500 w-4 h-4" />
                        Scientific Name
                      </Label>
                      <Input
                        id="chemistryName"
                        placeholder="Scientific name (e.g., Curcuma longa)"
                        value={formData.chemistryName}
                        onChange={(e) =>
                          handleInputChange("chemistryName", e.target.value)
                        }
                        className="h-12 text-base w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload Field */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Camera className="text-pink-500 w-4 h-4" />
                    Ingredient Image *
                  </Label>

                  {/* File Upload */}
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-gray-400 flex items-center gap-2"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Choose Image File
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Display selected image name */}
                    {imageFile && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Selected: {imageFile.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-end pt-8 border-t">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep1Valid || uploadingImage}
                    className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 text-base flex items-center gap-2 disabled:opacity-50"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Product Association */}
          {currentStep === 2 && (
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3 text-gray-900">
                  <Leaf className="text-indigo-600 w-6 h-6" />
                  Ingredient Management - Product Association
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Select the products that contain this ingredient. You can
                  choose multiple products or skip this step.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Selected Products Summary */}
                {selectedProducts.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Selected Products ({selectedProducts.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProducts.map((productId) => {
                        const product = products.find(
                          (p) => p._id === productId
                        );
                        return product ? (
                          <Badge
                            key={productId}
                            className="bg-green-100 text-green-800 px-3 py-2 text-sm"
                          >
                            {product.name || "Unnamed Product"}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Products List */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Package className="text-indigo-500 w-4 h-4" />
                    Available Products
                  </Label>

                  {fetchingProducts ? (
                    <div className="text-center py-12">
                      <Loader2 className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">
                        Loading products...
                      </p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-gray-600 text-lg">
                        No products available
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-96 w-full rounded-xl border bg-white">
                      <div className="p-4 grid gap-3">
                        {products.map((product) => (
                          <div
                            key={product._id}
                            className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 border border-gray-200 transition-all duration-200 hover:shadow-sm"
                          >
                            <Checkbox
                              id={product._id}
                              checked={selectedProducts.includes(product._id)}
                              onCheckedChange={() =>
                                handleProductSelect(product._id)
                              }
                              className="w-5 h-5"
                            />
                            <div className="flex-1 min-w-0">
                              <Label
                                htmlFor={product._id}
                                className="text-sm font-medium text-gray-900 cursor-pointer block mb-1"
                              >
                                {product?.name || "Unnamed Product"}
                              </Label>
                              {product.description && (
                                <p className="text-sm text-gray-500 truncate">
                                  {product.description}
                                </p>
                              )}
                            </div>
                            {(product?.category || product?.subCategory) && (
                              <Badge variant="outline" className="text-xs">
                                {getCategoryText(product)}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
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
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 text-base flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Create Ingredient
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

export default AdminIngredientForm;
