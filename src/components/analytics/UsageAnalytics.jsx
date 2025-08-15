// src/components/analytics/UsageAnalytics.jsx
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
import {
  TrendingUp,
  Clock,
  MapPin,
  Users,
  Activity,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

const UsageAnalytics = ({ timeFilter }) => {
  const [chartType, setChartType] = useState("line");

  // Mock usage data based on time filter
  const getUsageData = (filter) => {
    if (filter === "today") {
      return Array.from({ length: 24 }, (_, i) => ({
        time: `${i.toString().padStart(2, '0')}:00`,
        rides: Math.floor(Math.random() * 50) + (i >= 7 && i <= 9 || i >= 17 && i <= 19 ? 30 : 10),
        duration: Math.floor(Math.random() * 20) + 15,
        distance: Math.floor(Math.random() * 3) + 1,
      }));
    } else if (filter === "7days") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map(day => ({
        time: day,
        rides: Math.floor(Math.random() * 200) + 150,
        duration: Math.floor(Math.random() * 10) + 25,
        distance: Math.floor(Math.random() * 2) + 2,
      }));
    } else {
      return Array.from({ length: 30 }, (_, i) => ({
        time: `Day ${i + 1}`,
        rides: Math.floor(Math.random() * 300) + 100,
        duration: Math.floor(Math.random() * 15) + 20,
        distance: Math.floor(Math.random() * 3) + 1.5,
      }));
    }
  };

  const usageData = getUsageData(timeFilter);

  // Peak hours data
  const peakHoursData = [
    { hour: "7-9 AM", rides: 245, percentage: 18 },
    { hour: "12-2 PM", rides: 189, percentage: 14 },
    { hour: "5-7 PM", rides: 312, percentage: 23 },
    { hour: "8-10 PM", rides: 156, percentage: 11 },
  ];

  // Ride duration distribution
  const durationData = [
    { range: "0-15 min", count: 234, color: "#3b82f6" },
    { range: "15-30 min", count: 456, color: "#10b981" },
    { range: "30-45 min", count: 189, color: "#f59e0b" },
    { range: "45+ min", count: 87, color: "#ef4444" },
  ];

  const totalRides = usageData.reduce((sum, item) => sum + item.rides, 0);
  const avgDuration = usageData.reduce((sum, item) => sum + item.duration, 0) / usageData.length;
  const avgDistance = usageData.reduce((sum, item) => sum + item.distance, 0) / usageData.length;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
              {entry.dataKey === "rides" ? " rides" : 
               entry.dataKey === "duration" ? " min" : " km"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with Chart Type Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Usage Analytics</h3>
          <p className="text-sm text-gray-600">
            Scooter usage patterns and trends for {timeFilter === "today" ? "today" : timeFilter === "7days" ? "this week" : "this month"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChartType("line")}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === "line"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Activity className="h-4 w-4 mr-1" />
            Line Chart
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === "bar"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Bar Chart
          </button>
        </div>
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
              <p className="text-sm text-gray-600">Total Rides</p>
              <p className="text-2xl font-bold text-blue-600">{totalRides.toLocaleString()}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
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
              <p className="text-sm text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-green-600">{avgDuration.toFixed(1)} min</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
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
              <p className="text-sm text-gray-600">Avg Distance</p>
              <p className="text-2xl font-bold text-purple-600">{avgDistance.toFixed(1)} km</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-600" />
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
              <p className="text-sm text-gray-600">Peak Hour</p>
              <p className="text-2xl font-bold text-orange-600">5-7 PM</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Main Usage Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Usage Trends - {timeFilter === "today" ? "Hourly" : timeFilter === "7days" ? "Daily" : "Daily"}
        </h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="rides"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rides" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalytics;
