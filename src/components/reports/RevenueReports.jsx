// src/components/reports/RevenueReports.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  CreditCard,
  Smartphone,
  AlertCircle,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const RevenueReports = ({ dateRange }) => {
  const [viewType, setViewType] = useState("overview"); // overview, payments, trends

  // Mock data - in real implementation, this would come from API
  const revenueData = [
    { date: "Jan 1", revenue: 1200, rides: 45, avgRide: 26.67 },
    { date: "Jan 2", revenue: 1450, rides: 52, avgRide: 27.88 },
    { date: "Jan 3", revenue: 1680, rides: 61, avgRide: 27.54 },
    { date: "Jan 4", revenue: 1320, rides: 48, avgRide: 27.50 },
    { date: "Jan 5", revenue: 1890, rides: 67, avgRide: 28.21 },
    { date: "Jan 6", revenue: 2100, rides: 75, avgRide: 28.00 },
    { date: "Jan 7", revenue: 1950, rides: 70, avgRide: 27.86 },
  ];

  const paymentMethodData = [
    { name: "Credit Card", value: 50, amount: 12500, color: "#3B82F6" },
    { name: "Apple Pay", value: 33, amount: 8250, color: "#10B981" },
    { name: "Google Pay", value: 17, amount: 4250, color: "#F59E0B" },
  ];

  const revenueBreakdown = [
    { category: "Base Fare", amount: 8500, percentage: 34 },
    { category: "Time Charges", amount: 12750, percentage: 51 },
    { category: "Distance Charges", amount: 2250, percentage: 9 },
    { category: "Surge Pricing", amount: 1500, percentage: 6 },
  ];

  const failedTransactions = [
    { id: "T001", user: "John D.", amount: 15.50, reason: "Insufficient funds", time: "2 hours ago" },
    { id: "T002", user: "Sarah M.", amount: 22.75, reason: "Card expired", time: "4 hours ago" },
    { id: "T003", user: "Mike R.", amount: 8.25, reason: "Network error", time: "6 hours ago" },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-green-600">
            Revenue: ${payload[0].value.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600">
            Rides: {payload[0].payload.rides}
          </p>
          <p className="text-sm text-purple-600">
            Avg/Ride: ${payload[0].payload.avgRide.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* View Type Selector */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <button
            onClick={() => setViewType("overview")}
            className={`px-4 py-2 rounded-lg ${
              viewType === "overview"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Revenue Overview
          </button>
          <button
            onClick={() => setViewType("payments")}
            className={`px-4 py-2 rounded-lg ${
              viewType === "payments"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Payment Analysis
          </button>
          <button
            onClick={() => setViewType("trends")}
            className={`px-4 py-2 rounded-lg ${
              viewType === "trends"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Trends & Forecasting
          </button>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Export Revenue Report
        </button>
      </div>

      {viewType === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Revenue Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
            <div className="space-y-4">
              {revenueBreakdown.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: `hsl(${index * 90}, 70%, 50%)` }}
                    />
                    <span className="text-sm text-gray-700">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${item.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {viewType === "payments" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Usage"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Failed Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Failed Transactions</h3>
              <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                {failedTransactions.length} pending
              </span>
            </div>
            <div className="space-y-3">
              {failedTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.user}</p>
                      <p className="text-xs text-gray-600">{transaction.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">${transaction.amount}</p>
                    <p className="text-xs text-gray-500">{transaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {viewType === "trends" && (
        <div className="space-y-6">
          {/* Revenue vs Rides Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Rides Correlation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rides"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Rides"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue Growth</p>
                  <p className="text-2xl font-bold text-green-600">+12.5%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Month over month
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Revenue/Day</p>
                  <p className="text-2xl font-bold text-blue-600">$1,656</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.3% vs last week
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Peak Revenue Day</p>
                  <p className="text-2xl font-bold text-purple-600">Saturday</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    $2,100 average
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueReports;
