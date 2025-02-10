"use client";
import { FaEye, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Loader from "@/components/loader/loader";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users from API
  useEffect(() => {
    axios
      .get("/api/admin/dashboard/user")
      .then((response) => {
        if (Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          console.error("Unexpected response format:", response);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await axios.patch(`/api/admin/dashboard/user/${userId}`, {
        status: newStatus,
      });

      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, status: newStatus } : user
          )
        );
        toast.success(`User status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("An error occurred while updating the user status");
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    try {
      const response = await fetch(
        `/api/admin/dashboard/user/${userToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("User deleted successfully");
        handleDelete(userToDelete);
      } else {
        const { msg } = await response.json();
        toast.error(msg || "Failed to delete user");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the user");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDelete = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };

  if (loading) return <Loader />;
  if (!users.length) return <p className="text-center">No users available.</p>;

  return (
    <div className="w-full p-4 bg-white shadow-lg h-[85vh] min-w-[100%]">
      <div className="flex justify-between px-4 py-2 bg-gray-200 text-black rounded-md my-4 font-medium">
        <h2 className="text-lg font-semibold text-gray-800">
          Registered Users Details
        </h2>
        <button className="bg-[#754E1A] hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-all">
          Export
        </button>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
        <table className="border-collapse border border-gray-300 min-w-[1300px] text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1 text-left">Full Name</th>
              <th className="border px-2 py-1 text-left">Email</th>
              <th className="border px-2 py-1 text-center">Mobile Number</th>
              <th className="border px-2 py-1 text-left">Role</th>
              <th className="border px-2 py-1 text-center">Status</th>
              <th className="border px-2 py-1 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td className="border px-2 py-1">{user.fullName}</td>
                <td className="border px-2 py-1">{user.email}</td>
                <td className="border px-2 py-1 text-center">
                  {user.mobileNumber}
                </td>
                <td className="border px-2 py-1">{user.role}</td>
                <td className="border px-2 py-1 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user.status === "active"}
                        onChange={() => handleToggle(user._id, user.status)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:bg-gray-700 peer-checked:bg-green-500">
                        <motion.div
                          className="absolute w-5 h-5 bg-white border border-gray-300 rounded-full top-[2px] left-[1px]"
                          initial={{ x: 0 }}
                          animate={{ x: user.status === "active" ? 25 : 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      </div>
                    </label>
                  </div>
                </td>
                <td className="border px-2 py-1 text-center">
                  <div className="flex gap-4 justify-center">
                    <motion.button
                      onClick={() => console.log("View user", user._id)}
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300"
                    >
                      <FaEye className="text-lg drop-shadow-md" />
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setUserToDelete(user._id);
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
              Are you sure you want to delete this user?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={deleteUser}
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
        {[
          ...Array(Math.ceil(users.length / itemsPerPage)).keys(),
        ].map((number) => (
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

export default Users;