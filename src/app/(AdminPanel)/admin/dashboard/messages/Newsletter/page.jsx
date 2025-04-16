"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "@/components/loader/loader";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Search, Download, SortAsc, SortDesc, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Newsletter = () => {
  const [newsLetter, setNewsLetter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [filterConfig, setFilterConfig] = useState({ key: "all", value: "" });
  const [showFilterDialog, setShowFilterDialog] = useState(false);
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

  // Sorting function
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  // Filter function
  const applyFilter = (key, value) => {
    setFilterConfig({ key, value });
    setCurrentPage(1);
    setShowFilterDialog(false);
  };

  // Search function
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Export functions
  const exportData = (format) => {
    const dataToExport = filteredData.map(item => ({
      email: item.email,
      createdAt: new Date(item.createdAt).toLocaleString()
    }));
    
    switch (format) {
      case 'csv':
        exportCSV(dataToExport);
        break;
      case 'pdf':
        exportPDF(dataToExport);
        break;
      case 'docx':
        exportDOCX(dataToExport);
        break;
      default:
        console.error('Unsupported format');
    }
  };

  const exportCSV = (data) => {
    const csvContent = [
      ['Email', 'Timestamp'],
      ...data.map(item => [item.email, item.createdAt])
    ].map(row => row.join(',')).join('\n');
    
    downloadFile(csvContent, 'newsletter-subscribers.csv', 'text/csv');
  };

  const exportPDF = (data) => {
    // In a real implementation, you would use a library like jsPDF
    // For this example, we'll just log a message
    console.log('Exporting to PDF:', data);
    alert('PDF export would be implemented with a library like jsPDF');
  };

  const exportDOCX = (data) => {
    // In a real implementation, you would use a library like docx
    // For this example, we'll just log a message
    console.log('Exporting to DOCX:', data);
    alert('DOCX export would be implemented with a library like docx');
  };

  const downloadFile = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Apply sorting, filtering, and searching
  let filteredData = [...newsLetter];

  // Apply search
  if (searchTerm) {
    filteredData = filteredData.filter(item => 
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply filtering
  if (filterConfig.key !== "all" && filterConfig.value) {
    if (filterConfig.key === "date") {
      const filterDate = new Date(filterConfig.value).setHours(0, 0, 0, 0);
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.createdAt).setHours(0, 0, 0, 0);
        return itemDate === filterDate;
      });
    } else if (filterConfig.key === "domain") {
      filteredData = filteredData.filter(item => {
        const domain = item.email.split('@')[1];
        return domain === filterConfig.value;
      });
    }
  }

  // Apply sorting
  filteredData.sort((a, b) => {
    if (sortConfig.key === "email") {
      return sortConfig.direction === "asc" 
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    } else {
      // Sort by date
      return sortConfig.direction === "asc" 
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNewsletters = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Loader or No Newsletter State
  if (loading) {
    return <Loader />;
  }

  if (!newsLetter.length) {
    return <p className="text-center text-gray-600">No newsletters available.</p>;
  }

  return (
    <div className="w-full p-4 bg-white shadow-lg h-[80vh] min-w-[100%] mx-auto mt-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between px-4 py-2 bg-gray-200 text-black rounded-md font-medium">
          <h2 className="text-lg font-semibold text-gray-800">Newsletter Details</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-[#754E1A] text-white hover:bg-[#5c3d14]">
                <Download size={16} /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
              <DropdownMenuItem 
                onClick={() => exportData('csv')}
                className="hover:bg-blue-100 cursor-pointer px-4 py-2 text-sm"
              >
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 h-px my-1" />
              <DropdownMenuItem 
                onClick={() => exportData('pdf')}
                className="hover:bg-blue-100 cursor-pointer px-4 py-2 text-sm"
              >
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 h-px my-1" />
              <DropdownMenuItem 
                onClick={() => exportData('docx')}
                className="hover:bg-blue-100 cursor-pointer px-4 py-2 text-sm"
              >
                Export as DOCX
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
          {/* Search */}
          <div className="flex items-center gap-2 flex-grow">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by email..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
          </div>
          
          {/* Filter and Sort */}
          <div className="flex gap-2">
            <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200">
                  <Filter size={16} /> Filter
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Filter Newsletters</DialogTitle>
                  <DialogDescription>
                    Select criteria to filter the newsletter list.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <Select onValueChange={(value) => setFilterConfig({...filterConfig, key: value})}>
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue placeholder="Select filter type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">No Filter</SelectItem>
                      <SelectItem value="date">By Date</SelectItem>
                      <SelectItem value="domain">By Domain</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {filterConfig.key === "date" && (
                    <Input
                      type="date"
                      value={filterConfig.value}
                      onChange={(e) => setFilterConfig({...filterConfig, value: e.target.value})}
                      className="border border-gray-300"
                    />
                  )}
                  
                  {filterConfig.key === "domain" && (
                    <Input
                      placeholder="Enter domain (e.g., gmail.com)"
                      value={filterConfig.value}
                      onChange={(e) => setFilterConfig({...filterConfig, value: e.target.value})}
                      className="border border-gray-300"
                    />
                  )}
                  
                  <Button 
                    onClick={() => applyFilter(filterConfig.key, filterConfig.value)}
                    className="mt-2 bg-[#754E1A] hover:bg-[#5c3d14] text-white"
                  >
                    Apply Filter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200">
                  {sortConfig.direction === "asc" ? (
                    <SortAsc size={16} />
                  ) : (
                    <SortDesc size={16} />
                  )}
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
                <DropdownMenuItem 
                  onClick={() => handleSort("email")}
                  className="hover:bg-blue-100 cursor-pointer px-4 py-2 text-sm"
                >
                  Sort by Email {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200 h-px my-1" />
                <DropdownMenuItem 
                  onClick={() => handleSort("createdAt")}
                  className="hover:bg-blue-100 cursor-pointer px-4 py-2 text-sm"
                >
                  Sort by Date {sortConfig.key === "createdAt" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Applied Filters Display */}
      {(searchTerm || filterConfig.key !== "all") && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {searchTerm && (
            <div className="bg-blue-100 px-3 py-1 rounded-md text-sm flex items-center gap-1">
              Search: {searchTerm}
              <button 
                onClick={() => setSearchTerm("")} 
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          )}
          
          {filterConfig.key !== "all" && filterConfig.value && (
            <div className="bg-green-100 px-3 py-1 rounded-md text-sm flex items-center gap-1">
              Filter: {filterConfig.key === "date" ? "Date " : "Domain "} 
              {filterConfig.value}
              <button 
                onClick={() => setFilterConfig({ key: "all", value: "" })} 
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
        <table className="border-collapse border border-gray-300 min-w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">
                <div className="flex items-center gap-1">
                  Email
                  <button onClick={() => handleSort("email")} className="ml-1">
                    {sortConfig.key === "email" ? (
                      sortConfig.direction === "asc" ? "↑" : "↓"
                    ) : ""}
                  </button>
                </div>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                <div className="flex items-center gap-1">
                  Timestamp
                  <button onClick={() => handleSort("createdAt")} className="ml-1">
                    {sortConfig.key === "createdAt" ? (
                      sortConfig.direction === "asc" ? "↑" : "↓"
                    ) : ""}
                  </button>
                </div>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentNewsletters.length > 0 ? (
              currentNewsletters.map((newsletter) => (
                <tr key={newsletter._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{newsletter.email}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(newsletter.createdAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <FaTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 border border-gray-300">
                  No results match your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
              className="bg-gray-50 hover:bg-gray-100"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-50 hover:bg-gray-100"
            >
              Prev
            </Button>
            
            {/* Page numbers */}
            <div className="flex gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => paginate(pageNum)}
                    className={`w-8 ${
                      currentPage === pageNum 
                        ? "bg-[#754E1A] text-white hover:bg-[#5c3d14]" 
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-50 hover:bg-gray-100"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages}
              className="bg-gray-50 hover:bg-gray-100"
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletter;