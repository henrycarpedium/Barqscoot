// src/pages/Pricing.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  MapPin,
  Settings,
  BarChart3,
  Zap,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { pricingService } from "../services/pricingApi";
import PricingDashboard from "../components/pricing/PricingDashboard";
import PricingMap from "../components/pricing/PricingMap";
import PricingRules from "../components/pricing/PricingRules";
import PricingAnalytics from "../components/pricing/PricingAnalytics";

const Pricing = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetch pricing zones
  const { data: zonesData, isLoading: isLoadingZones } = useQuery({
    queryKey: ["pricing-zones"],
    queryFn: async () => {
      const response = await pricingService.getAllZones();
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch pricing analytics
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["pricing-analytics"],
    queryFn: async () => {
      const response = await pricingService.getAnalytics();
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch pricing rules
  const { data: rulesData, isLoading: isLoadingRules } = useQuery({
    queryKey: ["pricing-rules"],
    queryFn: async () => {
      const response = await pricingService.getAllRules();
      return response.data;
    },
    refetchInterval: 60000,
  });

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "map", label: "Live Map", icon: MapPin },
    { id: "rules", label: "Pricing Rules", icon: Settings },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  // Calculate quick stats
  const activeZones = zonesData?.filter(z => z.surgeActive)?.length || 0;
  const totalZones = zonesData?.length || 0;
  const avgMultiplier = zonesData?.reduce((sum, zone) => sum + zone.currentMultiplier, 0) / (zonesData?.length || 1) || 0;
  const totalRevenue = zonesData?.reduce((sum, zone) => sum + zone.revenueToday, 0) || 0;
  const activeRules = rulesData?.filter(r => r.isActive)?.length || 0;

  // Quick stats data
  const quickStats = [
    {
      title: "Active Surge Zones",
      value: isLoadingZones ? "..." : `${activeZones}/${totalZones}`,
      icon: Zap,
      color: "orange",
      trend: activeZones > totalZones / 2 ? "High activity" : "Normal activity",
    },
    {
      title: "Avg Multiplier",
      value: isLoadingZones ? "..." : `${avgMultiplier.toFixed(1)}x`,
      icon: TrendingUp,
      color: "blue",
      trend: avgMultiplier > 1.5 ? "+15% vs yesterday" : "Stable pricing",
    },
    {
      title: "Today's Revenue",
      value: isLoadingZones ? "..." : `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "green",
      trend: "+23% vs yesterday",
    },
    {
      title: "Active Rules",
      value: isLoadingRules ? "..." : activeRules.toString(),
      icon: Settings,
      color: "purple",
      trend: `${rulesData?.length || 0} total rules`,
    },
  ];

  const colorClasses = {
    orange: "bg-orange-50 text-orange-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <DollarSign className="h-6 w-6 mr-3 text-green-600" />
            Dynamic Pricing
          </h1>
          <p className="text-gray-600 mt-1">
            Configure surge pricing and monitor revenue optimization
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {analyticsData && (
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>{analyticsData.overview.revenueGrowth}% growth</span>
              </div>
              <div className="flex items-center text-blue-600">
                <Users className="h-4 w-4 mr-1" />
                <span>{analyticsData.overview.customerSatisfaction}/5 satisfaction</span>
              </div>
            </div>
          )}


        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-semibold mt-2">{stat.value}</h3>
                  <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[stat.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* System Status Alert */}
      {activeZones > totalZones * 0.7 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <h4 className="text-yellow-800 font-medium">High Surge Activity Detected</h4>
              <p className="text-yellow-700 text-sm mt-1">
                {activeZones} out of {totalZones} zones are currently in surge pricing. Consider monitoring demand patterns.
              </p>
            </div>
          </div>
        </motion.div>
      )}

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
                      ? "border-green-500 text-green-600"
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
          {activeTab === "dashboard" && (
            <PricingDashboard
              zones={zonesData}
              analytics={analyticsData}
              rules={rulesData}
              isLoading={isLoadingZones || isLoadingAnalytics || isLoadingRules}
            />
          )}
          {activeTab === "map" && (
            <PricingMap
              zones={zonesData}
              isLoading={isLoadingZones}
            />
          )}
          {activeTab === "rules" && (
            <PricingRules
              rules={rulesData}
              zones={zonesData}
              isLoading={isLoadingRules}
            />
          )}
          {activeTab === "analytics" && (
            <PricingAnalytics
              analytics={analyticsData}
              zones={zonesData}
              isLoading={isLoadingAnalytics}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
