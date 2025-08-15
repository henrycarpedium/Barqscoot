// src/components/reports/FleetAnalytics.jsx
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
import { Bike, Battery, MapPin, Clock, Download, Activity, AlertTriangle } from "lucide-react";

const FleetAnalytics = ({ dateRange }) => {
  const [isExporting, setIsExporting] = useState(false);

  // Mock fleet data
  const fleetUtilizationData = [
    { date: "Jan 1", utilized: 78, available: 22, maintenance: 5 },
    { date: "Jan 2", utilized: 82, available: 18, maintenance: 3 },
    { date: "Jan 3", utilized: 75, available: 25, maintenance: 7 },
    { date: "Jan 4", utilized: 88, available: 12, maintenance: 4 },
    { date: "Jan 5", utilized: 85, available: 15, maintenance: 6 },
    { date: "Jan 6", utilized: 90, available: 10, maintenance: 2 },
    { date: "Jan 7", utilized: 79, available: 21, maintenance: 8 },
  ];

  const batteryStatusData = [
    { status: "High (80-100%)", count: 45, color: "#10b981" },
    { status: "Medium (50-79%)", count: 32, color: "#f59e0b" },
    { status: "Low (20-49%)", count: 18, color: "#ef4444" },
    { status: "Critical (<20%)", count: 5, color: "#dc2626" },
  ];

  const maintenanceData = [
    { type: "Routine Check", count: 12, percentage: 40 },
    { type: "Battery Replacement", count: 8, percentage: 27 },
    { type: "Tire Repair", count: 6, percentage: 20 },
    { type: "Brake Service", count: 4, percentage: 13 },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate CSV
      const headers = "Date,Utilized %,Available %,Maintenance %";
      const csvData = fleetUtilizationData.map(row =>
        `${row.date},${row.utilized}%,${row.available}%,${row.maintenance}%`
      ).join("\n");

      const csvContent = headers + "\n" + csvData;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fleet-analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      console.log("✅ Fleet analytics exported successfully!");
    } catch (error) {
      console.error("❌ Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const totalScooters = 100;
  const activeScooters = 85;
  const maintenanceScooters = 8;
  const avgUtilization = fleetUtilizationData.reduce((sum, item) => sum + item.utilized, 0) / fleetUtilizationData.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Fleet Analytics</h3>
          <p className="text-sm text-gray-600">Fleet performance and utilization metrics for {dateRange}</p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
          {isExporting ? 'Exporting...' : 'Export Fleet Data'}
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
              <p className="text-sm text-gray-600">Total Fleet</p>
              <p className="text-2xl font-bold text-blue-600">{totalScooters}</p>
            </div>
            <Bike className="h-8 w-8 text-blue-600" />
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
              <p className="text-sm text-gray-600">Active Scooters</p>
              <p className="text-2xl font-bold text-green-600">{activeScooters}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
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
              <p className="text-sm text-gray-600">In Maintenance</p>
              <p className="text-2xl font-bold text-orange-600">{maintenanceScooters}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
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
              <p className="text-sm text-gray-600">Avg Utilization</p>
              <p className="text-2xl font-bold text-purple-600">{avgUtilization.toFixed(1)}%</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fleet Utilization Trend */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Fleet Utilization Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fleetUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                <Line
                  type="monotone"
                  dataKey="utilized"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  name="Utilized"
                />
                <Line
                  type="monotone"
                  dataKey="available"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                  name="Available"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Battery Status Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Battery Status Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={batteryStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {batteryStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Scooters']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {batteryStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.status}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetAnalytics;
