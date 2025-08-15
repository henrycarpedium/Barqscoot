// src/components/analytics/InsightsSummary.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Target,
  Zap,
} from "lucide-react";

const InsightsSummary = ({ timeFilter }) => {
  // Mock insights data based on time filter
  const getInsights = (filter) => {
    const baseInsights = {
      today: [
        {
          type: "positive",
          icon: TrendingUp,
          title: "Peak Hour Performance",
          message: "Evening rush (5-7 PM) shows 23% higher usage than average",
          impact: "high",
          color: "green",
        },
        {
          type: "warning",
          icon: AlertTriangle,
          title: "Battery Alert",
          message: "12 scooters in Riyadh need charging within 2 hours",
          impact: "medium",
          color: "yellow",
        },
        {
          type: "info",
          icon: Target,
          title: "Revenue Target",
          message: "Daily revenue is 85% of target with 6 hours remaining",
          impact: "medium",
          color: "blue",
        },
      ],
      "7days": [
        {
          type: "positive",
          icon: TrendingUp,
          title: "Weekly Growth",
          message: "Revenue increased by 12.5% compared to last week",
          impact: "high",
          color: "green",
        },
        {
          type: "insight",
          icon: Lightbulb,
          title: "User Pattern Discovery",
          message: "Weekend usage peaks at Makkah religious sites (+45%)",
          impact: "high",
          color: "purple",
        },
        {
          type: "warning",
          icon: TrendingDown,
          title: "Midweek Dip",
          message: "Wednesday shows 8% lower usage - consider promotions",
          impact: "medium",
          color: "orange",
        },
      ],
      "30days": [
        {
          type: "positive",
          icon: CheckCircle,
          title: "Monthly Achievement",
          message: "Exceeded monthly revenue target by 15.2%",
          impact: "high",
          color: "green",
        },
        {
          type: "insight",
          icon: Zap,
          title: "Efficiency Improvement",
          message: "Average ride duration increased by 18% - better user engagement",
          impact: "high",
          color: "blue",
        },
        {
          type: "info",
          icon: Info,
          title: "Market Expansion",
          message: "Jeddah operations show 25% month-over-month growth",
          impact: "medium",
          color: "indigo",
        },
      ],
    };

    return baseInsights[filter] || baseInsights["7days"];
  };

  const insights = getInsights(timeFilter);

  const getImpactColor = (impact) => {
    switch (impact) {
      case "high":
        return "border-l-4 border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-4 border-l-yellow-500 bg-yellow-50";
      default:
        return "border-l-4 border-l-blue-500 bg-blue-50";
    }
  };

  const getIconColor = (color) => {
    const colors = {
      green: "text-green-600",
      yellow: "text-yellow-600",
      blue: "text-blue-600",
      purple: "text-purple-600",
      orange: "text-orange-600",
      indigo: "text-indigo-600",
      red: "text-red-600",
    };
    return colors[color] || "text-gray-600";
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            Key Insights
          </h3>
          <p className="text-sm text-gray-600">
            AI-powered insights for {timeFilter === "today" ? "today" : timeFilter === "7days" ? "this week" : "this month"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {insights.length} insights
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg p-4 shadow-sm ${getImpactColor(insight.impact)}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 ${getIconColor(insight.color)}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {insight.message}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      insight.impact === "high" 
                        ? "bg-red-100 text-red-700"
                        : insight.impact === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {insight.impact} impact
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats Row */}
      <div className="mt-6 pt-4 border-t border-blue-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">94%</div>
            <div className="text-xs text-gray-600">Insight Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+18%</div>
            <div className="text-xs text-gray-600">Performance Boost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">127</div>
            <div className="text-xs text-gray-600">Actions Suggested</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">89%</div>
            <div className="text-xs text-gray-600">Implementation Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsSummary;