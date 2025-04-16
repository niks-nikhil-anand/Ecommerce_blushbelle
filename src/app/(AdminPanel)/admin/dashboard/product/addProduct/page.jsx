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
  Upload,
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
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
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
    isFanFavourites: false,
    isOnSale: false,
    isFeaturedSale: false,
    tags: "",
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
      setCompletedSteps(prev => [...prev, 1]);
    } else if (!isBasicInfoComplete && completedSteps.includes(1)) {
      setCompletedSteps(prev => prev.filter(step => step !== 1));
    }
    
    setFormErrors(prev => ({
      ...prev,
      basicInfo: !isBasicInfoComplete
    }));
  }, [formData.name, formData.originalPrice, formData.salePrice, formData.stock, completedSteps]);

  // Check if category is selected
  useEffect(() => {
    const isCategoryComplete = selectedCategory && selectedCollection;
    
    if (isCategoryComplete && !completedSteps.includes(2)) {
      setCompletedSteps(prev => [...prev, 2]);
    } else if (!isCategoryComplete && completedSteps.includes(2)) {
      setCompletedSteps(prev => prev.filter(step => step !== 2));
    }
    
    setFormErrors(prev => ({
      ...prev,
      category: !isCategoryComplete
    }));
  }, [selectedCategory, selectedCollection, completedSteps]);

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

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setFormData({
      ...formData,
      category: categoryId,
    });
  };

  const handleCollectionSelect = (collection) => {
    setSelectedCollection(collection);
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
      data.append("isFeaturedSale", formData.isFeaturedSale);
      data.append("isOnSale", formData.isOnSale);

      // Category & Collections
      data.append("category", formData.category);
      data.append("collections", selectedCollection);

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
          isOnSale: false,
          category: "",
          tags: "",
          suggestedUse: "",
          description: "",
          additionalInfo: "",
        });

        setImages([]);
        setFeaturedImage(null);
        setDescriptionImage(null);
        setSelectedCollection("");
        setCompletedSteps([]);
        setCurrentStep(1);
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
      toast.error("Please select both category and collection");
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
    <div className="max-w-full mx-auto p-6 bg-gray-50 rounded-lg w-full h-[90vh] overflow-y-auto max-h-[80vh] custom-scrollbar">
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
          {/* Step progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex flex-col items-center ${
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
            <Progress value={progress} className="h-2" />
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
                            id="isFeaturedSale"
                            checked={formData.isFeaturedSale}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("isFeaturedSale", checked)
                            }
                          />
                          <Label htmlFor="isFeaturedSale">Featured Sale</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isOnSale"
                            checked={formData.isOnSale}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("isOnSale", checked)
                            }
                          />
                          <Label htmlFor="isOnSale">On Sale</Label>
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
                        Select product category and collection
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
                                  className={`transition-all duration-200 ${
                                    selectedCategory === category._id
                                      ? "bg-primary text-white"
                                      : "bg-gray-100 hover:bg-gray-200"
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
                            Collection *
                          </Label>
                          <div className="flex flex-wrap gap-3">
                            {["Men", "Women", "Kids", "Student"].map(
                              (collection) => (
                                <Button
                                  key={collection}
                                  type="button"
                                  variant={
                                    selectedCollection === collection
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() =>
                                    handleCollectionSelect(collection)
                                  }
                                  className={`transition-all duration-200 ${
                                    selectedCollection === collection
                                      ? "bg-primary text-white"
                                      : "bg-gray-100 hover:bg-gray-200"
                                  }`}
                                >
                                  {collection}
                                </Button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={prevStep}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button onClick={nextStep}>
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">
                        Upload Images
                      </CardTitle>
                      <CardDescription>Add product images</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Label className="text-base">Product Images</Label>
                          {imageInputs.map((input, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div className="relative flex-1">
                                <Input
                                  type="file"
                                  onChange={(e) => handleFileChange(e, index)}
                                  className={`cursor-pointer ${inputStyles}`}
                                />
                              </div>
                              {index > 0 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeImage(index)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <MinusCircle className="h-5 w-5" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addMoreImages}
                            className="w-full"
                            size="sm"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" /> Add More
                            Images
                          </Button>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-base">Featured Image</Label>
                            <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                              <Input
                                type="file"
                                onChange={handleFeaturedImageChange}
                                className={`cursor-pointer ${inputStyles}`}
                              />
                              {!featuredImage && (
                                <p className="text-sm text-gray-500 mt-2">
                                  Upload the main product image
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-base">
                              Description Image
                            </Label>
                            <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                              <Input
                                type="file"
                                onChange={handleDescriptionImageChange}
                                className={`cursor-pointer ${inputStyles}`}
                              />
                              {!descriptionImage && (
                                <p className="text-sm text-gray-500 mt-2">
                                  Optional image for description
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={prevStep}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button onClick={nextStep}>
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">
                        Tags & Suggested Use
                      </CardTitle>
                      <CardDescription>
                        Add product tags and usage information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="tags" className="text-base">
                            Tags (comma separated)
                          </Label>
                          <Input
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="e.g. organic, vegan, natural"
                            className={inputStyles}
                          />
                          <p className="text-sm text-gray-500">
                            Add relevant tags to improve product discoverability
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="suggestedUse" className="text-base">
                            Suggested Use
                          </Label>
                          <Textarea
                            id="suggestedUse"
                            name="suggestedUse"
                            value={formData.suggestedUse}
                            onChange={handleInputChange}
                            placeholder="How should customers use this product?"
                            className={`min-h-32 ${inputStyles}`}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={prevStep}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button onClick={nextStep}>
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