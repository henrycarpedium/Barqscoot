// src/components/analytics/AnalyticsInsights.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Eye,
  TrendingDown,
  Lightbulb,
  Activity,
  Users,
} from "lucide-react";
import UsageAnalytics from "./UsageAnalytics";
import RevenueAnalytics from "./RevenueAnalytics";
import UserBehaviorInsights from "./UserBehaviorInsights";

const AnalyticsInsights = ({ dateRange }) => {
  const [timeFilter, setTimeFilter] = useState("Today");
  const [activeSubTab, setActiveSubTab] = useState("usage");

  const insights = [
    {
      id: 1,
      title: "Jack Hour Performance",
      description: "Average ride 7.7% higher usage than average",
      icon: TrendingUp,
      borderColor: "border-l-green-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      percentage: "94%",
      trend: "up",
    },
    {
      id: 2,
      title: "Battery Alert",
      description: "12 scooters in Riyadh need charging within 2 hours",
      icon: TrendingDown,
      borderColor: "border-l-yellow-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      percentage: "18%",
      trend: "down",
    },
    {
      id: 3,
      title: "Revenue Target",
      description: "Daily revenue is 85% of target with 6 hours remaining",
      icon: TrendingUp,
      borderColor: "border-l-blue-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      percentage: "127",
      trend: "up",
    },
    {
      id: 4,
      title: "Revenue Right",
      description: "Daily revenue is 85% of target with 6 hours remaining",
      icon: TrendingUp,
      borderColor: "border-l-red-500",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      percentage: "89%",
      trend: "up",
    },
  ];

  const timeFilters = [
    { value: "Today", label: "Today" },
    { value: "7 days", label: "7 days" },
    { value: "30 days", label: "30 days" },
  ];

  const subTabs = [
    { id: "usage", label: "Usage Analytics", icon: Activity },
    { id: "revenue", label: "Revenue Analytics", icon: TrendingUp },
    { id: "user", label: "User Behavior", icon: Users },
  ];

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "usage":
        return <UsageAnalytics timeFilter={timeFilter} />;
      case "revenue":
        return <RevenueAnalytics timeFilter={timeFilter} />;
      case "user":
        return <UserBehaviorInsights timeFilter={timeFilter} />;
      default:
        return <UsageAnalytics timeFilter={timeFilter} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Analytics & Insights
          </h2>
          <p className="text-gray-600 mt-1">
            Deep dive into usage patterns, revenue trends, and user behavior
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {timeFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </button>
          <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Key Insights Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Key Insights
            </h3>
            <span className="text-sm text-blue-600 font-medium">4 insights</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">AI-powered insights for this week</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {insights.map((insight) => {
              const IconComponent = insight.icon;
              return (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border-l-4 ${insight.borderColor} ${insight.bgColor} hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                      <IconComponent className={`h-5 w-5 ${insight.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-lg font-bold ${insight.iconColor}`}>
                          {insight.percentage}
                        </span>
                        <span className="text-xs text-gray-500">
                          {insight.trend === "up" ? "↗" : "↘"} {insight.trend === "up" ? "Increase" : "Decrease"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {subTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeSubTab === tab.id
                      ? "border-blue-500 text-blue-600"
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

        {/* Sub-tab Content */}
        <div className="p-6">
          {renderSubTabContent()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Schedule Report</h3>
              <p className="text-sm text-gray-600">Automate analytics delivery</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Data Export</h3>
              <p className="text-sm text-gray-600">Download raw analytics data</p>
            </div>
            <Download className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Custom Dashboard</h3>
              <p className="text-sm text-gray-600">Create personalized views</p>
            </div>
            <Eye className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsInsights;
