import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";


const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [idFromURL, setIdFromURL] = useState("");

  useEffect(() => {
    const fetchFAQs = async () => {
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

        // Using axios to fetch FAQs
        const response = await axios.get(
          `/api/admin/dashboard/faqs/product/${id}`,
          {
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        const faqsData = Array.isArray(response.data) ? response.data : [];
        console.log(faqsData[0].faq)
        setFaqs(faqsData[0].faq);

      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            const statusCode = error.response.status;
            switch (statusCode) {
              case 404:
                setError(`FAQs not found (ID: ${idFromURL})`);
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
            setError("Network error. Please check your internet connection.");
          } else {
            setError(error.message || "An unexpected error occurred");
          }
        } else {
          setError(error.message || "Failed to fetch FAQs");
        }

        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleExpanded = (index) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index);
    } else {
      newExpandedItems.add(index);
    }
    setExpandedItems(newExpandedItems);
  };

  // Don't render section if no FAQs and no error
  if (faqs.length === 0 && !loading && !error) {
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={faq._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleExpanded(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gradient-to-br from-green-50 to-green-100  transition-colors duration-200 focus:outline-none focus:bg-gray-50"
              >
                <span className="text-base sm:text-lg font-semibold text-gray-900 pr-4 leading-relaxed">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 ml-4">
                  {expandedItems.has(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {expandedItems.has(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2">
                      <div className="h-px bg-gray-200 mb-4"></div>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FAQSection;