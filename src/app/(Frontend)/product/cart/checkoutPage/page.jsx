"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios"; 
import { MdArrowBackIos } from "react-icons/md";
import Loader from "@/components/loader/loader";
import { useRouter } from 'next/navigation';
import Image from "next/image";

// Import Shadcn components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CheckoutPage = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [loadingButton, setLoadingButton] = useState(false); 

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

  const estimatedTotal = () => {
    return products
      .reduce((total, product) => total + product.salePrice * product.quantity, 0)
      .toFixed(2);
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
      subscribeChecked: checked
    });
  };

  const handleSelectChange = (value) => {
    // Handle country selection change if needed
    console.log("Country selected:", value);
  };

  const handleContinueToShipping = async () => {
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
      cart
    };
  
    try {
      // Submit checkout data
      setLoadingButton(true);
      console.log("Submitting checkout data:", checkoutData);
      const checkoutResponse = await axios.post("/api/pendingOrder/checkout", checkoutData, {
        headers: {
          'Content-Type': 'application/json', 
        },
      });
      
      console.log("Checkout successful!", checkoutResponse.data);
    
      if (checkoutResponse.status === 200) {
        console.log("Checkout successful! Response data:", checkoutResponse.data);
        router.push("/product/cart/checkoutPage/shipping"); // Absolute path
      } else {
        console.error("Checkout failed. Status:", checkoutResponse.status);
      }
    } catch (error) {
      console.error("Error during checkout or fetching order ID:", error);
    } finally {
      setLoadingButton(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col md:flex-row mx-auto justify-center my-4 md:my-10 gap-4 md:gap-5 px-4 md:px-0">
      {/* Checkout Form */}
      <Card className="w-full md:w-2/5 bg-gray-50 shadow-md rounded-md">
        <CardContent className="p-4 md:p-8">
          {/* Breadcrumb */}
          <div className="flex mb-6 gap-2 flex-wrap text-sm text-gray-600">
            <Link href="/cart" className="text-blue-500">Cart</Link>
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
            />
            <div className="flex items-center gap-2 mt-4">
              <Checkbox 
                id="subscribeChecked" 
                checked={formData.subscribeChecked}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="subscribeChecked">Email me with news and offers</Label>
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
                />
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="border w-full py-2 px-4 rounded-md"
                />
              </div>

              <Input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="border w-full py-2 px-4 rounded-md"
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
                />
                <Input
                  type="text"
                  name="pinCode"
                  placeholder="PinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  className="border w-full py-2 px-4 rounded-md"
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
              {loadingButton ? "Loading..." : "Continue to shipping"}
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
                <TableHead className="text-center hidden md:table-cell">Quantity</TableHead>
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
                            ₹<span className="line-through">{product.originalPrice}</span>
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

          <div className="mt-6 flex justify-between font-semibold">
            <h3>Total:</h3>
            <h3>₹{estimatedTotal()}</h3>
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
            {products.length} {products.length === 1 ? 'item' : 'items'} in cart
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutPage;