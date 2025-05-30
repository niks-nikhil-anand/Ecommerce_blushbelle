import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import axios from "axios";

const IngredientProductPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [idFromURL, setIdFromURL] = useState("");

  useEffect(() => {
    const fetchIngredient = async () => {
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

        // Using axios instead of fetch
        const response = await axios.get(
          `/api/admin/dashboard/ingredient/product/${id}`,
          {
            timeout: 10000, // 10 second timeout
            headers: {
              'Content-Type': 'application/json',
              // Add any additional headers if needed
              // 'Authorization': `Bearer ${token}`,
            }
          }
        );

        const ingredientsData = Array.isArray(response.data) ? response.data : [];
        
        setIngredients(ingredientsData);

      } catch (error) {
        
        if (axios.isAxiosError(error)) {
          // Handle specific error cases
          if (error.response) {
            // Server responded with error status
            const statusCode = error.response.status;
            switch (statusCode) {
              case 404:
                setError(`Product not found (ID: ${idFromURL})`);
                break;
              case 401:
                setError("Unauthorized access. Please check your credentials.");
                break;
              case 403:
                setError("Access forbidden. You don't have permission to view this data.");
                break;
              case 500:
                setError("Server error. Please try again later.");
                break;
              default:
                setError(`Server error: ${error.response.statusText} (${statusCode})`);
            }
          } else if (error.request) {
            // Request was made but no response received
            setError("Network error. Please check your internet connection.");
          } else {
            // Something else happened
            setError(error.message || "An unexpected error occurred");
          }
        } else {
          // Non-axios error
          setError(error.message || "Failed to fetch ingredients");
        }

        setIngredients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredient();
  }, []);

  const displayedIngredients = showAll ? ingredients : ingredients.slice(0, 6);
  const hasMoreIngredients = ingredients.length > 6;

  const openModal = (ingredient) => {
    setSelectedIngredient(ingredient);
  };

  const closeModal = () => {
    setSelectedIngredient(null);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-700 font-medium">Loading ingredients...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
        <div className="text-center text-red-600 max-w-md mx-auto">
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <p className="text-lg font-medium mb-2">Error loading ingredients</p>
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

  // Don't render the section if no ingredients
  if (ingredients.length === 0 && !loading && !error) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-br from-green-50 to-green-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Key Ingredients
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8"
        >
          <AnimatePresence>
            {displayedIngredients.map((ingredient, index) => (
              <motion.div
                key={ingredient._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer relative group  flex flex-col"
                onClick={() => openModal(ingredient)}
              >
                {/* Square container with padding */}
                <div className="p-4 sm:p-6 flex flex-col ">
                  {/* Header with image */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 pr-2 sm:pr-4 flex-1 leading-tight">
                      {ingredient.name}
                    </h3>
                    <div className="flex-shrink-0">
                      <img
                        src={ingredient.image}
                        alt={ingredient.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Benefits text - flexible space */}
                  <div className="flex-1 overflow-hidden">
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-4 sm:line-clamp-5">
                      {ingredient.benefits}
                    </p>
                  </div>

                  {/* Hover icon */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {hasMoreIngredients && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <button
              onClick={toggleShowAll}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm sm:text-base"
            >
              {showAll ? `View Less (showing ${ingredients.length})` : `View All (${ingredients.length - 6} more)`}
            </button>
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedIngredient && (
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
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedIngredient.image}
                      alt={selectedIngredient.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                      {selectedIngredient.name}
                    </h2>
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
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      Benefits
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {selectedIngredient.benefits}
                    </p>
                  </div>

                  {selectedIngredient.facts && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        Nutritional Facts
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {selectedIngredient.facts}
                      </p>
                    </div>
                  )}

                  {selectedIngredient.chemistryName && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        Chemistry Name
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {selectedIngredient.chemistryName}
                      </p>
                    </div>
                  )}

                  {selectedIngredient.origin && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        Origin
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {selectedIngredient.origin}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IngredientProductPage;