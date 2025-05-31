"use client";
import React, { useState, useEffect, useRef } from "react";
// Using available shadcn/ui components
import {
  Play,
  Plus,
  Trash2,
  Package,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Upload,
  Video,
  Award,
  X,
  FileVideo,
  Eye,
  Heart,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const AdminVideoForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    video: "",
    title: "",
    description: "",
    views: 0,
    likes: 0,
    isPublishedOnHomepage: false,
    product: "",
  });

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setFetchingProducts(true);
      try {
        const response = await fetch("/api/admin/dashboard/product/addProduct");
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        alert("Failed to fetch products. Please try again.");
      } finally {
        setFetchingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type - accept common video formats
      const validVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv'];
      if (!validVideoTypes.includes(file.type)) {
        alert('Please select a valid video file (MP4, AVI, MOV, WMV, FLV, WebM, MKV).');
        return;
      }
      
      // Validate file size (e.g., max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('Video file size must be less than 100MB.');
        return;
      }

      setVideoFile(file);
      setFormData((prev) => ({ ...prev, video: file.name }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProductSelect = (productId) => {
    // Only allow selecting one product at a time
    if (selectedProduct === productId) {
      // Deselect if clicking the same product
      setSelectedProduct("");
      setFormData((prev) => ({
        ...prev,
        product: "",
      }));
    } else {
      // Select new product
      setSelectedProduct(productId);
      setFormData((prev) => ({
        ...prev,
        product: productId,
      }));
    }
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
      video: "",
      title: "",
      description: "",
      views: 0,
      likes: 0,
      isPublishedOnHomepage: false,
      product: "",
    });
    setSelectedProduct("");
    setVideoFile(null);
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
      if (!videoFile) {
        alert("Video file is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.title.trim()) {
        alert("Video title is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.description.trim()) {
        alert("Video description is required");
        setIsSubmitting(false);
        return;
      }

      // Create FormData object for multipart form submission
      const submitData = new FormData();

      // Add the video file
      if (videoFile) {
        submitData.append("video", videoFile);
      }

      // Add other form data
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("views", formData.views.toString());
      submitData.append("likes", formData.likes.toString());
      submitData.append("isPublishedOnHomepage", formData.isPublishedOnHomepage.toString());

      // Add selected product if any
      if (selectedProduct) {
        submitData.append("product", selectedProduct);
      }

      console.log("Submitting video data...");

      const response = await fetch("/api/admin/dashboard/video", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        alert("Video uploaded successfully!");
        resetForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload video");
      }
    } catch (error) {
      console.error("Submission error:", error);

      // Show user-friendly error message
      const errorMessage = error.message || "Failed to upload video. Please try again.";
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

  const isStep1Valid = videoFile && formData.title.trim() && formData.description.trim();

  return (
    <div className="-full bg-white p-6 min-h-[80vh]">
      <div className="w-full">
        <div className="w-full">
          {/* Step 1: Video Upload & Details */}
          {currentStep === 1 && (
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3 text-gray-900">
                  <Video className="text-blue-600 w-6 h-6" />
                  Video Management - Upload Video Content
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Upload a video file and add its details including title and description.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Video Upload Field */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileVideo className="text-purple-500 w-4 h-4" />
                    Video File *
                  </Label>

                  {/* File Upload */}
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="video-file-input"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingVideo}
                        className="w-full h-16 border-2 border-dashed border-gray-300 hover:border-gray-400 flex items-center gap-2"
                      >
                        {uploadingVideo ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-6 h-6" />
                            <div className="text-center">
                              <div className="font-medium">
                                {videoFile ? "Change Video File" : "Choose Video File"}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Supports MP4, AVI, MOV, WMV, FLV, WebM, MKV (Max 100MB)
                              </div>
                            </div>
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Display selected video name */}
                    {videoFile && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-600" />
                            <div>
                              <span className="text-sm font-medium text-green-800 block">
                                Selected: {videoFile.name}
                              </span>
                              <span className="text-xs text-green-600">
                                Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                              </span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setVideoFile(null);
                              setFormData(prev => ({ ...prev, video: "" }));
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Details Section */}
                <div className="space-y-6 border-t pt-8">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Play className="text-red-500 w-4 h-4" />
                    Video Details
                  </Label>

                  <div className="grid grid-cols-1 gap-6">
                    {/* Title Field */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Video Title *
                      </Label>
                      <Input
                        placeholder="Enter video title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="h-12 text-base"
                        required
                      />
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Video Description *
                      </Label>
                      <Textarea
                        placeholder="Describe your video content..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="min-h-[120px] resize-none text-base"
                        required
                      />
                    </div>

                    {/* Stats Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Eye className="text-blue-500 w-4 h-4" />
                          Initial Views
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.views}
                          onChange={(e) => handleInputChange("views", parseInt(e.target.value) || 0)}
                          className="h-10"
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Heart className="text-red-500 w-4 h-4" />
                          Initial Likes
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.likes}
                          onChange={(e) => handleInputChange("likes", parseInt(e.target.value) || 0)}
                          className="h-10"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Homepage Publication Toggle */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Globe className="text-green-500 w-4 h-4" />
                        Publication Settings
                      </Label>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          id="homepage-publish"
                          checked={formData.isPublishedOnHomepage}
                          onChange={(e) => handleInputChange("isPublishedOnHomepage", e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="homepage-publish" className="text-sm font-medium text-gray-700">
                          Publish on Homepage
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-end pt-8 border-t">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep1Valid || uploadingVideo}
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
                  <Package className="text-indigo-600 w-6 h-6" />
                  Video Management - Product Association
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Select one product to associate with this video (optional).
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Product Selection Section */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Package className="text-indigo-500 w-4 h-4" />
                    Associate with Product - Select One
                  </Label>

                  {/* Selected Product Display */}
                  {selectedProduct && (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-green-800 flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Selected Product
                          </h4>
                          <p className="text-green-700">
                            {products.find((p) => p._id === selectedProduct)?.name || "Product"}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct("");
                            setFormData(prev => ({ ...prev, product: "" }));
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {fetchingProducts ? (
                    <div className="text-center py-12">
                      <Loader2 className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">Loading products...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-gray-600 text-lg">No products available</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-96 w-full rounded-xl border bg-white">
                      <div className="p-4 grid gap-3">
                        {products.map((product) => (
                          <div
                            key={product._id}
                            className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                              selectedProduct === product._id
                                ? "bg-blue-50 border-blue-300 shadow-sm"
                                : "border-gray-200 hover:bg-gray-50 hover:shadow-sm"
                            }`}
                            onClick={() => handleProductSelect(product._id)}
                          >
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedProduct === product._id
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedProduct === product._id && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {product?.name || "Unnamed Product"}
                              </p>
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
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Upload Video
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

export default AdminVideoForm;