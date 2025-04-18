"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { MdArrowBackIos } from "react-icons/md";
import Loader from "@/components/loader/loader";
import { useRouter } from "next/navigation";
import { FaMoneyBillWave } from "react-icons/fa";

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
  const [orderId, setOrderId] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [userId, setUserId] = useState(null); // Add userId state

  useEffect(() => {
    const fetchOrderAndAddress = async () => {
      try {
        const decodedTokenResponse = await axios.get("/api/pendingOrder/checkout/cookies");
        const { orderId, cartId, addressId } = decodedTokenResponse.data;

        setOrderId(orderId);
        setCartId(cartId);
        setAddressId(addressId);

        if (orderId && addressId) {
          const addressResponse = await axios.get(`/api/admin/dashboard/pendingOrder/address/${addressId}`);
          const { email, mobileNumber, address, firstName, lastName } = addressResponse.data.data;

          setContactInfo({
            name: `${firstName || ''} ${lastName || ''}`,
            email: email || '',
            mobileNumber: mobileNumber || '',
            address: address || ''
          });
          await axios.get(`/api/pendingOrder/shipping/${orderId}`);
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
    const urlPath = window.location.pathname;
    const extractedUserId = urlPath.split('/')[2];
    setUserId(extractedUserId); // Save userId in state

    const fetchCart = async () => {
      if (extractedUserId) {
        try {
          const response = await axios.get(`/api/users/cart/${extractedUserId}`);
          const fetchedCart = response.data.items;
          setCart(fetchedCart);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (cart.length === 0) return;
      setLoading(true);
      try {
        const productDetails = await Promise.all(
          cart.map(async (item) => {
            if (!item.productId) {
              console.warn('Missing productId in cart item:', item);
              return null;
            }
            const response = await axios.get(`/api/admin/dashboard/product/${item.productId}`);
            return { ...response.data, quantity: item.quantity || 1 };
          })
        );
        setProducts(productDetails.filter(Boolean));
      } catch (error) {
        console.error('Error fetching product details:', error);
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

  const handlePlaceOrder = async () => {
    if (!orderId || !cartId || !addressId || !userId) {
      console.error("Order ID, Cart ID, Address ID, or User ID missing.");
      return;
    }

    setPlacingOrder(true);

    const checkoutData = {
      orderId,
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
      const response = await axios.post(`/api/users/pendingOrder/${userId}/placeCodOrder`, checkoutData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        router.push(`/users/${userId}/product/cart/information/shipping/${orderId}/cashOnDelivery`);
      }
    } catch (error) {
      console.error("Error submitting checkout:", error);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="flex mx-auto justify-center my-10 gap-5">
      <div className="flex flex-col w-full lg:w-2/5 gap-10">
        <div className="">
          <div className="flex mb-6 gap-4 ">
            <div className="text-sm text-gray-600">
              <Link href="/cart" className="mr-2 text-blue-500">
                Cart
              </Link>
              &gt;
              <span className="ml-2 text-blue-500 ">Information</span>
              &gt;
              <span className="ml-2 text-blue-500">Shipping</span>
              &gt;
              <span className="ml-2 ">Payment</span>
            </div>
          </div>

          <div className="border border-gray-300 rounded-lg px-5 py-10">
            <div className="mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span>{contactInfo.email || "Not Available"}</span>
                <a href="#" className="text-purple-600 hover:underline">Change</a>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile No.</span>
                <span>{contactInfo.mobileNumber || "Not Available"}</span>
                <a href="#" className="text-purple-600 hover:underline">Change</a>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Ship to</span>
                <span>{contactInfo.address || "Not Available"}</span>
                <a href="#" className="text-purple-600 hover:underline">Change</a>
              </div>
            </div>  
          </div>
        </div>

        <div className="w-full p-4 border border-gray-300 rounded-lg">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Payment method</h3>
            <div className="flex items-center p-4 mb-2 border rounded-lg cursor-pointer"
              onClick={() => setPaymentMethod("Cash on Delivery")}> {/* Updated this line */}
              <FaMoneyBillWave className="text-purple-600 mr-4" size={24} />
              <input 
                type="radio" 
                name="paymentMethod" 
                checked={paymentMethod === "Cash on Delivery"} // Match to the state
                className="form-radio text-purple-600 mr-2" 
                readOnly 
              />
              <label className="cursor-pointer">Cash on Delivery</label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Remember me</h3>
          <div className="flex items-center mt-2">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-600" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
            <label className="ml-3 text-gray-700">Save my information for a faster checkout</label>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <div className="flex items-center">
            <MdArrowBackIos />
            <Link href="/cart">
              <button className="text-black font-bold py-2 px-6 rounded-md">Return to Checkout</button>
            </Link>
          </div>
          <button
            onClick={handlePlaceOrder}
           
            className="bg-purple-600 text-white font-bold py-2 px-6 rounded-md flex items-center justify-center"
          >
            {placingOrder ? "Loading..." : "Place Order"}
          </button>
          </div>
      </div>

      <div className="w-full border shadow-lg rounded-lg lg:w-5/12 bg-gray-50 p-10">
        <table className="w-full table-auto border-collapse text-xs md:text-base">
          <thead>
            <tr>
              <th className="px-2 md:px-4 py-2 text-left">Product</th>
              <th className="px-2 md:px-4 py-2 text-center hidden md:table-cell">Quantity</th>
              <th className="px-2 md:px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="flex items-center py-2">
                  <img src={product.featuredImage} alt={product.name} className="w-12 md:w-16 h-12 md:h-16 object-cover mr-2 md:mr-4 rounded-lg hover:cursor-pointer" />
                  <div className="flex flex-col">
                    <h3 className="text-xs md:text-base">{product.name}</h3>
                    <p className="text-xs md:text-sm text-gray-500">₹{product.salePrice}</p>
                  </div>
                </td>
                <td className="px-2 md:px-4 py-2 text-center hidden md:table-cell">{product.quantity}</td>
                <td className="px-2 md:px-4 py-2 text-right">₹{totalPriceForProduct(product)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between py-2 mt-8 border-t border-b">
          <span className="text-gray-600">Subtotal</span>
          <span>${estimatedTotal()}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between py-4 font-bold text-lg">
          <span>Total</span>
          <span>₹{estimatedTotal()}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
