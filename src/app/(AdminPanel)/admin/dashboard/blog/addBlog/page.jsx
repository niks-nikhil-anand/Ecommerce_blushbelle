"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Upload, Check } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const BlogFormComponent = () => {
  const [step, setStep] = useState(1);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featuredImage: '',
    product: [], // Changed to array for multiple products
  });
  const [loading, setLoading] = useState(false);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuillChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, featuredImage: file });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setFetchingProducts(true);
      try {
        const response = await axios.get('/api/admin/dashboard/product/addProduct');
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setFetchingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductSelect = (productId) => {
    setFormData(prev => {
      const currentProducts = prev.product || [];
      const isSelected = currentProducts.includes(productId);
      
      if (isSelected) {
        // Remove product if already selected
        return {
          ...prev,
          product: currentProducts.filter(id => id !== productId)
        };
      } else {
        // Add product if not selected
        return {
          ...prev,
          product: [...currentProducts, productId]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('featuredImage', formData.featuredImage);
    
    // Handle multiple products
    formData.product.forEach((productId, index) => {
      formDataToSend.append(`product[${index}]`, productId);
    });

    try {
      const response = await axios.post('/api/admin/dashboard/blog', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Blog post created successfully!');
      setFormData({
        title: '',
        content: '',
        featuredImage: '',
        product: [],
      });
      setStep(1);
    } catch (error) {
      toast.error('Error creating blog post');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Define step titles and descriptions
  const steps = [
    { 
      title: "Content Creation", 
      description: "Write your blog post content" 
    },
    { 
      title: "Image & Products", 
      description: "Add featured image and related products" 
    }
  ];

  return (
    <div className="w-full h-[90vh] overflow-y-auto max-h-[95vh] p-6 bg-gray-50 custom-scrollbar">
      <Card className="w-full shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-800">Create Blog Post</CardTitle>
              <CardDescription className="text-blue-600 mt-1">Share your insights with the world</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center">
                  <div 
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-medium
                    ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                  >
                    {step > i + 1 ? <Check size={16} /> : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-1 w-8 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-600">
              Step {step}: {steps[step-1].title}
            </p>
            <p className="text-xs text-gray-500">{steps[step-1].description}</p>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 pb-20">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-base font-medium text-gray-700">Blog Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter an engaging title for your blog"
                      className="mt-1 h-12"
                      required
                    />
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="content" className="text-base font-medium text-gray-700">Blog Content</Label>
                    <div className="mt-1 border rounded-md">
                      <ReactQuill
                        value={formData.content}
                        onChange={handleQuillChange}
                        className="h-96 rounded"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="featuredImage" className="text-base font-medium text-gray-700">Featured Image</Label>
                    <div className="mt-1 flex items-center">
                      <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors">
                        <Upload className="w-8 h-8" />
                        <span className="mt-2 text-base">Select image</span>
                        <input
                          id="featuredImage"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*"
                          required
                        />
                      </label>
                    </div>
                    {formData.featuredImage && (
                      <p className="mt-2 text-sm text-green-600">
                        Image selected: {typeof formData.featuredImage === 'object' ? formData.featuredImage.name : formData.featuredImage}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium text-gray-700">
                      Related Products 
                      {formData.product.length > 0 && (
                        <span className="text-sm text-blue-600 ml-2">
                          ({formData.product.length} selected)
                        </span>
                      )}
                    </Label>
                    <p className="text-sm text-gray-500 mt-1 mb-3">Select one or more products related to this blog post</p>
                    {fetchingProducts ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {products.map((product) => {
                          const isSelected = formData.product.includes(product._id);
                          return (
                            <Badge
                              key={product._id}
                              variant={isSelected ? "default" : "outline"}
                              className={`px-3 py-2 cursor-pointer text-sm transition-colors ${
                                isSelected 
                                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                  : "hover:bg-blue-50 hover:border-blue-300"
                              }`}
                              onClick={() => handleProductSelect(product._id)}
                            >
                              {product.name}
                              {isSelected && <Check size={14} className="ml-1" />}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                    {products.length === 0 && !fetchingProducts && (
                      <p className="text-sm text-gray-500 mt-2">No products available</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-between p-6 border-t bg-gray-50">
          {step > 1 ? (
            <Button 
              type="button" 
              variant="outline"
              onClick={handlePrevStep}
              className="flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < steps.length ? (
            <Button 
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-1"
              disabled={!formData.title || !formData.content}
            >
              Next
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button 
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !formData.featuredImage}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Publishing...' : 'Publish Blog'}
            </Button>
          )}
        </CardFooter>
      </Card>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default BlogFormComponent;