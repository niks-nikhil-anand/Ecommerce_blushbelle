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
  Plus,
  Search,
  ImageIcon,
  Calendar,
  Trash2,
  Edit,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Toaster } from "sonner";
import { FaTrash } from "react-icons/fa";

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

  const previewUrl = URL.createObjectURL(file);
  setImagePreview(previewUrl);
  setImageFile(file);
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    handleImageUpload(file);
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
      toast.error("Ingredient name is required");
      return;
    }
    if (!formData.benefits.trim()) {
      toast.error("Benefits description is required");
      return;
    }
    if (!imageFile) {
      toast.error("Ingredient image is required");
      return;
    }

    // Create FormData object
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("benefits", formData.benefits);
    submitData.append("facts", formData.facts || "");
    submitData.append("origin", formData.origin || "");
    submitData.append("chemistryName", formData.chemistryName || "");

    if (imageFile) {
      submitData.append("image", imageFile);
    }

    if (selectedProducts.length > 0) {
      submitData.append("products", JSON.stringify(selectedProducts));
    }

    const response = await fetch("/api/admin/dashboard/ingredient", {
      method: "POST",
      body: submitData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.msg ||
          errorData.message ||
          `Failed to create ingredient: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    resetForm();
    Toaster.success("Ingredient created successfully!");
  } catch (error) {
    console.error("Submission error:", error);

    toast.error(
      error.message || "Failed to create ingredient. Please try again."
    );
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



  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-gray-100 py-3">
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
                      Nutritional Facts
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



// Main Ingredients Management Component
const IngredientsManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch ingredients
  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = () => {
    setLoading(true);
    axios
      .get("/api/admin/dashboard/ingredient")
      .then((response) => {
        if (Array.isArray(response.data) || Array.isArray(response.data.data)) {
          setIngredients(Array.isArray(response.data) ? response.data : response.data.data);
        } else {
          console.error("Unexpected response format:", response);
          toast.error("Failed to load ingredients");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching ingredients:", error);
        toast.error("Error loading ingredients");
        setLoading(false);
      });
  };

  const deleteIngredient = async () => {
  setDeleteLoading(true);

  try {
    await axios.delete(`/api/admin/dashboard/ingredient/${ingredientToDelete}`);
    toast.success("Ingredient deleted successfully");
    setShowDeleteModal(false);
    fetchIngredients(); // Refresh the list
  } catch (error) {
    toast.error("Failed to delete ingredient");
    console.error("Error deleting ingredient:", error);
  } finally {
    setDeleteLoading(false);
  }
};


  // Filter and sort ingredients
  const filteredIngredients = ingredients.filter((ingredient) => 
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedIngredients = [...filteredIngredients].sort((a, b) => {
    let comparison = 0;
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "createdAt") {
      comparison = new Date(a.createdAt) - new Date(b.createdAt);
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIngredients = sortedIngredients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedIngredients.length / itemsPerPage);

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-50 to-gray-100 p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading ingredients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-gray-100 p-6 min-h-screen">
      {/* Header Card */}
      <Card className="bg-white/95">
        <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3 text-gray-900">
                <Leaf className="text-blue-600 w-6 h-6" />
                Ingredient Management
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Manage your product ingredients with ease. Edit fundamental details about ingredients including name, benefits, and visual representation.
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 text-base flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Ingredient
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Table Card */}
      <Card className="bg-white/95 rounded-b-lg">
        {/* Filters Section */}
        <CardContent className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base bg-white"
                />
              </div>
            </div>

           <div className="flex items-center gap-4">
              {/* Sort Field */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                <Select value={sortField} onValueChange={setSortField}>
                  <SelectTrigger className="w-[150px] h-12 bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4 text-gray-500" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="name" className="flex items-center gap-2">
                      Name
                    </SelectItem>
                    <SelectItem value="createdAt" className="flex items-center gap-2">
                      Created Date
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Direction */}
              <Select value={sortDirection} onValueChange={setSortDirection}>
                <SelectTrigger className="w-[130px] h-12 bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                  <div className="flex items-center gap-2">
                    {sortDirection === "asc" ? (
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-gray-500" />
                    )}
                    <SelectValue placeholder="Order" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="asc" className="flex items-center gap-2">
                    Ascending
                  </SelectItem>
                  <SelectItem value="desc" className="flex items-center gap-2">
                    Descending
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Items Per Page */}
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[110px] h-12 bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="Show" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="5" className="flex items-center gap-2">
                    5 per page
                  </SelectItem>
                  <SelectItem value="10" className="flex items-center gap-2">
                    10 per page
                  </SelectItem>
                  <SelectItem value="20" className="flex items-center gap-2">
                    20 per page
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        {/* Ingredients Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-center font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Image
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4" />
                      Name
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <TestTube className="w-4 h-4" />
                      Scientific Name
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Origin
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Products
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Created At
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentIngredients.length > 0 ? (
                  currentIngredients.map((ingredient) => (
                    <TableRow key={ingredient._id} className="hover:bg-gray-50">
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <img
                            src={ingredient.image}
                            alt={ingredient.name}
                            className="w-12 h-12 object-cover rounded-md border"
                            onError={(e) => {
                              e.target.src = '/placeholder-ingredient.png';
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{ingredient.name}</TableCell>
                      <TableCell className="text-gray-600">
                        {ingredient.chemistryName || 'N/A'}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {ingredient.origin || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {ingredient.product?.length || 0} products
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(ingredient.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => {
                              // Handle edit - you can add edit modal or navigation here
                              console.log('Edit ingredient:', ingredient._id);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 hover:text-red-600"
                            onClick={() => {
                              setIngredientToDelete(ingredient._id);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-3">
                        <Package className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500 text-lg">No ingredients found</p>
                        <p className="text-gray-400">
                          {searchTerm ? "Try adjusting your search" : "Start by adding your first ingredient"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <CardContent className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedIngredients.length)} of{' '}
                {sortedIngredients.length} ingredients
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Add Ingredient Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl">
         
          <AdminIngredientForm 
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              fetchIngredients();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
              <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm">
                <DialogHeader className="pb-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-t-lg -m-6 p-6 mb-6">
                  <DialogTitle className="text-2xl flex items-center gap-3 text-gray-900">
                    <FaTrash className="text-red-600 w-5 h-5" />
                    Confirm Deletion
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 text-base">
                                  Are you sure you want to delete this ingredient? This action cannot be undone.

                  </DialogDescription>
                </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteIngredient}
              disabled={deleteLoading}
              className="px-6 py-3 text-base bg-red-400 hover:bg-red-500"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IngredientsManagement;
