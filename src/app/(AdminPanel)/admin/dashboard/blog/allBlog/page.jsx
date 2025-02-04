"use client";
import { FaEye, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Loader from "@/components/loader/loader";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const Products = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [status, setStatus] = useState("active");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log("Fetching articles...");
        const response = await axios.get("/api/admin/dashboard/blog");
        console.log("Articles fetched:", response.data);
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
        console.log("Loading state set to false");
      }
    };

    fetchArticles();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = articles.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const truncateName = (name, wordLimit = 4) => {
    const words = name.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : name;
  };
  const truncateContent = (content, wordLimit = 20) => {
    const words = content.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : name;
  };
  const truncateSubtitle = (subtitle, wordLimit = 8) => {
    const words = subtitle.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : name;
  };

  const handleToggle = async (productId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await axios.patch(`/api/admin/dashboard/product/${productId}`, {
        status: newStatus,
      });

      if (response.status === 200) {
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article._id === productId ? { ...article, status: newStatus } : article
          )
        );
        toast.success(`Product status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("An error occurred while updating the product status");
    }
  };

  const deleteArticle = async () => {
    if (!productToDelete) return;
    try {
      const response = await fetch(`/api/admin/dashboard/blog/${productToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        handleDelete(productToDelete);
      } else {
        const { msg } = await response.json();
        toast.error(msg || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDelete = (productId) => {
    setArticles((prevArticles) =>
      prevArticles.filter((article) => article._id !== productId)
    );
  };

  if (loading) return <Loader />;
  if (!articles.length) return <p className="text-center">No products available.</p>;

  return (
    <div className="w-full p-4  bg-white shadow-lg  h-[85vh] min-w-[100%]  ">
     <div className="flex justify-between px-4 py-2 bg-gray-200 text-black  rounded-md my-4 font-medium">
                <h2 className="text-lg font-semibold text-gray-800">Articles Details</h2>
              </div>
      <div className="overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
        <table className="border-collapse border border-gray-300 min-w-[1300px] text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1 text-left">Featured Image</th>
              <th className="border px-2 py-1 text-left">Title</th>
              <th className="border px-2 py-1 text-left">SubTitle</th>
              <th className="border px-2 py-1 text-left">Content</th>
              <th className="border px-2 py-1 text-left">Catgeory</th>
              <th className="border px-2 py-1 text-left">Author</th>
              <th className="border px-2 py-1 text-left">Product</th>
              <th className="border px-2 py-1 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id} className="hover:bg-gray-100">
                <td className="border px-2 py-1 text-center flex justify-center">
                <Image
                  src={article.featuredImage}
                  alt={article.name}
                  width={48} // Adjust based on design
                  height={48} // Adjust based on design
                  className=" shadow-lg object-cover cursor-pointer rounded-full"
                  style={{ width: "60px", height: "60px" }}
                />
                </td>
                <td className="border px-2 py-1">{truncateName(article.title)}</td>
                <td className="border px-2 py-1">{truncateSubtitle(article.subtitle)}</td>
                <td className="border px-2 py-1">
                  <div dangerouslySetInnerHTML={{ __html: truncateContent(article.content) }} />
                </td>
                <td className="border px-2 py-1">{article.category}</td>
                <td className="border px-2 py-1">{article.author}</td>
                <td className="border px-2 py-1">{article.product?.name}</td>
              <td className="border px-2 py-1 text-center">
                <div className="flex gap-4 justify-center">
                  {/* View Button */}
                  <motion.button
                    onClick={() => console.log("View product", article._id)}
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300"
                  >
                    <FaEye className="text-lg drop-shadow-md" />
                  </motion.button>

                  {/* Delete Button */}
                  <motion.button
                    onClick={() => {
                      setProductToDelete(article._id);
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
      {showDeleteModal && (
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
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        {[...Array(Math.ceil(articles.length / itemsPerPage)).keys()].map((number) => (
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

export default Products;
