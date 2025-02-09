"use client";
import React, { useState, useEffect } from "react";
import {
  FaDollarSign,
  FaCalendarAlt,
  FaGlobe,
  FaStore,
} from "react-icons/fa";
import axios from "axios";

const DashboardCard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/admin/dashboard/orders");
        if (Array.isArray(response.data.data)) {
          console.log("Orders fetched successfully:", response.data.data);
          setOrders(response.data.data);
        } else {
          console.error("Unexpected response format:", response);
          setError("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const calculatePercentageIncrease = () => {
    if (orders.length === 0) return 0;

    const currentMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const currentDate = new Date();
      return orderDate.getMonth() === currentDate.getMonth() && orderDate.getFullYear() === currentDate.getFullYear();
    }).length;

    const previousMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const currentDate = new Date();
      return orderDate.getMonth() === currentDate.getMonth() - 1 && orderDate.getFullYear() === currentDate.getFullYear();
    }).length;

    if (previousMonthOrders === 0) return 100;

    return ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100;
  };

  const percentageIncrease = calculatePercentageIncrease();

  return (

    <div className="flex gap-5">
  {/* Total Revenue Card */}
  <Card
    title="Total Revenue"
    value={orders.length}
    percentageIncrease={percentageIncrease}
    loading={loading}
    error={error}
    icon={<FaDollarSign size={28} className="text-green-600" />} // Dollar sign for revenue
  />

  {/* Total Revenue This Month Card */}
  <Card
    title="Total Revenue This Month"
    value={orders.length}
    percentageIncrease={percentageIncrease}
    loading={loading}
    error={error}
    icon={<FaCalendarAlt size={28} className="text-blue-600" />} // Calendar for monthly revenue
  />

  {/* Total Revenue (Online) Card */}
  <Card
    title="Total Revenue (Online)"
    value={orders.length}
    percentageIncrease={percentageIncrease}
    loading={loading}
    error={error}
    icon={<FaGlobe size={28} className="text-purple-600" />} // Globe for online revenue
  />

  {/* Total Revenue (Offline) Card */}
  <Card
    title="Total Revenue (Offline)"
    value={orders.length}
    percentageIncrease={percentageIncrease}
    loading={loading}
    error={error}
    icon={<FaStore size={28} className="text-orange-600" />} // Store for offline revenue
  />
</div>
    
  );
};


const Card = ({ title, value, percentageIncrease, loading, error, icon }) => {
  return (
    <div className="w-54 h-36 bg-gradient-to-br from-white to-indigo-50 shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-6 flex justify-between items-start text-left">
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h2>
        <div className="space-y-1">
          {loading ? (
            <p className="text-xl font-bold text-gray-900">
              Loading...
              </p>
          ) : error ? (
            <p className="text-3xl font-bold text-gray-900">Error</p>
          ) : (
            <p className="text-3xl font-bold text-gray-900">₹{value}/-</p>
          )}
        </div>
      </div>
      <div className="bg-white/20 p-3 rounded-full shadow-md flex-shrink-0">{icon}</div>
    </div>
  );
};



export default DashboardCard;
