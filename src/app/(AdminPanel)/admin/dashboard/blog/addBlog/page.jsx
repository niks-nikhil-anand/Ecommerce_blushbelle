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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
    subtitle: '',
    product: '',
    author: '',
    category: '',
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
    setFormData({ ...formData, product: productId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

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
        subtitle: '',
        product: '',
        author: '',
        category: '',
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
      title: "Details & Metadata", 
      description: "Add supporting information" 
    }
  ];

  return (
    <div className="w-full h-[90vh] overflow-y-auto max-h-[80vh] p-6 bg-gray-50 custom-scrollbar">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="subtitle" className="text-base font-medium text-gray-700">Subtitle</Label>
                    <Input
                      id="subtitle"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      placeholder="Add a descriptive subtitle"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="author" className="text-base font-medium text-gray-700">Author</Label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Who wrote this blog?"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-base font-medium text-gray-700">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Select or create a category"
                      className="mt-1"
                    />
                  </div>
                  
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
                        />
                      </label>
                    </div>
                    {formData.featuredImage && (
                      <p className="mt-2 text-sm text-green-600">
                        Image selected: {typeof formData.featuredImage === 'object' ? formData.featuredImage.name : formData.featuredImage}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-base font-medium text-gray-700">Related Product</Label>
                  {fetchingProducts ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {products.map((product) => (
                        <Badge
                          key={product._id}
                          variant={formData.product === product._id ? "default" : "outline"}
                          className={`px-3 py-1 cursor-pointer text-sm ${
                            formData.product === product._id 
                              ? "bg-blue-600 hover:bg-blue-700" 
                              : "hover:bg-blue-50"
                          }`}
                          onClick={() => handleProductSelect(product._id)}
                        >
                          {product.name}
                        </Badge>
                      ))}
                    </div>
                  )}
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
            >
              Next
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button 
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
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