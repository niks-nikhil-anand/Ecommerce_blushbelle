"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { FaStar, FaCartPlus } from "react-icons/fa";
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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("best-selling");
  const [filters, setFilters] = useState({ availability: "", category: "", price: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(9);
  const router = useRouter();

  // Fetch products whenever sort option, filters, or current page changes
  useEffect(() => {
    fetchProducts();
  }, [sortOption, filters, currentPage]);

  // Fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/dashboard/product/addProduct");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    router.push(`/product/${id}`);
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

  // Get categories from products
  const categories = [...new Set(products.map(product => product.category))].filter(Boolean);
  
  // Filter and sort products based on user selection
  const filteredProducts = products
    .filter((product) => {
      if (filters.availability && product.availability !== filters.availability)
        return false;
      if (filters.category && product.category !== filters.category)
        return false;
      if (filters.price) {
        const price = parseFloat(product.salePrice);
        if (filters.price === "under-500" && price >= 500) return false;
        if (filters.price === "500-1000" && (price < 500 || price > 1000)) return false;
        if (filters.price === "1000-5000" && (price < 1000 || price > 5000)) return false;
        if (filters.price === "above-5000" && price <= 5000) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "best-selling") return b.sales - a.sales;
      if (sortOption === "price-low-high") return a.salePrice - b.salePrice;
      if (sortOption === "price-high-low") return b.salePrice - a.salePrice;
      if (sortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  // Calculate pagination info
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = Math.min(startIndex + productsPerPage, filteredProducts.length);
  const displayedProducts = filteredProducts.slice(startIndex, endIndex);

  // Product card component
  const ProductCard = ({ product }) => {
    // Ensure we have a valid number for the discount calculation
    const originalPrice = parseFloat(product.originalPrice) || 0;
    const salePrice = parseFloat(product.salePrice) || 0;
    const discount = originalPrice > 0 ? 
      Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="h-full overflow-hidden group cursor-pointer border-2 hover:border-indigo-500">
          <div onClick={() => handleCardClick(product._id)} className="h-full flex flex-col">
            {/* Discount badge */}
            {discount > 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                {discount}% OFF
              </Badge>
            )}

            {/* Product Image */}
            <div className="relative h-48 overflow-hidden bg-gray-50">
              {product.featuredImage && (
                <img
                  src={product.featuredImage}
                  alt={product.name || "Product image"}
                  className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
              )}
            </div>

            <CardHeader className="p-4 pb-0">
              <h3 className="font-semibold text-lg line-clamp-1">{product.name || "Unnamed Product"}</h3>
            </CardHeader>

            <CardContent className="p-4 flex-grow">
              {/* Price Section */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-black">
                  ₹{product.salePrice || "N/A"}
                </span>
                {originalPrice > salePrice && (
                  <span className="text-sm font-medium text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={14}
                      className={i < 4 ? "text-yellow-500" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-2">(120 reviews)</span>
              </div>

              {/* Category */}
              {product.category && (
                <Badge variant="outline" className="mt-2 text-xs">
                  {product.category}
                </Badge>
              )}
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300"
              >
                <FaCartPlus className="mr-2" /> Add to Cart
              </Button>
            </CardFooter>
          </div>
        </Card>
      </motion.div>
    );
  };

  // Loading skeleton for product cards
  const ProductCardSkeleton = () => (
    <Card className="h-full">
      <div className="h-48 relative">
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
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {loading ? (
        <>
          <div className="mb-6">
            <Skeleton className="h-10 w-full max-w-xs ml-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.category === ""}
                    onCheckedChange={() => handleFilterChange("category", "")}
                  >
                    All Categories
                  </DropdownMenuCheckboxItem>
                  {categories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={filters.category === category}
                      onCheckedChange={() => handleFilterChange("category", category)}
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
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Select Price Range</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.price === ""}
                    onCheckedChange={() => handleFilterChange("price", "")}
                  >
                    All Prices
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.price === "under-500"}
                    onCheckedChange={() => handleFilterChange("price", "under-500")}
                  >
                    Under ₹500
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.price === "500-1000"}
                    onCheckedChange={() => handleFilterChange("price", "500-1000")}
                  >
                    ₹500 - ₹1,000
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.price === "1000-5000"}
                    onCheckedChange={() => handleFilterChange("price", "1000-5000")}
                  >
                    ₹1,000 - ₹5,000
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.price === "above-5000"}
                    onCheckedChange={() => handleFilterChange("price", "above-5000")}
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
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Product Availability</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.availability === ""}
                    onCheckedChange={() => handleFilterChange("availability", "")}
                  >
                    All Products
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.availability === "in-stock"}
                    onCheckedChange={() => handleFilterChange("availability", "in-stock")}
                  >
                    In Stock
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.availability === "out-of-stock"}
                    onCheckedChange={() => handleFilterChange("availability", "out-of-stock")}
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
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
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
                  <SelectContent>
                    <SelectItem value="best-selling">Best Selling</SelectItem>
                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1}-{endIndex} of {filteredProducts.length} products
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product, index) => (
                <ProductCard key={product._id || `product-${index}`} product={product} />
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
                  // Show first page, last page, and pages around current page
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

                  // Show ellipsis for skipped pages
                  if (
                    index === 1 ||
                    index === totalPages - 2
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

export default AllProducts;