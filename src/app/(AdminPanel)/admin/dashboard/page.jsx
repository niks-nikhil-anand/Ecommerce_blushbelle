"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  Activity, 
  DollarSign, 
  Calendar, 
  ShoppingBag, 
  CreditCard, 
  TrendingUp, 
  RefreshCw,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SalesMetrics from '@/components/adminPanel/(dashboard)/SaleMetrics';
import SalesCharts from '@/components/adminPanel/(dashboard)/SalesChart';
import AnalyticsCard from '@/components/adminPanel/(dashboard)/Analytics';

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

const weeklyData = [
  { name: 'Mon', sales: 7430 },
  { name: 'Tue', sales: 8520 },
  { name: 'Wed', sales: 9120 },
  { name: 'Thu', sales: 8240 },
  { name: 'Fri', sales: 9560 },
  { name: 'Sat', sales: 10430 },
  { name: 'Sun', sales: 8640 }
];

const paymentMethodData = [
  { name: 'Cash on Delivery', value: 875400, color: '#4F46E5' },
  { name: 'Paid Online', value: 1470270, color: '#10B981' }
];

const monthlyTrendData = [
  { name: 'Jan', sales: 125000 },
  { name: 'Feb', sales: 135000 },
  { name: 'Mar', sales: 145000 },
  { name: 'Apr', sales: 155000 },
  { name: 'May', sales: 175000 },
  { name: 'Jun', sales: 190000 },
  { name: 'Jul', sales: 210000 },
  { name: 'Aug', sales: 195000 },
  { name: 'Sep', sales: 205000 },
  { name: 'Oct', sales: 225000 },
  { name: 'Nov', sales: 235000 },
  { name: 'Dec', sales: 260000 }
];

// Format currency function
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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

// Main dashboard component
export default function SalesDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Dashboard loading animation
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-12 h-12 text-blue-600" />
        </motion.div>
        <p className="ml-4 text-xl font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="h-[90vh] overflow-y-auto bg-gray-50">
      <div className="p-6  mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <header>
            <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
            <p className="text-gray-500 mt-2">Overview of your sales metrics and performance</p>
          </header>

          <Alert className="border-blue-200 bg-blue-50">
            <Activity className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Dashboard Updated</AlertTitle>
            <AlertDescription className="text-blue-700">
              Sales data was last refreshed on May 22, 2025 at 9:00 AM.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              {/* Sales Cards Grid */}
             <SalesMetrics/>
            </TabsContent>
            
            <TabsContent value="charts" className="mt-4">
             <SalesCharts/>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-4">
              <AnalyticsCard/>
            </TabsContent>
          </Tabs>
          
          {/* Dashboard Footer */}
          <footer className="border-t pt-6 text-center text-gray-500 text-sm">
            <p>© 2025 Cleaveda. All rights reserved.</p>
            <p className="mt-1">Developed by Nikhil</p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}