"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "@/components/loader/loader";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Newsletter = () => {
  const [newsLetter, setNewsLetter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  // Fetch newsletters from API
  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await axios.get("/api/admin/dashboard/newsLetter");
        if (Array.isArray(response.data.subscriptions)) {
          setNewsLetter(response.data.subscriptions);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Error fetching newsletters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNewsletters = newsLetter.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Loader or No Newsletter State
  if (loading) {
    return <Loader />;
  }

  if (!newsLetter.length) {
    return <p className="text-center text-gray-600">No newsletters available.</p>;
  }

  return (
    <div className="w-full p-4 bg-gray-200 shadow-lg h-[80vh] min-w-[100%] mx-auto ">
      <div className="flex justify-between px-4 py-2 bg-white text-black rounded-md my-4 font-medium">
        <h2 className="text-lg font-semibold text-black">Contact Us Page Details</h2>
        <button className="bg-[#754E1A] hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-all">
                  Export
                </button>
      </div>
      {/* Wrapper with horizontal and vertical scrollbars */}
      <div className="overflow-x-auto overflow-y-auto max-h-[70vh] custom-scrollbar flex justify-center items-center">
        <table className="border-collapse border border-gray-300 min-w-[800px] text-sm">
          <thead>
            <tr className="bg-white">
              <th className="border border-gray-300 px-2 py-1 text-left">Email</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Timestamp</th>
              <th className="border border-gray-300 px-2 py-1 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentNewsletters.map((newsletter) => (
              <tr key={newsletter._id} className="hover:bg-gray-100 cursor-pointer">
                <td className="border border-gray-300 px-2 py-1">{newsletter.email}</td>
                <td className="border border-gray-300 px-2 py-1 truncate">{new Date(newsletter.createdAt).toLocaleString()}</td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  <div className="flex justify-center space-x-2">
                    <button className="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs">
                    <FaTrash />
                  </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex justify-center space-x-2">
        {[...Array(Math.ceil(newsLetter.length / itemsPerPage)).keys()].map((number) => (
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

export default Newsletter;
