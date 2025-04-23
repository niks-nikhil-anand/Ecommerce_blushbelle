"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { MdArrowBackIos } from "react-icons/md";
import Loader from "@/components/loader/loader";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

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
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [shipping, setShipping] = useState({
    countries: [],
    states: [],
    selectedShippingInfo: null,
    fee: 0,
    deliveryTime: { minDays: 0, maxDays: 0 }
  });
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    mobileNumber: "",
    country: "India",
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
    const fetchShippingInfo = async () => {
      try {
        const response = await axios.get('/api/admin/dashboard/shipping');
        const shippingData = response.data;
        console.log("Shipping data:", shippingData);
        
        if (shippingData && shippingData.length > 0) {
          // Get unique countries
          const countries = [...new Set(shippingData.map(item => item.country))];
          setShipping(prev => ({
            ...prev,
            countries
          }));
          
          // Set default country states
          if (formData.country) {
            const countryStates = shippingData
              .filter(item => item.country === formData.country && item.state)
              .map(item => item.state);
            
            setShipping(prev => ({
              ...prev,
              states: [...new Set(countryStates)]
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching shipping data:", error);
        toast.error("Failed to load shipping information");
      }
    };
    
    fetchShippingInfo();
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

  useEffect(() => {
    // Update shipping fee and delivery time when country, state or cart changes
    const updateShippingInfo = async () => {
      if (!formData.country) return;
      
      try {
        const subtotalValue = parseFloat(subtotal());
        const response = await axios.get('/api/admin/dashboard/shipping', {
          params: {
            country: formData.country,
            state: formData.state || null,
            orderValue: subtotalValue
          }
        });
        
        const shippingInfo = response.data;
        if (shippingInfo) {
          setShipping(prev => ({
            ...prev,
            selectedShippingInfo: shippingInfo,
            fee: shippingInfo.isFreeShipping ? 0 : shippingInfo.shippingFee,
            deliveryTime: shippingInfo.estimatedDeliveryTime
          }));
        }
      } catch (error) {
        console.error("Error fetching shipping information:", error);
      }
    };
    
    updateShippingInfo();
  }, [formData.country, formData.state, products]);

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
    const total = parseFloat(subtotal()) - discountAmount + shipping.fee;
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
    
    // Clear the error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleCheckboxChange = (checked) => {
    setFormData({
      ...formData,
      subscribeChecked: checked,
    });
  };

  const handleCountryChange = async (value) => {
    setFormData({
      ...formData,
      country: value,
      state: "" // Reset state when country changes
    });
    
    try {
      const response = await axios.get('/api/admin/dashboard/shipping', {
        params: { country: value }
      });
      
      const shippingData = response.data;
      if (shippingData && shippingData.length > 0) {
        // Get states for selected country
        const countryStates = shippingData
          .filter(item => item.country === value && item.state)
          .map(item => item.state);
        
        // Fix for Frankfurt typo
        const fixedStates = countryStates.map(state => 
          state === "Franfrut" ? "Frankfurt" : state
        );
        
        setShipping(prev => ({
          ...prev,
          states: [...new Set(fixedStates)]
        }));
      }
    } catch (error) {
      console.error("Error fetching states for country:", error);
    }
  };

  const handleStateChange = (value) => {
    setFormData({
      ...formData,
      state: value
    });
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
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
        
        toast.success(`Coupon "${couponCode}" applied successfully!`);
        
        setCouponCode("");
      } else {
        toast.error(response.data.message || "This coupon cannot be applied");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Failed to apply coupon. Please try again.");
    } finally {
      setApplyCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    localStorage.removeItem("appliedCoupon");
    toast.success("Coupon has been removed successfully");
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = {
      email: "Email is required",
      firstName: "First name is required",
      lastName: "Last name is required",
      address: "Address is required",
      apartment: "Apartment/Suite is required",
      mobileNumber: "Mobile number is required",
      state: "State is required",
      city: "City is required",
      pinCode: "PIN code is required"
    };
    
    // Check each required field
    Object.keys(requiredFields).forEach(field => {
      if (!formData[field]) {
        newErrors[field] = requiredFields[field];
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Mobile validation
    if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }
    
    // PIN code validation
    if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "Please enter a valid 6-digit PIN code";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToShipping = async () => {
    // Validate form
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
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
      country: formData.country,
      state: formData.state === "Franfrut" ? "Frankfurt" : formData.state, // Fix typo when submitting
      landmark: formData.landmark,
      city: formData.city,
      pinCode: formData.pinCode,
      subscribeChecked: formData.subscribeChecked,
      cart,
      coupon: appliedCoupon,
      shipping: {
        fee: shipping.fee,
        deliveryTime: shipping.deliveryTime
      }
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

  const renderInputField = (name, placeholder, required = false) => {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <Input
            type="text"
            name={name}
            placeholder={placeholder + (required ? " *" : "")}
            value={formData[name]}
            onChange={handleInputChange}
            className={`border w-full py-2 px-4 rounded-md ${
              errors[name] ? "border-red-500" : ""
            }`}
            required={required}
          />
        </div>
        {errors[name] && (
          <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
        )}
      </div>
    );
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
            <div className="flex flex-col gap-1">
              <Input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleInputChange}
                className={`border w-full py-2 px-4 rounded-md ${
                  errors.email ? "border-red-500" : ""
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
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
              {/* Country Select */}
              <div className="flex flex-col gap-1">
                <Select 
                  value={formData.country} 
                  onValueChange={handleCountryChange} 
                  defaultValue="India"
                >
                  <SelectTrigger className={`w-full ${errors.country ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select a country *" />
                  </SelectTrigger>
                  <SelectContent>
                    {shipping.countries.length > 0 ? (
                      shipping.countries.map(country => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="India">India</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderInputField("firstName", "First name", true)}
                {renderInputField("lastName", "Last name", true)}
              </div>

              {renderInputField("address", "Address", true)}
              {renderInputField("apartment", "Apartment, suite, etc.", true)}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <Input
                    type="text"
                    name="mobileNumber"
                    placeholder="Mobile Number *"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className={`border w-full py-2 px-4 rounded-md ${
                      errors.mobileNumber ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
                  )}
                </div>
                {renderInputField("landmark", "Landmark")}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* State Select */}
                <div className="flex flex-col gap-1">
                  <Select 
                    value={formData.state} 
                    onValueChange={handleStateChange}
                  >
                    <SelectTrigger className={`w-full ${errors.state ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select a state *" />
                    </SelectTrigger>
                    <SelectContent>
                      {shipping.states.length > 0 ? (
                        shipping.states.map(state => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>No states available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                  )}
                </div>
                {renderInputField("city", "City", true)}
              </div>

              {renderInputField("pinCode", "PIN Code", true)}
            </div>
          </div>

          {/* Shipping Info Display */}
          {shipping.selectedShippingInfo && (
            <div className="mt-4 mb-2">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription>
                  <div className="flex flex-col gap-1 text-sm">
                    <p className="font-medium">
                      {/* Fix the wrong order of min and max days */}
                      {/* Estimated Delivery: {shipping.deliveryTime.minDays}-{shipping.deliveryTime.maxDays} days */}
                    </p>
                    <p>
                      {shipping.fee > 0 
                        ? `Shipping Fee: ₹${shipping.fee.toFixed(2)}` 
                        : "Free Shipping"}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

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
            
            {/* Display shipping fee */}
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>
                {shipping.fee > 0 
                  ? `₹${shipping.fee.toFixed(2)}` 
                  : "Free"}
              </span>
            </div>
            
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
            {shipping.fee > 0 && (
              <span className="ml-2">• Shipping: ₹{shipping.fee.toFixed(2)}</span>
            )}
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