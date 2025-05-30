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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Star,
  Plus,
  Trash2,
  Package,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Upload,
  Camera,
  Award,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
// import toast from "react-hot-toast"; // Assuming react-hot-toast is configured in your layout

const AdminBenefitForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    image: "",
    items: [
      {
        icon: "",
        title: "",
        description: "",
      },
    ],
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
        // toast.error("Failed to fetch products. Please try again.");
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
      handleImageUpload(file);
    }
  };

  const addBenefitItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          icon: "",
          title: "",
          description: "",
        },
      ],
    }));
  };

  const removeBenefitItem = (index) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const updateBenefitItem = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
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
      image: "",
      items: [
        {
          icon: "",
          title: "",
          description: "",
        },
      ],
      product: "",
    });
    setSelectedProduct("");
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
      if (!imageFile) {
        toast.error("Featured image is required");
        return;
      }

      // Validate benefit items
      const validItems = formData.items.filter(
        (item) => item.title.trim() && item.description.trim()
      );

      if (validItems.length === 0) {
        toast.error("At least one benefit item with title and description is required");
        return;
      }

      // Create FormData object for multipart form submission
      const submitData = new FormData();

      // Add the image file
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      // Add benefit items as JSON string
      submitData.append("items", JSON.stringify(validItems));

      // Add selected product if any
      if (selectedProduct) {
        submitData.append("product", selectedProduct);
      }

      console.log("Submitting benefit data...");

      // Make API call to create benefit
      const response = await axios.post("/api/admin/dashboard/benefits", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Benefit created successfully:", response.data);
      toast.success("Benefit created successfully!");
      resetForm();
    } catch (error) {
      console.error("Submission error:", error);

      // Show user-friendly error message
      const errorMessage =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create benefit. Please try again.";
      toast.error(errorMessage);
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

  const isStep1Valid = imageFile;
  const hasValidBenefitItems = formData.items.some(
    (item) => item.title.trim() && item.description.trim()
  );

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="w-full">
        <div className="w-full">
          {/* Step 1: Featured Image & Benefit Items */}
          {currentStep === 1 && (
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3 text-gray-900">
                  <Award className="text-blue-600 w-6 h-6" />
                  Benefit Management - Add the required benefits of the product
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Upload a featured image and add benefit items with their details.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Image Upload Field */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Camera className="text-pink-500 w-4 h-4" />
                    Featured Image *
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
                            {imageFile ? "Change Image" : "Choose Image File"}
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Display selected image name */}
                    {imageFile && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              Selected: {imageFile.name}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setImageFile(null);
                              setFormData(prev => ({ ...prev, image: "" }));
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

                {/* Benefit Items Section */}
                <div className="space-y-6 border-t pt-8">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Star className="text-yellow-500 w-4 h-4" />
                      Benefit Items *
                    </Label>
                    <Button
                      type="button"
                      onClick={addBenefitItem}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <Card key={index} className="border border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">
                              Benefit Item {index + 1}
                            </h4>
                            {formData.items.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeBenefitItem(index)}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Icon Field */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">
                                Icon URL
                              </Label>
                              <Input
                                placeholder="Enter icon URL or identifier"
                                value={item.icon}
                                onChange={(e) =>
                                  updateBenefitItem(index, "icon", e.target.value)
                                }
                                className="h-10"
                              />
                            </div>

                            {/* Title Field */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">
                                Title *
                              </Label>
                              <Input
                                placeholder="Enter benefit title"
                                value={item.title}
                                onChange={(e) =>
                                  updateBenefitItem(index, "title", e.target.value)
                                }
                                className="h-10"
                                required
                              />
                            </div>

                            {/* Description Field */}
                            <div className="space-y-2 lg:col-span-2">
                              <Label className="text-sm font-medium text-gray-700">
                                Description *
                              </Label>
                              <Textarea
                                placeholder="Describe this benefit in detail..."
                                value={item.description}
                                onChange={(e) =>
                                  updateBenefitItem(index, "description", e.target.value)
                                }
                                className="min-h-[100px] resize-none"
                                required
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-end pt-8 border-t">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep1Valid || !hasValidBenefitItems || uploadingImage}
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
                  Benefit Management - Product Association
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Select one product to associate with this benefit (optional).
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
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Create Benefit
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

export default AdminBenefitForm;