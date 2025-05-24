import Loader from '@/components/loader/loader';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ProductCard from '../shared/ProductCard';

const RelatedProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id: productId } = useParams();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/dashboard/product/relatedProduct/${productId}`);
        setProducts(response.data.slice(0, 4)); // Show only 4 products
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchRelatedProducts();
  }, [productId]);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-3 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl md:text-2xl font-bold mb-8 text-center text-gray-800"
      >
        Related Products
      </motion.h1>
      
      {products.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1 // Stagger animation
              }}
              className="h-full"
            >
              <ProductCard 
                product={product}
                isLoading={false}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg 
                className="w-16 h-16 mx-auto" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No Related Products
            </h3>
            <p className="text-gray-500">
              We couldn't find any related products at this time.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RelatedProducts;