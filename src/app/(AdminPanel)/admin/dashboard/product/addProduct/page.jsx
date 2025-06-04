"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-hot-toast";
import {
  PlusCircle,
  MinusCircle,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
} from "lucide-react";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const ProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [fetchingSubcategories, setFetchingSubcategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [progress, setProgress] = useState(20);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    salePrice: "",
    originalPrice: "",
    category: "",
    subCategory: "",
    stock: 0,
    suggestedUse: "",
    servingPerBottle: "",
    isShowOnHomePage: false,
    isFeatured: false,
    tags: "",
    purpose: "",
    additionalInfo: "",
  });
  const [images, setImages] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [descriptionImage, setDescriptionImage] = useState(null);
  const [imageInputs, setImageInputs] = useState([0]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    basicInfo: false,
    category: false,
  });

  const ReactQuill = useMemo(
    () =>
      dynamic(() => import("react-quill"), {
        ssr: false,
        loading: () => <p>Loading...</p>,
      }),
    []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      setFetchingCategories(true);
      try {
        const response = await axios.get("/api/admin/dashboard/category");
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle category selection and fetch subcategories
  const handleCategorySelect = async (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null); // Reset subcategory selection
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      subCategory: "",
    }));

    // Fetch subcategories for the selected category
    setFetchingSubcategories(true);
    try {
      const response = await axios.get(
        `/api/admin/dashboard/category/AllSubCatgeory/${categoryId}`
      );
      console.log(response);
      if (Array.isArray(response.data.subcategories)) {
        setSubcategories(response.data.subcategories);
      } else {
        console.error(
          "Unexpected subcategory response format:",
          response.data.subcategories
        );
        setSubcategories([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    } finally {
      setFetchingSubcategories(false);
    }
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    setFormData((prev) => ({
      ...prev,
      subCategory: subcategoryId,
    }));
  };

  useEffect(() => {
    // Update progress based on current step
    setProgress(currentStep * 20);
  }, [currentStep]);

  // Check if basic info fields are complete
  useEffect(() => {
    const { name, originalPrice, salePrice, stock } = formData;
    const isBasicInfoComplete = name && originalPrice && salePrice && stock;

    // Update completedSteps array accordingly
    if (isBasicInfoComplete && !completedSteps.includes(1)) {
      setCompletedSteps((prev) => [...prev, 1]);
    } else if (!isBasicInfoComplete && completedSteps.includes(1)) {
      setCompletedSteps((prev) => prev.filter((step) => step !== 1));
    }

    setFormErrors((prev) => ({
      ...prev,
      basicInfo: !isBasicInfoComplete,
    }));
  }, [
    formData.name,
    formData.originalPrice,
    formData.salePrice,
    formData.stock,
    completedSteps,
  ]);

  // Check if category and subcategory are selected
  useEffect(() => {
    // Changed this to require both category and subcategory selection
    const isCategoryComplete = selectedCategory && selectedSubcategory;

    if (isCategoryComplete && !completedSteps.includes(2)) {
      setCompletedSteps((prev) => [...prev, 2]);
    } else if (!isCategoryComplete && completedSteps.includes(2)) {
      setCompletedSteps((prev) => prev.filter((step) => step !== 2));
    }

    setFormErrors((prev) => ({
      ...prev,
      category: !isCategoryComplete,
    }));
  }, [selectedCategory, selectedSubcategory, completedSteps]);

  useEffect(() => {
  // Consider step 3 complete if all 3 images are uploaded (product images, featured image, and description image)
  const hasProductImages = images.some(img => img !== null && img !== undefined);
  const hasFeaturedImage = featuredImage !== null;
  const hasDescriptionImage = descriptionImage !== null;
  
  const isStep3Complete = hasProductImages && hasFeaturedImage && hasDescriptionImage;
  
  if (isStep3Complete && !completedSteps.includes(3)) {
    setCompletedSteps((prev) => [...prev, 3]);
  } else if (!isStep3Complete && completedSteps.includes(3)) {
    setCompletedSteps((prev) => prev.filter((step) => step !== 3));
  }
}, [images, featuredImage, descriptionImage, completedSteps]);

  // Check if tags and suggested use are filled (step 4)
  useEffect(() => {
    const { tags, purpose, suggestedUse } = formData;
    // Consider step 4 complete if at least one of these fields is filled
    const isStep4Complete = tags || purpose || suggestedUse;

    if (isStep4Complete && !completedSteps.includes(4)) {
      setCompletedSteps((prev) => [...prev, 4]);
    } else if (!isStep4Complete && completedSteps.includes(4)) {
      setCompletedSteps((prev) => prev.filter((step) => step !== 4));
    }
  }, [formData.tags, formData.purpose, formData.suggestedUse, completedSteps]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleFileChange = (e, index) => {
    const newImages = [...images];
    newImages[index] = e.target.files[0];
    setImages(newImages);
  };

  const handleFeaturedImageChange = (e) => {
    setFeaturedImage(e.target.files[0]);
  };

  const handleDescriptionImageChange = (e) => {
    setDescriptionImage(e.target.files[0]);
  };

  const handleQuillChange = (description) => {
    setFormData({ ...formData, description });
  };

  const handleQuillInfoChange = (additionalInfo) => {
    setFormData({ ...formData, additionalInfo });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // Basic Product Details
      data.append("name", formData.name);
      data.append("originalPrice", formData.originalPrice);
      data.append("salePrice", formData.salePrice);
      data.append("stock", formData.stock);
      data.append("isFeatured", formData.isFeatured);
      data.append("isShowOnHomePage", formData.isShowOnHomePage);

      // Category & Subcategory - Fixed the field name to match backend expectation
      data.append("category", formData.category);
      data.append("subCategory", formData.subCategory); // Fixed field name from subCatgeory to subCategory

      // Images
      if (images.length > 0) {
        images.forEach((file) => {
          if (file) data.append("images", file);
        });
      }

      if (featuredImage) data.append("featuredImage", featuredImage);
      if (descriptionImage) data.append("descriptionImage", descriptionImage);

      // Additional Fields
      data.append("tags", formData.tags);
      data.append("suggestedUse", formData.suggestedUse);
      data.append("purpose", formData.purpose);

      // Description & Additional Info
      data.append("description", formData.description);
      data.append("additionalInfo", formData.additionalInfo);

      console.log("Sending data to API:", Array.from(data.entries())); // Debugging log

      // API Call
      const response = await axios.post(
        "/api/admin/dashboard/product/addProduct",
        data
      );

      if (response.status === 200) {
        // Success Notification
        toast.success("Product created successfully!");
        console.log("Product created successfully:", data);

        // Clear the form
        setFormData({
          name: "",
          originalPrice: "",
          salePrice: "",
          stock: "",
          isFeaturedSale: false,
          isShowOnHomePage: false,
          category: "",
          subCategory: "", // Fixed field name
          tags: "",
          suggestedUse: "",
          description: "",
          additionalInfo: "",
          purpose: "",
        });

        setImages([]);
        setFeaturedImage(null);
        setDescriptionImage(null);
        setCompletedSteps([]);
        setCurrentStep(1);
        setSelectedCategory(null);
        setSelectedSubcategory(null);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const addMoreImages = () => {
    setImageInputs([...imageInputs, imageInputs.length]);
  };

  const removeImage = (index) => {
    if (index === 0) return; // Prevent removing the first image
    setImageInputs((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    // For step 1, validate basic info
    if (currentStep === 1 && formErrors.basicInfo) {
      toast.error("Please fill all required fields in Basic Information");
      return;
    }

    // For step 2, validate category selection
    if (currentStep === 2 && formErrors.category) {
      toast.error("Please select both category and subcategory");
      return;
    }

    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // Step titles for display
  const steps = [
    { number: 1, title: "Basic Information" },
    { number: 2, title: "Categories" },
    { number: 3, title: "Images" },
    { number: 4, title: "Tags & Use" },
    { number: 5, title: "Description" },
  ];

  // Custom style for input fields with increased padding
  const inputStyles = "px-4 py-3"; // Added padding

  return (
    <div className="max-w-full mx-auto p-6 bg-gray-50 rounded-lg w-full h-[90vh] overflow-y-auto max-h-[90vh] custom-scrollbar">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold text-primary">
            Add a New Product
          </CardTitle>
          <CardDescription className="text-lg">
            Fill in the details below to add a new product to your inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Enhanced Step progress indicator with connected horizontal bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2 relative">
              {/* Horizontal connecting line behind the circles */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />

              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex flex-col items-center z-10 ${
                    currentStep === step.number
                      ? "text-primary font-bold"
                      : completedSteps.includes(step.number)
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`rounded-full w-10 h-10 flex items-center justify-center border-2 ${
                      currentStep === step.number
                        ? "border-primary bg-primary/10"
                        : completedSteps.includes(step.number)
                        ? "border-green-500 bg-green-100"
                        : "border-gray-300 bg-gray-100"
                    }`}
                  >
                    {completedSteps.includes(step.number) ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-xs mt-1 text-center">{step.title}</span>
                </div>
              ))}
            </div>

            {/* Using the shadcn Progress component instead of the custom one */}
            <Progress value={progress} className="h-2 mt-4" />
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">
                        Basic Information
                      </CardTitle>
                      <CardDescription>
                        Add essential product details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-base">
                            Product Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className={inputStyles}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="stock" className="text-base">
                            Stock *
                          </Label>
                          <Input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                            className={inputStyles}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="originalPrice" className="text-base">
                            Original Price *
                          </Label>
                          <Input
                            type="number"
                            id="originalPrice"
                            name="originalPrice"
                            value={formData.originalPrice}
                            onChange={handleInputChange}
                            required
                            className={inputStyles}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="salePrice" className="text-base">
                            Sale Price (Discounted) *
                          </Label>
                          <Input
                            type="number"
                            id="salePrice"
                            name="salePrice"
                            value={formData.salePrice}
                            onChange={handleInputChange}
                            required
                            className={inputStyles}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isFeatured"
                            checked={formData.isFeatured}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("isFeatured", checked)
                            }
                          />
                          <Label htmlFor="isFeatured">Featured</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isShowOnHomePage"
                            checked={formData.isShowOnHomePage}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("isShowOnHomePage", checked)
                            }
                          />
                          <Label htmlFor="isShowOnHomePage">
                            Show on Homepage
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button onClick={nextStep}>
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">
                        Categories
                      </CardTitle>
                      <CardDescription>
                        Select product category and subcategory
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <Label className="text-base mb-3 block">
                            Category *
                          </Label>
                          {fetchingCategories ? (
                            <p>Loading categories...</p>
                          ) : (
                            <div className="flex flex-wrap gap-3">
                              {categories.map((category) => (
                                <Button
                                  key={category._id}
                                  type="button"
                                  variant={
                                    selectedCategory === category._id
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() =>
                                    handleCategorySelect(category._id)
                                  }
                                  className={`transition-all duration-300 ${
                                    selectedCategory === category._id
                                      ? "bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                      : "bg-white border-gray-300 hover:bg-gray-100 text-gray-800 hover:text-gray-900"
                                  }`}
                                >
                                  {category.name}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <Label className="text-base mb-3 block">
                            Subcategory *
                          </Label>
                          {fetchingSubcategories ? (
                            <p>Loading subcategories...</p>
                          ) : subcategories.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                              {subcategories.map((subcategory) => (
                                <Button
                                  key={subcategory._id}
                                  type="button"
                                  variant={
                                    selectedSubcategory === subcategory._id
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() =>
                                    handleSubcategorySelect(subcategory._id)
                                  }
                                  className={`transition-all duration-300 ${
                                    selectedSubcategory === subcategory._id
                                      ? "bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                      : "bg-white border-gray-300 hover:bg-gray-100 text-gray-800 hover:text-gray-900"
                                  }`}
                                >
                                  {subcategory.name}
                                </Button>
                              ))}
                            </div>
                          ) : selectedCategory ? (
                            <p>No subcategories available for this category.</p>
                          ) : (
                            <p>Please select a category first.</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        className="border-gray-300 hover:bg-gray-100 text-gray-800"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button
                        onClick={nextStep}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <Card className="mx-auto ">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-xl text-primary">
                        Upload Images
                      </CardTitle>
                      <CardDescription className="text-base">
                        Add product images
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <Label className="text-base font-medium">
                            Product Images
                          </Label>
                          <div className="space-y-4">
                            {imageInputs.map((input, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3"
                              >
                                <div className="relative flex-1">
                                  <Input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, index)}
                                    className={`cursor-pointer ${inputStyles} py-2`}
                                  />
                                </div>
                                {index > 0 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeImage(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                                  >
                                    <MinusCircle className="h-5 w-5" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addMoreImages}
                            className="w-full py-3"
                            size="sm"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" /> Add More
                            Images
                          </Button>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label className="text-base font-medium">
                              Featured Image
                            </Label>
                            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50/50">
                              <Input
                                type="file"
                                onChange={handleFeaturedImageChange}
                                className={`cursor-pointer ${inputStyles} py-2`}
                              />
                              {!featuredImage && (
                                <p className="text-sm text-gray-500 mt-3">
                                  Upload the main product image
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-base font-medium">
                              Description Image
                            </Label>
                            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50/50">
                              <Input
                                type="file"
                                onChange={handleDescriptionImageChange}
                                className={`cursor-pointer ${inputStyles} py-2`}
                              />
                              {!descriptionImage && (
                                <p className="text-sm text-gray-500 mt-3">
                                  Optional image for description
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between px-6 pt-4 pb-6 border-t border-gray-100">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        className="px-6 py-3"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button onClick={nextStep} className="px-6 py-3">
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <Card className="mx-auto ">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-xl text-primary">
                        Tags & Suggested Use
                      </CardTitle>
                      <CardDescription className="text-base">
                        Add product tags and usage information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <Label
                            htmlFor="tags"
                            className="text-base font-medium"
                          >
                            Tags (comma separated)
                          </Label>
                          <Input
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="e.g. organic, vegan, natural"
                            className={`${inputStyles} py-3`}
                          />
                          <p className="text-sm text-gray-500">
                            Add relevant tags to improve product discoverability
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="purpose"
                            className="text-base font-medium"
                          >
                            Purpose
                          </Label>
                          <Textarea
                            id="purpose"
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleInputChange}
                            placeholder="What is the main purpose or benefit of this product?"
                            className={`min-h-32 ${inputStyles} py-3`}
                          />
                          <p className="text-sm text-gray-500">
                            Describe the primary purpose or intended benefit of
                            your product
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="suggestedUse"
                            className="text-base font-medium"
                          >
                            Suggested Use
                          </Label>
                          <Textarea
                            id="suggestedUse"
                            name="suggestedUse"
                            value={formData.suggestedUse}
                            onChange={handleInputChange}
                            placeholder={`Serving Size – 1 capsule daily
Bottle Contains – 60 capsules (2 month supply)
 Suggested Use – Take 1 capsule daily with food
Storage  – Store in a cool, dry place`}
                            className={`min-h-40 ${inputStyles} py-3`}
                          />
                          <p className="text-sm text-gray-500">
                            Include serving size, bottle contents, usage
                            instructions, and storage information
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between px-6 pt-4 pb-6 border-t border-gray-100">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        className="px-6 py-3"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button onClick={nextStep} className="px-6 py-3">
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}

              {currentStep === 5 && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">
                        Description & Information
                      </CardTitle>
                      <CardDescription>
                        Add detailed product descriptions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="description" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="description">
                            Product Description
                          </TabsTrigger>
                          <TabsTrigger value="additional">
                            Additional Information
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="description" className="mt-4">
                          <div className="space-y-2">
                            <Label className="text-base">Description</Label>
                            <div className="min-h-80 border rounded-md">
                              <ReactQuill
                                value={formData.description}
                                onChange={handleQuillChange}
                                className="h-72"
                              />
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="additional" className="mt-4">
                          <div className="space-y-2">
                            <Label className="text-base">
                              Additional Information
                            </Label>
                            <div className="min-h-80 border rounded-md">
                              <ReactQuill
                                value={formData.additionalInfo}
                                onChange={handleQuillInfoChange}
                                className="h-72"
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                    <CardFooter className="flex justify-between mt-4">
                      <Button variant="outline" onClick={prevStep}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {loading ? "Submitting..." : "Create Product"}
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
