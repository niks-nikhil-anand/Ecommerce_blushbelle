import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function AnalyticsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Details</CardTitle>
        <CardDescription>Detailed analysis of your sales data</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          This section will contain more detailed analytics features in future updates.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Key Performance Indicators</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Average Order Value:</span>
                <span className="font-medium">₹18,625</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Conversion Rate:</span>
                <span className="font-medium">3.8%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Total Orders:</span>
                <span className="font-medium">9,445</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Growth Metrics</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Year-over-Year Growth:</span>
                <span className="font-medium text-green-600">24.7%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Month-over-Month Growth:</span>
                <span className="font-medium text-green-600">8.3%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Customer Retention Rate:</span>
                <span className="font-medium">78%</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming Features
          </h3>
          <div className="space-y-4 text-yellow-700">
            {/* User Metrics Section */}
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">👥 User Metrics</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  Total Users - All registered users to date
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  Active Users (DAU, WAU, MAU)
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  New Signups per Day
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  Returning Users vs New Users
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  User Retention Rate (day 1, 7, 30)
                </li>
              </ul>
            </div>

            {/* Traffic & Visit Metrics Section */}
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">🌐 Traffic & Visit Metrics</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  Total Visits per Day / Yesterday / This Month
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  Page Views (per route like /interview, /chat)
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  Average Session Duration
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  Bounce Rate Analysis
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  Geo-location (user country, city)
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  Device / Browser Usage Stats
                </li>
              </ul>
            </div>

            {/* Existing Features */}
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">📊 Additional Analytics</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  Customer Demographics Analysis
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  Product Performance Dashboard
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  Sales Forecasting Tools
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <p className="text-sm text-gray-500">
          For detailed analytics reports, please visit the Reports section or contact your account manager.
        </p>
      </CardFooter>
    </Card>
  );
}