"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Search, Loader2, Check, X, Filter } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const CouponManagement = () => {
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minPurchaseAmount: 0,
    maxDiscountAmount: null,
    validFrom: "",
    validUntil: "",
    usageLimit: null,
    status: "Active",
    applicableProducts: [],
    applicableCategories: [],
  });

  const [coupons, setCoupons] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);

  // Fetch coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Fetch products when product selector is opened
  useEffect(() => {
    if (isProductSelectorOpen) {
      fetchProducts();
    }
  }, [isProductSelectorOpen]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/dashboard/coupon");
      if (!response.ok) {
        throw new Error("Failed to fetch coupons");
      }
      const data = await response.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await axios.get('/api/admin/dashboard/product/addProduct');
      console.log("Products response:", response.data);
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked ? "Active" : "UnActive",
    }));
  };

  const handleProductSelection = (productId) => {
    setFormData((prev) => {
      const updatedProducts = prev.applicableProducts.includes(productId)
        ? prev.applicableProducts.filter(id => id !== productId)
        : [...prev.applicableProducts, productId];
      
      return {
        ...prev,
        applicableProducts: updatedProducts
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/dashboard/coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create coupon");
      }

      const data = await response.json();
      toast.success("Coupon created successfully!");
      
      // Reset form and refresh coupon list
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        minPurchaseAmount: 0,
        maxDiscountAmount: null,
        validFrom: "",
        validUntil: "",
        usageLimit: null,
        status: "Active",
        applicableProducts: [],
        applicableCategories: [],
      });
      
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to create coupon");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and sort coupons
  const filteredCoupons = coupons
    .filter(coupon => 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "highest":
          return b.discountValue - a.discountValue;
        case "lowest":
          return a.discountValue - b.discountValue;
        default:
          return 0;
      }
    });

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  // Format currency with ₹ symbol
  const formatCurrency = (amount) => {
    return `₹${amount}`;
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Coupon Management</h1>
      
      <Tabs defaultValue="management" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="management">Coupon Management</TabsTrigger>
          <TabsTrigger value="list">Coupon List</TabsTrigger>
        </TabsList>
        
        {/* Coupon Management Tab */}
        <TabsContent value="management">
          <Card>
            <CardHeader>
              <CardTitle>Create New Coupon</CardTitle>
              <CardDescription>
                Add a new discount coupon to your store. Fill in all required fields.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Coupon Code */}
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter coupon code (e.g., SUMMER25)"
                    required
                  />
                </div>
                
                {/* Discount Type and Value */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Discount Type</Label>
                    <Select 
                      value={formData.discountType} 
                      onValueChange={(value) => handleSelectChange("discountType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">Discount Value</Label>
                    <div className="relative">
                      {formData.discountType === "fixed" && (
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">₹</span>
                      )}
                      <Input
                        id="discountValue"
                        name="discountValue"
                        type="number"
                        value={formData.discountValue}
                        onChange={handleChange}
                        min="0"
                        className={formData.discountType === "fixed" ? "pl-8" : ""}
                        required
                      />
                      {formData.discountType === "percentage" && (
                        <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">%</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Purchase Amounts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minPurchaseAmount">Minimum Purchase Amount (₹)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">₹</span>
                      <Input
                        id="minPurchaseAmount"
                        name="minPurchaseAmount"
                        type="number"
                        value={formData.minPurchaseAmount}
                        onChange={handleChange}
                        min="0"
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscountAmount">Maximum Discount Amount (₹)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">₹</span>
                      <Input
                        id="maxDiscountAmount"
                        name="maxDiscountAmount"
                        type="number"
                        value={formData.maxDiscountAmount || ""}
                        onChange={handleChange}
                        min="0"
                        placeholder="Optional"
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Validity Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validFrom">Valid From</Label>
                    <Input
                      id="validFrom"
                      name="validFrom"
                      type="date"
                      value={formData.validFrom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <Input
                      id="validUntil"
                      name="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                {/* Usage Limit and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Usage Limit</Label>
                    <Input
                      id="usageLimit"
                      name="usageLimit"
                      type="number"
                      value={formData.usageLimit || ""}
                      onChange={handleChange}
                      min="0"
                      placeholder="Leave blank for unlimited"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="status">Active Status</Label>
                      <Switch
                        id="status"
                        checked={formData.status === "Active"}
                        onCheckedChange={(checked) => handleSwitchChange("status", checked)}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      {formData.status === "Active" ? "Coupon is active and can be used" : "Coupon is inactive"}
                    </p>
                  </div>
                </div>
                
                {/* Product Selection */}
                <div className="space-y-2">
                  <Label>Applicable Products</Label>
                  <div className="flex flex-col space-y-2">
                    <Dialog open={isProductSelectorOpen} onOpenChange={setIsProductSelectorOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" type="button" className="w-full md:w-auto">
                          Select Products ({formData.applicableProducts.length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto bg-white">
                        <DialogHeader>
                          <DialogTitle>Select Products</DialogTitle>
                          <DialogDescription>
                            Choose products that this coupon can be applied to. Leave empty for all products.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-4">
                          <div className="mb-4">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                              <Input
                                placeholder="Search products by name or SKU"
                                className="pl-8"
                                value={productSearchTerm}
                                onChange={(e) => setProductSearchTerm(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          {loadingProducts ? (
                            <div className="flex justify-center items-center py-8">
                              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                              {filteredProducts.length === 0 ? (
                                <p className="text-center py-4 text-gray-500">No products found</p>
                              ) : (
                                filteredProducts.map((product) => (
                                  <div 
                                    key={product._id} 
                                    className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50"
                                  >
                                    <Checkbox 
                                      id={`product-${product._id}`}
                                      checked={formData.applicableProducts.includes(product._id)}
                                      onCheckedChange={() => handleProductSelection(product._id)}
                                    />
                                    <div className="flex-1">
                                      <Label 
                                        htmlFor={`product-${product._id}`}
                                        className="font-medium cursor-pointer flex-1"
                                      >
                                        {product.name}
                                      </Label>
                                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">{formatCurrency(product.salePrice)}</p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between">
                          <Button 
                            variant="outline" 
                            onClick={() => setFormData(prev => ({ ...prev, applicableProducts: [] }))}
                          >
                            Clear All
                          </Button>
                          <Button onClick={() => setIsProductSelectorOpen(false)}>Done</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {formData.applicableProducts.length > 0 && (
                      <p className="text-sm text-gray-500">
                        This coupon will only apply to {formData.applicableProducts.length} selected product(s)
                      </p>
                    )}
                    {formData.applicableProducts.length === 0 && (
                      <p className="text-sm text-gray-500">
                        This coupon will apply to all products
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Submit Button */}
                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Coupon...
                    </>
                  ) : (
                    "Create Coupon"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Coupon List Tab */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Coupon List</CardTitle>
              <CardDescription>
                View and manage all discount coupons.
              </CardDescription>
              
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                {/* Search */}
                <div className="relative w-full md:w-1/2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search coupons by code..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Sort */}
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Discount</SelectItem>
                    <SelectItem value="lowest">Lowest Discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : coupons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No coupons available. Create your first coupon.
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead className="hidden md:table-cell">Validity Period</TableHead>
                        <TableHead className="hidden md:table-cell">Min. Purchase</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden lg:table-cell">Products</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCoupons.map((coupon) => (
                        <TableRow key={coupon._id}>
                          <TableCell className="font-medium">{coupon.code}</TableCell>
                          <TableCell>
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}%`
                              : formatCurrency(coupon.discountValue)}
                            {coupon.maxDiscountAmount && (
                              <span className="text-xs text-gray-500 block">
                                (Max: {formatCurrency(coupon.maxDiscountAmount)})
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="text-sm">
                              <div>From: {new Date(coupon.validFrom).toLocaleDateString()}</div>
                              <div>Until: {new Date(coupon.validUntil).toLocaleDateString()}</div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatCurrency(coupon.minPurchaseAmount)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={coupon.status === "Active" ? "default" : "secondary"}
                              className={coupon.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                            >
                              {coupon.status === "Active" ? (
                                <Check className="h-3 w-3 mr-1" />
                              ) : (
                                <X className="h-3 w-3 mr-1" />
                              )}
                              {coupon.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {coupon.applicableProducts && coupon.applicableProducts.length > 0 ? (
                              <Badge variant="outline" className="font-normal">
                                {coupon.applicableProducts.length} products
                              </Badge>
                            ) : (
                              <span className="text-sm text-gray-500">All products</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CouponManagement;