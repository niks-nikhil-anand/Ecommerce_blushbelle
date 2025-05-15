"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Import shadcn components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const AddSubCategory = () => {
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imageKey, setImageKey] = useState(Date.now()); // Used to reset file input

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setFetchingCategories(true);
      try {
        const response = await axios.get('/api/admin/dashboard/category');
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);
  
  // Clear form fields
  const resetForm = () => {
    setName('');
    setImage(null);
    setSelectedCategory(null);
    setImageKey(Date.now()); // This forces the file input to reset
  };

  // Handle form submission for adding sub-category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !image || !selectedCategory) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('category', selectedCategory);

    try {
      await axios.post('/api/admin/dashboard/subCategory', formData);
      toast.success('Sub-category added successfully!');
      resetForm(); // Clear the form after successful submission
    } catch (error) {
      console.error('Error adding sub-category:', error);
      toast.error('Failed to add sub-category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto border-t-4 border-t-blue-500 shadow-lg">
      <CardHeader className="bg-gray-100 p-4">
        <CardTitle className="text-2xl font-bold text-gray-700">Add SubCategories</CardTitle>
      </CardHeader>
      <CardContent className="bg-white p-4">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            {/* Category Selection */}
            <div className="space-y-1.5">
              <Label htmlFor="category-selection" className="text-gray-700 font-semibold">
                Category
              </Label>
              {fetchingCategories ? (
                <div className="flex items-center justify-center p-2 bg-gray-50 rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-600 mr-2" />
                  <span className="text-sm text-gray-600">Loading categories...</span>
                </div>
              ) : (
                <ScrollArea className="h-36 border border-gray-200 rounded-md shadow-inner bg-gray-50">
                  <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3 p-2">
                    {categories.map((category) => (
                      <Button
                        key={category._id}
                        type="button"
                        onClick={() => setSelectedCategory(category._id)}
                        variant={selectedCategory === category._id ? "default" : "outline"}
                        className={`w-full justify-start text-xs px-2 py-1.5 transition-all duration-200 ${
                          selectedCategory === category._id 
                            ? "bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md ring-2 ring-blue-300" 
                            : "bg-white border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 text-gray-800 shadow-sm"
                        }`}
                        size="sm"
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Sub-Category Form */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="font-medium text-gray-700">
                  SubCategory Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  required
                  className="border-gray-300 focus:border-blue-400 focus:ring-blue-400 bg-gray-50"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="image" className="font-medium text-gray-700">
                  SubCategory Image
                </Label>
                <Input
                  id="image"
                  key={imageKey}
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  required
                  className="cursor-pointer border-gray-300 focus:border-blue-400 bg-gray-50 file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:mr-2 hover:file:bg-blue-700"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : 'Add SubCategory'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSubCategory;