// src/components/dashboard/RevenueTrends.jsx
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Info,
  Clock,
  Target,
  CreditCard,
} from "lucide-react";

// Generate revenue data with realistic patterns
const generateRevenueData = (timeRange) => {
  const now = new Date();
  const data = [];

  if (timeRange === "today") {
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0") + ":00";
      const baseRevenue = 150 + Math.sin((i - 8) * Math.PI / 10) * 100; // Peak around 6 PM
      const rideRevenue = Math.max(50, Math.round(baseRevenue * 0.85 + Math.random() * 50));
      const subscriptionRevenue = Math.round(baseRevenue * 0.10 + Math.random() * 20);
      const penaltyRevenue = Math.round(baseRevenue * 0.05 + Math.random() * 10);
      
      data.push({
        time: hour,
        totalRevenue: rideRevenue + subscriptionRevenue + penaltyRevenue,
        rideRevenue,
        subscriptionRevenue,
        penaltyRevenue,
        rides: Math.round(rideRevenue / 25),
        avgPerRide: Math.round((rideRevenue / Math.max(1, Math.round(rideRevenue / 25))) * 100) / 100,
      });
    }
  } else if (timeRange === "week") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    days.forEach((day, index) => {
      const isWeekend = index === 0 || index === 6;
      const baseRevenue = isWeekend ? 2800 : 4200;
      const rideRevenue = Math.round(baseRevenue * 0.85 + Math.random() * 500);
      const subscriptionRevenue = Math.round(baseRevenue * 0.10 + Math.random() * 100);
      const penaltyRevenue = Math.round(baseRevenue * 0.05 + Math.random() * 50);
      
      data.push({
        time: day,
        totalRevenue: rideRevenue + subscriptionRevenue + penaltyRevenue,
        rideRevenue,
        subscriptionRevenue,
        penaltyRevenue,
        rides: Math.round(rideRevenue / 25),
        avgPerRide: Math.round((rideRevenue / Math.max(1, Math.round(rideRevenue / 25))) * 100) / 100,
      });
    });
  } else {
    for (let i = 1; i <= 30; i++) {
      const baseRevenue = 3800;
      const rideRevenue = Math.round(baseRevenue * 0.85 + Math.random() * 800);
      const subscriptionRevenue = Math.round(baseRevenue * 0.10 + Math.random() * 150);
      const penaltyRevenue = Math.round(baseRevenue * 0.05 + Math.random() * 75);
      
      data.push({
        time: i.toString(),
        totalRevenue: rideRevenue + subscriptionRevenue + penaltyRevenue,
        rideRevenue,
        subscriptionRevenue,
        penaltyRevenue,
        rides: Math.round(rideRevenue / 25),
        avgPerRide: Math.round((rideRevenue / Math.max(1, Math.round(rideRevenue / 25))) * 100) / 100,
      });
    }
  }

  return data;
};

// Find peak revenue times
const findPeakRevenueTimes = (data) => {
  return data
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 3)
    .map(item => ({
      time: item.time,
      revenue: item.totalRevenue
    }));
};

// Calculate revenue insights
const calculateRevenueInsights = (data) => {
  const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalRides = data.reduce((sum, item) => sum + item.rides, 0);
  const avgRevenuePerPeriod = totalRevenue / data.length;
  const avgRevenuePerRide = totalRides > 0 ? totalRevenue / totalRides : 0;
  
  return {
    totalRevenue,
    totalRides,
    avgRevenuePerPeriod: Math.round(avgRevenuePerPeriod),
    avgRevenuePerRide: Math.round(avgRevenuePerRide * 100) / 100
  };
};

const RevenueTrends = () => {
  const [timeRange, setTimeRange] = useState("today");
  const [chartType, setChartType] = useState("area");
  const [revenueType, setRevenueType] = useState("total");

  // Process data for charts
  const processedData = generateRevenueData(timeRange);
  const peakTimes = findPeakRevenueTimes(processedData);
  const insights = calculateRevenueInsights(processedData);

  // Revenue breakdown for pie chart
  const revenueBreakdown = [
    { name: "Ride Revenue", value: insights.totalRevenue * 0.85, color: "#10b981" },
    { name: "Subscriptions", value: insights.totalRevenue * 0.10, color: "#3b82f6" },
    { name: "Penalties", value: insights.totalRevenue * 0.05, color: "#ef4444" },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-green-600">
            Total Revenue: ${data.totalRevenue}
          </p>
          <p className="text-sm text-blue-600">
            Rides: {data.rides}
          </p>
          <p className="text-sm text-purple-600">
            Avg/Ride: ${data.avgPerRide}
          </p>
          {revenueType === "total" && (
            <>
              <p className="text-sm text-green-500">Ride Revenue: ${data.rideRevenue}</p>
              <p className="text-sm text-blue-500">Subscriptions: ${data.subscriptionRevenue}</p>
              <p className="text-sm text-red-500">Penalties: ${data.penaltyRevenue}</p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const getDataKey = () => {
    switch (revenueType) {
      case "ride": return "rideRevenue";
      case "subscription": return "subscriptionRevenue";
      case "penalty": return "penaltyRevenue";
      case "avgPerRide": return "avgPerRide";
      default: return "totalRevenue";
    }
  };

  const getChartColor = () => {
    switch (revenueType) {
      case "ride": return "#10b981";
      case "subscription": return "#3b82f6";
      case "penalty": return "#ef4444";
      case "avgPerRide": return "#8b5cf6";
      default: return "#059669";
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
            Revenue Analytics
          </h3>
          <div className="relative ml-2 group">
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              Track revenue streams, patterns, and performance metrics across different time periods.
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
          </select>
          
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="area">Area Chart</option>
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
          
          <select
            value={revenueType}
            onChange={(e) => setRevenueType(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="total">Total Revenue</option>
            <option value="ride">Ride Revenue</option>
            <option value="subscription">Subscription Revenue</option>
            <option value="penalty">Penalty Revenue</option>
            <option value="avgPerRide">Average per Ride</option>
          </select>
        </div>
      </div>

      {/* Main Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
              {revenueType === "total" && (
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
              )}
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey={getDataKey()}
                stroke={getChartColor()}
                strokeWidth={3}
                name={revenueType === "total" ? "Total Revenue ($)" : `${revenueType.charAt(0).toUpperCase() + revenueType.slice(1)} Revenue ($)`}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              {revenueType === "total" && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rides"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Rides"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              )}
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey={getDataKey()}
                fill={getChartColor()}
                name={revenueType === "total" ? "Total Revenue ($)" : `${revenueType.charAt(0).toUpperCase() + revenueType.slice(1)} Revenue ($)`}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <AreaChart data={processedData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getChartColor()} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={getChartColor()} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
              {revenueType === "total" && (
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
              )}
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey={getDataKey()}
                stroke={getChartColor()}
                strokeWidth={3}
                fill="url(#revenueGradient)"
                name={revenueType === "total" ? "Total Revenue ($)" : `${revenueType.charAt(0).toUpperCase() + revenueType.slice(1)} Revenue ($)`}
              />
              {revenueType === "total" && (
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="rides"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="rgba(59, 130, 246, 0.1)"
                  name="Rides"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Revenue Breakdown - Only show for total revenue */}
      {revenueType === "total" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-gray-600" />
              Revenue Breakdown
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    fontSize={10}
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Math.round(value)}`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Ride Revenue</span>
                <span className="text-sm font-bold text-green-600">
                  ${Math.round(insights.totalRevenue * 0.85).toLocaleString()} (85%)
                </span>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Subscription Revenue</span>
                <span className="text-sm font-bold text-blue-600">
                  ${Math.round(insights.totalRevenue * 0.10).toLocaleString()} (10%)
                </span>
              </div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Penalty Revenue</span>
                <span className="text-sm font-bold text-red-600">
                  ${Math.round(insights.totalRevenue * 0.05).toLocaleString()} (5%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Peak Revenue Times */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-green-600" />
            Peak Revenue Times
          </h4>
          <div className="space-y-2">
            {peakTimes.map((peak, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{peak.time}</span>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  ${peak.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2 text-blue-600" />
            Revenue Summary
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Revenue:</span>
              <span className="text-sm font-medium text-green-600">${insights.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Rides:</span>
              <span className="text-sm font-medium">{insights.totalRides.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg per Period:</span>
              <span className="text-sm font-medium">${insights.avgRevenuePerPeriod}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg per Ride:</span>
              <span className="text-sm font-medium">${insights.avgRevenuePerRide}</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
            Performance Metrics
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Growth Rate:</span>
              <span className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18.5%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Conversion Rate:</span>
              <span className="text-sm font-medium">87%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Revenue/Hour:</span>
              <span className="text-sm font-medium text-purple-600">${Math.round(insights.totalRevenue / 24)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Efficiency:</span>
              <span className="text-sm font-medium text-blue-600">94%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueTrends;
