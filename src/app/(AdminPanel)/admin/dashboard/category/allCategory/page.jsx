"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Loader from '@/components/loader/loader';
import { FaEye, FaTrash } from "react-icons/fa";
import Image from 'next/image';


const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [itemsPerPage] = useState(5); // Number of items per page

  // Fetch categories from API
  useEffect(() => {
    axios
      .get('/api/admin/dashboard/category')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('Unexpected response format:', response);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setLoading(false);
      });
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Loader />; // Show loader while fetching
  }

  if (!categories.length) {
    return <p className="text-center">No categories available.</p>;
  }

  return (
   <div className="w-full p-4  bg-white shadow-lg  h-[85vh] min-w-[100%]  ">
        <div className="flex justify-between px-4 py-2 bg-gray-200 text-black  rounded-md my-4 font-medium">
                   <h2 className="text-lg font-semibold text-gray-800">Articles Details</h2>
                 </div>
         <div className="overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
           <table className="border-collapse border border-gray-300 min-w-[1300px] text-sm">
             <thead>
               <tr className="bg-gray-200">
                 <th className="border px-2 py-1 text-left"> Image</th>
                 <th className="border px-2 py-1 text-left">Name</th>
                 <th className="border px-2 py-1 text-left">No. Of Products</th>
                 <th className="border px-2 py-1 text-left">Craeted At</th>
                 <th className="border px-2 py-1 text-center">Actions</th>
               </tr>
             </thead>
             <tbody>
               {categories.map((category) => (
                 <tr key={category._id} className="hover:bg-gray-100">
                   <td className="border px-2 py-1 text-center flex justify-center">
                   <Image
                     src={category.image}
                     alt={category.name}
                     width={48} // Adjust based on design
                     height={48} // Adjust based on design
                     className=" shadow-lg object-cover cursor-pointer rounded-full"
                     style={{ width: "60px", height: "60px" }}
                   />
                   </td>
                   <td className="border px-2 py-1">{category.name}</td>
                   <td className="border px-2 py-1">{category.name}</td>
                   <td className="border px-2 py-1">{category.name}</td>
                 <td className="border px-2 py-1 text-center">
                   <div className="flex gap-4 justify-center">
                     {/* View Button */}
                     <motion.button
                       onClick={() => console.log("View product", category._id)}
                       whileHover={{ scale: 1.1, rotate: 2 }}
                       whileTap={{ scale: 0.9 }}
                       className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300"
                     >
                       <FaEye className="text-lg drop-shadow-md" />
                     </motion.button>
   
                     {/* Delete Button */}
                     <motion.button
                       onClick={() => {
                         setProductToDelete(category._id);
                         setShowDeleteModal(true);
                       }}
                       whileHover={{ scale: 1.1, rotate: -2 }}
                       whileTap={{ scale: 0.9 }}
                       className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all duration-300"
                     >
                       <FaTrash className="text-lg drop-shadow-md" />
                     </motion.button>
                   </div>
                 </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
   
         {/* Delete Confirmation Modal */}
         {/* {showDeleteModal && (
           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
             <div className="bg-white rounded-lg shadow-lg p-6 w-80">
               <h2 className="text-lg font-semibold mb-4 text-center">
                 Are you sure you want to delete this product?
               </h2>
               <div className="flex justify-center gap-4">
                 <button
                   onClick={deleteArticle}
                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                 >
                   Yes, Delete
                 </button>
                 <button
                   onClick={() => setShowDeleteModal(false)}
                   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                 >
                   No, Cancel
                 </button>
               </div>
             </div>
           </div>
         )} */}
   
         {/* Pagination */}
         <div className="mt-4 flex justify-center space-x-2">
           {[...Array(Math.ceil(categories.length / itemsPerPage)).keys()].map((number) => (
             <button
               key={number}
               className={`px-2 py-1 rounded-md text-xs ${
                 currentPage === number + 1
                   ? "bg-blue-500 text-white"
                   : "bg-gray-200 hover:bg-gray-300"
               }`}
               onClick={() => paginate(number + 1)}
             >
               {number + 1}
             </button>
           ))}
         </div>
       </div>
  );
};

export default Categories;
