"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

// Import shadcn components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import ProductCard from "@/components/frontend/shared/ProductCard";

const ShopProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("best-selling");
  const [filters, setFilters] = useState({ availability: "", category: "", price: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(9);
  const router = useRouter();

  // Fetch products whenever sort option or filters change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption, filters]);

  // Fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/dashboard/product/addProduct");
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      const data = await response.json();
      // Ensure we're working with an array and that each item is properly formatted
      const formattedData = Array.isArray(data) ? data.map(product => {
        if (typeof product === 'object' && product !== null) {
          return product;
        }
        return {}; // Return empty object for invalid items
      }) : [];


      console.log(formattedData)
      
      setProducts(formattedData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle sort change
  const handleSortChange = (value) => setSortOption(value);

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle page size change
  const handlePageSizeChange = (value) => {
    setProductsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Extract categories safely from products
  const categories = [...new Set(products
    .filter(product => product && typeof product === 'object')
    .map(product => {
      const category = product.category;
      return typeof category === 'string' ? category : "Uncategorized";
    })
  )].filter(Boolean).sort();
  
  // Filter and sort products with safeguards
  const filteredProducts = products
    .filter((product) => {
      if (!product || typeof product !== 'object') return false;
      
      if (filters.availability && product.availability !== filters.availability)
        return false;
      
      if (filters.category && product.category !== filters.category)
        return false;
      
      if (filters.price) {
        const price = typeof product.salePrice === 'number' ? product.salePrice : 
                     typeof product.salePrice === 'string' ? parseFloat(product.salePrice) || 0 : 0;
                     
        if (filters.price === "under-500" && price >= 500) return false;
        if (filters.price === "500-1000" && (price < 500 || price > 1000)) return false;
        if (filters.price === "1000-5000" && (price < 1000 || price > 5000)) return false;
        if (filters.price === "above-5000" && price <= 5000) return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Handle sorting with type safety
      if (sortOption === "best-selling") {
        const salesA = typeof a.sales === 'number' ? a.sales : 0;
        const salesB = typeof b.sales === 'number' ? b.sales : 0;
        return salesB - salesA;
      }
      
      if (sortOption === "price-low-high") {
        const priceA = typeof a.salePrice === 'number' ? a.salePrice : 
                      typeof a.salePrice === 'string' ? parseFloat(a.salePrice) || 0 : 0;
        const priceB = typeof b.salePrice === 'number' ? b.salePrice : 
                      typeof b.salePrice === 'string' ? parseFloat(b.salePrice) || 0 : 0;
        return priceA - priceB;
      }
      
      if (sortOption === "price-high-low") {
        const priceA = typeof a.salePrice === 'number' ? a.salePrice : 
                      typeof a.salePrice === 'string' ? parseFloat(a.salePrice) || 0 : 0;
        const priceB = typeof b.salePrice === 'number' ? b.salePrice : 
                      typeof b.salePrice === 'string' ? parseFloat(b.salePrice) || 0 : 0;
        return priceB - priceA;
      }
      
      if (sortOption === "newest") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      
      return 0;
    });

  // Calculate pagination info
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = Math.min(startIndex + productsPerPage, filteredProducts.length);
  const displayedProducts = filteredProducts.slice(startIndex, endIndex);

  // Loading skeleton for product cards
  const ProductCardSkeleton = () => (
    <Card className="h-full">
      <div className="h-56 relative">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="p-4 pb-0">
        <Skeleton className="h-6 w-full" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-1/2 mt-2" />
        <div className="flex mt-2 gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4" />
          ))}
        </div>
        <Skeleton className="h-6 w-1/3 mt-2" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 min-h-[90vh]">
      {loading ? (
        <>
          <div className="mb-6">
            <Skeleton className="h-10 w-full max-w-xs ml-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(productsPerPage)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Filters and Sort Options */}
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <div className="flex flex-wrap gap-4">
              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white">
                    Category
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-50">
                  <DropdownMenuLabel className="bg-gray-100">Select Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.category === ""}
                    onClick={() => handleFilterChange("category", "")}
                    className="hover:bg-gray-100"
                  >
                    All Categories
                  </DropdownMenuCheckboxItem>
                  {categories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={filters.category === category}
                      onClick={() => handleFilterChange("category", category)}
                      className="hover:bg-gray-100"
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Price Range Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white">
                    Price Range
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-50">
                  <DropdownMenuLabel className="bg-gray-100">Select Price Range</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.price === ""}
                    onClick={() => handleFilterChange("price", "")}
                    className="hover:bg-gray-100"
                  >
                    All Prices
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.price === "under-500"}
                    onClick={() => handleFilterChange("price", "under-500")}
                    className="hover:bg-gray-100"
                  >
                    Under ₹500
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.price === "500-1000"}
                    onClick={() => handleFilterChange("price", "500-1000")}
                    className="hover:bg-gray-100"
                  >
                    ₹500 - ₹1,000
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.price === "1000-5000"}
                    onClick={() => handleFilterChange("price", "1000-5000")}
                    className="hover:bg-gray-100"
                  >
                    ₹1,000 - ₹5,000
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.price === "above-5000"}
                    onClick={() => handleFilterChange("price", "above-5000")}
                    className="hover:bg-gray-100"
                  >
                    Above ₹5,000
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Availability Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white">
                    Availability
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-50">
                  <DropdownMenuLabel className="bg-gray-100">Product Availability</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.availability === ""}
                    onClick={() => handleFilterChange("availability", "")}
                    className="hover:bg-gray-100"
                  >
                    All Products
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.availability === "in-stock"}
                    onClick={() => handleFilterChange("availability", "in-stock")}
                    className="hover:bg-gray-100"
                  >
                    In Stock
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.availability === "out-of-stock"}
                    onClick={() => handleFilterChange("availability", "out-of-stock")}
                    className="hover:bg-gray-100"
                  >
                    Out of Stock
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex gap-4 items-center">
              {/* Products Per Page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <Select
                  value={productsPerPage.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-20 bg-white">
                    <SelectValue placeholder="9" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-50">
                    <SelectItem value="6" className="hover:bg-gray-100">6</SelectItem>
                    <SelectItem value="9" className="hover:bg-gray-100">9</SelectItem>
                    <SelectItem value="12" className="hover:bg-gray-100">12</SelectItem>
                    <SelectItem value="24" className="hover:bg-gray-100">24</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Select value={sortOption} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40 bg-white">
                    <SelectValue placeholder="Best Selling" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-50">
                    <SelectItem value="best-selling" className="hover:bg-gray-100">Best Selling</SelectItem>
                    <SelectItem value="price-low-high" className="hover:bg-gray-100">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-low" className="hover:bg-gray-100">Price: High to Low</SelectItem>
                    <SelectItem value="newest" className="hover:bg-gray-100">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Showing {filteredProducts.length > 0 ? startIndex + 1 : 0}-{endIndex} of {filteredProducts.length} products
            </p>
          </div>

          {/* Active Filters */}
          {(filters.category || filters.price || filters.availability) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.category && (
                <Badge variant="secondary" className="px-3 py-1">
                  {filters.category}
                  <button
                    className="ml-2"
                    onClick={() => handleFilterChange("category", "")}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.price && (
                <Badge variant="secondary" className="px-3 py-1">
                  {filters.price === "under-500"
                    ? "Under ₹500"
                    : filters.price === "500-1000"
                    ? "₹500 - ₹1,000"
                    : filters.price === "1000-5000"
                    ? "₹1,000 - ₹5,000"
                    : "Above ₹5,000"}
                  <button
                    className="ml-2"
                    onClick={() => handleFilterChange("price", "")}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.availability && (
                <Badge variant="secondary" className="px-3 py-1">
                  {filters.availability === "in-stock"
                    ? "In Stock"
                    : "Out of Stock"}
                  <button
                    className="ml-2"
                    onClick={() => handleFilterChange("availability", "")}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {(filters.category || filters.price || filters.availability) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFilters({ category: "", price: "", availability: "" })
                  }
                  className="text-sm"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          )}

          {/* Products Grid */}
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {displayedProducts.map((product, index) => (
                <ProductCard 
                  key={product._id ? product._id.toString() : `product-${index}`} 
                  product={product} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter to find what you&apos;re looking for.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setFilters({ category: "", price: "", availability: "" })}
              >
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, index) => {
                  if (
                    index === 0 ||
                    index === totalPages - 1 ||
                    (index >= currentPage - 2 && index <= currentPage + 0)
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(index + 1);
                          }}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Show ellipsis for skipped pages (but only once)
                  if (
                    (index === 1 && currentPage > 3) ||
                    (index === totalPages - 2 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default ShopProducts;