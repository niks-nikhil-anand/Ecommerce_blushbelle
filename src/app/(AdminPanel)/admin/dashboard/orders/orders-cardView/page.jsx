"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const OrdersCart = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("orderDate");
  const ordersPerPage = 6;

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/admin/dashboard/orders");
        const sortedOrders = response.data.data.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        ); // Sort recent orders on top
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // Sorting orders
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    const sortedOrders = [...orders].sort((a, b) => {
      if (option === "orderDate") {
        return new Date(b.orderDate) - new Date(a.orderDate);
      } else if (option === "totalAmount") {
        return b.totalAmount - a.totalAmount;
      } else {
        return a[option].localeCompare(b[option]); // For string-based sorting
      }
    });
    setOrders(sortedOrders);
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between w-full">

      <h1 className="text-2xl font-bold mb-4">Order Cart</h1>

      {/* Sorting Options */}
      <div className="mb-4">
        
        <label htmlFor="sort" className="mr-2 font-semibold">
          Sort By:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={handleSortChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="orderDate">Order Date</option>
          <option value="totalAmount">Total Amount</option>
          <option value="orderStatus">Order Status</option>
        </select>
      </div>
      </div>

      

      {/* Orders List */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {currentOrders.map((order) => (
          <motion.div
            key={order._id}
            className="bg-white shadow-md rounded-lg p-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
            <p className="text-sm text-gray-500">
              Order Date: {new Date(order.orderDate).toLocaleDateString()}
            </p>
            <p className="mt-2">
              <span className="font-bold">Total Amount: </span>₹{order.totalAmount}
            </p>
            <p>
              <span className="font-bold">Payment Method: </span>
              {order.paymentMethod}
            </p>
            <p>
              <span className="font-bold">Payment Status: </span>
              {order.paymentStatus}
            </p>
            <p>
              <span className="font-bold">Order Status: </span>
              {order.orderStatus}
            </p>
            <p>
              <span className="font-bold">Delivery Date: </span>
              {order.deliveryDate
                ? new Date(order.deliveryDate).toLocaleDateString()
                : "Not Set"}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center items-center space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow disabled:opacity-50"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            } rounded-md shadow`}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersCart;
