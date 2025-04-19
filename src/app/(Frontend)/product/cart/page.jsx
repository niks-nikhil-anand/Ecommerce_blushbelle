"use client";
import React, { useState, useEffect } from 'react';
import { Trash2 } from "lucide-react";
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Loader from '@/components/loader/loader';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Cart = () => {
  const [cart, setCart] = useState([]); // Store cart data from localStorage
  const [products, setProducts] = useState([]); // Store product details
  const [loading, setLoading] = useState(true); // Track loading state
  const [checkoutLoading, setCheckoutLoading] = useState(false); // Track checkout button loading state
  const [couponCode, setCouponCode] = useState(''); // Store coupon code

  // Fetch cart from localStorage and product details from API
  useEffect(() => {
    const fetchCartFromLocalStorage = () => {
      const cartData = JSON.parse(localStorage.getItem('cart')); // Retrieve from localStorage
      if (cartData) {
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
            const response = await axios.get(`/api/admin/dashboard/product/${item.id}`);
            return { ...response.data, quantity: item.quantity }; // Add quantity from the cart
          })
        );
        setProducts(productDetails);
      } catch (error) {
        console.error('Error fetching product details:', error);
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

  const incrementQuantity = (productId) => {
    const updatedProducts = products.map((product) => {
      if (product._id === productId) {
        return { ...product, quantity: product.quantity + 1 }; // Only increment the quantity for the correct product
      }
      return product; // Return other products unchanged
    });
  
    setProducts(updatedProducts); // Update state
  
    // Update cart and localStorage
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  
  const decrementQuantity = (productId) => {
    const updatedProducts = products.map((product) => {
      if (product._id === productId && product.quantity > 1) {
        return { ...product, quantity: product.quantity - 1 }; // Only decrement the quantity for the correct product
      }
      return product; // Return other products unchanged
    });
  
    setProducts(updatedProducts); // Update state
  
    // Update cart and localStorage
    const updatedCart = cart.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Calculate total price for a specific product
  const totalPriceForProduct = (product) => {
    return (product.salePrice * product.quantity).toFixed(2);
  };

  // Calculate estimated total for the entire cart
  const estimatedTotal = () => {
    return products.reduce((total, product) => {
      return total + product.salePrice * product.quantity;
    }, 0).toFixed(2);
  };

  // Remove item from cart
  const removeItem = (productId) => {
    const updatedProducts = products.filter((product) => product._id !== productId);
    setProducts(updatedProducts);
    
    // Also update localStorage
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Handle coupon application
  const handleApplyCoupon = () => {
    // Implement coupon logic here
    console.log("Applying coupon:", couponCode);
    // For now just show an alert
    alert(`Coupon ${couponCode} applied!`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 md:p-4">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <h1 className="text-2xl md:text-5xl font-semibold text-orange-600 mb-2 md:mb-4">My Shopping Cart</h1>
        <Link href={"/"}>
          <h1 className="text-sm md:text-xl font-semibold text-blue-500 mb-2 md:mb-4 underline hover:cursor-pointer hover:underline-offset-1">Continue Shopping</h1>
        </Link>
      </div>

      <div className='flex flex-col md:flex-row w-full justify-between p-2 md:p-6 bg-white gap-4'>
        {/* Left Section - Cart Items */}
        <div className='flex flex-col w-full md:w-3/4 md:pr-6'>
          <Card className="w-full">
            <CardContent className="p-2 md:p-4">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader />
                </div>
              ) : products.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/2">Product</TableHead>
                        <TableHead className="text-center hidden md:table-cell">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell className="flex flex-col sm:flex-row items-start sm:items-center py-2 md:py-3">
                            <Image
                              src={product.featuredImage}
                              width={25}
                              height={64}
                              alt={product.name}
                              className="w-25 h-25 object-cover mr-2 md:mr-4 hover:cursor-pointer"
                            />
                            <div>
                              <h2 className="text-sm md:text-lg cursor-pointer hover:underline">{product.name}</h2>
                              <div className="flex gap-2">
                                <p className="text-gray-500 text-sm line-through">₹{product.originalPrice}</p>
                                <p className="text-black text-sm md:text-lg">₹{product.salePrice}</p>
                              </div>
                              
                              {/* Mobile quantity controls - visible only on small screens */}
                              <div className="flex items-center mt-2 md:hidden">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 rounded-l"
                                  onClick={() => decrementQuantity(product._id)}
                                >
                                  -
                                </Button>
                                <span className="px-3 py-1 border-t border-b h-8 flex items-center">{product.quantity}</span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 rounded-r"
                                  onClick={() => incrementQuantity(product._id)}
                                >
                                  +
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700 ml-2"
                                  onClick={() => removeItem(product._id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center hidden md:table-cell">
                            <div className="flex items-center justify-center">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-l"
                                onClick={() => decrementQuantity(product._id)}
                              >
                                -
                              </Button>
                              <span className="px-3 py-2 border-t border-b">{product.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-r"
                                onClick={() => incrementQuantity(product._id)}
                              >
                                +
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700 ml-4"
                                onClick={() => removeItem(product._id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm md:text-lg font-medium">
                            ₹{totalPriceForProduct(product)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 md:mt-6 text-right">
                    <p className="text-xs md:text-sm font-semibold">Taxes, discounts, and shipping calculated at checkout</p>
                  </div>
                  <div className='flex justify-start mt-4 md:mt-6'>
                    <Link href="/">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="secondary" className="w-full sm:w-48">
                          Return to Shop
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-sm md:text-base mb-4">Your cart is empty</p>
                  <Link href="/">
                    <Button variant="default" className="bg-orange-600 hover:bg-orange-700">Go Shopping</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coupon Field -- only shown when there are products */}
          {products.length > 0 && (
            <Card className="w-full mt-4">
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <h2 className="text-lg font-semibold mb-2 md:mb-0">Coupon Code</h2>
                  <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Enter code"
                      className="rounded-full flex-1"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                      <Button 
                        variant="default" 
                        className="rounded-full bg-orange-600 hover:bg-orange-700 w-full"
                        onClick={handleApplyCoupon}
                      >
                        Apply Coupon
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Section - Cart Summary */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Cart Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">₹{products.length > 0 ? estimatedTotal() : '0.00'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total:</span>
                <span className="text-gray-900">₹{products.length > 0 ? estimatedTotal() : '0.00'}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/product/cart/checkoutPage" className="w-full">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700 rounded-full" 
                    disabled={products.length === 0}
                  >
                    Proceed to checkout
                  </Button>
                </motion.div>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;