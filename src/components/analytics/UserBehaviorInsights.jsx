// src/components/analytics/UserBehaviorInsights.jsx
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
import { Users, Activity, Clock, MapPin, Download, TrendingUp } from "lucide-react";

const UserBehaviorInsights = ({ timeFilter }) => {
  const [isExporting, setIsExporting] = useState(false);

  // Mock user behavior data
  const getUserActivityData = (filter) => {
    if (filter === "Today") {
      return Array.from({ length: 24 }, (_, i) => ({
        time: `${i.toString().padStart(2, '0')}:00`,
        activeUsers: Math.floor(Math.random() * 100) + (i >= 7 && i <= 9 || i >= 17 && i <= 19 ? 80 : 20),
        newUsers: Math.floor(Math.random() * 20) + (i >= 8 && i <= 10 || i >= 18 && i <= 20 ? 15 : 3),
        sessionDuration: Math.floor(Math.random() * 30) + 10,
      }));
    } else if (filter === "7 days") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map(day => ({
        time: day,
        activeUsers: Math.floor(Math.random() * 300) + 200,
        newUsers: Math.floor(Math.random() * 50) + 20,
        sessionDuration: Math.floor(Math.random() * 25) + 15,
      }));
    } else {
      return Array.from({ length: 30 }, (_, i) => ({
        time: `Day ${i + 1}`,
        activeUsers: Math.floor(Math.random() * 400) + 150,
        newUsers: Math.floor(Math.random() * 60) + 15,
        sessionDuration: Math.floor(Math.random() * 35) + 12,
      }));
    }
  };

  const userActivityData = getUserActivityData(timeFilter);

  // User demographics data
  const userDemographicsData = [
    { segment: "18-25", users: 1250, percentage: 35, color: "#3b82f6" },
    { segment: "26-35", users: 1430, percentage: 40, color: "#10b981" },
    { segment: "36-45", users: 715, percentage: 20, color: "#f59e0b" },
    { segment: "46+", users: 180, percentage: 5, color: "#ef4444" },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate CSV
      const headers = "Time,Active Users,New Users,Avg Session Duration (min)";
      const csvData = userActivityData.map(row =>
        `${row.time},${row.activeUsers},${row.newUsers},${row.sessionDuration}`
      ).join("\n");

      const csvContent = headers + "\n" + csvData;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-behavior-${timeFilter}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      console.log("✅ User behavior data exported successfully!");
    } catch (error) {
      console.error("❌ Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const totalActiveUsers = userActivityData.reduce((sum, item) => sum + item.activeUsers, 0);
  const totalNewUsers = userActivityData.reduce((sum, item) => sum + item.newUsers, 0);
  const avgSessionDuration = userActivityData.reduce((sum, item) => sum + item.sessionDuration, 0) / userActivityData.length;
  const peakActiveUsers = Math.max(...userActivityData.map(item => item.activeUsers));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">User Behavior Insights</h3>
          <p className="text-sm text-gray-600">
            User engagement patterns and behavior analysis for {timeFilter}
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
        >
          <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
          {isExporting ? 'Exporting...' : 'Export Behavior Data'}
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
              <p className="text-sm text-gray-600">Total Active Users</p>
              <p className="text-2xl font-bold text-blue-600">{totalActiveUsers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
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
              <p className="text-sm text-gray-600">New Users</p>
              <p className="text-2xl font-bold text-green-600">{totalNewUsers.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
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
              <p className="text-sm text-gray-600">Avg Session Duration</p>
              <p className="text-2xl font-bold text-purple-600">{avgSessionDuration.toFixed(1)} min</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
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
              <p className="text-sm text-gray-600">Peak Active Users</p>
              <p className="text-2xl font-bold text-orange-600">{peakActiveUsers}</p>
            </div>
            <Activity className="h-8 w-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Trend */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 mb-4">User Activity Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  name="Active Users"
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Demographics */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 mb-4">User Demographics</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDemographicsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="users"
                >
                  {userDemographicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Users']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {userDemographicsData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.segment}</span>
                <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBehaviorInsights;
