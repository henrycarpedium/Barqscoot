// src/pages/Dashboard.jsx
import { useState } from "react";
import {
  Bike,
  DollarSign,
  Users,
  AlertTriangle,
  Activity,
  Battery,
  Download
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { scooterService, authService } from "../services/api";
import StatCard from "../components/dashboard/StatCard";
import TrendsAnalytics from "../components/dashboard/TrendsAnalytics";
import UsageHeatmap from "../components/dashboard/UsageHeatmap";
import RecentActivities from "../components/dashboard/RecentActivities";
import SystemAlerts from "../components/dashboard/SystemAlerts";
import FleetStatus from "../components/dashboard/FleetStatus";

const Dashboard = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("24h");
  const [isExportingAll, setIsExportingAll] = useState(false);

  // Fetch scooter data
  const { data: scootersData, isLoading: isLoadingScooters } = useQuery({
    queryKey: ["scooters-summary"],
    queryFn: async () => {
      try {
        const response = await scooterService.getAllScooters();
        return response.data;
      } catch (error) {
        console.error("Error fetching scooters:", error);
        return [];
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time data
  });

  // Fetch rides data
  const { data: ridesData, isLoading: isLoadingRides } = useQuery({
    queryKey: ["rides-summary", timeRange],
    queryFn: async () => {
      try {
        const response = await scooterService.getAllRides();
        return response.data;
      } catch (error) {
        console.error("Error fetching rides:", error);
        return [];
      }
    },
    refetchInterval: 30000,
  });

  // Fetch users data
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users-summary"],
    queryFn: async () => {
      try {
        const response = await authService.getAllUsers();
        return response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
    refetchInterval: 60000, // Refetch every minute
  });

  // Calculate enhanced stats
  const scootersCount = scootersData?.length || 0;
  const activeScooters = scootersData?.filter((s) => s.status === "available")?.length || 0;
  const inUseScooters = scootersData?.filter((s) => s.status === "in_use")?.length || 0;
  const maintenanceScooters = scootersData?.filter((s) => s.status === "maintenance")?.length || 0;
  const lowBatteryScooters = scootersData?.filter((s) => s.battery < 20)?.length || 0;

  const totalRides = ridesData?.length || 0;
  const activeRides = ridesData?.filter((r) => r.status === "active")?.length || 0;
  const totalUsers = usersData?.length || 0;
  const activeUsers = usersData?.filter((u) => u.status === "active")?.length || 0;

  // Calculate revenue with more sophisticated logic
  const revenue = ridesData?.reduce((total, ride) => {
    const duration = ride.duration || 15;
    const basePrice = 2;
    const perMinuteRate = 0.25;
    return total + (basePrice + duration * perMinuteRate);
  }, 0) || 0;



  // Enhanced stat cards data
  const stats = [
    {
      title: t('dashboard.stats.totalRevenue'),
      value: isLoadingRides ? t('common.loading') : `$${revenue.toFixed(2)}`,
      icon: DollarSign,
      trend: 12.5,
      color: "green",
      subtitle: `${totalRides} ${t('dashboard.stats.ridesCompleted')}`,
    },
    {
      title: t('dashboard.stats.activeScooters'),
      value: isLoadingScooters ? t('common.loading') : `${activeScooters}/${scootersCount}`,
      icon: Bike,
      trend: -2.3,
      color: "blue",
      subtitle: `${inUseScooters} ${t('dashboard.stats.currentlyInUse')}`,
    },
    {
      title: t('dashboard.stats.activeUsers'),
      value: isLoadingUsers ? t('common.loading') : activeUsers.toString(),
      icon: Users,
      trend: 8.7,
      color: "purple",
      subtitle: `${totalUsers} ${t('dashboard.stats.totalRegistered')}`,
    },
    {
      title: t('dashboard.stats.activeRides'),
      value: isLoadingRides ? t('common.loading') : activeRides.toString(),
      icon: Activity,
      trend: 15.2,
      color: "orange",
      subtitle: t('dashboard.stats.currentlyOngoing'),
    },
  ];

  // System alerts data
  const alerts = [
    ...(lowBatteryScooters > 0 ? [{
      id: 1,
      type: "warning",
      title: t('dashboard.alerts.lowBattery'),
      message: `${lowBatteryScooters} ${t('dashboard.alerts.lowBatteryMessage')}`,
      time: `2 ${t('dashboard.alerts.minutesAgo')}`,
      icon: Battery,
    }] : []),
    ...(maintenanceScooters > 0 ? [{
      id: 2,
      type: "info",
      title: t('dashboard.alerts.maintenanceRequired'),
      message: `${maintenanceScooters} ${t('dashboard.alerts.maintenanceMessage')}`,
      time: `5 ${t('dashboard.alerts.minutesAgo')}`,
      icon: AlertTriangle,
    }] : []),
  ];

  // Export All functionality
  const handleExportAll = async () => {
    setIsExportingAll(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create comprehensive CSV data for dashboard
      const csvData = [];

      // Add header
      csvData.push(['E-Scooter Dashboard - Complete Export', '', '', '']);
      csvData.push(['Generated on:', new Date().toLocaleDateString(), 'Time Range:', timeRange]);
      csvData.push(['', '', '', '']); // Empty row

      // Add key metrics
      csvData.push(['KEY METRICS', '', '', '']);
      csvData.push(['Metric', 'Value', 'Trend', 'Details']);
      csvData.push(['Total Revenue', `$${revenue.toFixed(2)}`, '+12.5%', `${totalRides} rides completed`]);
      csvData.push(['Active Scooters', `${activeScooters}/${scootersCount}`, '-2.3%', `${inUseScooters} currently in use`]);
      csvData.push(['Active Users', activeUsers.toString(), '+8.7%', `${totalUsers} total registered`]);
      csvData.push(['Fleet Utilization', `${((activeScooters / scootersCount) * 100).toFixed(1)}%`, '+5.2%', 'Fleet efficiency']);

      csvData.push(['', '', '', '']); // Empty row

      // Add fleet status
      csvData.push(['FLEET STATUS', '', '', '']);
      csvData.push(['Status', 'Count', 'Percentage', 'Battery Avg']);
      const statusCounts = {
        available: scootersData?.filter(s => s.status === 'available').length || 0,
        inUse: scootersData?.filter(s => s.status === 'in-use').length || 0,
        maintenance: scootersData?.filter(s => s.status === 'maintenance').length || 0,
        charging: scootersData?.filter(s => s.status === 'charging').length || 0,
      };
      Object.entries(statusCounts).forEach(([status, count]) => {
        const percentage = ((count / scootersCount) * 100).toFixed(1);
        const avgBattery = scootersData?.filter(s => s.status === status)
          .reduce((sum, s) => sum + (s.batteryLevel || 0), 0) / (count || 1) || 0;
        csvData.push([status.charAt(0).toUpperCase() + status.slice(1), count, `${percentage}%`, `${avgBattery.toFixed(1)}%`]);
      });

      csvData.push(['', '', '', '']); // Empty row

      // Add system alerts
      csvData.push(['SYSTEM ALERTS', '', '', '']);
      csvData.push(['Type', 'Title', 'Message', 'Time']);
      alerts.forEach(alert => {
        csvData.push([alert.type, alert.title, alert.message, alert.time]);
      });

      const csvContent = csvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `dashboard_export_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ Dashboard data exported successfully!');
    } catch (error) {
      console.error('❌ Export All failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExportingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with time range selector */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-600">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="1h">{t('dashboard.timeRange.lastHour')}</option>
            <option value="24h">{t('dashboard.timeRange.last24Hours')}</option>
            <option value="7d">{t('dashboard.timeRange.last7Days')}</option>
            <option value="30d">{t('dashboard.timeRange.last30Days')}</option>
          </select>
          <button
            onClick={handleExportAll}
            disabled={isExportingAll}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            <Download className={`h-4 w-4 mr-2 ${isExportingAll ? 'animate-bounce' : ''}`} />
            {isExportingAll ? t('common.loading') : t('common.exportAll')}
          </button>
        </div>
      </div>



      {/* Enhanced stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Trends Analytics Section */}
      <TrendsAnalytics />

      {/* Usage Heatmap */}
      <UsageHeatmap />

      {/* Fleet Status and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FleetStatus scooters={scootersData || []} />
        </div>
        <SystemAlerts alerts={alerts} />
      </div>

      {/* Recent Activities */}
      <RecentActivities />


    </div>
  );
};

export default Dashboard;
