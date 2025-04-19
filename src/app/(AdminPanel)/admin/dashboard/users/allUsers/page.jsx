"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import { FaEye, FaTrash } from "react-icons/fa";
import { 
  ArrowUpDown, 
  Search, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileUp,
  CheckCircle,
  XCircle
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import Loader from "@/components/loader/loader";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  // Fetch users from API
  useEffect(() => {
    axios
      .get("/api/admin/dashboard/user")
      .then((response) => {
        if (Array.isArray(response.data.users)) {
          setUsers(response.data.users);
          setFilteredUsers(response.data.users);
        } else {
          console.error("Unexpected response format:", response);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
        setLoading(false);
      });
  }, []);

  // Filter users based on search term
  useEffect(() => {
    const results = users.filter((user) => {
      return (
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobileNumber.includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredUsers(results);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  useEffect(() => {
    let sortedUsers = [...filteredUsers];
    if (sortConfig.key) {
      sortedUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    setFilteredUsers(sortedUsers);
  }, [sortConfig.key, sortConfig.direction]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Check if status is active, case-insensitive
  const isStatusActive = (status) => {
    return status.toLowerCase() === "active";
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    // Convert using case-insensitive comparison
    const isActive = isStatusActive(currentStatus);
    const newStatus = isActive ? "Inactive" : "Active";
    
    // Create loading toast that will be updated later
    const loadingToastId = toast.loading(`Updating user status...`);
    
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
        // Dismiss loading toast and show success toast
        toast.dismiss(loadingToastId);
        toast.success(`User status updated to ${newStatus}`);
      } else {
        // Dismiss loading toast and show error toast
        toast.dismiss(loadingToastId);
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      // Dismiss loading toast and show error toast
      toast.dismiss(loadingToastId);
      toast.error("An error occurred while updating the user status");
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    
    // Create loading toast
    const loadingToastId = toast.loading("Deleting user...");
    
    try {
      const response = await fetch(
        `/api/admin/dashboard/user/${userToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Dismiss loading toast and show success toast
        toast.dismiss(loadingToastId);
        toast.success("User deleted successfully");
        
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete));
        setFilteredUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete));
      } else {
        const { msg } = await response.json();
        // Dismiss loading toast and show error toast
        toast.dismiss(loadingToastId);
        toast.error(msg || "Failed to delete user");
      }
    } catch (error) {
      // Dismiss loading toast and show error toast
      toast.dismiss(loadingToastId);
      toast.error("An error occurred while deleting the user");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Export functions
  const exportToCSV = () => {
    // The CSVLink component will handle this
    return filteredUsers;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    const tableColumn = ["Full Name", "Email", "Mobile Number", "Role", "Status"];
    const tableRows = [];

    filteredUsers.forEach(user => {
      const userData = [
        user.fullName,
        user.email,
        user.mobileNumber,
        user.role,
        user.status
      ];
      tableRows.push(userData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
    });

    doc.text("User Data Report", 14, 15);
    doc.save("users-report.pdf");
    toast.success("PDF exported successfully");
  };

  const exportToDOCX = () => {
    // Create a formatted text content
    let content = "User Data Report\n\n";
    
    filteredUsers.forEach((user, index) => {
      content += `User ${index + 1}:\n`;
      content += `Name: ${user.fullName}\n`;
      content += `Email: ${user.email}\n`;
      content += `Mobile: ${user.mobileNumber}\n`;
      content += `Role: ${user.role}\n`;
      content += `Status: ${user.status}\n\n`;
    });
    
    // Convert the content to a Blob
    const blob = new Blob([content], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    
    // Save the file
    saveAs(blob, "users-report.docx");
    toast.success("DOCX exported successfully");
  };

  const getCSVData = () => {
    return filteredUsers.map(user => ({
      "Full Name": user.fullName,
      "Email": user.email,
      "Mobile Number": user.mobileNumber,
      "Role": user.role,
      "Status": user.status
    }));
  }

  const handleCSVExport = () => {
    toast.success("CSV exported successfully");
  };

  // Loading state
  if (loading) return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  if (!users.length) return <p className="text-center">No users available.</p>;

  return (
    <Card className="w-full bg-white text-gray-800">
      {/* Add Toaster component with light mode styling */}
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#ffffff',
              color: '#16a34a',
              borderLeft: '4px solid #16a34a',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
            },
            iconTheme: {
              primary: '#16a34a',
              secondary: '#ffffff',
            },
          },
          error: {
            style: {
              background: '#ffffff',
              color: '#dc2626',
              borderLeft: '4px solid #dc2626',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
            },
            iconTheme: {
              primary: '#dc2626',
              secondary: '#ffffff',
            },
          },
          loading: {
            style: {
              background: '#ffffff',
              color: '#2563eb',
              borderLeft: '4px solid #2563eb',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
            },
          },
          duration: 3000, // Duration for all toasts
        }}
      />
      
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">User Management</CardTitle>
          <CardDescription className="text-gray-500">
            Manage registered users and their access
          </CardDescription>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              className="pl-8 bg-white border-gray-300 text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white text-gray-800 border-gray-300">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-gray-300">
              <CSVLink
                data={getCSVData()}
                filename={"users-report.csv"}
                className="w-full"
                onClick={handleCSVExport}
              >
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export to CSV
                </DropdownMenuItem>
              </CSVLink>
              <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer hover:bg-gray-100">
                <FileText className="mr-2 h-4 w-4" />
                Export to PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToDOCX} className="cursor-pointer hover:bg-gray-100">
                <FileUp className="mr-2 h-4 w-4" />
                Export to DOCX
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="hover:bg-gray-100">
                <TableHead className="text-gray-600 font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('fullName')}
                    className="p-0 hover:bg-transparent text-gray-600"
                  >
                    Full Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('email')}
                    className="p-0 hover:bg-transparent text-gray-600"
                  >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-gray-600 font-medium text-center">
                  Mobile Number
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('role')}
                    className="p-0 hover:bg-transparent text-gray-600"
                  >
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-gray-600 font-medium text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('status')}
                    className="p-0 hover:bg-transparent text-gray-600"
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-gray-600 font-medium text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    No users found matching your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                currentUsers.map((user) => (
                  <TableRow key={user._id} className="border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700">
                      {user.fullName}
                    </TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell className="text-gray-600 text-center">
                      {user.mobileNumber}
                    </TableCell>
                    <TableCell className="text-gray-600">{user.role}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={isStatusActive(user.status) ? "success" : "secondary"}
                        className={`${
                          isStatusActive(user.status)
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        } cursor-pointer`}
                        onClick={() => handleToggleStatus(user._id, user.status)}
                      >
                        {isStatusActive(user.status) ? (
                          <><CheckCircle className="h-3.5 w-3.5 mr-1" /> Active</>
                        ) : (
                          <><XCircle className="h-3.5 w-3.5 mr-1" /> Inactive</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          onClick={() => {
                            console.log("View user", user._id);
                            toast.success("User view functionality coming soon!");
                          }}
                        >
                          <FaEye className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          onClick={() => {
                            setUserToDelete(user._id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <Pagination className="mt-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationLink 
                  onClick={() => paginate(currentPage - 1)}
                  className="cursor-pointer bg-white border-gray-200 hover:bg-gray-50"
                >
                  Previous
                </PaginationLink>
              </PaginationItem>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <PaginationItem key={number}>
                <PaginationLink
                  onClick={() => paginate(number)}
                  isActive={currentPage === number}
                  className={`cursor-pointer ${
                    currentPage === number 
                      ? "bg-blue-500 text-white hover:bg-blue-600" 
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink 
                  onClick={() => paginate(currentPage + 1)}
                  className="cursor-pointer bg-white border-gray-200 hover:bg-gray-50"
                >
                  Next
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-white border-gray-200 text-gray-800">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-500">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              className="bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={deleteUser}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Users;