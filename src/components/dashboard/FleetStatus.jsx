// src/components/dashboard/FleetStatus.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Bike,
  Battery,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Navigation,
  Filter,
} from "lucide-react";

const FleetStatus = ({ scooters = [] }) => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("battery"); // battery, location, status, lastUsed

  // Mock data if no scooters provided
  const mockScooters = [
    {
      id: "SC-001",
      status: "available",
      battery: 85,
      location: t('dashboard.fleetStatus.locations.downtown'),
      lastUsed: "5 min ago",
      coordinates: { lat: 40.7128, lng: -74.0060 },
    },
    {
      id: "SC-002",
      status: "in_use",
      battery: 67,
      location: t('dashboard.fleetStatus.locations.university'),
      lastUsed: "Active",
      coordinates: { lat: 40.7589, lng: -73.9851 },
    },
    {
      id: "SC-003",
      status: "maintenance",
      battery: 15,
      location: "Workshop",
      lastUsed: "2 hours ago",
      coordinates: { lat: 40.7505, lng: -73.9934 },
    },
    {
      id: "SC-004",
      status: "available",
      battery: 92,
      location: t('dashboard.fleetStatus.locations.businessDistrict'),
      lastUsed: "1 min ago",
      coordinates: { lat: 40.7614, lng: -73.9776 },
    },
    {
      id: "SC-005",
      status: "offline",
      battery: 0,
      location: "Unknown",
      lastUsed: "3 hours ago",
      coordinates: null,
    },
  ];

  const fleetData = scooters.length > 0 ? scooters : mockScooters;

  // Calculate fleet statistics
  const stats = {
    total: fleetData.length,
    available: fleetData.filter(s => s.status === "available").length,
    inUse: fleetData.filter(s => s.status === "in_use").length,
    maintenance: fleetData.filter(s => s.status === "maintenance").length,
    offline: fleetData.filter(s => s.status === "offline").length,
    lowBattery: fleetData.filter(s => s.battery < 20).length,
    avgBattery: Math.round(fleetData.reduce((sum, s) => sum + s.battery, 0) / fleetData.length),
  };

  // Filter and sort scooters
  const filteredScooters = fleetData
    .filter(scooter => {
      if (statusFilter === "all") return true;
      if (statusFilter === "low_battery") return scooter.battery < 20;
      return scooter.status === statusFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "battery":
          return a.battery - b.battery;
        case "location":
          return a.location.localeCompare(b.location);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_use":
        return <Navigation className="h-4 w-4 text-blue-600" />;
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "offline":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Bike className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-50";
      case "in_use":
        return "text-blue-600 bg-blue-50";
      case "maintenance":
        return "text-yellow-600 bg-yellow-50";
      case "offline":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getBatteryColor = (battery) => {
    if (battery >= 60) return "text-green-600";
    if (battery >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusText = (status) => {
    const statusMap = {
      'available': t('dashboard.fleetStatus.available'),
      'in_use': t('dashboard.fleetStatus.inUse'),
      'maintenance': t('dashboard.fleetStatus.maintenance'),
      'offline': t('dashboard.fleetStatus.offline')
    };
    return statusMap[status] || status;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bike className="h-5 w-5 mr-2 text-blue-600" />
            {t('dashboard.fleetStatus.title')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('dashboard.fleetStatus.subtitle').replace('16', stats.total)}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('dashboard.fleetStatus.allScooters')}</option>
            <option value="available">{t('dashboard.fleetStatus.available')}</option>
            <option value="in_use">{t('dashboard.fleetStatus.inUse')}</option>
            <option value="maintenance">{t('dashboard.fleetStatus.maintenance')}</option>
            <option value="offline">{t('dashboard.fleetStatus.offline')}</option>
            <option value="low_battery">Low Battery</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="battery">{t('dashboard.fleetStatus.sortBy')}</option>
            <option value="location">Sort by Location</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{stats.available}</p>
          <p className="text-xs text-green-700">{t('dashboard.fleetStatus.available')}</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{stats.inUse}</p>
          <p className="text-xs text-blue-700">{t('dashboard.fleetStatus.inUse')}</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
          <p className="text-xs text-yellow-700">{t('dashboard.fleetStatus.maintenance')}</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">{stats.offline}</p>
          <p className="text-xs text-red-700">{t('dashboard.fleetStatus.offline')}</p>
        </div>
      </div>

      {/* Scooter List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredScooters.map((scooter, index) => (
          <motion.div
            key={scooter.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(scooter.status)}
              <div>
                <p className="text-sm font-medium text-gray-900">{scooter.id}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{scooter.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Battery */}
              <div className="flex items-center space-x-1">
                <Battery className={`h-4 w-4 ${getBatteryColor(scooter.battery)}`} />
                <span className={`text-sm font-medium ${getBatteryColor(scooter.battery)}`}>
                  {scooter.battery}%
                </span>
              </div>

              {/* Status */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(scooter.status)}`}>
                {getStatusText(scooter.status)}
              </span>

              {/* Last Used */}
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{scooter.lastUsed}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fleet Health Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">{t('dashboard.fleetStatus.fleetUtilization')}</p>
            <p className="text-lg font-semibold text-blue-600">
              {Math.round((stats.inUse / stats.total) * 100)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('dashboard.fleetStatus.avgBattery')}</p>
            <p className={`text-lg font-semibold ${getBatteryColor(stats.avgBattery)}`}>
              {stats.avgBattery}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('dashboard.fleetStatus.healthScore')}</p>
            <p className="text-lg font-semibold text-green-600">
              {Math.round(((stats.total - stats.offline - stats.maintenance) / stats.total) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FleetStatus;
