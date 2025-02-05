import Loader from '@/components/loader/loader';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const RelatedBlogs = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id: productId } = useParams();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const urlPath = window.location.pathname;
        const id = urlPath.substring(urlPath.lastIndexOf('/') + 1);
        const response = await axios.get(`/api/admin/dashboard/blog/product/${id}`);
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchArticles();
  }, [productId]);

  const handleCardClick = (id) => {
    router.push(`/blog/${id}`);
  };

  return (
   <div>
    {articles.length > 0 && (
  <div className="px-4 md:px-10 mt-10 mb-10">
    <h2 className="text-3xl md:text-4xl lg:text-5xl mb-8 font-bold text-center">
      Learn why it&apos;s good for you.
    </h2>

    {loading ? (
      <Loader />  
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {articles.map((article) => (
          <motion.div
            key={article._id}
            className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            onClick={() => handleCardClick(article._id)}
            whileHover={{ y: -5 }}
          >
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:underline">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                {article.subtitle}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{article.category}</span>
                <span>
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
)}

   </div>
  );
};

export default RelatedBlogs;