"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Calendar, 
  Activity, 
  TrendingUp, 
  ShoppingBag, 
  CreditCard,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

// Sample data for the dashboard
const salesData = {
  today: { value: 8590, change: 12.5 },
  yesterday: { value: 7634, change: -3.2 },
  weekly: { value: 48320, change: 8.7 },
  monthly: { value: 195750, change: 15.3 },
  total: { value: 2345670, change: 21.8 },
  cod: { value: 875400, change: 5.6 },
  paid: { value: 1470270, change: 14.2 }
};

// Format currency function for Indian Rupees
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

// SalesCard component for metrics display
const SalesCard = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
          <div className="p-2 bg-gray-100 rounded-md">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(value)}</div>
          <div className={`flex items-center text-sm mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            <span>{Math.abs(change)}% from previous period</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function SalesMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
      <SalesCard 
        title="Today's Sales" 
        value={salesData.today.value} 
        change={salesData.today.change}
        icon={<DollarSign className="h-4 w-4 text-green-600" />}
      />
      <SalesCard 
        title="Yesterday's Sales" 
        value={salesData.yesterday.value} 
        change={salesData.yesterday.change}
        icon={<Calendar className="h-4 w-4 text-blue-600" />}
      />
      <SalesCard 
        title="Weekly Sales" 
        value={salesData.weekly.value} 
        change={salesData.weekly.change}
        icon={<Activity className="h-4 w-4 text-purple-600" />}
      />
      <SalesCard 
        title="Monthly Sales" 
        value={salesData.monthly.value} 
        change={salesData.monthly.change}
        icon={<TrendingUp className="h-4 w-4 text-orange-600" />}
      />
      <SalesCard 
        title="Total Sales" 
        value={salesData.total.value} 
        change={salesData.total.change}
        icon={<ShoppingBag className="h-4 w-4 text-indigo-600" />}
      />
      <SalesCard 
        title="COD Sales" 
        value={salesData.cod.value} 
        change={salesData.cod.change}
        icon={<DollarSign className="h-4 w-4 text-yellow-600" />}
      />
      <SalesCard 
        title="Paid Sales" 
        value={salesData.paid.value} 
        change={salesData.paid.change}
        icon={<CreditCard className="h-4 w-4 text-emerald-600" />}
      />
    </div>
  );
}