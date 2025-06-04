"use client";
import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  Trash2,
  Package,
  Check,
  Loader2,
  X,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

const AdminFaqForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    faq: [
      {
        question: "",
        answer: "",
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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        toast.error("Failed to fetch products. Please try again.");
      } finally {
        setFetchingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const addFaqItem = () => {
    setFormData((prev) => ({
      ...prev,
      faq: [
        ...prev.faq,
        {
          question: "",
          answer: "",
        },
      ],
    }));
    toast.success("New FAQ item added!");
  };

  const removeFaqItem = (index) => {
    if (formData.faq.length > 1) {
      setFormData((prev) => ({
        ...prev,
        faq: prev.faq.filter((_, i) => i !== index),
      }));
      toast.success("FAQ item removed!");
    }
  };

  const updateFaqItem = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      faq: prev.faq.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleProductSelect = (productId) => {
    if (selectedProduct === productId) {
      setSelectedProduct("");
      setFormData((prev) => ({
        ...prev,
        product: "",
      }));
    } else {
      setSelectedProduct(productId);
      setFormData((prev) => ({
        ...prev,
        product: productId,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      faq: [
        {
          question: "",
          answer: "",
        },
      ],
      product: "",
    });
    setSelectedProduct("");
    setCurrentStep(1);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!selectedProduct) {
        toast.error("Please select a product");
        return;
      }

      const validFaqs = formData.faq.filter(
        (item) => item.question.trim() && item.answer.trim()
      );

      if (validFaqs.length === 0) {
        toast.error("At least one FAQ with question and answer is required");
        return;
      }

      const submitData = {
        faq: validFaqs,
        product: selectedProduct,
      };

      console.log("Submitting FAQ data...", submitData);

      const response = await fetch("/api/admin/dashboard/faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create FAQ: ${response.status} ${errorData}`);
      }

      const result = await response.json();
      console.log("FAQ created successfully:", result);
      toast.success("FAQ created successfully!", {
        description: "Your FAQ items have been saved and are now live.",
      });
      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(`Failed to create FAQ: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const hasValidFaqItems = formData.faq.some(
    (item) => item.question.trim() && item.answer.trim()
  );

  return (
    <div className="w-full bg-white p-6 min-h-[90vh]">
      <div className="w-full">
        <div className="w-full space-y-8">
          {/* Step 1: FAQ Items */}
          {currentStep === 1 && (
            <div className="bg-white shadow-xl rounded-lg border-0 backdrop-blur-sm">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900 mb-2">
                  <HelpCircle className="text-blue-600 w-6 h-6" />
                  FAQ Management - Add Frequently Asked Questions
                </h2>
                <p className="text-gray-600">
                  Create helpful FAQ items for your products to assist customers.
                </p>
              </div>
              <div className="p-8 space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <HelpCircle className="text-blue-500 w-4 h-4" />
                      FAQ Items *
                    </label>
                    <button
                      type="button"
                      onClick={addFaqItem}
                      className="group relative px-4 py-2 border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-300 flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:scale-95"
                    >
                      <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90 group-hover:text-blue-600" />
                      <span className="transition-colors duration-300 group-hover:text-blue-600 font-medium">
                        Add FAQ
                      </span>
                      {/* Animated background effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-10 rounded-md transition-opacity duration-300" />
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                    {formData.faq.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg animate-in slide-in-from-top-2 duration-300">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">
                              FAQ Item {index + 1}
                            </h4>
                            {formData.faq.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFaqItem(index)}
                                className="group px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-all duration-200 flex items-center gap-1 transform hover:scale-105 active:scale-95"
                              >
                                <Trash2 className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Question *
                              </label>
                              <input
                                type="text"
                                placeholder="Enter the frequently asked question"
                                value={item.question}
                                onChange={(e) =>
                                  updateFaqItem(index, "question", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Answer *
                              </label>
                              <textarea
                                placeholder="Provide a detailed answer to this question..."
                                value={item.answer}
                                onChange={(e) =>
                                  updateFaqItem(index, "answer", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-none transition-all duration-200"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-8 border-t">
                  <div></div>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!hasValidFaqItems}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-10 py-3 rounded-md font-medium flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Product Association */}
          {currentStep === 2 && (
            <div className="bg-white shadow-xl rounded-lg border-0 backdrop-blur-sm">
              <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg border-b">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900 mb-2">
                  <Package className="text-indigo-600 w-6 h-6" />
                  FAQ Management - Product Association
                </h2>
                <p className="text-gray-600">
                  Select the product to associate with these FAQs (required).
                </p>
              </div>
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Package className="text-indigo-500 w-4 h-4" />
                    Associate with Product - Select One *
                  </label>

                  {selectedProduct && (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200 animate-in slide-in-from-top-2 duration-300">
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
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProduct("");
                            setFormData(prev => ({ ...prev, product: "" }));
                          }}
                          className="p-1 hover:bg-green-100 rounded transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
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
                    <div className="h-96 w-full rounded-xl border bg-white overflow-auto">
                      <div className="p-4 grid gap-3">
                        {products.map((product) => (
                          <div
                            key={product._id}
                            className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer transform hover:scale-[1.02] ${
                              selectedProduct === product._id
                                ? "bg-blue-50 border-blue-300 shadow-sm"
                                : "border-gray-200 hover:bg-gray-50 hover:shadow-sm"
                            }`}
                            onClick={() => handleProductSelect(product._id)}
                          >
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
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
                              <span className="px-2 py-1 text-xs border border-gray-300 rounded-full">
                                {getCategoryText(product)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-8 border-t">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-10 py-3 rounded-md font-medium flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous Step
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !selectedProduct || !hasValidFaqItems}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-10 py-3 rounded-md font-medium flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Create FAQ
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFaqForm;