// src/components/scooters/ScooterList.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Battery,
  MapPin,
  Settings,
  Plus,
  AlertCircle,
  Loader,
  Download,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { scooterService } from "../../services/api";

const ScooterList = ({ onScooterSelect, onAddScooter, localScooters = [] }) => {
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBattery, setFilterBattery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch scooters with React Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["scooters", filterStatus, filterBattery],
    queryFn: async () => {
      try {
        const filters = {};
        if (filterStatus) filters.status = filterStatus;
        if (filterBattery) filters.minBattery = filterBattery;
        const response = await scooterService.getAllScooters(filters);
        return response.data;
      } catch (error) {
        console.log("API not available, using local data only");
        return [];
      }
    },
  });

  // Combine API data with local scooters (local scooters first for demo)
  const allScooters = [...localScooters, ...(data || [])];

  // Apply client-side search filter
  const filteredScooters = allScooters.filter(
    (scooter) =>
      searchTerm === "" ||
      scooter.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scooter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (scooter.location &&
        typeof scooter.location === "string" &&
        scooter.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (scooter.lastStation &&
        scooter.lastStation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  // Export functionality
  const handleExportScooters = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const csvHeaders = [
        'Scooter ID',
        'Name',
        'Model',
        'Battery Level (%)',
        'Status',
        'Location',
        'Last Station',
        'Total Rides',
        'Last Maintenance',
        'Created Date'
      ];

      const csvData = filteredScooters.map(scooter => [
        scooter.id,
        scooter.name || 'N/A',
        scooter.model || 'N/A',
        scooter.batteryLevel || 0,
        scooter.status,
        getDisplayLocation(scooter),
        scooter.lastStation || 'N/A',
        scooter.totalRides || 0,
        scooter.lastMaintenance ? new Date(scooter.lastMaintenance).toLocaleDateString() : 'N/A',
        scooter.createdAt ? new Date(scooter.createdAt).toLocaleDateString() : 'N/A'
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `scooters_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ Scooters exported successfully!');
    } catch (error) {
      console.error('❌ Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getBatteryColor = (level) => {
    if (level > 70) return "text-green-500";
    if (level > 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusBadge = (status) => {
    const styles = {
      available: "bg-green-100 text-green-800",
      "in-use": "bg-blue-100 text-blue-800",
      maintenance: "bg-orange-100 text-orange-800",
      offline: "bg-gray-100 text-gray-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  // Transform location display to show Riyadh locations (frontend only)
  const getDisplayLocation = (scooter) => {
    const location = scooter.lastStation || scooter.location || "Unknown";

    // Map NYC locations to Riyadh locations for display
    const locationMap = {
      "NYC-001": "RYD-001 (Kingdom Centre)",
      "NYC-002": "RYD-002 (Olaya District)",
      "NYC-003": "RYD-003 (Al Malaz)",
      "NYC-004": "RYD-004 (Diplomatic Quarter)",
      "NYC-005": "RYD-005 (King Fahd Road)",
      "40.7128,-74.0060": "Kingdom Centre Tower",
      "Downtown": "Olaya District",
      "University": "King Saud University",
      "Business District": "King Fahd Road",
      "Unknown": "Riyadh City Center"
    };

    return locationMap[location] || location;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Scooters</h2>
          <div className="mt-4 md:mt-0 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportScooters}
              disabled={isExporting}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors">
              <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
              {isExporting ? 'Exporting...' : 'Export'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddScooter}
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Scooter
            </motion.button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search scooters..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </motion.button>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            Refresh
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2">
                  <option value="">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="in-use">In Use</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Battery
                </label>
                <select
                  value={filterBattery}
                  onChange={(e) => setFilterBattery(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2">
                  <option value="">Any Battery</option>
                  <option value="20">At least 20%</option>
                  <option value="50">At least 50%</option>
                  <option value="80">At least 80%</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setFilterStatus("");
                  setFilterBattery("");
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scooter Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-teal-500 animate-spin" />
            <span className="ml-2 text-gray-600">Loading scooters...</span>
          </div>
        ) : isError ? (
          <div className="col-span-3 flex justify-center items-center py-12 text-red-500">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>Error loading scooters. Please try again.</span>
          </div>
        ) : filteredScooters.length === 0 ? (
          <div className="col-span-3 flex justify-center items-center py-12 text-gray-500">
            No scooters found
          </div>
        ) : (
          filteredScooters.map((scooter) => (
            <motion.div
              key={scooter.id || scooter._id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onScooterSelect(scooter)}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-800">
                  {scooter.name || scooter.id || "Unknown"}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                    scooter.status || "unknown"
                  )}`}>
                  {scooter.status || "Unknown"}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Battery
                      className={`w-4 h-4 mr-2 ${getBatteryColor(
                        scooter.batteryLevel || 0
                      )}`}
                    />
                    <span>{scooter.batteryLevel || 0}%</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Settings className="w-4 h-4 mr-2" />
                    <span>{scooter.model || "Standard"}</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>
                    {getDisplayLocation(scooter)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  {scooter.lastMaintenance && (
                    <span>
                      Last Maintenance:{" "}
                      {new Date(scooter.lastMaintenance).toLocaleDateString()}
                    </span>
                  )}
                  {scooter.totalRides !== undefined && (
                    <span>{scooter.totalRides} rides</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredScooters.length} scooters
            {isLoading && (
              <span className="ml-2 text-teal-500">(Loading...)</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled>
              Previous
            </button>
            <button
              className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScooterList;
