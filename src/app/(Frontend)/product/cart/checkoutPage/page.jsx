"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { MdArrowBackIos } from "react-icons/md";
import Loader from "@/components/loader/loader";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast

// Import Shadcn components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Remove the shadcn toast import
// import { toast } from "@/components/ui/use-toast";

const CheckoutPage = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [applyCouponLoading, setApplyCouponLoading] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    mobileNumber: "",
    state: "",
    landmark: "",
    city: "",
    pinCode: "",
    subscribeChecked: false,
  });

  useEffect(() => {
    const fetchCartFromLocalStorage = () => {
      const cartData = JSON.parse(localStorage.getItem("cart"));
      if (cartData) {
        console.log("Cart data found in local storage:", cartData);
        setCart(cartData);
      }
      
      // Get coupon from localStorage if exists
      const savedCoupon = JSON.parse(localStorage.getItem("appliedCoupon"));
      if (savedCoupon) {
        setAppliedCoupon(savedCoupon);
        setDiscountAmount(savedCoupon.discountAmount);
      }
    };
    fetchCartFromLocalStorage();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const productDetails = await Promise.all(
          cart.map(async (item) => {
            const response = await axios.get(
              `/api/admin/dashboard/product/${item.id}`
            );
            return { ...response.data, quantity: item.quantity }; // Add quantity from the cart
          })
        );
        setProducts(productDetails);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cart.length > 0) {
      fetchProductDetails();
    } else {
      setLoading(false);
    }
  }, [cart]);

  const totalPriceForProduct = (product) => {
    return (product.salePrice * product.quantity).toFixed(2);
  };

  const subtotal = () => {
    return products
      .reduce(
        (total, product) => total + product.salePrice * product.quantity,
        0
      )
      .toFixed(2);
  };

  const estimatedTotal = () => {
    const total = parseFloat(subtotal()) - discountAmount;
    return Math.max(total, 0).toFixed(2);
  };

  if (loading) {
    return <Loader />;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCheckboxChange = (checked) => {
    setFormData({
      ...formData,
      subscribeChecked: checked,
    });
  };

  const handleSelectChange = (value) => {
    // Handle country selection change if needed
    console.log("Country selected:", value);
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      // Use react-hot-toast for error notification
      toast.error("Please enter a coupon code");
      return;
    }

    setApplyCouponLoading(true);
    try {
      const response = await axios.post("/api/coupon/validate", {
        code: couponCode,
        subtotal: subtotal(),
      });

      if (response.data.valid) {
        const couponData = {
          code: couponCode,
          discountType: response.data.discountType,
          discountValue: response.data.discountValue,
          discountAmount: response.data.discountAmount,
        };
        
        setAppliedCoupon(couponData);
        setDiscountAmount(response.data.discountAmount);
        localStorage.setItem("appliedCoupon", JSON.stringify(couponData));
        
        // Use react-hot-toast for success notification
        toast.success(`Coupon "${couponCode}" applied successfully!`);
        
        setCouponCode("");
      } else {
        // Use react-hot-toast for error notification
        toast.error(response.data.message || "This coupon cannot be applied");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      // Use react-hot-toast for error notification
      toast.error("Failed to apply coupon. Please try again.");
    } finally {
      setApplyCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    localStorage.removeItem("appliedCoupon");
    // Use react-hot-toast for info notification
    toast.success("Coupon has been removed successfully");
  };

  const handleContinueToShipping = async () => {
    // Simple form validation
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.address || 
        !formData.mobileNumber || !formData.state || !formData.city || !formData.pinCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Data object for the checkout API
    const checkoutData = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      apartment: formData.apartment,
      mobileNumber: formData.mobileNumber,
      state: formData.state,
      landmark: formData.landmark,
      city: formData.city,
      pinCode: formData.pinCode,
      subscribeChecked: formData.subscribeChecked,
      cart,
      coupon: appliedCoupon,
    };

    try {
      // Submit checkout data
      setLoadingButton(true);
      toast.loading("Processing your order...");
      
      console.log("Submitting checkout data:", checkoutData);
      const checkoutResponse = await axios.post(
        "/api/pendingOrder/checkout",
        checkoutData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.dismiss(); // Dismiss the loading toast
      console.log("Checkout successful!", checkoutResponse.data);

      if (checkoutResponse.status === 200) {
        console.log(
          "Checkout successful! Response data:",
          checkoutResponse.data
        );
        toast.success("Information saved! Proceeding to shipping.");
        router.push("/product/cart/checkoutPage/shipping"); // Absolute path
      } else {
        console.error("Checkout failed. Status:", checkoutResponse.status);
        toast.error("Checkout failed. Please try again.");
      }
    } catch (error) {
      toast.dismiss(); // Dismiss the loading toast
      console.error("Error during checkout or fetching order ID:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoadingButton(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col md:flex-row mx-auto justify-center my-4 md:my-10 gap-4 md:gap-5 px-4 md:px-0">
      {/* React Hot Toast Container */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#4c1d95', // Purple background for success
            },
          },
          error: {
            style: {
              background: '#991b1b', // Red background for error
            },
          },
        }}
      />
      
      {/* Checkout Form */}
      <Card className="w-full md:w-2/5 bg-gray-50 shadow-md rounded-md">
        <CardContent className="p-4 md:p-8">
          {/* Breadcrumb */}
          <div className="flex mb-6 gap-2 flex-wrap text-sm text-gray-600">
            <Link href="/cart" className="text-blue-500">
              Cart
            </Link>
            <span>&gt;</span>
            <span className="text-black font-semibold">Information</span>
            <span>&gt;</span>
            <span>Shipping</span>
            <span>&gt;</span>
            <span>Payment</span>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="border w-full py-2 px-4 rounded-md focus:ring-purple-600"
              required
            />
            <div className="flex items-center gap-2 mt-4">
              <Checkbox
                id="subscribeChecked"
                checked={formData.subscribeChecked}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="subscribeChecked">
                Email me with news and offers
              </Label>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
            <div className="flex flex-col gap-4">
              <Select onValueChange={handleSelectChange} defaultValue="India">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                </SelectContent>
              </Select>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="border w-full py-2 px-4 rounded-md"
                  required
                />
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="border w-full py-2 px-4 rounded-md"
                  required
                />
              </div>

              <Input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="border w-full py-2 px-4 rounded-md"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="border w-full py-2 px-4 rounded-md"
                />
                <Input
                  type="text"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="border w-full py-2 px-4 rounded-md"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="border w-full py-2 px-4 rounded-md"
                  required
                />
                <Input
                  type="text"
                  name="landmark"
                  placeholder="Landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="border w-full py-2 px-4 rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="border w-full py-2 px-4 rounded-md"
                  required
                />
                <Input
                  type="text"
                  name="pinCode"
                  placeholder="PinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  className="border w-full py-2 px-4 rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-between mt-6">
            <Button
              onClick={handleContinueToShipping}
              className="bg-purple-600 text-white font-bold py-2 px-6 rounded-md hover:bg-purple-700 transition-colors w-full sm:w-auto"
              disabled={loadingButton}
            >
              {loadingButton ? "Processing..." : "Continue to shipping"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary - Hidden on mobile */}
      <Card className="w-full md:w-5/12 bg-gray-50 shadow-lg rounded-lg hidden md:block">
        <CardContent className="p-6 md:p-10">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Product</TableHead>
                <TableHead className="text-center hidden md:table-cell">
                  Quantity
                </TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id} className="border-b">
                  <TableCell className="py-2">
                    <div className="flex items-center">
                      <div className="relative w-9 h-16 mr-4">
                        <img
                          src={product.featuredImage}
                          alt={product.name}
                          className="object-cover hover:cursor-pointer w-full h-full"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-sm md:text-lg hover:cursor-pointer hover:underline">
                          {product.name}
                        </h2>
                        <div className="flex gap-2">
                          <p className="text-gray-500 text-xs md:text-sm">
                            ₹
                            <span className="line-through">
                              {product.originalPrice}
                            </span>
                          </p>
                          <p className="text-black text-sm md:text-lg">
                            ₹{product.salePrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-center py-2">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="text-right py-2">
                    ₹{totalPriceForProduct(product)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Coupon Section */}
          <div className="mt-6 border-t pt-4">
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={handleCouponChange}
                  className="flex-grow"
                />
                <Button 
                  onClick={applyCoupon} 
                  className="bg-purple-600 text-white hover:bg-purple-700"
                  disabled={applyCouponLoading}
                >
                  {applyCouponLoading ? "Applying..." : "Apply"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <div>
                  <span className="font-medium text-purple-700">{appliedCoupon.code}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    ({appliedCoupon.discountType === 'percentage' 
                      ? `${appliedCoupon.discountValue}% off` 
                      : `₹${appliedCoupon.discountValue} off`})
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={removeCoupon}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{subtotal()}</span>
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between text-purple-700">
                <span>Discount</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <h3>Total:</h3>
              <h3>₹{estimatedTotal()}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Order Summary Preview - Only for mobile */}
      <Card className="w-full bg-gray-50 shadow-md rounded-md p-4 md:hidden">
        <CardContent className="p-0">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Order Summary</h3>
            <h3 className="font-semibold">₹{estimatedTotal()}</h3>
          </div>
          <div className="text-sm text-gray-600">
            {products.length} {products.length === 1 ? "item" : "items"} in cart
            {appliedCoupon && (
              <span className="text-purple-700 ml-2">
                • Coupon: {appliedCoupon.code}
              </span>
            )}
          </div>
          
          {/* Mobile Coupon Input */}
          {!appliedCoupon && (
            <div className="mt-3 flex gap-2">
              <Input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={handleCouponChange}
                className="flex-grow"
                size="sm"
              />
              <Button 
                onClick={applyCoupon} 
                className="bg-purple-600 text-white hover:bg-purple-700"
                size="sm"
                disabled={applyCouponLoading}
              >
                {applyCouponLoading ? "..." : "Apply"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutPage;