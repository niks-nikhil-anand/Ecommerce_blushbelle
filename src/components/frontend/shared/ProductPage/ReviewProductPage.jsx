import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Star, User, Calendar, Edit3, Send } from "lucide-react";
import { toast } from "sonner";

const ReviewProductPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [idFromURL, setIdFromURL] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    reviewTitle: '',
    review: ''
  });

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
  const averageRating = reviews.length > 0 ? 
    Math.round((reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length) * 10) / 10 : 0;

  const openModal = (review) => {
    setSelectedReview(review);
  };

  const closeModal = () => {
    setSelectedReview(null);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmitReview = async () => {
    if (!formData.name || !formData.email || !formData.rating || !formData.reviewTitle || !formData.review) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);

    try {
      let id = "";
      if (typeof window !== "undefined") {
        const urlPath = window.location.pathname;
        id = urlPath.substring(urlPath.lastIndexOf("/") + 1);
      }

      if (!id) {
        throw new Error('Invalid product ID. Please refresh and try again.');
      }

      const response = await fetch(`/api/admin/dashboard/review/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit review. Please try again.');
      }

      const newReview = await response.json();
      
      // Add new review to the list with current timestamp
      const reviewWithTimestamp = {
        ...newReview,
        createdAt: new Date().toISOString(),
        _id: Date.now().toString() // Temporary ID until refresh
      };
      
      setReviews(prevReviews => [reviewWithTimestamp, ...prevReviews]);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        rating: 0,
        reviewTitle: '',
        review: ''
      });
      
      setShowReviewForm(false);
      toast.success('Review submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    const validRating = Math.max(0, Math.min(5, rating || 0));
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < validRating ? "text-green-500 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const renderInteractiveStars = (rating, onRatingChange) => {
    const validRating = Math.max(0, Math.min(5, rating || 0));
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 cursor-pointer transition-colors ${
          i < validRating ? "text-green-500 fill-current" : "text-gray-300 hover:text-green-300"
        }`}
        onClick={() => onRatingChange(i + 1)}
      />
    ));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  // Get rating distribution with safe defaults
  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      if (review.rating && review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating] = (distribution[review.rating] || 0) + 1;
      }
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-black font-medium text-sm sm:text-base">Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return null;
  }

  // Return null if no reviews found (this is the key change)
  if (!loading && reviews.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white  py-4 sm:py-8 lg:py-12 px-3 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8 lg:mb-12"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-3 sm:mb-4">
            Customer Reviews
          </h1>
          
          {/* Rating Summary - Only show if there are reviews */}
          {reviews.length > 0 && (
            <>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <span className="text-lg sm:text-2xl font-bold text-black">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-600 font-medium text-sm sm:text-base">
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {/* Rating Distribution */}
              <div className="max-w-xs sm:max-w-md mx-auto mb-4 sm:mb-6">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center mb-1">
                    <span className="text-xs sm:text-sm text-gray-600 w-4 sm:w-8">{rating}</span>
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 fill-current mr-1 sm:mr-2" />
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-green-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(ratingDistribution[rating] / reviews.length) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 w-4 sm:w-8 text-right">
                      {ratingDistribution[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Add Review Button */}
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm sm:text-base"
          >
            <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </motion.div>

        {/* Review Form */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 sm:mb-8"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-4 sm:mb-6">
                  Write Your Review
                </h2>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-black font-medium mb-2 text-sm sm:text-base" htmlFor="name">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-black font-medium mb-2 text-sm sm:text-base" htmlFor="email">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-black font-medium mb-3 text-sm sm:text-base">
                      Rating *
                    </label>
                    <div className="flex space-x-1">
                      {renderInteractiveStars(formData.rating, handleRatingChange)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-black font-medium mb-2 text-sm sm:text-base" htmlFor="reviewTitle">
                      Review Title *
                    </label>
                    <input
                      type="text"
                      id="reviewTitle"
                      name="reviewTitle"
                      value={formData.reviewTitle}
                      onChange={handleFormChange}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Sum up your review in a few words"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-black font-medium mb-2 text-sm sm:text-base" htmlFor="review">
                      Your Review *
                    </label>
                    <textarea
                      id="review"
                      name="review"
                      value={formData.review}
                      onChange={handleFormChange}
                      rows="4"
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm sm:text-base"
                      placeholder="Share your experience with this product..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    disabled={submitting || formData.rating === 0}
                    className="w-full flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8"
        >
          <AnimatePresence>
            {displayedReviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 transition-shadow duration-300 cursor-pointer relative group flex flex-col"
                onClick={() => openModal(review)}
              >
                {/* Card content */}
                <div className="p-3 sm:p-4 lg:p-6 flex flex-col">
                  {/* Header with rating and date */}
                  <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4">
                    <div className="flex flex-col">
                      <div className="flex space-x-1 mb-1">
                        {renderStars(review.rating || 0)}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(review.createdAt || review.date)}
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="text-xs font-medium truncate max-w-16 sm:max-w-20">
                        {review.name || 'Anonymous'}
                      </span>
                    </div>
                  </div>

                  {/* Review title */}
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-2 sm:mb-3 leading-tight line-clamp-2">
                    {review.reviewTitle || 'No title'}
                  </h3>

                  {/* Review text - flexible space */}
                  <div className="flex-1 overflow-hidden">
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-4 lg:line-clamp-5">
                      {review.review || 'No review text available'}
                    </p>
                  </div>

                  {/* Hover icon */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-green-600" />
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
              className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-xs sm:text-sm lg:text-base"
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
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50"
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl mx-2 sm:mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-black">
                          {selectedReview.name || 'Anonymous'}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500">{selectedReview.email || 'Email not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-1">
                        {renderStars(selectedReview.rating || 0)}
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {formatDate(selectedReview.createdAt || selectedReview.date)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0 ml-4"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-black mb-2 sm:mb-3">
                      {selectedReview.reviewTitle || 'No title'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {selectedReview.review || 'No review text available'}
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