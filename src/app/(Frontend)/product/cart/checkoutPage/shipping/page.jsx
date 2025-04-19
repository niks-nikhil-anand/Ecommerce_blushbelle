"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { MdArrowBackIos } from "react-icons/md";
import Loader from "@/components/loader/loader";
import { useRouter } from "next/navigation";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";

// Import Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

// Updated imports or custom breadcrumb implementation
import { ChevronRight } from "lucide-react";

const CheckoutPage = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [rememberMe, setRememberMe] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    mobileNumber: "",
    address: "",
    name: ""
  });
  const [cartId, setCartId] = useState(null);
  const [addressId, setAddressId] = useState(null);

  useEffect(() => {
    const fetchOrderAndAddress = async () => {
      try {
        console.log("Fetching decoded token...");
        const decodedTokenResponse = await axios.get("/api/pendingOrder/checkout/cookies");
        const { cartId, addressId } = decodedTokenResponse.data;

        console.log("Decoded token response:", decodedTokenResponse.data);
        console.log("Cart ID:", cartId, "Address ID:", addressId);

        setCartId(cartId);
        setAddressId(addressId);

        if (cartId && addressId) {
          console.log("Fetching address details...");
          const addressResponse = await axios.get(`/api/admin/dashboard/pendingOrder/address/${addressId}`);
          const { email, mobileNumber, address, firstName, lastName } = addressResponse.data.data;

          console.log("Address details:", addressResponse.data.data);

          setContactInfo({
            name: `${firstName || ''} ${lastName || ''}`,
            email: email || '',
            mobileNumber: mobileNumber || '',
            address: address || ''
          });

          console.log("Fetching shipping details...");
          await axios.get(`/api/pendingOrder/shipping/${cartId}`);
        } else {
          console.error("Order ID or Address ID not found.");
        }
      } catch (error) {
        console.error("Error fetching order or address details:", error.response || error.message);
      }
    };

    fetchOrderAndAddress();
  }, [router]);

  useEffect(() => {
    const fetchCartFromLocalStorage = () => {
      const cartData = JSON.parse(localStorage.getItem("cart"));
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
            return { ...response.data, quantity: item.quantity };
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

  const initiateRazorpayPayment = async () => {
    const totalAmount = parseFloat(estimatedTotal()) * 100; // Convert to paise
    console.log("Total Amount (in paise):", totalAmount);

    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      toast.error("Invalid total amount for payment.");
      console.log("Invalid total amount:", totalAmount);
      return;
    }

    const payload = {
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    console.log("Payload for Razorpay:", payload);

    try {
      const response = await axios.post(
        "/api/pendingOrder/create-razorpay-order",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Razorpay order creation response:", response);

      if (response.status !== 200) {
        toast.error("Failed to create Razorpay order. Please try again.");
        console.log("Failed to create Razorpay order, status:", response.status);
        return;
      }

      const { order } = response.data;
      console.log("Order details:", order);

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "JonoJivan Grocery Checkout",
        description: "Complete your purchase with Razorpay",
        order_id: order.id,
        handler: async (razorpayResponse) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            razorpayResponse;
          console.log("Razorpay response:", razorpayResponse);

          try {
            const verificationResponse = await axios.post(
              "/api/pendingOrder/verify-payment",
              {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
              }
            );
            console.log("Payment verification response:", verificationResponse);

            const checkoutData = {
              cartId,
              addressId,
              paymentMethod: "Online",
              rememberMe,
              contactInfo,
              products: cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
              })),
              totalAmount: estimatedTotal(),
              razorpay_order_id,
              razorpay_payment_id,
            };

            console.log("Checkout data:", checkoutData);

            const placeOrderResponse = await fetch(
              "/api/pendingOrder/placeOnlineOrder",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(checkoutData),
              }
            );

            if (placeOrderResponse.ok) {
              const result = await placeOrderResponse.json();
              console.log("Order placed successfully:", result);

              router.push(
                `/product/cart/checkoutPage/shipping/${order.id}/ThankYouPage`
              );
              toast.success("Order placed successfully!");
            } else {
              const errorData = await placeOrderResponse.json();
              console.error("Error placing order:", errorData);
            }
          } catch (error) {
            console.error("Verification or order placement error:", error);
          }
        },
        prefill: {
          name: contactInfo.name,
          email: contactInfo.email,
          contact: contactInfo.mobileNumber,
        },
        notes: {
          address: contactInfo.address,
        },
        theme: {
          color: "#FF0080",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!cartId || !addressId) {
      console.error("Order ID, Cart ID, or Address ID missing.");
      return;
    }
    setPlacingOrder(true);
    const checkoutData = {
      cartId,
      addressId,
      paymentMethod,
      rememberMe,
      contactInfo,
      products: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      totalAmount: estimatedTotal(),
    };

    try {
      if (paymentMethod === "Cash on Delivery") {
        const response = await axios.post("/api/pendingOrder/placeCodOrder", checkoutData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          router.push(`/product/cart/checkoutPage/shipping/${cartId}/ThankYouPage`);
        }
      } else if (paymentMethod === "Online Payment") {
        await initiateRazorpayPayment(checkoutData);
      }
    } catch (error) {
      console.error("Error submitting checkout:", error);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/5">
          {/* Custom Breadcrumb Implementation */}
          <div className="flex items-center text-sm mb-6">
            <Link href="/cart" className="text-blue-500 hover:underline">
              Cart
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
            <Link href="#" className="text-blue-500 hover:underline">
              Information
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
            <Link href="#" className="text-blue-500 hover:underline">
              Shipping
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
            <span className="text-gray-600">Payment</span>
          </div>

          {/* Contact Information Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email</span>
                  <span>{contactInfo.email || "Not Available"}</span>
                  <Button variant="link" className="text-purple-600 p-0">Change</Button>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mobile No.</span>
                  <span>{contactInfo.mobileNumber || "Not Available"}</span>
                  <Button variant="link" className="text-purple-600 p-0">Change</Button>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ship to</span>
                  <span className="text-center flex-1 mx-4">{contactInfo.address || "Not Available"}</span>
                  <Button variant="link" className="text-purple-600 p-0">Change</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div className="flex items-center space-x-4 border rounded-lg p-4">
                  <FaMoneyBillWave className="text-purple-600" size={24} />
                  <RadioGroupItem value="Cash on Delivery" id="cod" />
                  <Label htmlFor="cod" className="cursor-pointer flex-1">Cash on Delivery</Label>
                </div>

                {/* Uncomment this for Online Payment Option
                <div className="flex items-center space-x-4 border rounded-lg p-4">
                  <FaCreditCard className="text-purple-600" size={24} />
                  <RadioGroupItem value="Online Payment" id="online" />
                  <Label htmlFor="online" className="cursor-pointer flex-1">Online Payment</Label>
                </div>
                */}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Remember Me Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Remember me</h3>
            <div className="flex items-center">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
              />
              <Label htmlFor="rememberMe" className="ml-2">
                Save my information for a faster checkout
              </Label>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <Button
              variant="outline"
              className="flex items-center"
              asChild
            >
              <Link href="/cart">
                <MdArrowBackIos className="mr-2" />
                Return to Checkout
              </Link>
            </Button>
            <Button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {placingOrder ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-2/5">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.featuredImage}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">₹{product.salePrice}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{product.quantity}</TableCell>
                      <TableCell className="text-right">₹{totalPriceForProduct(product)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between py-2 border-t">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{estimatedTotal()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between py-2 font-bold text-lg">
                  <span>Total</span>
                  <span>₹{estimatedTotal()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;