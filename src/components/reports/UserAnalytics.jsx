// src/components/reports/UserAnalytics.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  TrendingUp,
  Download,
  Filter,
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

const UserAnalytics = ({ dateRange }) => {
  const [viewType, setViewType] = useState("overview");

  // Mock data
  const userGrowthData = [
    { date: "Jan 1", newUsers: 45, activeUsers: 234, totalUsers: 1200 },
    { date: "Jan 2", newUsers: 52, activeUsers: 267, totalUsers: 1252 },
    { date: "Jan 3", newUsers: 38, activeUsers: 245, totalUsers: 1290 },
    { date: "Jan 4", newUsers: 61, activeUsers: 289, totalUsers: 1351 },
    { date: "Jan 5", newUsers: 47, activeUsers: 256, totalUsers: 1398 },
    { date: "Jan 6", newUsers: 55, activeUsers: 278, totalUsers: 1453 },
    { date: "Jan 7", newUsers: 49, activeUsers: 267, totalUsers: 1502 },
  ];

  const userDemographics = [
    { name: "18-25", value: 35, count: 525 },
    { name: "26-35", value: 40, count: 600 },
    { name: "36-45", value: 20, count: 300 },
    { name: "46+", value: 5, count: 75 },
  ];

  const userBehavior = [
    { metric: "Avg Rides/User", value: "12.5", change: "+8.3%" },
    { metric: "Avg Session Duration", value: "18 min", change: "+5.2%" },
    { metric: "User Retention (30d)", value: "68%", change: "+12.1%" },
    { metric: "Churn Rate", value: "4.2%", change: "-2.1%" },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

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
            User Overview
          </button>
          <button
            onClick={() => setViewType("demographics")}
            className={`px-4 py-2 rounded-lg ${
              viewType === "demographics"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Demographics
          </button>
          <button
            onClick={() => setViewType("behavior")}
            className={`px-4 py-2 rounded-lg ${
              viewType === "behavior"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            User Behavior
          </button>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export User Report
        </button>
      </div>

      {viewType === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="totalUsersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="totalUsers"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#totalUsersGradient)"
                    name="Total Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* New vs Active Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">New vs Active Users</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="newUsers" fill="#10b981" name="New Users" />
                  <Bar dataKey="activeUsers" fill="#3b82f6" name="Active Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}

      {viewType === "demographics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Age Demographics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Demographics</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDemographics}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {userDemographics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Demographics Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographics Breakdown</h3>
            <div className="space-y-4">
              {userDemographics.map((demo, index) => (
                <div key={demo.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-gray-900">{demo.name} years</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{demo.count} users</p>
                    <p className="text-xs text-gray-500">{demo.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {viewType === "behavior" && (
        <div className="space-y-6">
          {/* Key Behavior Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userBehavior.map((metric, index) => (
              <motion.div
                key={metric.metric}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg border border-gray-200"
              >
                <div className="text-center">
                  <p className="text-sm text-gray-600">{metric.metric}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <p className={`text-xs mt-1 flex items-center justify-center ${
                    metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metric.change}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* User Activity Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity Patterns</h3>
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Detailed user activity patterns and engagement metrics
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserAnalytics;
