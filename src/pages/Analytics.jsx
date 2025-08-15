// src/pages/Analytics.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  Eye,
  Settings,
  Clock,
  Users,
  DollarSign,
  Activity,
} from "lucide-react";
import { scooterService } from "../services/api";
import AnalyticsInsights from "../components/analytics/AnalyticsInsights";
import BookingStats from "../components/bookings/BookingStats";
import AnalyticsConfig from "../components/analytics/AnalyticsConfig";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // Fetch real data from API
  const {
    data: ridesData,
    isLoading: isLoadingRides,
    refetch: refetchRides,
  } = useQuery({
    queryKey: ["rides-analytics", dateRange],
    queryFn: async () => {
      try {
        const response = await scooterService.getAllRides({});
        return response.data || [];
      } catch (err) {
        console.error("Error fetching rides:", err);
        return [];
      }
    },
  });

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users-analytics"],
    queryFn: async () => {
      try {
        const response = await scooterService.getAllUsers();
        return response.data || [];
      } catch (err) {
        console.error("Error fetching users:", err);
        return [];
      }
    },
  });

  // Calculate real statistics
  const totalBookings = ridesData?.length || 0;
  const activeRides = ridesData?.filter((ride) => ride.status === "active")?.length || 0;
  const uniqueUsers = ridesData ? new Set(ridesData.map((ride) => ride.userId)).size : 0;
  const totalRevenue = ridesData?.reduce((sum, ride) => sum + (ride.amount || 0), 0) || 0;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchRides(), refetchUsers()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };

  const handleExport = () => {
    // Create CSV data
    const csvData = [
      ["Metric", "Value", "Date"],
      ["Total Bookings", totalBookings, new Date().toLocaleDateString()],
      ["Active Rides", activeRides, new Date().toLocaleDateString()],
      ["Unique Users", uniqueUsers, new Date().toLocaleDateString()],
      ["Total Revenue", `$${totalRevenue.toFixed(2)}`, new Date().toLocaleDateString()],
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleConfigSave = (config) => {
    console.log("Analytics configuration saved:", config);
    // In a real app, save to backend or localStorage
    localStorage.setItem("analyticsConfig", JSON.stringify(config));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-6 w-6 mr-3 text-blue-600" />
            Analytics & Insights
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive analytics dashboard with AI-powered insights for your e-scooter business
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
            <option value="1y">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
          
          <button
            onClick={() => setShowConfig(true)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Settings className="h-4 w-4 mr-1" />
            Configure
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Debug Information</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <p>Date Range: {dateRange}</p>
          <p>Rides Loading: {isLoadingRides ? 'Yes' : 'No'}</p>
          <p>Users Loading: {isLoadingUsers ? 'Yes' : 'No'}</p>
          <p>Total Bookings: {totalBookings}</p>
          <p>Active Rides: {activeRides}</p>
          <p>Unique Users: {uniqueUsers}</p>
          <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Main Analytics Dashboard */}
      <BookingStats />

      {/* Additional Analytics Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Insights</h3>
        <p className="text-gray-600">Advanced analytics insights and detailed reports will be displayed here.</p>

        {/* Sub-tabs for different analytics views */}
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                Usage Analytics
              </button>
              <button className="border-teal-500 text-teal-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                Revenue Analytics
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                User Behavior
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                City Reports
              </button>
            </nav>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Select a tab above to view detailed analytics.</p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Last updated: {new Date().toLocaleString()}</span>
            <span>•</span>
            <span>Data refresh interval: 5 minutes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Real-time data</span>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      <AnalyticsConfig
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
        onSave={handleConfigSave}
      />
    </div>
  );
};

export default Analytics;
