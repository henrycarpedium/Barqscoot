// src/components/analytics/RevenueAnalytics.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DollarSign, TrendingUp, Calendar, BarChart3, Download } from "lucide-react";

const RevenueAnalytics = ({ timeFilter }) => {
  const [isExporting, setIsExporting] = useState(false);

  // Mock revenue data based on time filter
  const getRevenueData = (filter) => {
    if (filter === "Today") {
      return Array.from({ length: 24 }, (_, i) => ({
        time: `${i.toString().padStart(2, '0')}:00`,
        revenue: Math.floor(Math.random() * 200) + (i >= 7 && i <= 9 || i >= 17 && i <= 19 ? 150 : 50),
        rides: Math.floor(Math.random() * 20) + (i >= 7 && i <= 9 || i >= 17 && i <= 19 ? 15 : 5),
      }));
    } else if (filter === "7 days") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map(day => ({
        time: day,
        revenue: Math.floor(Math.random() * 1000) + 800,
        rides: Math.floor(Math.random() * 100) + 80,
      }));
    } else {
      return Array.from({ length: 30 }, (_, i) => ({
        time: `Day ${i + 1}`,
        revenue: Math.floor(Math.random() * 1500) + 600,
        rides: Math.floor(Math.random() * 150) + 60,
      }));
    }
  };

  const revenueData = getRevenueData(timeFilter);

  // Revenue breakdown by source
  const revenueSourceData = [
    { source: "Ride Fees", amount: 15420, percentage: 68, color: "#3b82f6" },
    { source: "Subscription", amount: 4200, percentage: 18, color: "#10b981" },
    { source: "Late Fees", amount: 2100, percentage: 9, color: "#f59e0b" },
    { source: "Other", amount: 1080, percentage: 5, color: "#ef4444" },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate CSV
      const headers = "Time,Revenue,Rides,Revenue per Ride";
      const csvData = revenueData.map(row =>
        `${row.time},$${row.revenue},${row.rides},$${(row.revenue / row.rides).toFixed(2)}`
      ).join("\n");

      const csvContent = headers + "\n" + csvData;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `revenue-analytics-${timeFilter}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      console.log("✅ Revenue analytics exported successfully!");
    } catch (error) {
      console.error("❌ Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalRides = revenueData.reduce((sum, item) => sum + item.rides, 0);
  const avgRevenuePerRide = totalRevenue / totalRides;
  const peakRevenue = Math.max(...revenueData.map(item => item.revenue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
          <p className="text-sm text-gray-600">
            Financial performance and revenue insights for {timeFilter}
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
        >
          <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
          {isExporting ? 'Exporting...' : 'Export Revenue Data'}
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rides</p>
              <p className="text-2xl font-bold text-blue-600">{totalRides.toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Revenue/Ride</p>
              <p className="text-2xl font-bold text-purple-600">${avgRevenuePerRide.toFixed(2)}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Peak Revenue</p>
              <p className="text-2xl font-bold text-orange-600">${peakRevenue}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  formatter={(value, name) => [`$${value}`, name === 'revenue' ? 'Revenue' : 'Rides']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Sources */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Revenue Sources</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {revenueSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {revenueSourceData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.source}</span>
                <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
