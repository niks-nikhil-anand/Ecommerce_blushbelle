"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import { Eye, Check, Upload, Loader2, Tag, Plus, Search, Filter, ImageIcon, Package, Calendar, Camera } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Loader from "@/components/loader/loader";
import { FaTrash } from "react-icons/fa";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);


  // New category form states
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    axios
      .get("/api/admin/dashboard/category")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error("Unexpected response format:", response);
          toast.error("Failed to load categories");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        toast.error("Error loading categories");
        setLoading(false);
      });
  };

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, WebP, or GIF)");
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("Image file size must be less than 5MB");
        return;
      }

      setUploadingImage(true);
      setNewCategoryImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setUploadingImage(false);
        toast.success("Image selected successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    
    if (!newCategoryImage) {
      toast.error("Category image is required");
      return;
    }

    setFormLoading(true);

    const formData = new FormData();
    formData.append("name", newCategoryName);
    formData.append("image", newCategoryImage);

    try {
      await axios.post("/api/admin/dashboard/category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Category added successfully!");
      setShowAddModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error("Failed to add category");
      console.error("Error adding category:", error);
    } finally {
      setFormLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async () => {
      setDeleteLoading(true);

    try {
      await axios.delete(`/api/admin/dashboard/category/${categoryToDelete}`);
      toast.success("Category deleted successfully");
      setShowDeleteModal(false);

      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
      console.error("Error deleting category:", error);
    }finally{
     setDeleteLoading(false);

    }
  };

  // Reset form fields
  const resetForm = () => {
    setNewCategoryName("");
    setNewCategoryImage(null);
    setPreviewImage(null);
    setUploadingImage(false);
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    let comparison = 0;
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "createdAt") {
      comparison = new Date(a.createdAt) - new Date(b.createdAt);
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = sortedCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-gray-100 p-6 min-h-screen">
      {/* Header Card */}
      <Card className=" bg-white/95 ">
        <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3 text-gray-900">
                <Tag className="text-blue-600 w-6 h-6" />
                Category Management 
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Manage your product categories with ease. Edit fundamental details about categories including name and visual representation.
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 text-base flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Combined Filters and Table Card */}
      <Card className=" bg-white/95 rounded-b-lg ">
        {/* Filters and Search Section */}
        <CardContent className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Field */}
              <div className="flex items-center gap-2">
                <Filter className="text-gray-500 w-4 h-4" />
                <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                <Select value={sortField} onValueChange={setSortField}>
                  <SelectTrigger className="w-[150px] h-12 bg-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Direction */}
              <Select value={sortDirection} onValueChange={setSortDirection}>
                <SelectTrigger className="w-[120px] h-12 bg-white">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>

              {/* Items Per Page */}
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[100px] h-12 bg-white">
                  <SelectValue placeholder="Show" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        {/* Categories Table Section */}
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
                      <Tag className="w-4 h-4" />
                      Name
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
                {currentCategories.length > 0 ? (
                  currentCategories.map((category) => (
                    <TableRow key={category._id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="text-center p-4">
                        <div className="flex justify-center">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white shadow-lg border-2 border-gray-100">
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 text-base">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-500" />
                          {category.productCount || 0} products
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(category.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-center p-4">
                        <div className="flex gap-3 justify-center">
                          <motion.button
                            onClick={() => console.log("View category", category._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            onClick={() => {
                              setCategoryToDelete(category._id);
                              setShowDeleteModal(true);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all duration-300"
                          >
                            <FaTrash className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <Tag className="w-16 h-16 text-gray-300" />
                        <div>
                          <p className="text-lg font-medium text-gray-500">No categories found</p>
                          <p className="text-gray-400">Try adjusting your search or add a new category</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t bg-gray-50/50">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => setCurrentPage(index + 1)}
                        isActive={currentPage === index + 1}
                        className="cursor-pointer"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Category Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-sm">
          <DialogHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg -m-6 p-6 mb-6">
            <DialogTitle className="text-2xl flex items-center gap-3 text-gray-900">
              <Tag className="text-blue-600 w-6 h-6" />
              Category Management - Basic Information
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base">
              Enter the fundamental details about the category including its name and visual representation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCategory} className="space-y-8">
            {/* Category Name */}
            <div className="space-y-3">
              <Label 
                htmlFor="categoryName" 
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <Tag className="text-green-500 w-4 h-4" />
                Category Name *
              </Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name (e.g., Skincare, Supplements)"
                className="h-12 text-base bg-white w-full"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Camera className="text-pink-500 w-4 h-4" />
                Category Image *
              </Label>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="category-image-upload"
                  />
                  <Label
                    htmlFor="category-image-upload"
                    className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors bg-white hover:bg-gray-50"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        <span className="text-gray-600">Processing image...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Choose Image File</span>
                      </>
                    )}
                  </Label>
                </div>

                {/* Display selected image name */}
                {newCategoryImage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Selected: {newCategoryImage.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Image Preview */}
                {previewImage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white shadow-md">
                        <Image
                          src={previewImage}
                          alt="Category preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Image preview ready
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="pt-6 border-t">
              <DialogClose asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  className="px-10 py-3 text-base"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={formLoading || uploadingImage || !newCategoryName.trim() || !newCategoryImage}
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 text-base flex items-center gap-2 disabled:opacity-50"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Create Category
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
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
              Are you sure you want to delete this category? This action cannot be undone and may affect associated products.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-red-800">
                This action is permanent and cannot be reversed
              </span>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="px-6 py-3 text-base">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={deleteCategory}
              className="px-6 py-3 text-base bg-red-400 hover:bg-red-500"
            >
            {deleteLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;