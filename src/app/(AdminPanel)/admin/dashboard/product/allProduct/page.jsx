"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEye, FaTrash, FaSearch, FaFilter, FaSort } from "react-icons/fa";
import Loader from "@/components/loader/loader";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Search, sort, filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    isFeatured: "all",
    isOnSale: "all"
  });
  
  // Unique categories for filter dropdown
  const [categories, setCategories] = useState([]);

  // Fetch products from API
  useEffect(() => {
    axios
      .get('/api/admin/dashboard/product/addProduct')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(response.data
            .filter(product => product.category?.name)
            .map(product => product.category.name))];
          setCategories(uniqueCategories);
        } else {
          console.error('Unexpected response format:', response);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category?.name && product.category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.subCatgeory && product.subCatgeory.toLowerCase().includes(searchTerm.toLowerCase()));
      
    // Category filter
    const matchesCategory = filters.category === "all" || 
      (product.category?.name && product.category.name === filters.category);
      
    // Status filter
    const matchesStatus = filters.status === "all" || product.status === filters.status;
    
    // Featured filter
    const matchesFeatured = filters.isFeatured === "all" || 
      (filters.isFeatured === "yes" && product.isFeaturedSale) ||
      (filters.isFeatured === "no" && !product.isFeaturedSale);
      
    // On Sale filter
    const matchesOnSale = filters.isOnSale === "all" || 
      (filters.isOnSale === "yes" && product.isOnSale) ||
      (filters.isOnSale === "no" && !product.isOnSale);
      
    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured && matchesOnSale;
  });

  // Sort products
  const sortedProducts = React.useMemo(() => {
    let sortableProducts = [...filteredProducts];
    
    if (sortConfig.key) {
      sortableProducts.sort((a, b) => {
        let aValue, bValue;
        
        // Handle nested properties or special cases
        if (sortConfig.key === "category") {
          aValue = a.category?.name || "";
          bValue = b.category?.name || "";
        } else if (sortConfig.key === "price") {
          aValue = a.salePrice || a.originalPrice;
          bValue = b.salePrice || b.originalPrice;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }
        
        // Handle string comparison
        if (typeof aValue === "string") {
          if (sortConfig.direction === "ascending") {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        } else {
          // Handle numeric comparison
          if (sortConfig.direction === "ascending") {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        }
      });
    }
    
    return sortableProducts;
  }, [filteredProducts, sortConfig]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Request sort
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const truncateName = (name, wordLimit = 4) => {
    if (!name) return "N/A";
    const words = name.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : name;
  };

  const handleToggle = async (productId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await axios.patch(`/api/admin/dashboard/product/${productId}`, {
        status: newStatus,
      });
  
      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId ? { ...product, status: newStatus } : product
          )
        );
        toast.success(`Product status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("An error occurred while updating the product status");
    }
  };

  const deleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const response = await fetch(`/api/admin/dashboard/product/${productToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        handleDelete(productToDelete);
      } else {
        const { msg } = await response.json();
        toast.error(msg || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDelete = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== productId)
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({
      category: "all",
      status: "all",
      isFeatured: "all",
      isOnSale: "all"
    });
    setSortConfig({ key: null, direction: null });
  };

  if (loading) return <Loader />;
  if (!products.length) return <p className="text-center">No products available.</p>;

  return (
    <Card className="w-full shadow-lg h-[85vh] min-w-full">
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-center">
          <CardTitle>Product Details</CardTitle>
          <Button variant="default" className="bg-[#754E1A] hover:bg-[#5d3e15]">
            Export
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Search, Filter, and Sort Controls */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filters */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <FaFilter /> Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Category Filter */}
              <div className="p-2">
                <p className="text-sm font-medium mb-1">Category</p>
                <Select 
                  value={filters.category} 
                  onValueChange={(value) => setFilters({...filters, category: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Status Filter */}
              <div className="p-2">
                <p className="text-sm font-medium mb-1">Status</p>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => setFilters({...filters, status: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Featured Filter */}
              <div className="p-2">
                <p className="text-sm font-medium mb-1">Featured</p>
                <Select 
                  value={filters.isFeatured} 
                  onValueChange={(value) => setFilters({...filters, isFeatured: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* On Sale Filter */}
              <div className="p-2">
                <p className="text-sm font-medium mb-1">On Sale</p>
                <Select 
                  value={filters.isOnSale} 
                  onValueChange={(value) => setFilters({...filters, isOnSale: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-center"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <FaSort /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white shadow-lg border border-gray-200">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => requestSort("name")} className="cursor-pointer hover:bg-gray-100">
                Name {sortConfig.key === "name" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort("price")} className="cursor-pointer hover:bg-gray-100">
                Price {sortConfig.key === "price" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort("stock")} className="cursor-pointer hover:bg-gray-100">
                Stock {sortConfig.key === "stock" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort("category")} className="cursor-pointer hover:bg-gray-100">
                Category {sortConfig.key === "category" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Items per page */}
          <Select 
            value={itemsPerPage.toString()} 
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Results info */}
        <div className="text-sm text-gray-500 mb-2">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedProducts.length)} of {sortedProducts.length} products
        </div>
        
        {/* Products Table */}
        <div className="overflow-x-auto overflow-y-auto max-h-[50vh] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100">
                <TableHead className="font-medium">Image</TableHead>
                <TableHead className="font-medium">Name</TableHead>
                <TableHead className="font-medium text-center">Stock</TableHead>
                <TableHead className="font-medium">Price</TableHead>
                <TableHead className="font-medium">Category</TableHead>
                <TableHead className="font-medium">SubCategory</TableHead>
                <TableHead className="font-medium text-center">Featured</TableHead>
                <TableHead className="font-medium text-center">On Sale</TableHead>
                <TableHead className="font-medium text-center">Status</TableHead>
                <TableHead className="font-medium text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <TableRow key={product._id} className="hover:bg-gray-50">
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Image
                          src={product.featuredImage || "/placeholder.png"}
                          alt={product.name}
                          width={30}
                          height={60}
                          className="shadow-sm object-cover rounded-sm"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{truncateName(product.name)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={product.stock > 10 ? "success" : (product.stock > 0 ? "warning" : "destructive")}>
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs line-through">₹{product.originalPrice}</span>
                        <span className="text-sm font-medium">₹{product.salePrice}</span>
                        <span className="text-green-600 text-xs">
                          {Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}% Off
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category?.name || "N/A"}</TableCell>
                    <TableCell>{product.subCatgeory || "N/A"}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={product.isFeaturedSale ? "success" : "outline"}>
                        {product.isFeaturedSale ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={product.isOnSale ? "success" : "outline"}>
                        {product.isOnSale ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <Switch
                          checked={product.status === "active"}
                          onCheckedChange={() => handleToggle(product._id, product.status)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => console.log("View product", product._id)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                        >
                          <FaEye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProductToDelete(product._id);
                            setShowDeleteModal(true);
                          }}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                        >
                          <FaTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    No products found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <Button
                  key={number}
                  variant={currentPage === number ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(number)}
                  className={currentPage === number ? "bg-[#754E1A] hover:bg-[#5d3e15]" : ""}
                >
                  {number}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.  
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Toast notifications */}
      <Toaster position="top-right" />
    </Card>
  );
};

export default Products;