"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FiMenu, FiX, FiSettings, FiBell, FiShoppingBag, FiGift, FiPercent } from "react-icons/fi";
import AccountSidebar from "@/components/users/shared/AccountSidebar";

const Notifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState({
    orders: [
      {
        id: "n1",
        title: "Order Shipped",
        message: "Your order #ORD-23756 has been shipped and is on its way.",
        time: "2 hours ago",
        read: false
      },
      {
        id: "n2",
        title: "Order Delivered",
        message: "Your order #ORD-23489 has been delivered successfully.",
        time: "3 days ago",
        read: true
      },
      {
        id: "n3",
        title: "Order Processing",
        message: "We've started processing your order #ORD-23985.",
        time: "1 week ago",
        read: true
      }
    ],
    promotions: [
      {
        id: "n4",
        title: "Summer Sale",
        message: "Enjoy up to 40% off on all eco-friendly products this summer!",
        time: "1 day ago",
        read: false
      },
      {
        id: "n5",
        title: "Free Shipping",
        message: "Free shipping on all orders above $50 for this weekend only.",
        time: "2 days ago",
        read: false
      },
      {
        id: "n6",
        title: "Exclusive Offer",
        message: "Use code ECO25 to get 25% off on your next purchase.",
        time: "1 week ago",
        read: true
      }
    ],
    system: [
      {
        id: "n7",
        title: "Account Updated",
        message: "Your account information has been updated successfully.",
        time: "5 days ago", 
        read: true
      },
      {
        id: "n8",
        title: "Password Changed",
        message: "Your account password was changed. If this wasn't you, please contact support.",
        time: "2 weeks ago",
        read: true
      }
    ]
  });

  const markAsRead = (id) => {
    // This would call an API to mark the notification as read in a real app
    const updatedNotifications = { ...notifications };
    
    // Find and update the notification in any category
    Object.keys(updatedNotifications).forEach(category => {
      updatedNotifications[category] = updatedNotifications[category].map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      );
    });
    
    setNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    // This would call an API to mark all notifications as read in a real app
    const updatedNotifications = { ...notifications };
    
    Object.keys(updatedNotifications).forEach(category => {
      updatedNotifications[category] = updatedNotifications[category].map(notification => 
        ({ ...notification, read: true })
      );
    });
    
    setNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
    // This would call an API to clear all notifications in a real app
    const updatedNotifications = { ...notifications };
    
    Object.keys(updatedNotifications).forEach(category => {
      updatedNotifications[category] = [];
    });
    
    setNotifications(updatedNotifications);
  };

  const getAllNotifications = () => {
    return [
      ...notifications.orders,
      ...notifications.promotions,
      ...notifications.system
    ].sort((a, b) => {
      // Sort by read status (unread first) and then by time (newest first)
      if (a.read !== b.read) return a.read ? 1 : -1;
      
      // Simple time-based sort for demo purposes
      const timeA = a.time.includes("hour") ? 0 : 
                     a.time.includes("day") ? parseInt(a.time) : 
                     a.time.includes("week") ? parseInt(a.time) * 7 : 30;
      
      const timeB = b.time.includes("hour") ? 0 : 
                     b.time.includes("day") ? parseInt(b.time) : 
                     b.time.includes("week") ? parseInt(b.time) * 7 : 30;
      
      return timeA - timeB;
    });
  };

  const getNotificationIcon = (category) => {
    switch (category) {
      case "orders":
        return <FiShoppingBag className="w-5 h-5" />;
      case "promotions":
        return <FiGift className="w-5 h-5" />;
      case "system":
        return <FiSettings className="w-5 h-5" />;
      default:
        return <FiBell className="w-5 h-5" />;
    }
  };

  const getActiveNotifications = () => {
    if (activeTab === "all") return getAllNotifications();
    return notifications[activeTab] || [];
  };

  const getUnreadCount = (category) => {
    if (category === "all") {
      return getAllNotifications().filter(n => !n.read).length;
    }
    return notifications[category]?.filter(n => !n.read).length || 0;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 md:hidden">
        <h1 className="text-2xl font-bold text-black">Notifications</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-black"
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
            <Card className="border-black">
              <CardHeader>
                <CardTitle className="text-2xl text-black">Notifications</CardTitle>
                <CardDescription className="text-gray-700">
                  Stay updated with your orders, promotions, and account activity
                </CardDescription>
                
                <Tabs
                  defaultValue="all"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="mt-4"
                >
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="all" className="data-[state=active]:bg-black data-[state=active]:text-white">
                      All
                      {getUnreadCount("all") > 0 && (
                        <Badge className="ml-2 bg-black text-white">{getUnreadCount("all")}</Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="data-[state=active]:bg-black data-[state=active]:text-white">
                      Orders
                      {getUnreadCount("orders") > 0 && (
                        <Badge className="ml-2 bg-black text-white">{getUnreadCount("orders")}</Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="promotions" className="data-[state=active]:bg-black data-[state=active]:text-white">
                      Promotions
                      {getUnreadCount("promotions") > 0 && (
                        <Badge className="ml-2 bg-black text-white">{getUnreadCount("promotions")}</Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="system" className="data-[state=active]:bg-black data-[state=active]:text-white">
                      System
                      {getUnreadCount("system") > 0 && (
                        <Badge className="ml-2 bg-black text-white">{getUnreadCount("system")}</Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent>
                <ScrollArea className="h-[420px] pr-4">
                  <AnimatePresence>
                    {getActiveNotifications().length > 0 ? (
                      <div className="space-y-4">
                        {getActiveNotifications().map((notification) => {
                          // Determine which category this notification belongs to
                          let category = "system";
                          if (notifications.orders.some(n => n.id === notification.id)) {
                            category = "orders";
                          } else if (notifications.promotions.some(n => n.id === notification.id)) {
                            category = "promotions";
                          }
                          
                          return (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className={`p-4 rounded-lg border ${notification.read ? 'border-gray-200 bg-white' : 'border-black bg-gray-50'}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${notification.read ? 'bg-gray-100 text-gray-500' : 'bg-gray-200 text-black'}`}>
                                  {getNotificationIcon(category)}
                                </div>
                                <div className="flex-1">
                                  <h4 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-black'}`}>
                                    {notification.title}
                                  </h4>
                                  <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-500">{notification.time}</span>
                                    {!notification.read && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-xs text-black hover:text-gray-800 hover:bg-gray-100"
                                        onClick={() => markAsRead(notification.id)}
                                      >
                                        Mark as read
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="bg-gray-100 text-black rounded-full p-4 mb-4">
                          <FiBell size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-black mb-2">No notifications</h3>
                        <p className="text-gray-500 text-center">
                          You're all caught up! We'll notify you when there's something new.
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </ScrollArea>
              </CardContent>

              {getActiveNotifications().length > 0 && (
                <CardFooter className="flex justify-between border-t border-gray-200 pt-4">
                  <Button 
                    variant="outline" 
                    className="border-black hover:bg-gray-100 hover:text-black"
                    onClick={markAllAsRead}
                    disabled={getActiveNotifications().every(n => n.read)}
                  >
                    Mark All as Read
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-black text-black hover:bg-gray-100 hover:text-black"
                    onClick={clearAllNotifications}
                  >
                    Clear All
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

export default Notifications;