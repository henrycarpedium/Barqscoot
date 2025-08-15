// src/components/dashboard/FleetTrends.jsx
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
  Bike,
  Battery,
  TrendingUp,
  Info,
  Clock,
  MapPin,
  Activity,
} from "lucide-react";

// Process fleet data by time periods
const processFleetData = (timeRange) => {
  const now = new Date();
  const data = [];

  // Different grouping based on time range
  if (timeRange === "today") {
    // Group by hour for today
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0") + ":00";
      const baseUtilization = 30 + Math.sin((i - 6) * Math.PI / 12) * 25; // Peak around noon
      data.push({
        time: hour,
        utilization: Math.max(5, Math.round(baseUtilization + Math.random() * 10)),
        available: Math.floor(Math.random() * 20) + 40,
        inUse: Math.floor(Math.random() * 15) + 10,
        charging: Math.floor(Math.random() * 8) + 5,
      });
    }
  } else if (timeRange === "week") {
    // Group by day for last 7 days
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseUtilization = isWeekend ? 45 : 65;
      data.push({
        time: dayName,
        utilization: Math.round(baseUtilization + Math.random() * 15),
        available: Math.floor(Math.random() * 25) + 35,
        inUse: Math.floor(Math.random() * 20) + 15,
        charging: Math.floor(Math.random() * 10) + 8,
      });
    }
  } else {
    // Group by day for this month
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= Math.min(daysInMonth, 30); i++) {
      data.push({
        time: i.toString(),
        utilization: Math.round(50 + Math.random() * 30),
        available: Math.floor(Math.random() * 30) + 30,
        inUse: Math.floor(Math.random() * 25) + 10,
        charging: Math.floor(Math.random() * 12) + 6,
      });
    }
  }

  return data;
};

// Find peak utilization times
const findPeakTimes = (data) => {
  return data
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, 3)
    .map(item => ({
      time: item.time,
      utilization: item.utilization
    }));
};

// Calculate fleet insights
const calculateFleetInsights = (data) => {
  const avgUtilization = data.reduce((sum, item) => sum + item.utilization, 0) / data.length;
  const totalAvailable = data.reduce((sum, item) => sum + item.available, 0);
  const totalInUse = data.reduce((sum, item) => sum + item.inUse, 0);
  const totalCharging = data.reduce((sum, item) => sum + item.charging, 0);
  
  return {
    avgUtilization: Math.round(avgUtilization),
    totalFleet: Math.round((totalAvailable + totalInUse + totalCharging) / data.length),
    efficiency: Math.round((totalInUse / (totalAvailable + totalInUse)) * 100),
    chargingRate: Math.round((totalCharging / (totalAvailable + totalInUse + totalCharging)) * 100)
  };
};

const FleetTrends = () => {
  const [timeRange, setTimeRange] = useState("today");
  const [chartType, setChartType] = useState("line");

  // Process data for charts
  const processedData = processFleetData(timeRange);
  const peakTimes = findPeakTimes(processedData);
  const insights = calculateFleetInsights(processedData);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            Utilization: {payload.find(p => p.dataKey === 'utilization')?.value || 0}%
          </p>
          <p className="text-sm text-green-600">
            Available: {payload.find(p => p.dataKey === 'available')?.value || 0}
          </p>
          <p className="text-sm text-orange-600">
            In Use: {payload.find(p => p.dataKey === 'inUse')?.value || 0}
          </p>
          <p className="text-sm text-purple-600">
            Charging: {payload.find(p => p.dataKey === 'charging')?.value || 0}
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
            <Bike className="h-5 w-5 mr-2 text-blue-600" />
            Fleet Utilization Trends
          </h3>
          <div className="relative ml-2 group">
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              Monitor scooter utilization, availability, and charging patterns.
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
          </select>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="available"
                stroke="#10b981"
                strokeWidth={2}
                name="Available"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="inUse"
                stroke="#f59e0b"
                strokeWidth={2}
                name="In Use"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="utilization"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Utilization %"
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
                dataKey="available"
                fill="#10b981"
                name="Available"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="inUse"
                fill="#f59e0b"
                name="In Use"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="charging"
                fill="#8b5cf6"
                name="Charging"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <AreaChart data={processedData}>
              <defs>
                <linearGradient id="availableGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="inUseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="available"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#availableGradient)"
                name="Available"
              />
              <Area
                type="monotone"
                dataKey="inUse"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#inUseGradient)"
                name="In Use"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Peak Utilization Times */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-600" />
            Peak Utilization
          </h4>
          <div className="space-y-2">
            {peakTimes.map((peak, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{peak.time}</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {peak.utilization}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Summary */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <Activity className="h-4 w-4 mr-2 text-green-600" />
            Fleet Summary
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg Utilization:</span>
              <span className="text-sm font-medium text-blue-600">{insights.avgUtilization}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Fleet:</span>
              <span className="text-sm font-medium">{insights.totalFleet}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Efficiency:</span>
              <span className="text-sm font-medium text-green-600">{insights.efficiency}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Charging Rate:</span>
              <span className="text-sm font-medium text-purple-600">{insights.chargingRate}%</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <Battery className="h-4 w-4 mr-2 text-orange-600" />
            Performance Metrics
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime:</span>
              <span className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                98.5%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg Battery:</span>
              <span className="text-sm font-medium">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Maintenance:</span>
              <span className="text-sm font-medium text-orange-600">2.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Response Time:</span>
              <span className="text-sm font-medium">4.2 min</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FleetTrends;
