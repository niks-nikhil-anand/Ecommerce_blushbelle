"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Loader from '@/components/loader/loader';

const ITEMS_PER_PAGE = 6; 

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleCardClick = (id) => {
    console.log('Card clicked with ID:', id);
    router.push(`/blog/${id}`);
  };

  // Calculate the current articles based on the current page
  const indexOfLastArticle = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstArticle = indexOfLastArticle - ITEMS_PER_PAGE;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Calculate total pages
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col px-4 md:px-10 mt-10 mb-10 justify-center md:ml-[90px]">
    <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4 font-bold text-center">
      Learn why it's good for you.
    </h2>
  
    {loading ? (
      <Loader />  
    ) : (
      <div className="flex flex-wrap justify-start gap-4">
        {articles.map((article) => (
          <motion.div
            key={article._id}
            className="p-4  cursor-pointer w-full sm:w-[48%] md:w-[30%] lg:w-[30%] mt-5 shadow-sm"
            onClick={() => handleCardClick(article._id)}
          >
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-44 object-cover rounded-t-lg mb-3"
            />
            <h3 className="text-base md:text-xl lg:text-base font-semibold text-center textColor hover:underline">
              {article.title}
            </h3>
            <div className='mt-5 w-25%'>
            <p className="text-sm md:text-base lg:text-sm text-gray-600 ">
              {article.subtitle.split(" ").slice(0, 50).join(" ")}{article.subtitle.split(" ").length > 50 ? "..." : ""}
              </p>    
              <div className="text-xs md:text-sm lg:text-base text-gray-500 mt-2">
               {article.category}
            </div>
            <div className="text-xs md:text-sm lg:text-base text-gray-400 mt-1">
              Published on {new Date(article.createdAt).toLocaleDateString()}
            </div>
            </div>
           
          </motion.div>
        ))}
      </div>
    )}
  </div>
  );
};

export default News;
