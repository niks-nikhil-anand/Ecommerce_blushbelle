"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const BlogFormComponent = () => {
  const [step, setStep] = useState(1);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featuredImage: '',
    subtitle: '',
    product: '',
    author: '',
  });
  const [loading, setLoading] = useState(false);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuillChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, featuredImage: file });
  };


  useEffect(() => {
    const fetchProducts = async () => {
      setFetchingProducts(true);
      try {
        const response = await axios.get('/api/admin/dashboard/product/addProduct');
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setFetchingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductSelect = (productId) => {
    setFormData({ ...formData, product: productId });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post('/api/admin/dashboard/blog', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Blog added successfully!');
      setFormData({
        title: '',
        content: '',
        featuredImage: '',
        subtitle: '',
        product: '',
        author: '',
      });
      setStep(1);
    } catch (error) {
      toast.error('Error adding blog');
    } finally {
      setLoading(false); 
    }
  };


  return (
    <div className="max-w-full mx-auto p-4 bg-gray-50  rounded-lg w-full h-[90vh]  overflow-y-auto max-h-[80vh] custom-scrollbar ">
     <h1 className="text-2xl font-bold mb-6">Add Blog</h1>
    <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          className="flex flex-col space-y-4"
        >
          {step === 1 && (
            <>
              <div className='flex flex-col gap-5'>
                <div>
                  <label className="block mb-2 text-gray-700 font-bold ">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter the title"
                    className="w-full p-2 border border-gray-300  focus:ring-2 focus:ring-blue-400 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block mb-3 text-gray-700 font-bold">Content</label>
                  <ReactQuill
                    value={formData.content}
                    onChange={handleQuillChange}
                    className="w-full h-80 rounded"
                  />
                </div>
                <div className="mt-5 flex justify-end">
              <motion.button
                type="button"
                onClick={handleNextStep}
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 mt-6 text-white bg-blue-500 rounded hover:bg-blue-600 transition-all duration-300"
              >
                Next
              </motion.button>
            </div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div>
                <label className="block mb-2 text-gray-700 font-bold">Featured Image</label>
                <input
                  type="file"
                  name="featuredImageFile"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-bold">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="Enter the subtitle"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="col-span-2">
                  <label className="block text-blue-600 font-bold mb-3">Product</label>
                  {fetchingProducts ? (
                    <p>Loading products...</p>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      {products.map((product) => (
                        <motion.button
                          key={product._id}
                          type="button"
                          onClick={() => handleProductSelect(product._id)}
                          className={`p-3 border rounded-lg ${
                            formData.product === product._id
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-200'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        >
                          {product.name}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-bold">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter the category"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-bold">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter the author"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex justify-between mt-6">
              <motion.button
                type="button"
                onClick={handlePrevStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-3/20 p-2 text-white bg-gray-500 rounded hover:bg-gray-600"
              >
                Previous
              </motion.button>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-3/20 p-2 ml-2 text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </motion.button>
            </div>
            </>
          )}
        </motion.div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default BlogFormComponent;
