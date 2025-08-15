// src/pages/FleetMonitoring.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  MapPin,
  Battery,
  Zap,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Clock,
  Filter,
  RefreshCw,
} from "lucide-react";
import VehicleLocationMap from "../components/scooters/VehicleLocationMap";

const FleetMonitoring = () => {
  const [viewMode, setViewMode] = useState("grid"); // grid, map, list
  const [filterStatus, setFilterStatus] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Mock real-time fleet data with Riyadh locations
  const fleetData = [
    {
      id: "Test-Scooter-001",
      name: "Test-Scooter-001",
      status: "in_use",
      battery: 78,
      location: { name: "Kingdom Centre Tower", lat: 24.7118, lng: 46.6747 },
      speed: 15,
      rider: "Ahmed S.",
      rideTime: "12 min",
      lastUpdate: "2024-01-20T10:30:00Z",
      health: "good",
      station: "RYD-001"
    },
    {
      id: "SC-002",
      name: "Scooter-002",
      status: "available",
      battery: 92,
      location: { name: "Olaya District", lat: 24.7200, lng: 46.6800 },
      speed: 0,
      rider: null,
      rideTime: null,
      lastUpdate: "2024-01-20T10:25:00Z",
      health: "excellent",
      station: "RYD-002"
    },
    {
      id: "SC-003",
      name: "Scooter-003",
      status: "charging",
      battery: 45,
      location: { name: "Al Malaz District", lat: 24.7100, lng: 46.6700 },
      speed: 0,
      rider: null,
      rideTime: null,
      lastUpdate: "2024-01-20T10:20:00Z",
      health: "good",
      station: "RYD-003"
    },
    {
      id: "SC-004",
      name: "Scooter-004",
      status: "maintenance",
      battery: 15,
      location: { name: "Diplomatic Quarter", lat: 24.7180, lng: 46.6850 },
      speed: 0,
      rider: null,
      rideTime: null,
      lastUpdate: "2024-01-20T09:15:00Z",
      health: "poor",
      station: "RYD-004"
    },
    {
      id: "SC-005",
      name: "Scooter-005",
      status: "available",
      battery: 92,
      location: { name: "King Fahd Road", lat: 24.7050, lng: 46.6650 },
      speed: 0,
      rider: null,
      rideTime: null,
      lastUpdate: "2024-01-20T10:35:00Z",
      health: "excellent",
      station: "RYD-005"
    },
    {
      id: "SC-006",
      name: "Scooter-006",
      status: "offline",
      battery: 12,
      location: { name: "Al Nakheel District", lat: 24.7250, lng: 46.6900 },
      speed: 0,
      rider: null,
      rideTime: null,
      lastUpdate: "2024-01-20T08:45:00Z",
      health: "critical",
      station: "RYD-006"
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "in_use":
        return <Navigation className="h-4 w-4 text-blue-600" />;
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "charging":
        return <Zap className="h-4 w-4 text-yellow-600" />;
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "offline":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in_use":
        return "bg-blue-100 text-blue-800";
      case "available":
        return "bg-green-100 text-green-800";
      case "charging":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBatteryColor = (battery) => {
    if (battery >= 60) return "text-green-600";
    if (battery >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthColor = (health) => {
    switch (health) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "fair":
        return "text-yellow-600";
      case "poor":
        return "text-orange-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredFleet = fleetData.filter((scooter) => {
    if (filterStatus === "all") return true;
    return scooter.status === filterStatus;
  });

  const stats = {
    total: fleetData.length,
    active: fleetData.filter((s) => s.status === "in_use").length,
    available: fleetData.filter((s) => s.status === "available").length,
    charging: fleetData.filter((s) => s.status === "charging").length,
    maintenance: fleetData.filter((s) => s.status === "maintenance").length,
    offline: fleetData.filter((s) => s.status === "offline").length,
    lowBattery: fleetData.filter((s) => s.battery < 20).length,
    avgBattery: Math.round(
      fleetData.reduce((sum, s) => sum + s.battery, 0) / fleetData.length
    ),
  };

  // Clear filter function
  const clearFilter = () => {
    setFilterStatus("all");
    console.log("🧹 Filter cleared");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="h-6 w-6 mr-3 text-blue-600" />
            Fleet Monitoring
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time monitoring and tracking of your entire e-scooter fleet
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center px-3 py-2 rounded-lg text-sm ${
              autoRefresh
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
            Auto Refresh
          </button>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Scooters ({stats.total})</option>
            <option value="in_use">In Use ({stats.active})</option>
            <option value="available">Available ({stats.available})</option>
            <option value="charging">Charging ({stats.charging})</option>
            <option value="maintenance">Maintenance ({stats.maintenance})</option>
            <option value="offline">Offline ({stats.offline})</option>
          </select>
          {filterStatus !== "all" && (
            <button
              onClick={clearFilter}
              className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filter
            </button>
          )}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === "grid" ? "bg-white shadow-sm" : ""
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === "map" ? "bg-white shadow-sm" : ""
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === "list" ? "bg-white shadow-sm" : ""
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center"
        >
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-xs text-gray-600">Total Fleet</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center"
        >
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-xs text-gray-600">In Use</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center"
        >
          <p className="text-2xl font-bold text-blue-600">{stats.available}</p>
          <p className="text-xs text-gray-600">Available</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center"
        >
          <p className="text-2xl font-bold text-yellow-600">{stats.charging}</p>
          <p className="text-xs text-gray-600">Charging</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center"
        >
          <p className="text-2xl font-bold text-orange-600">{stats.maintenance}</p>
          <p className="text-xs text-gray-600">Maintenance</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center"
        >
          <p className="text-2xl font-bold text-red-600">{stats.offline}</p>
          <p className="text-xs text-gray-600">Offline</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center"
        >
          <p className={`text-2xl font-bold ${getBatteryColor(stats.avgBattery)}`}>
            {stats.avgBattery}%
          </p>
          <p className="text-xs text-gray-600">Avg Battery</p>
        </motion.div>
      </div>

      {/* Fleet Grid/List View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFleet.map((scooter, index) => (
            <motion.div
              key={scooter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{scooter.id}</h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(scooter.status)}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      scooter.status
                    )}`}
                  >
                    {scooter.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Battery</span>
                  <div className="flex items-center space-x-2">
                    <Battery className={`h-4 w-4 ${getBatteryColor(scooter.battery)}`} />
                    <span className={`font-medium ${getBatteryColor(scooter.battery)}`}>
                      {scooter.battery}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Location</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{scooter.location.name}</span>
                  </div>
                </div>

                {scooter.status === "in_use" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rider</span>
                      <span className="text-sm text-gray-900">{scooter.rider}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Speed</span>
                      <span className="text-sm text-gray-900">{scooter.speed} km/h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ride Time</span>
                      <span className="text-sm text-gray-900">{scooter.rideTime}</span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Health</span>
                  <span className={`text-sm font-medium ${getHealthColor(scooter.health)}`}>
                    {scooter.health}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Updated {scooter.lastUpdate}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {viewMode === "map" && (
        <VehicleLocationMap
          vehicles={filteredFleet.map(scooter => ({
            id: scooter.id,
            name: scooter.name || scooter.id,
            lat: scooter.location.lat,
            lng: scooter.location.lng,
            status: scooter.status.replace('_', '-'),
            battery: scooter.battery,
            lastUpdate: scooter.lastUpdate,
            location: scooter.location.name,
            station: scooter.station
          }))}
          onVehicleSelect={setSelectedVehicle}
        />
      )}

      {viewMode === "list" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scooter ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Battery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Health
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Update
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFleet.map((scooter) => (
                  <tr key={scooter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {scooter.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          scooter.status
                        )}`}
                      >
                        {scooter.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Battery className={`h-4 w-4 mr-2 ${getBatteryColor(scooter.battery)}`} />
                        <span className={`text-sm ${getBatteryColor(scooter.battery)}`}>
                          {scooter.battery}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {scooter.location.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getHealthColor(scooter.health)}`}>
                        {scooter.health}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {scooter.lastUpdate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetMonitoring;
