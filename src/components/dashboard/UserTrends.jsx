// src/components/dashboard/UserTrends.jsx
import { useState } from "react";
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
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  UserPlus,
  TrendingUp,
  Info,
  Clock,
  MapPin,
} from "lucide-react";

// Process user data by time periods
const processUserData = (timeRange) => {
  const now = new Date();
  const data = [];

  // Different grouping based on time range
  if (timeRange === "today") {
    // Group by hour for today
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0") + ":00";
      data.push({
        time: hour,
        newUsers: Math.floor(Math.random() * 15) + 2,
        activeUsers: Math.floor(Math.random() * 50) + 20,
        sessions: Math.floor(Math.random() * 80) + 30,
      });
    }
  } else if (timeRange === "week") {
    // Group by day for last 7 days
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      data.push({
        time: dayName,
        newUsers: Math.floor(Math.random() * 25) + 5,
        activeUsers: Math.floor(Math.random() * 150) + 80,
        sessions: Math.floor(Math.random() * 200) + 100,
      });
    }
  } else {
    // Group by day for this month
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= Math.min(daysInMonth, 30); i++) {
      data.push({
        time: i.toString(),
        newUsers: Math.floor(Math.random() * 20) + 3,
        activeUsers: Math.floor(Math.random() * 120) + 60,
        sessions: Math.floor(Math.random() * 180) + 90,
      });
    }
  }

  return data;
};

// Find peak user activity times
const findPeakTimes = (data) => {
  return data
    .sort((a, b) => b.activeUsers - a.activeUsers)
    .slice(0, 3)
    .map(item => ({
      time: item.time,
      users: item.activeUsers
    }));
};

// Find user growth insights
const findUserInsights = (data) => {
  const totalNew = data.reduce((sum, item) => sum + item.newUsers, 0);
  const avgActive = data.reduce((sum, item) => sum + item.activeUsers, 0) / data.length;
  const totalSessions = data.reduce((sum, item) => sum + item.sessions, 0);
  
  return {
    totalNew,
    avgActive: Math.round(avgActive),
    totalSessions,
    avgSessionsPerUser: totalSessions > 0 ? (totalSessions / totalNew).toFixed(1) : 0
  };
};

const UserTrends = () => {
  const [timeRange, setTimeRange] = useState("today");
  const [chartType, setChartType] = useState("line");

  // Process data for charts
  const processedData = processUserData(timeRange);
  const peakTimes = findPeakTimes(processedData);
  const insights = findUserInsights(processedData);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            New Users: {payload.find(p => p.dataKey === 'newUsers')?.value || 0}
          </p>
          <p className="text-sm text-green-600">
            Active Users: {payload.find(p => p.dataKey === 'activeUsers')?.value || 0}
          </p>
          <p className="text-sm text-purple-600">
            Sessions: {payload.find(p => p.dataKey === 'sessions')?.value || 0}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            User Activity Trends
          </h3>
          <div className="relative ml-2 group">
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              Track user registration, activity patterns, and engagement metrics.
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
          </select>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="area">Area Chart</option>
          </select>
        </div>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="New Users"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#10b981"
                strokeWidth={2}
                name="Active Users"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="newUsers"
                fill="#8b5cf6"
                name="New Users"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="activeUsers"
                fill="#10b981"
                name="Active Users"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <AreaChart data={processedData}>
              <defs>
                <linearGradient id="newUsersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="activeUsersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="newUsers"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#newUsersGradient)"
                name="New Users"
              />
              <Area
                type="monotone"
                dataKey="activeUsers"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#activeUsersGradient)"
                name="Active Users"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Peak Activity Times */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-purple-600" />
            Peak Activity Times
          </h4>
          <div className="space-y-2">
            {peakTimes.map((peak, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{peak.time}</span>
                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {peak.users} users
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth Summary */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <UserPlus className="h-4 w-4 mr-2 text-green-600" />
            Growth Summary
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">New Users:</span>
              <span className="text-sm font-medium">{insights.totalNew}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg Active:</span>
              <span className="text-sm font-medium text-green-600">{insights.avgActive}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Sessions:</span>
              <span className="text-sm font-medium">{insights.totalSessions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Sessions/User:</span>
              <span className="text-sm font-medium">{insights.avgSessionsPerUser}</span>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
            Engagement Metrics
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Growth Rate:</span>
              <span className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.7%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Retention:</span>
              <span className="text-sm font-medium">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Daily Active:</span>
              <span className="text-sm font-medium text-blue-600">65%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg Session:</span>
              <span className="text-sm font-medium">12.5 min</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserTrends;
