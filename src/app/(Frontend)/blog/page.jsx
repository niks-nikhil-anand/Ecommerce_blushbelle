"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

import { CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';

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

  const handleCardClick = (id) => {
    router.push(`/blog/${id}`);
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
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { 
      y: -10, 
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: { duration: 0.2 }
    }
  };

  // Skeleton card component
  const SkeletonCard = () => (
    <div className="h-full">
      <Card className="overflow-hidden h-full backdrop-blur-sm bg-white/30 dark:bg-gray-900/50 border-0 shadow-lg rounded-xl flex flex-col">
        <div className="relative w-full h-52 overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
        
        <CardHeader className="p-4 pb-0">
          <Skeleton className="h-6 w-full mb-2" />
        </CardHeader>
        
        <CardContent className="p-4 flex-grow">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col px-4 md:px-10 mt-10 mb-10 justify-center md:ml-5 max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl lg:text-5xl mb-8 font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Read About Our Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Display skeleton cards during loading
          Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <motion.div
              key={`skeleton-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <SkeletonCard />
            </motion.div>
          ))
        ) : (
          // Display actual content
          currentArticles.map((article, index) => (
            <motion.div
              key={article._id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ delay: index * 0.05 }}
              className="h-full"
            >
              <Card 
                className="overflow-hidden h-full backdrop-blur-sm bg-white/30 dark:bg-gray-900/50 border-0 shadow-lg rounded-xl flex flex-col cursor-pointer transition-all duration-300"
                onClick={() => handleCardClick(article._id)}
              >
                <div className="relative w-full h-52 overflow-hidden">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-blue-500/80 hover:bg-blue-600 backdrop-blur-md text-white font-medium">
                      {article.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="p-4 pb-0">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent line-clamp-2">
                    {article.title}
                  </h3>
                </CardHeader>
                
                <CardContent className="p-4 flex-grow">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {article.subtitle.split(" ").slice(0, 30).join(" ")}
                    {article.subtitle.split(" ").length > 30 ? "..." : ""}
                  </p>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 p-0 font-medium"
                  >
                    Read more <ArrowRightIcon className="h-3 w-3 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination controls */}
      {!loading && articles.length > 0 && (
        <div className="mt-10">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious 
                    className="hover:bg-blue-50 dark:hover:bg-gray-800"
                    onClick={() => handlePageChange(currentPage - 1)} 
                  />
                </PaginationItem>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    className={currentPage === i + 1 ? 
                      "bg-blue-500 text-white hover:bg-blue-600" : 
                      "hover:bg-blue-50 dark:hover:bg-gray-800"
                    }
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    className="hover:bg-blue-50 dark:hover:bg-gray-800"
                    onClick={() => handlePageChange(currentPage + 1)} 
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* No articles found message */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No articles found</p>
        </div>
      )}
    </div>
  );
};

export default News;