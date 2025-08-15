// src/pages/Insights.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Brain,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Star,
  ArrowRight,
} from "lucide-react";

const Insights = () => {
  const [timeFilter, setTimeFilter] = useState("today");
  const [insightType, setInsightType] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock AI insights data
  const aiInsights = [
    {
      id: 1,
      type: "opportunity",
      priority: "high",
      title: "Peak Hour Optimization",
      description: "Increase fleet deployment during 5-7 PM for 23% revenue boost",
      impact: "Revenue increase: +$2,340/week",
      confidence: 94,
      action: "Deploy 15 more scooters in downtown area",
      icon: TrendingUp,
      color: "green",
      timeframe: "Implement within 3 days",
    },
    {
      id: 2,
      type: "warning",
      priority: "medium",
      title: "Battery Maintenance Alert",
      description: "12 scooters showing degraded battery performance",
      impact: "Potential downtime: 18 hours/week",
      confidence: 87,
      action: "Schedule battery replacement for affected units",
      icon: AlertTriangle,
      color: "orange",
      timeframe: "Address within 1 week",
    },
    {
      id: 3,
      type: "success",
      priority: "low",
      title: "User Retention Improvement",
      description: "New user onboarding flow increased retention by 15%",
      impact: "Additional 45 active users this month",
      confidence: 92,
      action: "Continue current onboarding strategy",
      icon: CheckCircle,
      color: "blue",
      timeframe: "Monitor progress",
    },
    {
      id: 4,
      type: "prediction",
      priority: "high",
      title: "Weekend Demand Forecast",
      description: "Expect 35% higher demand this weekend due to weather",
      impact: "Potential revenue: +$1,850",
      confidence: 89,
      action: "Increase weekend fleet by 20%",
      icon: Brain,
      color: "purple",
      timeframe: "Prepare by Friday",
    },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "opportunity": return TrendingUp;
      case "warning": return AlertTriangle;
      case "success": return CheckCircle;
      case "prediction": return Brain;
      default: return Lightbulb;
    }
  };

  const filteredInsights = aiInsights.filter(insight => 
    insightType === "all" || insight.type === insightType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Lightbulb className="h-6 w-6 mr-3 text-yellow-500" />
            AI-Powered Insights
          </h1>
          <p className="text-gray-600 mt-1">
            Smart recommendations and predictions to optimize your e-scooter operations
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
          
          <select
            value={insightType}
            onChange={(e) => setInsightType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
          >
            <option value="all">All Insights</option>
            <option value="opportunity">Opportunities</option>
            <option value="warning">Warnings</option>
            <option value="success">Success Stories</option>
            <option value="prediction">Predictions</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm">
            <Settings className="h-4 w-4 mr-1" />
            AI Settings
          </button>
        </div>
      </div>

      {/* Insights Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Insights</p>
              <p className="text-2xl font-bold text-gray-900">{aiInsights.length}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3 new today
              </p>
            </div>
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">
                {aiInsights.filter(i => i.priority === "high").length}
              </p>
              <p className="text-xs text-red-600 flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Requires attention
              </p>
            </div>
            <Target className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(aiInsights.reduce((sum, i) => sum + i.confidence, 0) / aiInsights.length)}%
              </p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <Star className="h-3 w-3 mr-1" />
                High accuracy
              </p>
            </div>
            <Zap className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actions Pending</p>
              <p className="text-2xl font-bold text-orange-600">
                {aiInsights.filter(i => i.priority !== "low").length}
              </p>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                Need response
              </p>
            </div>
            <ArrowRight className="h-8 w-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* AI Insights List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            AI-Generated Insights
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Machine learning powered recommendations based on your data patterns
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {filteredInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-2 rounded-lg ${
                        insight.color === "green" ? "bg-green-100" :
                        insight.color === "orange" ? "bg-orange-100" :
                        insight.color === "blue" ? "bg-blue-100" :
                        insight.color === "purple" ? "bg-purple-100" : "bg-gray-100"
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          insight.color === "green" ? "text-green-600" :
                          insight.color === "orange" ? "text-orange-600" :
                          insight.color === "blue" ? "text-blue-600" :
                          insight.color === "purple" ? "text-purple-600" : "text-gray-600"
                        }`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{insight.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(insight.priority)}`}>
                            {insight.priority.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {insight.confidence}% confidence
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="font-medium text-gray-700">Impact: </span>
                            <span className="text-gray-600">{insight.impact}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Action: </span>
                            <span className="text-gray-600">{insight.action}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Timeline: </span>
                            <span className="text-gray-600">{insight.timeframe}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                        Take Action
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Performance Metrics */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-600" />
              AI Performance Metrics
            </h3>
            <p className="text-sm text-gray-600">
              How our AI insights are performing for your business
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prediction Accuracy</p>
                <p className="text-xl font-bold text-purple-600">94.2%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue Impact</p>
                <p className="text-xl font-bold text-blue-600">+$12,450</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actions Completed</p>
                <p className="text-xl font-bold text-green-600">87%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
