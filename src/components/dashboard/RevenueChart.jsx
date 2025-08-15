// src/components/dashboard/RevenueChart.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { DollarSign, TrendingUp } from "lucide-react";

const RevenueChart = ({ timeRange }) => {
  // Mock data - in real implementation, this would come from API based on timeRange
  const generateMockData = (range) => {
    const now = new Date();
    const data = [];
    
    let intervals, format, step;
    
    switch (range) {
      case "1h":
        intervals = 12;
        format = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        step = 5 * 60 * 1000; // 5 minutes
        break;
      case "24h":
        intervals = 24;
        format = (date) => date.toLocaleTimeString([], { hour: '2-digit' });
        step = 60 * 60 * 1000; // 1 hour
        break;
      case "7d":
        intervals = 7;
        format = (date) => date.toLocaleDateString([], { weekday: 'short' });
        step = 24 * 60 * 60 * 1000; // 1 day
        break;
      case "30d":
        intervals = 30;
        format = (date) => date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        step = 24 * 60 * 60 * 1000; // 1 day
        break;
      default:
        intervals = 24;
        format = (date) => date.toLocaleTimeString([], { hour: '2-digit' });
        step = 60 * 60 * 1000;
    }

    for (let i = intervals - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * step));
      const baseRevenue = 100 + Math.random() * 200;
      const rides = Math.floor(5 + Math.random() * 15);
      
      data.push({
        time: format(date),
        revenue: Math.round(baseRevenue * 100) / 100,
        rides: rides,
        avgRideValue: Math.round((baseRevenue / rides) * 100) / 100,
      });
    }
    
    return data;
  };

  const data = generateMockData(timeRange);
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalRides = data.reduce((sum, item) => sum + item.rides, 0);
  const avgRideValue = totalRevenue / totalRides;

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
            Avg/Ride: ${payload[0].payload.avgRideValue.toFixed(2)}
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
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
            Revenue Trends
          </h3>
          <p className="text-sm text-gray-600">
            Revenue performance over {timeRange}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">
            ${totalRevenue.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            {totalRides} rides • ${avgRideValue.toFixed(2)} avg
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
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

      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-600">Peak Hour</p>
          <p className="text-lg font-semibold text-gray-900">
            {data.reduce((max, item) => item.revenue > max.revenue ? item : max, data[0])?.time || "N/A"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Growth Rate</p>
          <p className="text-lg font-semibold text-green-600 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12.5%
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Efficiency</p>
          <p className="text-lg font-semibold text-blue-600">
            ${(totalRevenue / data.length).toFixed(0)}/period
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RevenueChart;
