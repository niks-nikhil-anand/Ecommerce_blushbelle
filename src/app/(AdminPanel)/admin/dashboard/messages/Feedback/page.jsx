"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "@/components/loader/loader";
import { FaTrash } from "react-icons/fa";

const ContactUs = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Contact Us messages from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("/api/admin/dashboard/contactUs");
        if (Array.isArray(response.data)) {
          setContacts(response.data);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Error fetching contact messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = contacts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Loader or No Data State
  if (loading) {
    return <Loader />;
  }

  if (!contacts.length) {
    return <p className="text-center text-gray-600">No contact messages available.</p>;
  }

  return (
    <div className="w-full p-4 bg-white shadow-lg h-[80vh] min-w-[100%] mx-auto mt-4">
      <div className="flex justify-between px-4 py-2 bg-gray-200 text-black rounded-md my-4 font-medium">
        <h2 className="text-lg font-semibold text-gray-800">Contact Us Messages</h2>
        <button className="bg-[#754E1A] hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-all">
          Export
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto overflow-y-auto max-h-[70vh] custom-scrollbar">
        <table className="border-collapse border border-gray-300 min-w-[1000px] text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-2 py-1 text-left">First Name</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Last Name</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Email</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Mobile Number</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Message</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Timestamp</th>
              <th className="border border-gray-300 px-2 py-1 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentContacts.map((contact) => (
              <tr key={contact._id} className="hover:bg-gray-100 cursor-pointer">
                <td className="border border-gray-300 px-2 py-1">{contact.firstName}</td>
                <td className="border border-gray-300 px-2 py-1">{contact.lastName}</td>
                <td className="border border-gray-300 px-2 py-1">{contact.email}</td>
                <td className="border border-gray-300 px-2 py-1">{contact.mobileNumber}</td>
                <td className="border border-gray-300 px-2 py-1 truncate max-w-[250px]">{contact.message}</td>
                <td className="border border-gray-300 px-2 py-1">{new Date(contact.createdAt).toLocaleString()}</td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center space-x-2">
        {[...Array(Math.ceil(contacts.length / itemsPerPage)).keys()].map((number) => (
          <button
            key={number}
            className={`px-2 py-1 rounded-md text-xs ${
              currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
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

export default ContactUs;
