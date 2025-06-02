"use client"
import React, { useState, useEffect } from 'react';
import BlogCard from '../BlogCard';

const BlogProductPage = () => {
  const [idFromURL, setIdFromURL] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
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
              <BlogCard
                key={article._id || index}
                article={article}
                index={index}
                onCardClick={handleCardClick}
                onReadMoreClick={handleReadMoreClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogProductPage;