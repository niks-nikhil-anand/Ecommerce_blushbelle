"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AccountSidebar from "./AccountSidebar";
import { FiChevronDown, FiMenu, FiX, FiSearch } from "react-icons/fi";

const OrderHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Demo order data
  const orders = [
    {
      id: "ORD-23985",
      date: "May 12, 2025",
      total: "$127.95",
      status: "delivered",
      items: [
        { name: "Organic Face Wash", price: "$35.99", quantity: 1 },
        { name: "Natural Hair Conditioner", price: "$45.99", quantity: 2 }
      ]
    },
    {
      id: "ORD-23756",
      date: "April 29, 2025",
      total: "$89.50",
      status: "shipped",
      items: [
        { name: "Eco-Friendly Dish Soap", price: "$22.50", quantity: 1 },
        { name: "Bamboo Toothbrush Set", price: "$18.99", quantity: 1 },
        { name: "Organic Hand Cream", price: "$24.99", quantity: 2 }
      ]
    },
    {
      id: "ORD-23612",
      date: "April 15, 2025",
      total: "$210.45",
      status: "processing",
      items: [
        { name: "All-Natural Laundry Detergent", price: "$45.99", quantity: 1 },
        { name: "Zero-Waste Kitchen Kit", price: "$89.50", quantity: 1 },
        { name: "Biodegradable Trash Bags", price: "$24.99", quantity: 3 }
      ]
    },
    {
      id: "ORD-23489",
      date: "March 27, 2025",
      total: "$67.90",
      status: "delivered",
      items: [
        { name: "Vegan Lip Balm", price: "$12.99", quantity: 2 },
        { name: "Organic Bath Bombs", price: "$21.99", quantity: 1 },
        { name: "Natural Deodorant", price: "$19.99", quantity: 1 }
      ]
    }
  ];

  const filterOptions = [
    { value: "all", label: "All Orders" },
    { value: "delivered", label: "Delivered" },
    { value: "shipped", label: "Shipped" },
    { value: "processing", label: "Processing" }
  ];

  // Filter orders based on selected filter and search query
  const filteredOrders = orders.filter(order => {
    const matchesFilter = selectedFilter === "all" || order.status === selectedFilter;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 md:hidden">
        <h1 className="text-2xl font-bold text-green-700">Order History</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-green-700"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile sidebar - shown/hidden based on state */}
        {sidebarOpen && (
          <div className="md:hidden w-full">
            <AccountSidebar className="w-full" />
          </div>
        )}
        
        {/* Desktop sidebar - always visible on md+ screens */}
        <div className="hidden md:block md:w-1/4 lg:w-1/5">
          <AccountSidebar className="sticky top-24" />
        </div>

        {/* Main content area */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">Order History</CardTitle>
                <CardDescription>View and track all your previous orders</CardDescription>
              </CardHeader>

              <CardContent>
                {/* Filter and Search Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative sm:w-1/3">
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="w-full p-2 pr-8 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                    >
                      {filterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute top-1/2 right-2 transform -translate-y-1/2 text-green-700" />
                  </div>
                  
                  <div className="relative flex-1">
                    <Input 
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border-green-200 focus:border-green-500"
                    />
                    <FiSearch className="absolute top-1/2 right-2 transform -translate-y-1/2 text-green-700" />
                  </div>
                </div>

                {/* Orders Table */}
                {filteredOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-green-50">
                          <TableHead className="font-semibold">Order ID</TableHead>
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold">Total</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <>
                            <TableRow key={order.id} className="hover:bg-green-50">
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.date}</TableCell>
                              <TableCell>{order.total}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  className="text-green-700 hover:text-green-800 hover:bg-green-100"
                                  onClick={() => toggleOrderDetails(order.id)}
                                >
                                  {expandedOrder === order.id ? "Hide Details" : "View Details"}
                                </Button>
                              </TableCell>
                            </TableRow>
                            
                            {/* Expanded Order Details */}
                            {expandedOrder === order.id && (
                              <TableRow className="bg-gray-50">
                                <TableCell colSpan={5} className="p-4">
                                  <div className="rounded-md bg-white p-4 border border-green-100">
                                    <h4 className="font-medium text-green-700 mb-2">Order Items</h4>
                                    <Table>
                                      <TableHeader>
                                        <TableRow className="bg-green-50">
                                          <TableHead className="font-semibold">Item</TableHead>
                                          <TableHead className="font-semibold">Price</TableHead>
                                          <TableHead className="font-semibold">Quantity</TableHead>
                                          <TableHead className="font-semibold">Subtotal</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {order.items.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.price}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                              ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                    <div className="flex justify-end mt-4">
                                      <Button className="bg-green-600 hover:bg-green-800">
                                        Track Order
                                      </Button>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No orders found matching your criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;