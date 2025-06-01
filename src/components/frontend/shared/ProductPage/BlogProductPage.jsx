"use client"
import React, { useState, useEffect } from 'react';

const BlogProductPage = () => {
  const [idFromURL, setIdFromURL] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to calculate reading time based on content
  const calculateReadTime = (content) => {
    if (!content) return 1;
    
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '');
    const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
    
    // Average reading speed is 200-250 words per minute
    const wordsPerMinute = 200;
    const minutes = Math.ceil(words.length / wordsPerMinute);
    
    return minutes || 1; // Ensure at least 1 minute
  };

  // Function to truncate HTML content safely to 30 words
  const truncateContent = (content, maxWords = 30) => {
    if (!content) return '';
    
    const plainText = content.replace(/<[^>]*>/g, '');
    const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (words.length <= maxWords) return plainText;
    
    return words.slice(0, maxWords).join(' ') + '...';
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Safely get ID from URL
        let id = '';
        if (typeof window !== 'undefined') {
          const urlPath = window.location.pathname;
          id = urlPath.substring(urlPath.lastIndexOf('/') + 1);
          setIdFromURL(id);
        }

        if (!id) {
          throw new Error("No product ID found in URL");
        }
        
        console.log('Fetching articles for ID:', id);
        
        // Using fetch with error handling similar to axios pattern
        const response = await fetch(`/api/admin/dashboard/blog/product/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          const statusCode = response.status;
          switch (statusCode) {
            case 404:
              throw new Error(`Articles not found (ID: ${idFromURL})`);
            case 401:
              throw new Error("Unauthorized access. Please check your credentials.");
            case 403:
              throw new Error("Access forbidden. You don't have permission to view this data.");
            case 500:
              throw new Error("Server error. Please try again later.");
            default:
              throw new Error(`Server error: ${response.statusText} (${statusCode})`);
          }
        }

        const data = await response.json();
        console.log('Articles fetched:', data);
        const articlesData = Array.isArray(data) ? data : [];
        setArticles(articlesData);
        
      } catch (error) {
        console.error('Error fetching articles:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          setError("Network error. Please check your internet connection.");
        } else {
          setError(error.message || "Failed to fetch articles");
        }
        
        setArticles([]);
      } finally {
        setLoading(false);
        console.log('Loading state set to false');
      }
    };

    fetchArticles();
  }, []);

  // Safe navigation function
  const handleCardClick = (id) => {
    if (!id) return;
    
    console.log(`Redirecting to blog article with id: ${id}`);
    if (typeof window !== 'undefined') {
      window.location.href = `/blog/${id}`;
    }
  };

  // Separate handler for Read More button to prevent event bubbling
  const handleReadMoreClick = (e, id) => {
    if (e) {
      e.stopPropagation(); // Prevent card click event
    }
    
    if (!id) return;
    
    console.log(`Read More clicked for article id: ${id}`);
    if (typeof window !== 'undefined') {
      window.location.href = `/blog/${id}`;
    }
  };

  // Safe date formatting
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Don't render section if no articles and no error
  if (articles.length === 0 && !loading && !error) {
    return null;
  }

  // Also don't render section during loading if no data
  if (loading) {
    return null;
  }

  // Only show error state for actual errors, not for empty data
  if (error) {
    return null;
  }

  return (
    <div className="w-full  py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Learn why it&apos;s good for you.
            </h1>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div
                key={article._id || index}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-102 hover:-translate-y-2"
                onClick={() => handleCardClick(article._id)}
              >
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 backdrop-blur-sm h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img
                      src={article.featuredImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop'}
                      alt={article.title || 'Article image'}
                      className="w-full h-56 object-cover transition-all duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Article
                      </div>
                    </div>
                    
                    {/* Floating Read More Button */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <div 
                        className="bg-white/95 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-blue-600 hover:text-white transition-colors duration-200 cursor-pointer"
                        onClick={(e) => handleReadMoreClick(e, article._id)}
                      >
                        Read More →
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                      {article.title || 'Untitled Article'}
                    </h3>
                    
                    {/* Content Preview */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                      {truncateContent(article.content) || 'No preview available.'}
                    </p>
                    
                    {/* Footer Section */}
                    <div className="mt-auto">
                      {/* Divider */}
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>
                      
                      {/* Date and Reading Time */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="font-medium">
                            {formatDate(article.createdAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-medium">
                            {calculateReadTime(article.content)} min read
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogProductPage;