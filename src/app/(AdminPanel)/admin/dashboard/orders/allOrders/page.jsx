"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEye, FaPrint } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

// Shadcn UI components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

// Existing components
import Loader from "@/components/loader/loader";
import GenerateInvoice from "@/components/adminPanel/ui/GenerateInvoice";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [sortField, setSortField] = useState("orderDate");
  const [sortDirection, setSortDirection] = useState("desc");
  
  const router = useRouter();
  const itemsPerPage = 10;

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/admin/dashboard/orders");
        if (Array.isArray(response.data.data)) {
          console.log("Orders fetched successfully:", response.data.data);
          setOrders(response.data.data);
          setFilteredOrders(response.data.data);
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

  // Filter, sort and search orders
  useEffect(() => {
    let result = [...orders];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          (order.invoiceNo && order.invoiceNo.toString().toLowerCase().includes(query)) ||
          (order.user?.fullName && order.user.fullName.toLowerCase().includes(query)) ||
          (order.totalAmount && order.totalAmount.toString().includes(query))
      );
    }

    // Apply order status filter
    if (filterStatus !== "all") {
      result = result.filter(order => order.orderStatus === filterStatus);
    }

    // Apply payment status filter
    if (filterPayment !== "all") {
      result = result.filter(order => order.paymentStatus === filterPayment);
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;

      switch (sortField) {
        case "invoiceNo":
          valueA = a.invoiceNo || "";
          valueB = b.invoiceNo || "";
          break;
        case "customerName":
          valueA = a.user?.fullName || "";
          valueB = b.user?.fullName || "";
          break;
        case "totalAmount":
          valueA = a.totalAmount || 0;
          valueB = b.totalAmount || 0;
          break;
        case "orderDate":
        default:
          valueA = new Date(a.orderDate);
          valueB = new Date(b.orderDate);
          break;
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [orders, searchQuery, filterStatus, filterPayment, sortField, sortDirection]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Modal handlers
  const handleOpenModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleNavigate = (orderId) => {
    router.push(`${orderId}`);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterPayment("all");
    setSortField("orderDate");
    setSortDirection("desc");
  };

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Show loader during initial fetch
  if (loading) {
    return <Loader />;
  }

  // Show message when no orders available
  if (!orders.length) {
    return (
      <Card className="w-full p-8">
        <CardContent className="flex flex-col items-center justify-center pt-6">
          <p className="text-center text-gray-600">No orders available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-lg h-[80vh] min-w-[100%] mx-auto mt-4">
      <CardHeader className="pb-2 bg-gray-50">
        <CardTitle className="text-lg font-semibold text-gray-800">Order Details</CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Input
              placeholder="Search by invoice or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-blue-50 placeholder-blue-400 border-blue-200 focus:border-blue-300"
            />
          </div>
          
          <div>
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger className="bg-green-50 border-green-200 text-green-700">
                <SelectValue placeholder="Filter by Order Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-green-200">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Delivered" className="text-green-700">Delivered</SelectItem>
                <SelectItem value="Processing" className="text-yellow-700">Processing</SelectItem>
                <SelectItem value="Cancelled" className="text-red-700">Cancelled</SelectItem>
                <SelectItem value="Pending" className="text-blue-700">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select
              value={filterPayment}
              onValueChange={setFilterPayment}
            >
              <SelectTrigger className="bg-purple-50 border-purple-200 text-purple-700">
                <SelectValue placeholder="Filter by Payment Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-purple-200">
                <SelectItem value="all">All Payment Statuses</SelectItem>
                <SelectItem value="Completed" className="text-green-700">Completed</SelectItem>
                <SelectItem value="UnPaid" className="text-red-700">Unpaid</SelectItem>
                <SelectItem value="Pending" className="text-yellow-700">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Button 
              onClick={resetFilters} 
              variant="outline" 
              className="w-full bg-gray-50 hover:bg-gray-100"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-md">
          <span className="text-sm font-medium mt-2">Sort by:</span>
          <Button 
            variant={sortField === "orderDate" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleSort("orderDate")}
            className={sortField === "orderDate" ? "bg-blue-600" : "bg-white"}
          >
            Date {sortField === "orderDate" && (sortDirection === "asc" ? "↑" : "↓")}
          </Button>
          <Button 
            variant={sortField === "totalAmount" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleSort("totalAmount")}
            className={sortField === "totalAmount" ? "bg-blue-600" : "bg-white"}
          >
            Amount {sortField === "totalAmount" && (sortDirection === "asc" ? "↑" : "↓")}
          </Button>
          <Button 
            variant={sortField === "customerName" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleSort("customerName")}
            className={sortField === "customerName" ? "bg-blue-600" : "bg-white"}
          >
            Customer {sortField === "customerName" && (sortDirection === "asc" ? "↑" : "↓")}
          </Button>
          <Button 
            variant={sortField === "invoiceNo" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleSort("invoiceNo")}
            className={sortField === "invoiceNo" ? "bg-blue-600" : "bg-white"}
          >
            Invoice # {sortField === "invoiceNo" && (sortDirection === "asc" ? "↑" : "↓")}
          </Button>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-gray-500 mb-4 px-3 py-2 bg-blue-50 rounded-md">
          Showing {currentOrders.length} of {filteredOrders.length} orders
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto max-h-[50vh] custom-scrollbar rounded-md border border-gray-200">
          <Table className="min-w-[1400px] text-sm">
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100">
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
                  <TableRow key={order._id} className="hover:bg-gray-50">
                    <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell className="truncate">{order.invoiceNo}</TableCell>
                    <TableCell className="truncate">{order.user?.fullName || "N/A"}</TableCell>
                    <TableCell>₹{order.totalAmount}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge variant={
                        order.paymentStatus === "Completed" ? "success" :
                        order.paymentStatus === "UnPaid" ? "destructive" : 
                        "outline"
                      } className={
                        order.paymentStatus === "Completed" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                        order.paymentStatus === "UnPaid" ? "bg-red-100 text-red-800 hover:bg-red-200" : 
                        "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        order.orderStatus === "Delivered" ? "success" :
                        order.orderStatus === "Processing" ? "warning" :
                        "destructive"
                      } className={
                        order.orderStatus === "Delivered" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                        order.orderStatus === "Processing" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" :
                        "bg-red-100 text-red-800 hover:bg-red-200"
                      }>
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          onClick={() => handleNavigate(order._id)}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                        >
                          <FaEye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleOpenModal(order._id)}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200"
                        >
                          <FaPrint className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 bg-gray-50">
                    No orders found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""} bg-gray-50 hover:bg-gray-100`}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first page, last page, current page, and pages around current
                  return page === 1 || 
                         page === totalPages || 
                         (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => {
                  // Add ellipsis
                  const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                  const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                  
                  return (
                    <React.Fragment key={page}>
                      {showEllipsisBefore && (
                        <PaginationItem>
                          <span className="px-4">...</span>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className={currentPage !== page ? "bg-gray-50 hover:bg-gray-100" : ""}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                      {showEllipsisAfter && (
                        <PaginationItem>
                          <span className="px-4">...</span>
                        </PaginationItem>
                      )}
                    </React.Fragment>
                  );
                })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : ""} bg-gray-50 hover:bg-gray-100`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>

      {/* Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-full h-full max-h-screen p-4 overflow-y-auto">
            <Button
              onClick={handleCloseModal}
              variant="destructive"
              size="icon"
              className="absolute top-4 right-10 rounded-full"
            >
              <FaTimes />
            </Button>
            <GenerateInvoice orderId={selectedOrderId} />
          </div>
        </div>
      )}
    </Card>
  );
};

export default Orders;