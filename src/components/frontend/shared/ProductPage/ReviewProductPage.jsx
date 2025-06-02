import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Star, User, Calendar } from "lucide-react";

const ReviewProductPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [idFromURL, setIdFromURL] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Safely get ID from URL
        let id = "";
        if (typeof window !== "undefined") {
          const urlPath = window.location.pathname;
          id = urlPath.substring(urlPath.lastIndexOf("/") + 1);
          setIdFromURL(id);
        }

        if (!id) {
          throw new Error("No product ID found in URL");
        }

        // Using fetch instead of axios
        const response = await fetch(
          `/api/admin/dashboard/review/product/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Add any additional headers if needed
              // 'Authorization': `Bearer ${token}`,
            },
            signal: AbortSignal.timeout(10000) // 10 second timeout
          }
        );

        if (!response.ok) {
          // Handle specific error cases
          const statusCode = response.status;
          switch (statusCode) {
            case 404:
              throw new Error(`Product reviews not found (ID: ${idFromURL})`);
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
        const reviewsData = Array.isArray(data) ? data : [];
        
        setReviews(reviewsData);

      } catch (error) {
        
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
          setError("Request timed out. Please try again.");
        } else if (error instanceof TypeError) {
          setError("Network error. Please check your internet connection.");
        } else {
          setError(error.message || "Failed to fetch reviews");
        }

        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 6);
  const hasMoreReviews = reviews.length > 6;

  const openModal = (review) => {
    setSelectedReview(review);
  };

  const closeModal = () => {
    setSelectedReview(null);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
        <div className="text-center text-red-600 max-w-md mx-auto">
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <p className="text-lg font-medium mb-2">Error loading reviews</p>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the section if no reviews
  if (reviews.length === 0 && !loading && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
        <div className="text-center text-gray-600 max-w-md mx-auto">
          <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No Reviews Yet</p>
            <p className="text-sm">Be the first to review this product!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-blue-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Customer Reviews
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <div className="flex space-x-1">
              {renderStars(Math.round(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length))}
            </div>
            <span className="text-gray-600 font-medium">
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8"
        >
          <AnimatePresence>
            {displayedReviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer relative group flex flex-col"
                onClick={() => openModal(review)}
              >
                {/* Card content */}
                <div className="p-4 sm:p-6 flex flex-col">
                  {/* Header with rating and date */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex flex-col">
                      <div className="flex space-x-1 mb-1">
                        {renderStars(review.rating)}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium truncate max-w-20">
                        {review.name}
                      </span>
                    </div>
                  </div>

                  {/* Review title */}
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">
                    {review.reviewTitle}
                  </h3>

                  {/* Review text - flexible space */}
                  <div className="flex-1 overflow-hidden">
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-4 sm:line-clamp-5">
                      {review.review}
                    </p>
                  </div>

                  {/* Hover icon */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {hasMoreReviews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <button
              onClick={toggleShowAll}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
            >
              {showAll ? `View Less (showing ${reviews.length})` : `View All (${reviews.length - 6} more)`}
            </button>
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedReview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                          {selectedReview.name}
                        </h2>
                        <p className="text-sm text-gray-500">{selectedReview.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-1">
                        {renderStars(selectedReview.rating)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(selectedReview.createdAt)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0 ml-4"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                      {selectedReview.reviewTitle}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {selectedReview.review}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReviewProductPage;