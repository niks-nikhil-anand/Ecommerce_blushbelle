"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import BlogCard from '@/components/frontend/shared/BlogCard';

const ITEMS_PER_PAGE = 6;

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('/api/admin/dashboard/blog');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        // Added a small delay to show the skeleton effect
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchArticles();
  }, []);

  // Handler for blog card clicks
  const handleCardClick = (blogId) => {
    router.push(`/blog/${blogId}`);
  };

  // Handler for read more clicks
  const handleReadMoreClick = (e, blogId) => {
    e.stopPropagation(); // Prevent card click event
    router.push(`/blog/${blogId}`);
  };

  // Calculate the current articles based on the current page
  const indexOfLastArticle = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstArticle = indexOfLastArticle - ITEMS_PER_PAGE;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Calculate total pages
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Add a brief loading state when changing pages
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Skeleton card component
  const SkeletonCard = () => (
    <div className="h-full ">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden backdrop-blur-sm h-full flex flex-col">
        {/* Image skeleton */}
        <div className="relative overflow-hidden">
          <Skeleton className="w-full h-56" />
        </div>

        {/* Content skeleton */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title skeleton */}
          <Skeleton className="h-6 w-full mb-3" />
          
          {/* Content preview skeleton */}
          <div className="space-y-2 mb-4 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          
          {/* Footer skeleton */}
          <div className="mt-auto">
            <div className="w-full h-px bg-gray-200 mb-4"></div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
   <div className="flex flex-col px-4 md:px-8 lg:px-12 py-8 md:py-12 justify-start max-w-7xl mx-auto min-h-screen">
  {/* Header Section */}
  <div className="text-center mb-12 md:mb-16">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
      Read About Our Products
    </h2>
  </div>

  {/* Content Grid Section */}
  <div className="flex-1 mb-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {loading ? (
        // Display skeleton cards during loading
        Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
          <motion.div
            key={`skeleton-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <SkeletonCard />
          </motion.div>
        ))
      ) : (
        // Display actual content using BlogCard
        currentArticles.map((article, index) => (
          <motion.div
            key={article._id || article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="h-full"
          >
            <BlogCard
              article={{
                _id: article._id || article.id,
                title: article.title,
                content: article.content || article.subtitle,
                featuredImage: article.featuredImage,
                createdAt: article.createdAt,
                categories: article.categories || [article.category].filter(Boolean)
              }}
              index={index}
              onCardClick={handleCardClick}
              onReadMoreClick={handleReadMoreClick}
            />
          </motion.div>
        ))
      )}
    </div>
  </div>

  {/* Pagination Section - Fixed at bottom */}
  {!loading && articles.length > 0 && totalPages > 1 && (
    <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent className="flex items-center gap-1">
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  className="hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                  onClick={() => handlePageChange(currentPage - 1)} 
                />
              </PaginationItem>
            )}
            
            {/* Show page numbers with ellipsis for large number of pages */}
            {(() => {
              const pages = [];
              const showEllipsis = totalPages > 7;
              
              if (!showEllipsis) {
                // Show all pages if total pages <= 7
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(
                    <PaginationItem key={i}>
                      <PaginationLink
                        className={currentPage === i ? 
                          "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer border-blue-500 transition-all duration-200" : 
                          "hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                        }
                        onClick={() => handlePageChange(i)}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              } else {
                // Show ellipsis for large number of pages
                pages.push(
                  <PaginationItem key={1}>
                    <PaginationLink
                      className={currentPage === 1 ? 
                        "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer border-blue-500 transition-all duration-200" : 
                        "hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                      }
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                );

                if (currentPage > 3) {
                  pages.push(
                    <PaginationItem key="ellipsis1">
                      <span className="px-3 py-2 text-gray-500">...</span>
                    </PaginationItem>
                  );
                }

                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);

                for (let i = start; i <= end; i++) {
                  pages.push(
                    <PaginationItem key={i}>
                      <PaginationLink
                        className={currentPage === i ? 
                          "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer border-blue-500 transition-all duration-200" : 
                          "hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                        }
                        onClick={() => handlePageChange(i)}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                if (currentPage < totalPages - 2) {
                  pages.push(
                    <PaginationItem key="ellipsis2">
                      <span className="px-3 py-2 text-gray-500">...</span>
                    </PaginationItem>
                  );
                }

                pages.push(
                  <PaginationItem key={totalPages}>
                    <PaginationLink
                      className={currentPage === totalPages ? 
                        "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer border-blue-500 transition-all duration-200" : 
                        "hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                      }
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              
              return pages;
            })()}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  className="hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                  onClick={() => handlePageChange(currentPage + 1)} 
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )}

  {/* No articles found message */}
  {!loading && articles.length === 0 && (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">📰</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">No Articles Found</h3>
          <p className="text-gray-500 dark:text-gray-400">Check back later for new content!</p>
        </div>
      </div>
    </div>
  )}
</div>
  );
};

export default News;