"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AccountSidebar from "./AccountSidebar";
import { FiMenu, FiX, FiMoreVertical, FiShoppingCart, FiTrash2, FiEye, FiHeart } from "react-icons/fi";

const Wishlist = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Demo wishlist data
  const wishlistItems = [
    {
      id: 1,
      name: "Organic Aloe Vera Moisturizer",
      price: "$29.99",
      imageUrl: "/api/placeholder/120/120",
      availability: "In Stock",
      originalPrice: "$39.99",
      discount: "25%"
    },
    {
      id: 2,
      name: "Natural Bamboo Toothbrush Set",
      price: "$12.99",
      imageUrl: "/api/placeholder/120/120",
      availability: "In Stock",
      originalPrice: "$15.99",
      discount: "19%"
    },
    {
      id: 3,
      name: "Eco-Friendly Reusable Food Wraps",
      price: "$18.50",
      imageUrl: "/api/placeholder/120/120",
      availability: "Low Stock",
      originalPrice: "$25.99",
      discount: "29%"
    },
    {
      id: 4,
      name: "Organic Tea Tree Essential Oil",
      price: "$16.99",
      imageUrl: "/api/placeholder/120/120",
      availability: "Out of Stock",
      originalPrice: "$21.99",
      discount: "23%"
    },
    {
      id: 5,
      name: "Plant-Based Laundry Detergent",
      price: "$32.99",
      imageUrl: "/api/placeholder/120/120",
      availability: "In Stock",
      originalPrice: "$42.99",
      discount: "23%"
    }
  ];

  const removeFromWishlist = (id) => {
    // This would call an API to remove the item in a real app
    console.log(`Removing item ${id} from wishlist`);
  };

  const addToCart = (id) => {
    // This would call an API to add the item to cart in a real app
    console.log(`Adding item ${id} to cart`);
  };

  const viewProduct = (id) => {
    // This would navigate to product page in a real app
    console.log(`Viewing product ${id}`);
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "In Stock":
        return "text-green-700";
      case "Low Stock":
        return "text-yellow-600";
      case "Out of Stock":
        return "text-red-500";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 md:hidden">
        <h1 className="text-2xl font-bold text-green-700">My Wishlist</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-green-700"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile sidebar - shown/hidden based on state */}
        {sidebarOpen && (
          <div className="md:hidden w-full">
            <AccountSidebar className="w-full" />
          </div>
        )}
        
        {/* Desktop sidebar - always visible on md+ screens */}
        <div className="hidden md:block md:w-1/4 lg:w-1/5">
          <AccountSidebar className="sticky top-24" />
        </div>

        {/* Main content area */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">My Wishlist</CardTitle>
                <CardDescription>
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved in your wishlist
                </CardDescription>
              </CardHeader>

              <CardContent>
                {wishlistItems.length > 0 ? (
                  <div className="space-y-6">
                    {wishlistItems.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.01 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-green-100 rounded-lg p-4 hover:bg-green-50 transition-colors"
                      >
                        {/* Product Image */}
                        <div className="w-full sm:w-auto flex justify-center">
                          <div className="w-28 h-28 rounded-md overflow-hidden bg-gray-100">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 w-full">
                          <h3 className="font-medium text-lg text-green-700">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-semibold">{item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">{item.originalPrice}</span>
                            )}
                            {item.discount && (
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                                -{item.discount}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${getAvailabilityColor(item.availability)}`}>
                            {item.availability}
                          </p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                          <Button
                            className="bg-green-600 hover:bg-green-800 flex-1"
                            onClick={() => addToCart(item.id)}
                            disabled={item.availability === "Out of Stock"}
                          >
                            <FiShoppingCart className="mr-2" />
                            Add to Cart
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="border-green-200 hover:border-green-500 hover:bg-green-50">
                                <FiMoreVertical />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => viewProduct(item.id)} className="cursor-pointer">
                                <FiEye className="mr-2" /> View Product
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => removeFromWishlist(item.id)} className="cursor-pointer text-red-500 hover:text-red-700">
                                <FiTrash2 className="mr-2" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-700 mb-4">
                      <FiHeart size={36} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-6">Browse our products and add your favorites to wishlist</p>
                    <Button className="bg-green-600 hover:bg-green-800">
                      Continue Shopping
                    </Button>
                  </div>
                )}
              </CardContent>
              
              {wishlistItems.length > 0 && (
                <CardFooter className="flex justify-between border-t border-green-100 pt-4">
                  <Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600">
                    <FiTrash2 className="mr-2" /> Clear Wishlist
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-800">
                    <FiShoppingCart className="mr-2" /> Add All to Cart
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;