// src/components/promotions/PromotionAnalytics.jsx
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Tag,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";

const PromotionAnalytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock analytics data
  const revenueData = [
    { name: "Week 1", revenue: 2400, redemptions: 145, conversion: 68.5 },
    { name: "Week 2", revenue: 1398, redemptions: 89, conversion: 45.2 },
    { name: "Week 3", revenue: 9800, redemptions: 567, conversion: 78.9 },
    { name: "Week 4", revenue: 3908, redemptions: 234, conversion: 56.7 },
  ];

  const promotionTypeData = [
    { name: "Percentage", value: 65, color: "#8B5CF6" },
    { name: "Fixed Amount", value: 35, color: "#06B6D4" },
  ];

  const topPromotions = [
    { name: "WELCOME20", revenue: 12450, redemptions: 567, conversion: 78.9 },
    { name: "WEEKEND15", revenue: 8930, redemptions: 423, conversion: 65.4 },
    { name: "STUDENT10", revenue: 5670, redemptions: 234, conversion: 45.2 },
    { name: "SUMMER25", revenue: 3450, redemptions: 156, conversion: 34.7 },
  ];

  const kpiData = [
    {
      title: "Total Revenue",
      value: "$45,230",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Redemptions",
      value: "2,847",
      change: "+8.3%",
      trend: "up",
      icon: Tag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Avg Conversion Rate",
      value: "62.4%",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Active Promotions",
      value: "8",
      change: "+3",
      trend: "up",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  // Generate CSV data for promotions
  const generatePromotionCSV = () => {
    const headers = "Week,Revenue,Redemptions,Conversion Rate";
    const data = revenueData.map(item =>
      `${item.name},$${item.revenue},${item.redemptions},${item.conversion}%`
    ).join("\n");

    // Add summary data
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalRedemptions = revenueData.reduce((sum, item) => sum + item.redemptions, 0);
    const avgConversion = (revenueData.reduce((sum, item) => sum + item.conversion, 0) / revenueData.length).toFixed(1);

    const summaryHeaders = "\n\nSummary,Value";
    const summaryData = [
      `Total Revenue,$${totalRevenue}`,
      `Total Redemptions,${totalRedemptions}`,
      `Average Conversion Rate,${avgConversion}%`,
      `Revenue per Redemption,$${(totalRevenue / totalRedemptions).toFixed(2)}`
    ].join("\n");

    // Add top promotions
    const topPromotionsHeaders = "\n\nTop Performing Promotions";
    const topPromotionsData = "\nPromotion,Revenue,Redemptions,Conversion Rate\n" +
      topPromotions.map(promo =>
        `"${promo.name}",$${promo.revenue},${promo.redemptions},${promo.conversion}%`
      ).join("\n");

    return headers + "\n" + data + summaryHeaders + "\n" + summaryData + topPromotionsHeaders + topPromotionsData;
  };

  // Download CSV file
  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle export functionality
  const handleExportData = async () => {
    setIsExporting(true);
    console.log(`📊 Exporting promotion analytics for ${timeRange}...`);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create CSV data
      const csvData = generatePromotionCSV();
      const timestamp = new Date().toISOString().split('T')[0];
      downloadCSV(csvData, `promotion-analytics-${timeRange}-${timestamp}.csv`);

      console.log("✅ Promotion analytics export completed!");
    } catch (error) {
      console.error("❌ Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle refresh functionality
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    console.log("🔄 Refreshing promotion analytics data...");

    try {
      // Simulate refresh process
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("✅ Promotion analytics data refreshed successfully!");
    } catch (error) {
      console.error("❌ Refresh failed:", error);
      alert("Refresh failed. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Promotion Analytics</h2>
          <p className="text-gray-600 mt-1">Track performance and ROI of your promotional campaigns</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="flex items-center px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            title="Refresh analytics data"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
            title="Export analytics data to CSV"
          >
            <Download className={`h-4 w-4 mr-1 ${isExporting ? 'animate-bounce' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                <div className="flex items-center mt-2">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {kpi.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="revenue">Revenue</option>
              <option value="redemptions">Redemptions</option>
              <option value="conversion">Conversion Rate</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: "#8B5CF6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Promotion Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Promotion Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={promotionTypeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {promotionTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Performing Promotions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Promotions</h3>
          <p className="text-gray-600 mt-1">Ranked by revenue generated</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topPromotions.map((promotion, index) => (
              <div key={promotion.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{promotion.name}</h4>
                    <p className="text-sm text-gray-600">{promotion.redemptions} redemptions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${promotion.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{promotion.conversion}% conversion</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PromotionAnalytics;
