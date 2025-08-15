// src/components/notifications/NotificationStats.jsx
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
  AreaChart,
  Area,
} from "recharts";
import {
  Target,
  TrendingUp,
  TrendingDown,
  Users,
  Send,
  Eye,
  MousePointer,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";

const NotificationStats = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("delivery");
  const [activeTab, setActiveTab] = useState("delivery");
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Updated analytics data to match the image
  const deliveryData = [
    { name: "2024-01-01", sent: 1200, delivered: 1140, opened: 684, clicked: 137 },
    { name: "2024-01-02", sent: 1350, delivered: 1283, opened: 769, clicked: 154 },
    { name: "2024-01-03", sent: 980, delivered: 931, opened: 558, clicked: 112 },
    { name: "2024-01-04", sent: 1500, delivered: 1425, opened: 855, clicked: 171 },
    { name: "2024-01-05", sent: 1612, delivered: 1532, opened: 919, clicked: 184 },
    { name: "2024-01-06", sent: 1450, delivered: 1378, opened: 827, clicked: 165 },
    { name: "2024-01-07", sent: 1800, delivered: 1710, opened: 1026, clicked: 205 },
  ];

  const channelData = [
    { name: "Push", value: 8245, sent: 8500, deliveryRate: 97, color: "#8B5CF6" },
    { name: "Email", value: 3990, sent: 4200, deliveryRate: 95, color: "#06B6D4" },
    { name: "SMS", value: 1710, sent: 1800, deliveryRate: 95, color: "#10B981" },
    { name: "In-App", value: 622, sent: 734, deliveryRate: 84.7, color: "#F59E0B" },
  ];

  const kpiData = [
    {
      title: "Total Sent",
      value: "15,234",
      change: "+12.5%",
      trend: "up",
      icon: Send,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Delivery Rate",
      value: "95.6%",
      change: "+2.1%",
      trend: "up",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Open Rate",
      value: "61.4%",
      change: "-1.3%",
      trend: "down",
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Click Rate",
      value: "14%",
      change: "+3.7%",
      trend: "up",
      icon: MousePointer,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const topPerformers = [
    { title: "Weekend Special Offer", openRate: 66.8, clickRate: 14.7, sent: 2345 },
    { title: "System Maintenance Alert", openRate: 81.3, clickRate: 2.6, sent: 8900 },
    { title: "New Feature Announcement", openRate: 63.9, clickRate: 12.6, sent: 1234 },
    { title: "Battery Low Warning", openRate: 92.2, clickRate: 15.7, sent: 567 },
  ];

  // Additional data for different metric types
  const engagementData = [
    { name: "2024-01-01", opened: 684, clicked: 137, bounced: 456 },
    { name: "2024-01-02", opened: 769, clicked: 154, bounced: 514 },
    { name: "2024-01-03", opened: 558, clicked: 112, bounced: 373 },
    { name: "2024-01-04", opened: 855, clicked: 171, bounced: 570 },
    { name: "2024-01-05", opened: 919, clicked: 184, bounced: 613 },
    { name: "2024-01-06", opened: 827, clicked: 165, bounced: 551 },
    { name: "2024-01-07", opened: 1026, clicked: 205, bounced: 684 },
  ];

  const channelPerformanceData = [
    { name: "Push", delivered: 8245, failed: 255, openRate: 72 },
    { name: "Email", delivered: 3990, failed: 210, openRate: 65 },
    { name: "SMS", delivered: 1710, failed: 90, openRate: 85 },
    { name: "In-App", delivered: 622, failed: 112, openRate: 58 },
  ];

  const notificationTypesData = [
    { name: "Promotional", count: 4567, engagement: 68 },
    { name: "Transactional", count: 3245, engagement: 89 },
    { name: "Alert", count: 2890, engagement: 92 },
    { name: "Reminder", count: 1234, engagement: 45 },
    { name: "Welcome", count: 890, engagement: 78 },
  ];

  // Tab configuration
  const tabs = [
    { id: "delivery", label: "Delivery Metrics", icon: Target },
    { id: "engagement", label: "Engagement", icon: Eye },
    { id: "channel", label: "Channel Performance", icon: Send },
    { id: "types", label: "Notification Types", icon: Users },
  ];

  // Generate CSV data for notifications
  const generateNotificationCSV = () => {
    const headers = "Date,Sent,Delivered,Opened,Clicked,Delivery Rate,Open Rate,Click Rate";
    const data = deliveryData.map(item => {
      const deliveryRate = ((item.delivered / item.sent) * 100).toFixed(1);
      const openRate = ((item.opened / item.delivered) * 100).toFixed(1);
      const clickRate = ((item.clicked / item.opened) * 100).toFixed(1);
      return `${item.name},${item.sent},${item.delivered},${item.opened},${item.clicked},${deliveryRate}%,${openRate}%,${clickRate}%`;
    }).join("\n");

    // Add summary data
    const totalSent = deliveryData.reduce((sum, item) => sum + item.sent, 0);
    const totalDelivered = deliveryData.reduce((sum, item) => sum + item.delivered, 0);
    const totalOpened = deliveryData.reduce((sum, item) => sum + item.opened, 0);
    const totalClicked = deliveryData.reduce((sum, item) => sum + item.clicked, 0);

    const summaryHeaders = "\n\nSummary,Value";
    const summaryData = [
      `Total Sent,${totalSent}`,
      `Total Delivered,${totalDelivered}`,
      `Total Opened,${totalOpened}`,
      `Total Clicked,${totalClicked}`,
      `Overall Delivery Rate,${((totalDelivered / totalSent) * 100).toFixed(1)}%`,
      `Overall Open Rate,${((totalOpened / totalDelivered) * 100).toFixed(1)}%`,
      `Overall Click Rate,${((totalClicked / totalOpened) * 100).toFixed(1)}%`
    ].join("\n");

    // Add top performers
    const topPerformersHeaders = "\n\nTop Performing Notifications";
    const topPerformersData = "\nNotification,Open Rate,Click Rate,Sent\n" +
      topPerformers.map(notif =>
        `"${notif.title}",${notif.openRate}%,${notif.clickRate}%,${notif.sent}`
      ).join("\n");

    return headers + "\n" + data + summaryHeaders + "\n" + summaryData + topPerformersHeaders + topPerformersData;
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
    console.log(`📊 Exporting notification analytics for ${timeRange}...`);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create CSV data
      const csvData = generateNotificationCSV();
      const timestamp = new Date().toISOString().split('T')[0];
      downloadCSV(csvData, `notification-analytics-${timeRange}-${timestamp}.csv`);

      console.log("✅ Notification analytics export completed!");
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
    console.log("🔄 Refreshing notification analytics data...");

    try {
      // Simulate refresh process
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("✅ Notification analytics data refreshed successfully!");
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
          <h2 className="text-xl font-semibold text-gray-900">Notification Analytics</h2>
          <p className="text-gray-600 mt-1">Track performance and engagement metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed transition-colors"
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

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "delivery" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Delivery Metrics Chart */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Delivery Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={deliveryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [value.toLocaleString(), name]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="delivered"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      name="Delivered"
                    />
                    <Area
                      type="monotone"
                      dataKey="sent"
                      stackId="2"
                      stroke="#EF4444"
                      fill="#EF4444"
                      name="Failed"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Delivery Status */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Delivery Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-xl font-bold text-green-600">14,567</p>
                    <p className="text-sm text-gray-600">Delivered</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-red-100 rounded-lg flex items-center justify-center">
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-xl font-bold text-red-600">667</p>
                    <p className="text-sm text-gray-600">Failed</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "engagement" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Engagement Chart */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Engagement Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="opened" stroke="#06B6D4" strokeWidth={2} name="Opened" />
                    <Line type="monotone" dataKey="clicked" stroke="#8B5CF6" strokeWidth={2} name="Clicked" />
                    <Line type="monotone" dataKey="bounced" stroke="#EF4444" strokeWidth={2} name="Bounced" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Engagement Metrics */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Engagement Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-xl font-bold text-blue-600">8,945</p>
                    <p className="text-sm text-gray-600">Opened</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MousePointer className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-xl font-bold text-purple-600">2,134</p>
                    <p className="text-sm text-gray-600">Clicked</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "channel" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Channel Performance Chart */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Channel Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={channelPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="delivered" fill="#8B5CF6" name="Delivered" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Channel Details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Channel Details</h3>
                <div className="space-y-4">
                  {channelData.map((channel, index) => (
                    <div key={channel.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: channel.color }}
                        ></div>
                        <span className="font-medium text-gray-900">{channel.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{channel.value.toLocaleString()} / {channel.sent.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{channel.deliveryRate}% delivery rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "types" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notification Types Chart */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Types</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={notificationTypesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Type Performance */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Type Performance</h3>
                <div className="space-y-4">
                  {notificationTypesData.map((type, index) => (
                    <div key={type.name} className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{type.name}</span>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{type.count.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{type.engagement}% engagement</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Performing Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Notifications</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topPerformers.map((notification, index) => (
              <div key={notification.title} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-600 rounded text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.sent.toLocaleString()} sent</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{notification.openRate}% open</p>
                  <p className="text-sm text-gray-600">{notification.clickRate}% click</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationStats;
