"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReviewFormComponent = () => {
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    reviewTitle: '',
    review: '',
    product: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setFetchingProducts(true);
      try {
        const response = await axios.get('/api/admin/dashboard/product/addProduct');
        if (Array.isArray(response.data)) {
          // Ensure all products have string values for required properties
          const sanitizedProducts = response.data.map(product => ({
            ...product,
            name: product.name ? String(product.name) : 'Unnamed Product',
            category: product.category ? String(product.category) : 'Uncategorized',
            _id: product._id ? String(product._id) : '',
            image: product.image ? String(product.image) : ''
          }));
          
          setProducts(sanitizedProducts);
          setFilteredProducts(sanitizedProducts);
          
          // Extract unique categories
          const categories = [...new Set(sanitizedProducts.map(product => product.category || 'Uncategorized'))];
          setProductCategories(categories);
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

  // Filter products based on search term and category
  useEffect(() => {
    let result = [...products];
    
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(product => 
        product.category === selectedCategory
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await axios.post('/api/admin/dashboard/review/addReview', formData);
      toast.success('Your review has been successfully submitted.', {
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      setFormData({
        name: '',
        email: '',
        rating: 5,
        reviewTitle: '',
        review: '',
        product: '',
      });
    } catch (error) {
      toast.error('There was an error submitting your review. Please try again.', {
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg">
      <Card className="border-0 shadow-none">
        <CardHeader className="bg-gray-100 rounded-t-lg">
          <CardTitle className="text-xl font-bold text-gray-800">Submit a Product Review</CardTitle>
          <CardDescription>
            Share your feedback to help others make better purchasing decisions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium">
                  Name <span className="text-sm text-gray-500">(displayed publicly)</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., John Smith"
                  className="rounded-md border-gray-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">
                  Email <span className="text-sm text-gray-500">(kept private)</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="rounded-md border-gray-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="rating" className="font-medium">Your Rating</Label>
                <div className="flex gap-1 p-2 border rounded-md bg-gray-50">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaStar
                        size={28}
                        onClick={() => handleRatingChange(star)}
                        color={star <= formData.rating ? "#FFB800" : "#e4e5e9"}
                        className="cursor-pointer"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewTitle" className="font-medium">Review Title</Label>
                <Input
                  id="reviewTitle"
                  name="reviewTitle"
                  value={formData.reviewTitle}
                  onChange={handleChange}
                  placeholder="Summarize your experience"
                  className="rounded-md border-gray-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review" className="font-medium">Your Review</Label>
              <Textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleChange}
                placeholder="Share your experience with this product. What did you like or dislike? What would you want other customers to know?"
                className="rounded-md border-gray-300 min-h-32"
                required
              />
            </div>

            <div className="space-y-4">
              <Label className="font-medium">Select Product</Label>
              
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                  <Select 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
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
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredProducts.map((product) => {
                      // Make sure we have string values and not objects
                      const productId = String(product._id || '');
                      const productName = String(product.name || 'Unnamed Product');
                      const productCategory = String(product.category || 'Uncategorized');
                      const productImage = String(product.image || '');
                      
                      return (
                        <motion.div
                          key={productId}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div
                            onClick={() => handleProductSelect(productId)}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              formData.product === productId
                                ? 'border-2 border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex flex-col h-full">
                              {productImage && (
                                <div className="mb-2 w-full aspect-square rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                  <img 
                                    src={productImage} 
                                    alt={productName}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/api/placeholder/100/100";
                                    }}
                                  />
                                </div>
                              )}
                              <div className="flex-grow">
                                <h3 className="font-medium text-sm mb-1 line-clamp-2">{productName}</h3>
                                {productCategory && (
                                  <Badge variant="outline" className="text-xs bg-gray-100">
                                    {productCategory}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No products match your search</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end bg-gray-50 rounded-b-lg p-6">
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={loading || !formData.product}
            className="px-6"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Toaster position="top-center" />
    </div>
  );
};

export default ReviewFormComponent;