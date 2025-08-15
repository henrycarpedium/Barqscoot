// src/components/pricing/PricingDashboard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
} from "recharts";
import {
  TrendingUp,
  MapPin,
  Zap,
  DollarSign,
  Clock,
  Users,
  AlertTriangle,
  Settings,
  Play,
  Pause,
  Edit,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pricingService } from "../../services/pricingApi";
import WeatherImpactPanel from "./WeatherImpactPanel";
import { SurgePermissionGuard } from "../common/PermissionGuard";
import { usePermissions } from "../../services/permissionService";

const PricingDashboard = ({ zones, analytics, rules, isLoading }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { canManualSurge } = usePermissions();

  // Manual surge override mutation
  const manualSurgeMutation = useMutation({
    mutationFn: async ({ zoneId, multiplier, duration }) => {
      return await pricingService.manualSurgeOverride(zoneId, multiplier, duration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pricing-zones"]);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600">Loading pricing dashboard...</span>
      </div>
    );
  }

  if (!zones || !analytics) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
        <p>Unable to load pricing data</p>
      </div>
    );
  }

  const handleQuickSurge = (zoneId, multiplier) => {
    if (!canManualSurge()) {
      alert('⚠️ You need Admin or Pricing Manager role to control surge pricing.');
      return;
    }

    manualSurgeMutation.mutate({
      zoneId,
      multiplier,
      duration: 60 // 60 minutes
    });
  };

  const handleManageZones = () => {
    navigate('/geofencing');
  };

  const getDemandColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMultiplierColor = (multiplier) => {
    if (multiplier >= 2.0) return 'text-red-600';
    if (multiplier >= 1.5) return 'text-orange-600';
    if (multiplier >= 1.2) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Prepare chart data
  const revenueData = analytics.revenueByHour?.slice(-12) || []; // Last 12 hours
  const demandData = analytics.demandHeatmap || [];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6'];

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-green-900">
                {analytics.overview.totalRevenue?.toLocaleString()} SAR
              </p>
              <p className="text-xs text-green-600 mt-1">
                {analytics.overview.surgeRevenue?.toLocaleString()} SAR from surge
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Avg Multiplier</p>
              <p className="text-2xl font-bold text-blue-900">
                {analytics.overview.avgMultiplier}x
              </p>
              <p className="text-xs text-blue-600 mt-1">Across all zones</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Active Zones</p>
              <p className="text-2xl font-bold text-orange-900">
                {analytics.overview.activeZones}/{analytics.overview.totalZones}
              </p>
              <p className="text-xs text-orange-600 mt-1">Surge pricing active</p>
            </div>
            <Zap className="h-8 w-8 text-orange-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Customer Satisfaction</p>
              <p className="text-2xl font-bold text-purple-900">
                {analytics.overview.customerSatisfaction}/5
              </p>
              <p className="text-xs text-purple-600 mt-1">With dynamic pricing</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Multiplier Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="revenue" fill="#10B981" name="Revenue ($)" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="multiplier"
                stroke="#EF4444"
                strokeWidth={2}
                name="Multiplier"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Demand Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demand vs Supply</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={demandData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="zone" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="demand" fill="#3B82F6" name="Demand" />
              <Bar dataKey="supply" fill="#10B981" name="Supply" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Zone Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-lg border border-gray-200"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Zone Management</h3>
          <button
            onClick={handleManageZones}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Zones
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{zone.name}</h4>
                  <p className="text-sm text-gray-600">{zone.id}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getDemandColor(zone.demandLevel)}`}>
                  {zone.demandLevel}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-medium">{zone.basePrice} SAR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Multiplier:</span>
                  <span className={`font-medium ${getMultiplierColor(zone.currentMultiplier)}`}>
                    {zone.currentMultiplier}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Rides:</span>
                  <span className="font-medium">{zone.activeRides}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium">{zone.availableScooters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue Today:</span>
                  <span className="font-medium text-green-600">{zone.revenueToday} SAR</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <SurgePermissionGuard showError={false}>
                  <button
                    onClick={() => handleQuickSurge(zone.id, zone.surgeActive ? 1.0 : 1.5)}
                    disabled={manualSurgeMutation.isLoading}
                    className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-xs rounded-lg transition-colors ${
                      zone.surgeActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {zone.surgeActive ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                    {zone.surgeActive ? 'Stop Surge' : 'Start Surge'}
                  </button>
                </SurgePermissionGuard>

                {!canManualSurge() && (
                  <div className="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-500 rounded-lg text-center">
                    🔒 Admin Only
                  </div>
                )}

                <button
                  onClick={() => setSelectedZone(zone)}
                  className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weather Impact Panel */}
      <WeatherImpactPanel zones={zones} analytics={analytics} />

      {/* Active Rules Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white p-6 rounded-lg border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Pricing Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules?.filter(rule => rule.isActive).map((rule) => (
            <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{rule.name}</h4>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
              <div className="text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Multiplier:</span>
                  <span className="font-medium">{rule.pricing.multiplier}x</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue Lift:</span>
                  <span className="font-medium text-green-600">
                    +{rule.performance.avgRevenueLift}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PricingDashboard;
