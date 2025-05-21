"use client";
import { motion } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import {
  Card, CardHeader, CardContent, CardTitle, CardDescription
} from '@/components/ui/card';

// Sample Data
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

const regionRevenueData = [
  { name: 'North', revenue: 450000 },
  { name: 'South', revenue: 375000 },
  { name: 'East', revenue: 290000 },
  { name: 'West', revenue: 410000 }
];

const deviceUsageData = [
  { name: 'Mobile', value: 65, color: '#4F46E5' },
  { name: 'Desktop', value: 30, color: '#10B981' },
  { name: 'Tablet', value: 5, color: '#F59E0B' }
];

// Currency formatter for INR
const formatCurrency = (value) => {
  return `₹${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(value)}`;
};

export default function SalesCharts() {
  return (
    <div className="h-screen overflow-y-auto p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Row 1: Weekly Sales & Payment Method */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Sales */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Weekly Sales Performance</CardTitle>
                <CardDescription>Daily sales for the current week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="sales" fill="#4F46E5" name="Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Method */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Distribution</CardTitle>
                <CardDescription>COD vs Paid Orders</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Row 2: Monthly Sales Trend & Regional Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Sales */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Trend</CardTitle>
                <CardDescription>Sales over the last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#10B981"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Monthly Sales"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Regional Revenue (Bar Chart) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Region</CardTitle>
                <CardDescription>Performance of different regions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#6366F1" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Row 3: Device Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
                <CardDescription>User access by device type</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceUsageData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      dataKey="value"
                    >
                      {deviceUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
