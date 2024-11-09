"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaEye, FaTrash } from 'react-icons/fa'; 
import { AiOutlineClose } from 'react-icons/ai';



const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null); // State to hold the selected article content
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const articlesPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log('Fetching articles...');
        const response = await axios.get('/api/admin/dashboard/blog');
        console.log('Articles fetched:', response.data);
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
        console.log('Loading state set to false');
      }
    };

    fetchArticles();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCardClick = (id) => {
    console.log('Card clicked with ID:', id);
    router.push(`/blog/${id}`);
  };

  const handleViewClick = async (id) => {
    try {
      const response = await axios.get(`/api/admin/dashboard/blog/${id}`);
      setSelectedArticle(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error('Error fetching full blog content:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const confirmed = confirm('Are you sure you want to delete this article?');
      if (!confirmed) return;

      await axios.delete(`/api/admin/dashboard/blog/${id}`);
      setArticles(articles.filter(article => article._id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedArticle(null);
  };

  return (
    <div className="flex flex-col mb-10 mt-5 px-10">
      <h1 className="text-3xl font-bold mb-2 text-center underline"> ALL BLOGS</h1>
      {loading ? (
        <motion.div
          className="flex justify-center items-center h-64"
        >
          <div className="loader"></div>
        </motion.div>
      ) : (
        <>
          <div className="space-y-4">
            {currentArticles.map((article) => (
              <motion.div
                key={article._id}
                className="flex bg-white rounded-lg shadow-md cursor-pointer p-4 relative"
              >
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-24 h-24 object-cover rounded-lg mr-4"
                />
                <div className="flex flex-col justify-between flex-grow">
                  <h3 className="text-xl font-semibold mb-1">{article.title}</h3>
                  <p className="text-gray-600 mb-1">{article.subtitle}</p>
                  <div className="text-sm text-gray-500">
                    By {article.author} in {article.category}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Published on {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex justify-end space-x-2 absolute bottom-4 right-4">
                    {/* View Button */}
                    <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewClick(article._id);
                  }}
                  className="bg-blue-500 text-white px-2 py-1 text-sm rounded-md shadow-md hover:bg-blue-600 flex items-center"
                >
                  <FaEye className="mr-1" /> {/* View icon */}
                  View
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(article._id);
                  }}
                  className="bg-red-500 text-white px-2 py-1 text-sm rounded-md shadow-md hover:bg-red-600 flex items-center"
                >
                  <FaTrash className="mr-1" /> {/* Delete icon */}
                  Delete
                </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            {Array.from({ length: Math.ceil(articles.length / articlesPerPage) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 border rounded ${
                  currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Popup for Full Blog Content */}
      {showPopup && selectedArticle && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full h-96 overflow-y-auto relative">
            <h2 className="text-2xl font-bold mb-4">{selectedArticle.title}</h2>
            <div
              className="prose prose-sm md:prose-lg mx-auto"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <AiOutlineClose size={24} /> {/* Close icon from React Icons */}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default News;
