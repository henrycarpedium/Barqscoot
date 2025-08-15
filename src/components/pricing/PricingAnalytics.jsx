// src/components/pricing/PricingAnalytics.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Calendar,
  Download,
  Filter,
  BarChart3,
  AlertTriangle,
} from "lucide-react";

const PricingAnalytics = ({ analytics, zones, isLoading }) => {
  const [timeRange, setTimeRange] = useState("7d");
  const [isExporting, setIsExporting] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  // Export functionality
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate comprehensive pricing analytics CSV
      const timestamp = new Date().toISOString().split('T')[0];

      // Summary data
      const summaryHeaders = "Pricing Analytics Summary,Value";
      const summaryData = [
        "Total Revenue,$" + (analytics?.overview?.totalRevenue || 24567),
        "Active Zones," + (zones?.filter(z => z.surgeActive)?.length || 8),
        "Average Multiplier," + (analytics?.overview?.avgMultiplier || 1.8) + "x",
        "Customer Satisfaction," + (analytics?.overview?.customerSatisfaction || 4.2) + "/5",
        "Revenue Growth," + (analytics?.overview?.revenueGrowth || 15.2) + "%",
        "Time Range," + timeRange,
        "Export Date," + timestamp
      ].join("\n");

      // Zone data
      const zoneHeaders = "\n\nZone Analytics,Zone Name,Current Multiplier,Revenue Today,Status";
      const zoneData = zones?.map(zone =>
        `Zone Data,${zone.name},${zone.currentMultiplier}x,$${zone.revenueToday},${zone.surgeActive ? 'Active' : 'Inactive'}`
      ).join("\n") || "Zone Data,Sample Zone,1.5x,$1200,Active";

      const csvContent = summaryHeaders + "\n" + summaryData + zoneHeaders + "\n" + zoneData;

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `pricing-analytics-${timeRange}-${timestamp}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("✅ Pricing analytics exported successfully!");
    } catch (error) {
      console.error("❌ Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
        <p>Unable to load analytics data</p>
      </div>
    );
  }

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Calculate key insights
  const totalSurgeRevenue = analytics.overview.surgeRevenue;
  const totalRevenue = analytics.overview.totalRevenue;
  const surgePercentage = ((totalSurgeRevenue / totalRevenue) * 100).toFixed(1);
  
  const highestRevenueHour = analytics.revenueByHour?.reduce((max, hour) => 
    hour.revenue > max.revenue ? hour : max, analytics.revenueByHour[0]
  );

  const avgMultiplierToday = analytics.revenueByHour?.reduce((sum, hour) => 
    sum + hour.multiplier, 0) / analytics.revenueByHour?.length || 0;

  return (
    <div className="space-y-6">
      {/* Analytics Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Pricing Analytics</h2>
          <p className="text-sm text-gray-600">
            Revenue optimization and performance insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors">
            <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export Analytics'}
          </button>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Surge Revenue %</p>
              <p className="text-2xl font-bold text-green-600">{surgePercentage}%</p>
              <p className="text-xs text-gray-500 mt-1">
                ${totalSurgeRevenue?.toLocaleString()} of ${totalRevenue?.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Peak Revenue Hour</p>
              <p className="text-2xl font-bold text-blue-600">{highestRevenueHour?.hour}</p>
              <p className="text-xs text-gray-500 mt-1">
                ${highestRevenueHour?.revenue} earned
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
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
              <p className="text-gray-500 text-sm">Avg Multiplier</p>
              <p className="text-2xl font-bold text-orange-600">{avgMultiplierToday.toFixed(1)}x</p>
              <p className="text-xs text-gray-500 mt-1">Today's average</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
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
              <p className="text-gray-500 text-sm">Customer Satisfaction</p>
              <p className="text-2xl font-bold text-purple-600">
                {analytics.overview.customerSatisfaction}/5
              </p>
              <p className="text-xs text-gray-500 mt-1">With dynamic pricing</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Revenue Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-lg border border-gray-200"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue & Pricing Trends</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedMetric("revenue")}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedMetric === "revenue" 
                  ? "bg-green-100 text-green-700" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setSelectedMetric("multiplier")}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedMetric === "multiplier" 
                  ? "bg-blue-100 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Multiplier
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analytics.revenueByHour}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            {selectedMetric === "revenue" ? (
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                name="Revenue ($)"
              />
            ) : (
              <Area 
                type="monotone" 
                dataKey="multiplier" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3}
                name="Multiplier"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Weekly Performance & Demand Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.weeklyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Demand Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demand vs Supply Ratio</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.demandHeatmap} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="zone" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="ratio" fill="#EF4444" name="Demand/Supply Ratio" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Zone Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Zone Performance Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue Today
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Multiplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demand Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Rides
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Wait Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {zones?.map((zone) => (
                <tr key={zone.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{zone.name}</div>
                    <div className="text-sm text-gray-500">{zone.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      ${zone.revenueToday?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      zone.currentMultiplier >= 2.0 ? 'bg-red-100 text-red-800' :
                      zone.currentMultiplier >= 1.5 ? 'bg-orange-100 text-orange-800' :
                      zone.currentMultiplier >= 1.2 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {zone.currentMultiplier}x
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      zone.demandLevel === 'high' ? 'bg-red-100 text-red-800' :
                      zone.demandLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {zone.demandLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {zone.activeRides}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {zone.avgWaitTime}m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {zone.revenueToday > 1000 ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${
                        zone.revenueToday > 1000 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {zone.revenueToday > 1000 ? 'Excellent' : 'Below Target'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Insights and Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white p-6 rounded-lg border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Revenue Optimization</h4>
                <p className="text-sm text-gray-600">
                  Consider increasing surge multiplier during 6-8 PM in Downtown area. 
                  Potential revenue increase: +15%
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Customer Experience</h4>
                <p className="text-sm text-gray-600">
                  Reduce surge pricing in University Campus during lunch hours to 
                  improve satisfaction scores.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Timing Optimization</h4>
                <p className="text-sm text-gray-600">
                  Weekend surge pricing could start 1 hour earlier based on 
                  demand patterns analysis.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Supply Management</h4>
                <p className="text-sm text-gray-600">
                  Deploy 5 more scooters to Airport Vicinity during peak hours 
                  to reduce wait times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PricingAnalytics;
