"use client";
import { FaEye, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Loader from "@/components/loader/loader";
import toast, { Toaster } from "react-hot-toast";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";


const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [status, setStatus] = useState("active");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log("Fetching reviews...");
        const response = await axios.get("/api/admin/dashboard/review/addReview");
        console.log("Reviews fetched:", response.data);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
        console.log("Loading state set to false");
      }
    };

    fetchReviews();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = reviews.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const truncateName = (name, wordLimit = 4) => {
    const words = name.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : name;
  };

  const truncateContent = (content, wordLimit = 20) => {
    const words = content.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : content;
  };

  const handleToggle = async (reviewId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await axios.patch(`/api/admin/dashboard/review/${reviewId}`, {
        status: newStatus,
      });

      if (response.status === 200) {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === reviewId ? { ...review, status: newStatus } : review
          )
        );
        toast.success(`Review status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update review status");
      }
    } catch (error) {
      console.error("Error updating review status:", error);
      toast.error("An error occurred while updating the review status");
    }
  };

  const deleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      const response = await fetch(`/api/admin/dashboard/review/${reviewToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Review deleted successfully");
        handleDelete(reviewToDelete);
      } else {
        const { msg } = await response.json();
        toast.error(msg || "Failed to delete review");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the review");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDelete = (reviewId) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review._id !== reviewId)
    );
  };

  if (loading) return <Loader />;
  if (!reviews.length) return <p className="text-center">No reviews available.</p>;

  return (
    <div className="w-full p-4 bg-white shadow-lg h-[85vh] min-w-[100%]">
          <div className="flex justify-between items-center px-6 py-3 bg-gray-200 text-black rounded-md my-4 font-medium">
        <h2 className="text-lg font-semibold text-gray-800">Reviews Details</h2>
        
        <button className="bg-[#754E1A] hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-all">
          Export
        </button>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
        <table className="border-collapse border border-gray-300 min-w-[1300px] text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1 text-left">Name</th>
              <th className="border px-2 py-1 text-left">Email</th>
              <th className="border px-2 py-1 text-left">Rating</th>
              <th className="border px-2 py-1 text-left">Title</th>
              <th className="border px-2 py-1 text-left">Review</th>
              <th className="border px-2 py-1 text-left">Product</th>
              <th className="border px-2 py-1 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id} className="hover:bg-gray-100">
                <td className="border px-2 py-1">{review.name}</td>
                <td className="border px-2 py-1">{review.email}</td>
                <td className="border px-2 py-1">{renderStars(review.rating)}</td>
                <td className="border px-2 py-1">
                  <div dangerouslySetInnerHTML={{ __html: truncateContent(review.reviewTitle) }} />
                </td>
                <td className="border px-2 py-1">
                  <div dangerouslySetInnerHTML={{ __html: truncateContent(review.review) }} />
                </td>
                <td className="border px-2 py-1">{review.product?.name}</td>
                <td className="border px-2 py-1 text-center">
                  <div className="flex gap-4 justify-center">
                    {/* View Button */}
                    <motion.button
                      onClick={() => console.log("View review", review._id)}
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300"
                    >
                      <FaEye className="text-lg drop-shadow-md" />
                    </motion.button>

                    {/* Delete Button */}
                    <motion.button
                      onClick={() => {
                        setReviewToDelete(review._id);
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
              Are you sure you want to delete this review?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={deleteReview}
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
        {[...Array(Math.ceil(reviews.length / itemsPerPage)).keys()].map((number) => (
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

export default Reviews;


const renderStars = (rating) => {
  const fullStars = Math.floor(rating); // Full stars
  const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Half stars
  const emptyStars = 5 - fullStars - halfStars; // Empty stars

  const stars = [];

  // Push full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <motion.span
        key={`full-${i}`}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="text-yellow-500"
      >
        <FaStar />
      </motion.span>
    );
  }

  // Push half stars
  for (let i = 0; i < halfStars; i++) {
    stars.push(
      <motion.span
        key={`half-${i}`}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="text-yellow-500"
      >
        <FaStarHalfAlt />
      </motion.span>
    );
  }

  // Push empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <motion.span
        key={`empty-${i}`}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="text-gray-300"
      >
        <FaRegStar />
      </motion.span>
    );
  }

  return (
    <div className="flex space-x-1"> {/* This wraps the stars in a flex container */}
      {stars}
    </div>
  );
};

