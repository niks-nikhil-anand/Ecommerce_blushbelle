"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Loader from "@/components/loader/loader";
import { format } from "date-fns";
import { 
  Download, Search, FileText, FileSpreadsheet, 
  FileBox, SlidersHorizontal, X, ArrowUpDown,
  ChevronLeft, ChevronRight, ChevronDown
} from "lucide-react";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table, TableCell, TableRow } from "docx";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell as ShadcnTableCell,
  TableHead,
  TableHeader,
  TableRow as ShadcnTableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const ContactUs = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const csvLinkRef = useRef();

  // Fetch Contact Us messages from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("/api/admin/dashboard/contactUs");
        if (Array.isArray(response.data)) {
          setContacts(response.data);
          setFilteredContacts(response.data);
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

  // Apply filters and search when they change
  useEffect(() => {
    let results = [...contacts];

    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      results = results.filter(
        (contact) =>
          contact.firstName?.toLowerCase().includes(lowerCaseSearch) ||
          contact.lastName?.toLowerCase().includes(lowerCaseSearch) ||
          contact.email?.toLowerCase().includes(lowerCaseSearch) ||
          contact.message?.toLowerCase().includes(lowerCaseSearch) ||
          contact.mobileNumber?.includes(searchTerm)
      );
    }

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // Set to end of day

      results = results.filter((contact) => {
        const contactDate = new Date(contact.createdAt);
        return contactDate >= fromDate && contactDate <= toDate;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      results.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredContacts(results);
    setCurrentPage(1); // Reset to first page whenever filters change
  }, [searchTerm, contacts, sortConfig, dateRange]);

  // Handle sort request
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Check/uncheck all contacts
  useEffect(() => {
    if (selectAll) {
      setSelectedContacts(currentContacts.map(contact => contact._id));
    } else if (selectedContacts.length === currentContacts.length) {
      setSelectedContacts([]);
    }
  }, [selectAll]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle checkbox selection
  const handleSelectContact = (id) => {
    setSelectedContacts(prev => {
      if (prev.includes(id)) {
        return prev.filter(contactId => contactId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle deleting contact
  const handleDeleteContact = async () => {
    if (!contactToDelete) return;
    
    try {
      await axios.delete(`/api/admin/dashboard/contactUs/${contactToDelete}`);
      setContacts(contacts.filter(contact => contact._id !== contactToDelete));
      setFilteredContacts(filteredContacts.filter(contact => contact._id !== contactToDelete));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  // Bulk delete selected contacts
  const handleBulkDelete = async () => {
    if (!selectedContacts.length) return;
    
    try {
      await Promise.all(
        selectedContacts.map(id => 
          axios.delete(`/api/admin/dashboard/contactUs/${id}`)
        )
      );
      
      setContacts(contacts.filter(contact => !selectedContacts.includes(contact._id)));
      setFilteredContacts(filteredContacts.filter(contact => !selectedContacts.includes(contact._id)));
      setSelectedContacts([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error bulk deleting contacts:", error);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setDateRange({ from: "", to: "" });
    setSortConfig({ key: "createdAt", direction: "desc" });
    setFilteredContacts(contacts);
    setFilterOpen(false);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text("Contact Messages Report", 14, 15);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    // Define table columns
    const tableColumn = ["Name", "Email", "Mobile", "Message", "Date"];
    
    // Define table rows
    const tableRows = selectedContacts.length 
      ? filteredContacts.filter(contact => selectedContacts.includes(contact._id))
          .map(contact => [
            `${contact.firstName} ${contact.lastName}`,
            contact.email,
            contact.mobileNumber,
            contact.message.substring(0, 50) + (contact.message.length > 50 ? "..." : ""),
            new Date(contact.createdAt).toLocaleDateString()
          ])
      : filteredContacts.map(contact => [
          `${contact.firstName} ${contact.lastName}`,
          contact.email,
          contact.mobileNumber,
          contact.message.substring(0, 50) + (contact.message.length > 50 ? "..." : ""),
          new Date(contact.createdAt).toLocaleDateString()
        ]);
    
    // Generate PDF table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { overflow: 'linebreak', cellWidth: 'wrap' },
      columnStyles: { 
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 50 },
        4: { cellWidth: 30 }
      },
      headStyles: { fillColor: [117, 78, 26] } // #754E1A color
    });
    
    doc.save("contact_messages.pdf");
  };

  // Export to DOCX
  const exportToDocx = () => {
    const contactsToExport = selectedContacts.length 
      ? filteredContacts.filter(contact => selectedContacts.includes(contact._id))
      : filteredContacts;
    
    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Contact Messages Report",
              heading: "Heading1"
            }),
            new Paragraph({
              text: `Generated on: ${new Date().toLocaleDateString()}`,
              spacing: {
                after: 200
              }
            }),
            
            // Table
            new Table({
              width: {
                size: 100,
                type: "pct"
              },
              rows: [
                // Header row
                new TableRow({
                  tableHeader: true,
                  children: [
                    new TableCell({ children: [new Paragraph("Name")] }),
                    new TableCell({ children: [new Paragraph("Email")] }),
                    new TableCell({ children: [new Paragraph("Mobile")] }),
                    new TableCell({ children: [new Paragraph("Message")] }),
                    new TableCell({ children: [new Paragraph("Date")] })
                  ]
                }),
                
                // Data rows
                ...contactsToExport.map(contact => 
                  new TableRow({
                    children: [
                      new TableCell({ 
                        children: [new Paragraph(`${contact.firstName} ${contact.lastName}`)] 
                      }),
                      new TableCell({ 
                        children: [new Paragraph(contact.email)] 
                      }),
                      new TableCell({ 
                        children: [new Paragraph(contact.mobileNumber)] 
                      }),
                      new TableCell({ 
                        children: [new Paragraph(
                          contact.message.substring(0, 50) + 
                          (contact.message.length > 50 ? "..." : "")
                        )] 
                      }),
                      new TableCell({ 
                        children: [new Paragraph(
                          new Date(contact.createdAt).toLocaleDateString()
                        )] 
                      })
                    ]
                  })
                )
              ]
            })
          ]
        }
      ]
    });
    
    // Generate and save document
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "contact_messages.docx");
    });
  };

  // Prepare CSV data
  const csvData = selectedContacts.length 
    ? filteredContacts.filter(contact => selectedContacts.includes(contact._id))
        .map(contact => ({
          "First Name": contact.firstName,
          "Last Name": contact.lastName,
          "Email": contact.email,
          "Mobile Number": contact.mobileNumber,
          "Message": contact.message,
          "Date": new Date(contact.createdAt).toLocaleDateString()
        }))
    : filteredContacts.map(contact => ({
        "First Name": contact.firstName,
        "Last Name": contact.lastName,
        "Email": contact.email,
        "Mobile Number": contact.mobileNumber,
        "Message": contact.message,
        "Date": new Date(contact.createdAt).toLocaleDateString()
      }));

  // Loader or No Data State
  if (loading) {
    return <Loader />;
  }

  if (!contacts.length) {
    return (
      <Card className="w-full mx-auto mt-4">
        <CardContent className="flex flex-col items-center justify-center h-64">
          <p className="text-center text-gray-600 text-lg">No contact messages available.</p>
          <Button variant="outline" className="mt-4">Refresh Data</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg h-[80vh] min-w-[100%] mx-auto mt-4">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Contact Us Messages</CardTitle>
            <CardDescription>
              {filteredContacts.length} messages total
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedContacts.length > 0 && (
              <Badge variant="secondary" className="h-9 px-3 flex items-center gap-1">
                {selectedContacts.length} selected 
                <X 
                  className="h-4 w-4 cursor-pointer ml-1" 
                  onClick={() => {
                    setSelectedContacts([]);
                    setSelectAll(false);
                  }}
                />
              </Badge>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-amber-50">
                  <DropdownMenuItem className="hover:bg-amber-100" onClick={exportToPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-amber-100" onClick={() => csvLinkRef.current.link.click()}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-amber-100" onClick={exportToDocx}>
                    <FileBox className="h-4 w-4 mr-2" />
                    Export as DOCX
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Hidden CSV link for download */}
              <CSVLink
                data={csvData}
                filename="contact_messages.csv"
                className="hidden"
                ref={csvLinkRef}
                target="_blank"
              />
              
              {selectedContacts.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    setContactToDelete(selectedContacts);
                    setDeleteModalOpen(true);
                  }}
                >
                  Delete Selected
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Search and filters bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {filterOpen && (
            <Card className="w-full mt-2">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Date Range</h3>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={dateRange.from}
                        onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                        className="w-full"
                      />
                      <Input
                        type="date"
                        value={dateRange.to}
                        onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleResetFilters}
                      className="h-10"
                    >
                      Reset Filters
                    </Button>
                    <Button 
                      onClick={() => setFilterOpen(false)}
                      className="h-10"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto max-h-[50vh] custom-scrollbar">
          <ShadcnTable>
            <TableHeader>
              <ShadcnTableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={
                      currentContacts.length > 0 && 
                      selectedContacts.length === currentContacts.length
                    }
                    onCheckedChange={(checked) => {
                      setSelectAll(!!checked);
                    }}
                  />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort("firstName")}>
                  <div className="flex items-center">
                    First Name
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort("lastName")}>
                  <div className="flex items-center">
                    Last Name
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort("email")}>
                  <div className="flex items-center">
                    Email
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort("createdAt")}>
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </ShadcnTableRow>
            </TableHeader>
            <TableBody>
              {currentContacts.map((contact) => (
                <ShadcnTableRow key={contact._id} className="hover:bg-gray-50">
                  <ShadcnTableCell>
                    <Checkbox 
                      checked={selectedContacts.includes(contact._id)}
                      onCheckedChange={() => handleSelectContact(contact._id)}
                    />
                  </ShadcnTableCell>
                  <ShadcnTableCell>{contact.firstName}</ShadcnTableCell>
                  <ShadcnTableCell>{contact.lastName}</ShadcnTableCell>
                  <ShadcnTableCell>{contact.email}</ShadcnTableCell>
                  <ShadcnTableCell>{contact.mobileNumber}</ShadcnTableCell>
                  <ShadcnTableCell>
                    <div className="truncate max-w-[250px]">
                      {contact.message}
                    </div>
                  </ShadcnTableCell>
                  <ShadcnTableCell>
                    {format(new Date(contact.createdAt), "MMM d, yyyy")}
                  </ShadcnTableCell>
                  <ShadcnTableCell>
                    <div className="flex justify-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setSelectedContact(contact);
                          setViewModalOpen(true);
                        }}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setContactToDelete(contact._id);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </ShadcnTableCell>
                </ShadcnTableRow>
              ))}
            </TableBody>
          </ShadcnTable>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 bg-gray-50 border-t">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredContacts.length)} of {filteredContacts.length} entries
          </p>
          
          <Select 
            value={String(itemsPerPage)}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent className="bg-amber-50">
              <SelectItem className="hover:bg-amber-100" value="5">5</SelectItem>
              <SelectItem className="hover:bg-amber-100" value="10">10</SelectItem>
              <SelectItem className="hover:bg-amber-100" value="25">25</SelectItem>
              <SelectItem className="hover:bg-amber-100" value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">per page</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Pagination numbers */}
          <div className="flex items-center">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic to show pagination centered around current page
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
                  key={i}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className="w-9 h-9"
                  onClick={() => paginate(pageNum)}
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
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
      
      {/* View Contact Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Message Details</DialogTitle>
            <DialogDescription>
              Message from {selectedContact?.firstName} {selectedContact?.lastName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Name:</div>
                <div className="col-span-2">{selectedContact.firstName} {selectedContact.lastName}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Email:</div>
                <div className="col-span-2">{selectedContact.email}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Mobile:</div>
                <div className="col-span-2">{selectedContact.mobileNumber}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Date:</div>
                <div className="col-span-2">
                  {format(new Date(selectedContact.createdAt), "PPP p")}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="font-medium">Message:</div>
                <div className="border rounded-md p-3 bg-gray-50 whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button onClick={() => setViewModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {Array.isArray(contactToDelete) 
                ? `Are you sure you want to delete ${contactToDelete.length} selected contact messages?` 
                : "Are you sure you want to delete this contact message?"}
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={Array.isArray(contactToDelete) ? handleBulkDelete : handleDeleteContact}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ContactUs;