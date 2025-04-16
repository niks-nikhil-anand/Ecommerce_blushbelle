"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import { 
  Eye, 
  Trash2, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Calendar,
  User,
  Bookmark,
  X,
  FileText,
  Layers,
  RefreshCw
} from "lucide-react";

// Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to generate consistent colors based on string values
const stringToColor = (str) => {
  if (!str) return "#f3f4f6"; // Default light gray
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // To ensure the colors are light/pastel and not too bright or dark
  const hue = ((hash % 360) + 360) % 360;
  return `hsla(${hue}, 70%, 85%, 0.3)`;
};

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "title", direction: "ascending" });
  const [activeFilters, setActiveFilters] = useState({
    category: "all",
    author: "all"
  });
  const [categoryOptions, setCategoryOptions] = useState(["all"]);
  const [authorOptions, setAuthorOptions] = useState(["all"]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/dashboard/blog");
      setArticles(response.data);
      setFilteredArticles(response.data);
      
      // Extract unique categories and authors for filters
      const categories = ["all", ...new Set(response.data.map(article => article.category).filter(Boolean))];
      const authors = ["all", ...new Set(response.data.map(article => article.author).filter(Boolean))];
      
      setCategoryOptions(categories);
      setAuthorOptions(authors);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchArticles().finally(() => {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 600);
    });
  };

  // Search functionality
  useEffect(() => {
    const results = articles.filter(article => {
      const matchesSearch = 
        (article.title && article.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (article.subtitle && article.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (article.author && article.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (article.category && article.category.toLowerCase().includes(searchQuery.toLowerCase()));
        
      const matchesCategory = activeFilters.category === "all" || article.category === activeFilters.category;
      const matchesAuthor = activeFilters.author === "all" || article.author === activeFilters.author;
      
      return matchesSearch && matchesCategory && matchesAuthor;
    });
    
    setFilteredArticles(sortData(results));
    setCurrentPage(1);
  }, [searchQuery, activeFilters, sortConfig.key, sortConfig.direction, articles]);

  // Sorting functionality
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortData = (data) => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  // Helper functions for text truncation
  const truncateText = (text, limit) => {
    if (!text) return '';
    const words = text.split(" ");
    return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
  };

  const stripHtmlTags = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  // Delete functionality
  const deleteArticle = async () => {
    if (!productToDelete) return;
    try {
      const response = await fetch(`/api/admin/dashboard/blog/${productToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setArticles(prevArticles => 
          prevArticles.filter(article => article._id !== productToDelete)
        );
        setFilteredArticles(prevArticles => 
          prevArticles.filter(article => article._id !== productToDelete)
        );
      } else {
        const { msg } = await response.json();
        console.error(msg || "Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Render loading skeletons
  if (loading) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle>Articles Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-[250px]" />
              <Skeleton className="h-9 w-[150px]" />
              <Skeleton className="h-9 w-[150px]" />
            </div>
          </div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-2 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5" /> 
            Articles Dashboard
          </CardTitle>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search articles..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={activeFilters.category}
              onValueChange={(value) => setActiveFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(category => (
                  <SelectItem 
                    key={category} 
                    value={category}
                    className="focus:bg-blue-100"
                    style={{
                      backgroundColor: category === activeFilters.category 
                        ? stringToColor(category) 
                        : category !== "all" 
                          ? "rgba(243, 244, 246, 0.5)" 
                          : "transparent"
                    }}
                  >
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={activeFilters.author}
              onValueChange={(value) => setActiveFilters(prev => ({ ...prev, author: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <SelectValue placeholder="Author" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {authorOptions.map(author => (
                  <SelectItem 
                    key={author} 
                    value={author}
                    className="focus:bg-blue-100"
                    style={{
                      backgroundColor: author === activeFilters.author 
                        ? stringToColor(author) 
                        : author !== "all" 
                          ? "rgba(243, 244, 246, 0.5)" 
                          : "transparent"
                    }}
                  >
                    {author === "all" ? "All Authors" : author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[100px]">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <SelectValue placeholder="Show" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 20].map(size => (
                  <SelectItem 
                    key={size} 
                    value={size.toString()}
                    className="focus:bg-blue-100"
                    style={{
                      backgroundColor: size === itemsPerPage 
                        ? "rgba(219, 234, 254, 0.6)" 
                        : "transparent"
                    }}
                  >
                    {size} rows
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Active filters */}
        {(activeFilters.category !== "all" || activeFilters.author !== "all") && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.category !== "all" && (
              <Badge 
                variant="secondary" 
                className="px-3 py-1"
                style={{ backgroundColor: stringToColor(activeFilters.category) }}
              >
                Category: {activeFilters.category}
                <button 
                  className="ml-2" 
                  onClick={() => setActiveFilters(prev => ({ ...prev, category: "all" }))}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {activeFilters.author !== "all" && (
              <Badge 
                variant="secondary" 
                className="px-3 py-1"
                style={{ backgroundColor: stringToColor(activeFilters.author) }}
              >
                Author: {activeFilters.author}
                <button 
                  className="ml-2" 
                  onClick={() => setActiveFilters(prev => ({ ...prev, author: "all" }))}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
        
        {/* Results info */}
        <div className="text-sm text-gray-500 mb-4">
          Showing {filteredArticles.length ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredArticles.length)} of {filteredArticles.length} articles
        </div>
        
        {/* Articles table */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50 hover:bg-gray-100">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead onClick={() => requestSort('title')} className="cursor-pointer">
                  <div className="flex items-center">
                    Title
                    {sortConfig.key === 'title' ? (
                      sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="ml-1 h-4 w-4" /> : 
                      <ArrowDown className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead onClick={() => requestSort('subtitle')} className="cursor-pointer">
                  <div className="flex items-center">
                    Subtitle
                    {sortConfig.key === 'subtitle' ? (
                      sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="ml-1 h-4 w-4" /> : 
                      <ArrowDown className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Content</TableHead>
                <TableHead onClick={() => requestSort('category')} className="cursor-pointer">
                  <div className="flex items-center">
                    Category
                    {sortConfig.key === 'category' ? (
                      sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="ml-1 h-4 w-4" /> : 
                      <ArrowDown className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead onClick={() => requestSort('author')} className="cursor-pointer">
                  <div className="flex items-center">
                    Author
                    {sortConfig.key === 'author' ? (
                      sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="ml-1 h-4 w-4" /> : 
                      <ArrowDown className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentArticles.length > 0 ? (
                currentArticles.map((article) => (
                  <TableRow key={article._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex justify-center">
                        {article.featuredImage ? (
                          <Image
                            src={article.featuredImage}
                            alt={article.title || 'Article image'}
                            width={48}
                            height={48}
                            className="rounded-full object-cover shadow-sm border"
                            style={{ width: "48px", height: "48px" }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{truncateText(article.title, 4)}</TableCell>
                    <TableCell>{truncateText(article.subtitle, 4)}</TableCell>
                    <TableCell>
                      {truncateText(stripHtmlTags(article.content), 8)}
                    </TableCell>
                    <TableCell>
                      {article.category ? (
                        <Badge 
                          variant="outline" 
                          className="bg-blue-50"
                          style={{ backgroundColor: stringToColor(article.category) }}
                        >
                          {article.category}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">Uncategorized</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-gray-500" />
                        <span 
                          className="px-2 py-0.5 rounded-full text-xs" 
                          style={{ backgroundColor: stringToColor(article.author) }}
                        >
                          {article.author || "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {article.product?.name ? (
                        <Badge 
                          variant="secondary"
                          style={{ backgroundColor: stringToColor(article.product.name) }}
                        >
                          {article.product.name}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setProductToDelete(article._id);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No articles found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {filteredArticles.length > 0 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => {
                  // Show first page, last page, current page and one page before and after current
                  if (
                    index === 0 || 
                    index === totalPages - 1 || 
                    index === currentPage - 1 ||
                    index === currentPage - 2 || 
                    index === currentPage
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(index + 1);
                          }}
                          isActive={currentPage === index + 1}
                          style={
                            currentPage === index + 1 
                              ? { backgroundColor: "#3b82f6" } 
                              : { backgroundColor: "transparent" }
                          }
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  
                  // Show ellipsis for breaks in sequence
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
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start flex gap-2">
            <Button 
              variant="destructive" 
              onClick={deleteArticle}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster position="bottom-right" />
    </Card>
  );
};

export default Articles;