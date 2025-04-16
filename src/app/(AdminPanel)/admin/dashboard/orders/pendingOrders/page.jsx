"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "@/components/loader/loader";
import { FaEye, FaPrint, FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import GenerateInvoice from "@/components/adminPanel/ui/GenerateInvoice";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState("orderDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    paymentStatus: "all",
    orderStatus: "all",
    paymentMethod: "all"
  });
  
  const router = useRouter();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/admin/dashboard/orders");
        if (Array.isArray(response.data.data)) {
          console.log("Orders fetched successfully:", response.data.data);
          setOrders(response.data.data);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.invoiceNo && order.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.user?.fullName && order.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPaymentStatus = filters.paymentStatus === "all" ? true : order.paymentStatus === filters.paymentStatus;
    const matchesOrderStatus = filters.orderStatus === "all" ? true : order.orderStatus === filters.orderStatus;
    const matchesPaymentMethod = filters.paymentMethod === "all" ? true : order.paymentMethod === filters.paymentMethod;
    
    return matchesSearch && matchesPaymentStatus && matchesOrderStatus && matchesPaymentMethod;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];
    
    // Handle date fields
    if (sortField === "orderDate") {
      fieldA = new Date(fieldA);
      fieldB = new Date(fieldB);
    }
    
    // Handle numeric fields
    if (sortField === "totalAmount") {
      fieldA = parseFloat(fieldA);
      fieldB = parseFloat(fieldB);
    }
    
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      paymentStatus: "all",
      orderStatus: "all",
      paymentMethod: "all"
    });
    setSearchTerm("");
    setSortField("orderDate");
    setSortDirection("desc");
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Open full-screen modal
  const handleOpenModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  // Close full-screen modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleNavigate = (orderId) => {
    router.push(`${orderId}`);
  };

  // Extract unique payment methods, statuses, etc. for filter dropdowns
  const paymentMethods = [...new Set(orders.map(order => order.paymentMethod))];
  const paymentStatuses = [...new Set(orders.map(order => order.paymentStatus))];
  const orderStatuses = [...new Set(orders.map(order => order.orderStatus))];

  // Loader or No Orders State
  if (loading) {
    return <Loader />;
  }

  if (!orders.length) {
    return <p className="text-center text-gray-600">No pending Orders available.</p>;
  }

  return (
    <div className="w-full p-4 bg-white shadow-lg h-[80vh] min-w-[100%] mx-auto mt-4">
      <div className="flex justify-between px-4 py-2 bg-gray-200 text-black rounded-md my-4 font-medium">
        <h2 className="text-lg font-semibold text-gray-800">Pending Order Details</h2>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search by invoice or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon" className="bg-gray-100 hover:bg-gray-200">
            <FaSearch className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {/* Payment Status Filter */}
          <Select 
            value={filters.paymentStatus} 
            onValueChange={(value) => handleFilterChange("paymentStatus", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-100">
              <SelectItem value="all">All Payment Statuses</SelectItem>
              {paymentStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Order Status Filter */}
          <Select 
            value={filters.orderStatus} 
            onValueChange={(value) => handleFilterChange("orderStatus", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-100">
              <SelectItem value="all">All Order Statuses</SelectItem>
              {orderStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Payment Method Filter */}
          <Select 
            value={filters.paymentMethod} 
            onValueChange={(value) => handleFilterChange("paymentMethod", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent className="bg-gray-100">
              <SelectItem value="all">All Payment Methods</SelectItem>
              {paymentMethods.map(method => (
                <SelectItem key={method} value={method}>{method}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Sort Field & Direction */}
          <div className="flex gap-2">
            <Select 
              value={sortField} 
              onValueChange={setSortField}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-gray-100">
                <SelectItem value="orderDate">Order Date</SelectItem>
                <SelectItem value="totalAmount">Amount</SelectItem>
                <SelectItem value="invoiceNo">Invoice No</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={sortDirection} 
              onValueChange={setSortDirection}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Dir" />
              </SelectTrigger>
              <SelectContent className="bg-gray-100">
                <SelectItem value="asc">Asc</SelectItem>
                <SelectItem value="desc">Desc</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Reset Filters Button */}
          <Button variant="outline" onClick={resetFilters} className="bg-gray-100 hover:bg-gray-200">
            <FaFilter className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      {/* Items per page selector */}
      <div className="mb-4 flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <Select 
            value={itemsPerPage.toString()} 
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent className="bg-gray-100">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[55vh] custom-scrollbar">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead className="font-medium">Sl. No</TableHead>
              <TableHead className="font-medium">Invoice No.</TableHead>
              <TableHead className="font-medium">Customer</TableHead>
              <TableHead className="font-medium">Total Amount</TableHead>
              <TableHead className="font-medium">Payment Method</TableHead>
              <TableHead className="font-medium">Payment Status</TableHead>
              <TableHead className="font-medium">Order Status</TableHead>
              <TableHead className="font-medium">Order Date</TableHead>
              <TableHead className="font-medium text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order, index) => (
                <TableRow key={order._id} className="hover:bg-gray-100 border-b">
                  <TableCell className="py-2">{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell className="py-2 truncate max-w-[100px]">{order.invoiceNo}</TableCell>
                  <TableCell className="py-2 truncate max-w-[120px]">{order.user?.fullName || "N/A"}</TableCell>
                  <TableCell className="py-2">₹{order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell className="py-2">{order.paymentMethod}</TableCell>
                  <TableCell className="py-2">
                    <Badge 
                      className={`${
                        order.paymentStatus === "Completed" ? "bg-green-100 text-green-800 hover:bg-green-200" : 
                        order.paymentStatus === "UnPaid" ? "bg-red-100 text-red-800 hover:bg-red-200" : 
                        "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge 
                      className={`${
                        order.orderStatus === "Delivered" ? "bg-green-100 text-green-800 hover:bg-green-200" : 
                        order.orderStatus === "Processing" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : 
                        "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {order.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    {new Date(order.orderDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleNavigate(order._id)} 
                        className="bg-blue-500 text-white hover:bg-blue-600 h-8 w-8 p-0"
                      >
                        <FaEye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleOpenModal(order._id)}
                        className="bg-purple-500 text-white hover:bg-purple-600 h-8 w-8 p-0"
                      >
                        <FaPrint className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No orders found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
              // Calculate page numbers to show based on current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = idx + 1;
              } else if (currentPage <= 3) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }
              
              return (
                <PaginationItem key={idx}>
                  <PaginationLink
                    onClick={() => paginate(pageNum)}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Full-Screen Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} className="max-w-full h-full">
        <DialogContent className="max-w-full h-[95vh] overflow-y-auto bg-white">
          <DialogHeader className="sticky top-0 z-10 bg-white border-b pb-2">
            <DialogTitle>Order Invoice</DialogTitle>
            <DialogClose 
              className="absolute right-4 top-4 rounded-full p-2 bg-red-500 text-white hover:bg-red-600"
              onClick={handleCloseModal}
            >
              <FaTimes />
            </DialogClose>
          </DialogHeader>
          <div className="p-4">
            <GenerateInvoice orderId={selectedOrderId} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;