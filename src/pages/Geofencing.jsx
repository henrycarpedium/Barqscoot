// src/pages/Geofencing.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GeofencingMap from "../components/geofencing/GeofencingMap";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Shield,
  AlertTriangle,
  Activity,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";

const Geofencing = () => {
  const [activeTab, setActiveTab] = useState("zones");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Mock geofencing zones data - including Riyadh zones
  const geofenceZones = [
    {
      id: 1,
      name: "King Abdulaziz Historical Center",
      nameAr: "مركز الملك عبدالعزيز التاريخي",
      type: "restricted",
      coordinates: "24.6408, 46.7728",
      radius: 500,
      rules: {
        maxSpeed: 15,
        parkingAllowed: false,
        ridingAllowed: true,
        timeRestrictions: "6 AM - 10 PM"
      },
      status: "active",
      scootersInside: 23,
      createdAt: "2024-01-15",
      description: "Historical area with speed restrictions",
      descriptionAr: "منطقة تاريخية مع قيود السرعة"
    },
    {
      id: 2,
      name: "King Fahd Park",
      nameAr: "حديقة الملك فهد",
      type: "allowed",
      coordinates: "24.6877, 46.6947",
      radius: 800,
      rules: {
        maxSpeed: 25,
        parkingAllowed: true,
        ridingAllowed: true,
        timeRestrictions: "24/7"
      },
      status: "active",
      scootersInside: 45,
      createdAt: "2024-01-10",
      description: "Recreational park area with full access",
      descriptionAr: "منطقة حديقة ترفيهية مع وصول كامل"
    },
    {
      id: 3,
      name: "King Faisal Specialist Hospital",
      nameAr: "مستشفى الملك فيصل التخصصي",
      type: "no-ride",
      coordinates: "24.7020, 46.6753",
      radius: 300,
      rules: {
        maxSpeed: 0,
        parkingAllowed: false,
        ridingAllowed: false,
        timeRestrictions: "24/7"
      },
      status: "active",
      scootersInside: 0,
      createdAt: "2024-01-08",
      description: "Medical facility - no scooter access",
      descriptionAr: "منشأة طبية - لا يُسمح بالسكوترات"
    },
    {
      id: 4,
      name: "King Saud University",
      type: "parking-only",
      coordinates: "24.7136, 46.6197",
      radius: 400,
      rules: {
        maxSpeed: 10,
        parkingAllowed: true,
        ridingAllowed: false,
        timeRestrictions: "6 AM - 11 PM"
      },
      status: "active",
      scootersInside: 12,
      createdAt: "2024-01-05",
      description: "University campus - designated parking only"
    },
    {
      id: 5,
      name: "Al Tahlia Street",
      type: "restricted",
      coordinates: "24.7311, 46.6753",
      radius: 600,
      rules: {
        maxSpeed: 20,
        parkingAllowed: true,
        ridingAllowed: true,
        timeRestrictions: "5 AM - 11 PM"
      },
      status: "active",
      scootersInside: 34,
      createdAt: "2024-01-12",
      description: "Commercial street with speed limits"
    },
    {
      id: 6,
      name: "Riyadh Gallery Mall",
      type: "parking-only",
      coordinates: "24.7753, 46.6586",
      radius: 300,
      rules: {
        maxSpeed: 10,
        parkingAllowed: true,
        ridingAllowed: false,
        timeRestrictions: "8 AM - 12 AM"
      },
      status: "active",
      scootersInside: 18,
      createdAt: "2024-01-18",
      description: "Shopping mall - parking area only"
    },
    {
      id: 7,
      name: "Olaya District",
      type: "allowed",
      coordinates: "24.6877, 46.6853",
      radius: 700,
      rules: {
        maxSpeed: 25,
        parkingAllowed: true,
        ridingAllowed: true,
        timeRestrictions: "24/7"
      },
      status: "active",
      scootersInside: 56,
      createdAt: "2024-01-20",
      description: "Business district with full access"
    },
    {
      id: 8,
      name: "Al Masmak Fortress",
      type: "no-ride",
      coordinates: "24.6308, 46.7136",
      radius: 200,
      rules: {
        maxSpeed: 0,
        parkingAllowed: false,
        ridingAllowed: false,
        timeRestrictions: "24/7"
      },
      status: "active",
      scootersInside: 0,
      createdAt: "2024-01-22",
      description: "Historic fortress - no scooter access"
    }
  ];

  const getZoneTypeColor = (type) => {
    switch (type) {
      case "allowed":
        return "bg-green-100 text-green-800";
      case "restricted":
        return "bg-yellow-100 text-yellow-800";
      case "no-ride":
        return "bg-red-100 text-red-800";
      case "parking-only":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  // Map utility functions
  const getZoneColor = (type) => {
    switch (type) {
      case "allowed":
        return "#10b981"; // green
      case "restricted":
        return "#f59e0b"; // yellow
      case "no-ride":
        return "#ef4444"; // red
      case "parking-only":
        return "#3b82f6"; // blue
      default:
        return "#6b7280"; // gray
    }
  };

  const parseCoordinates = (coordString) => {
    const [lat, lng] = coordString.split(',').map(coord => parseFloat(coord.trim()));
    return [lat, lng];
  };

  // Initialize map when tab changes to map
  useEffect(() => {
    if (activeTab === "map" && mapRef.current && !mapInstanceRef.current) {
      // Dynamically import Leaflet to avoid SSR issues
      Promise.all([
        import('leaflet'),
        import('leaflet/dist/leaflet.css')
      ]).then(([L]) => {
        // Initialize map
        const map = L.map(mapRef.current).setView([40.7128, -74.0060], 13);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Store map instance
        mapInstanceRef.current = map;

        // Add zones to map
        const bounds = [];
        geofenceZones.forEach(zone => {
          if (zone.coordinates) {
            const [lat, lng] = parseCoordinates(zone.coordinates);
            const color = getZoneColor(zone.type);

            // Create circle for zone
            const circle = L.circle([lat, lng], {
              color: color,
              fillColor: color,
              fillOpacity: 0.3,
              radius: zone.radius,
              weight: 2
            }).addTo(map);

            // Add popup with zone info
            circle.bindPopup(`
              <div class="p-2">
                <h3 class="font-semibold text-gray-900">${zone.name}</h3>
                <p class="text-sm text-gray-600">${zone.description}</p>
                <div class="mt-2 text-xs">
                  <div><strong>Type:</strong> ${zone.type}</div>
                  <div><strong>Radius:</strong> ${zone.radius}m</div>
                  <div><strong>Max Speed:</strong> ${zone.rules.maxSpeed} km/h</div>
                  <div><strong>Status:</strong> ${zone.status}</div>
                </div>
              </div>
            `);

            // Add to bounds for auto-fit
            bounds.push([lat, lng]);
          }
        });

        // Fit map to show all zones
        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeTab, geofenceZones]);

  const tabs = [
    { id: "zones", label: "Geofence Zones", count: geofenceZones.length },
    { id: "map", label: "Interactive Map", count: null },
    { id: "analytics", label: "Zone Analytics", count: null },
    { id: "settings", label: "Global Settings", count: null }
  ];

  // Refresh functionality
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API refresh
      await new Promise(resolve => setTimeout(resolve, 1000));

      // If on map tab, refresh the map
      if (activeTab === "map" && mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }

      console.log("✅ Geofencing data refreshed successfully");
    } catch (error) {
      console.error("❌ Error refreshing geofencing data:", error);
      alert("Failed to refresh data. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const ZoneForm = () => {
    const [formData, setFormData] = useState({
      name: "",
      type: "allowed",
      coordinates: "",
      radius: 100,
      maxSpeed: 15,
      parkingAllowed: true,
      ridingAllowed: true,
      timeRestrictions: "24/7",
      description: "",
      assignedScooters: ""
    });

    const handleSubmit = (e) => {
      e.preventDefault();

      // Process assigned scooters - split by comma and clean up
      const scooterList = formData.assignedScooters
        .split(',')
        .map(scooter => scooter.trim())
        .filter(scooter => scooter.length > 0);

      const zoneData = {
        ...formData,
        assignedScooters: scooterList
      };

      console.log("Creating zone:", zoneData);
      setShowCreateForm(false);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white flex items-center justify-center z-50"
        style={{ backgroundColor: '#ffffff' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="!bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="!bg-white p-6 border-b border-gray-200" style={{ backgroundColor: '#ffffff' }}>
            <h3 className="text-lg font-semibold text-gray-900">Create Geofence Zone</h3>
          </div>

          <form onSubmit={handleSubmit} className="!bg-white p-6 space-y-6" style={{ backgroundColor: '#ffffff' }}>
            <div className="!bg-white grid grid-cols-1 md:grid-cols-2 gap-6" style={{ backgroundColor: '#ffffff' }}>
              <div className="!bg-white" style={{ backgroundColor: '#ffffff' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 !bg-white"
                  style={{ backgroundColor: '#ffffff' }}
                  placeholder="Enter zone name"
                  required
                />
              </div>

              <div className="!bg-white" style={{ backgroundColor: '#ffffff' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 !bg-white"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <option value="allowed">Allowed Zone</option>
                  <option value="restricted">Restricted Zone</option>
                  <option value="no-ride">No Ride Zone</option>
                  <option value="parking-only">Parking Only</option>
                </select>
              </div>

              <div className="!bg-white" style={{ backgroundColor: '#ffffff' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coordinates (Lat, Lng)
                </label>
                <input
                  type="text"
                  value={formData.coordinates}
                  onChange={(e) => setFormData({...formData, coordinates: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 !bg-white"
                  style={{ backgroundColor: '#ffffff' }}
                  placeholder="40.7128,-74.0060"
                  required
                />
              </div>

              <div className="!bg-white" style={{ backgroundColor: '#ffffff' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Radius (meters)
                </label>
                <input
                  type="number"
                  value={formData.radius}
                  onChange={(e) => setFormData({...formData, radius: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 !bg-white"
                  style={{ backgroundColor: '#ffffff' }}
                  min="50"
                  max="2000"
                  required
                />
              </div>

              <div className="!bg-white" style={{ backgroundColor: '#ffffff' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Speed (km/h)
                </label>
                <input
                  type="number"
                  value={formData.maxSpeed}
                  onChange={(e) => setFormData({...formData, maxSpeed: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 !bg-white"
                  style={{ backgroundColor: '#ffffff' }}
                  min="0"
                  max="25"
                />
              </div>

              <div className="!bg-white" style={{ backgroundColor: '#ffffff' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Restrictions
                </label>
                <input
                  type="text"
                  value={formData.timeRestrictions}
                  onChange={(e) => setFormData({...formData, timeRestrictions: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 !bg-white"
                  style={{ backgroundColor: '#ffffff' }}
                  placeholder="24/7 or 6:00-22:00"
                />
              </div>
            </div>

            <div className="!bg-white space-y-4" style={{ backgroundColor: '#ffffff' }}>
              <div className="!bg-white flex items-center space-x-6" style={{ backgroundColor: '#ffffff' }}>
                <label className="!bg-white flex items-center" style={{ backgroundColor: '#ffffff' }}>
                  <input
                    type="checkbox"
                    checked={formData.parkingAllowed}
                    onChange={(e) => setFormData({...formData, parkingAllowed: e.target.checked})}
                    className="mr-2"
                  />
                  Parking Allowed
                </label>
                <label className="!bg-white flex items-center" style={{ backgroundColor: '#ffffff' }}>
                  <input
                    type="checkbox"
                    checked={formData.ridingAllowed}
                    onChange={(e) => setFormData({...formData, ridingAllowed: e.target.checked})}
                    className="mr-2"
                  />
                  Riding Allowed
                </label>
              </div>

              <div className="!bg-white" style={{ backgroundColor: '#ffffff' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 !bg-white"
                  style={{ backgroundColor: '#ffffff' }}
                  rows="3"
                  placeholder="Zone description and additional rules"
                />
              </div>

              <div className="!bg-white" style={{ backgroundColor: '#ffffff' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Scooters (Optional)
                </label>
                <input
                  type="text"
                  value={formData.assignedScooters}
                  onChange={(e) => setFormData({...formData, assignedScooters: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 !bg-white"
                  style={{ backgroundColor: '#ffffff' }}
                  placeholder="Enter scooter IDs or tags separated by commas (e.g., SC-001, SC-002, tag:downtown)"
                />
                <p className="text-xs text-gray-500 mt-1 !bg-white" style={{ backgroundColor: '#ffffff' }}>
                  Specify individual scooter IDs (SC-001) or use tags (tag:region-name) to assign scooters to this zone
                </p>
              </div>
            </div>

            <div className="!bg-white flex justify-end space-x-4" style={{ backgroundColor: '#ffffff' }}>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 !bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                style={{ backgroundColor: '#ffffff' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Zone
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MapPin className="h-6 w-6 mr-3 text-green-600" />
            Geofencing Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage geofencing zones and monitor scooter access restrictions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
              isRefreshing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Zone
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Zones</p>
              <p className="text-2xl font-bold text-green-600">{geofenceZones.length}</p>
              <p className="text-xs text-green-600 mt-1">
                {geofenceZones.filter(z => z.status === 'active').length} active
              </p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scooters in Zones</p>
              <p className="text-2xl font-bold text-blue-600">
                {geofenceZones.reduce((sum, zone) => sum + zone.scootersInside, 0)}
              </p>
              <p className="text-xs text-blue-600 mt-1">Currently tracked</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Restricted Zones</p>
              <p className="text-2xl font-bold text-red-600">
                {geofenceZones.filter(z => z.type === 'no-ride' || z.type === 'restricted').length}
              </p>
              <p className="text-xs text-red-600 mt-1">Active restrictions</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Parking Zones</p>
              <p className="text-2xl font-bold text-purple-600">
                {geofenceZones.filter(z => z.rules.parkingAllowed).length}
              </p>
              <p className="text-xs text-purple-600 mt-1">Parking allowed</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "zones" && (
            <div className="space-y-4">
              {geofenceZones.map((zone, index) => (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {zone.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getZoneTypeColor(zone.type)}`}>
                          {zone.type.replace('-', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(zone.status)}`}>
                          {zone.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{zone.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Coordinates:</span>
                          <p className="text-gray-600">{zone.coordinates}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Radius:</span>
                          <p className="text-gray-600">{zone.radius}m</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Max Speed:</span>
                          <p className="text-gray-600">{zone.rules.maxSpeed} km/h</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Scooters Inside:</span>
                          <p className="text-gray-600">{zone.scootersInside}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center space-x-6 text-sm">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 mr-2">Rules:</span>
                          <div className="flex space-x-3">
                            <span className={`px-2 py-1 rounded text-xs ${zone.rules.parkingAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              Parking {zone.rules.parkingAllowed ? 'Allowed' : 'Forbidden'}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${zone.rules.ridingAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              Riding {zone.rules.ridingAllowed ? 'Allowed' : 'Forbidden'}
                            </span>
                            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                              {zone.rules.timeRestrictions}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-6">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title={zone.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {zone.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "map" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Interactive Geofencing Map</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Allowed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Restricted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>No Ride</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Parking Only</span>
                  </div>
                </div>
              </div>
              <GeofencingMap zones={geofenceZones} />
              <p className="text-sm text-gray-500">
                Click on zones to view details. Use the legend above to identify zone types.
              </p>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Zone Violations</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Speed violations</span>
                      <span className="font-medium">23 this week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parking violations</span>
                      <span className="font-medium">12 this week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">No-ride zone entries</span>
                      <span className="font-medium">5 this week</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Zone Usage</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Most active zone</span>
                      <span className="font-medium">Downtown Business</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average dwell time</span>
                      <span className="font-medium">15 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peak usage hours</span>
                      <span className="font-medium">8-10 AM, 5-7 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Global Geofencing Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enable Geofencing</label>
                      <p className="text-xs text-gray-500">Master switch for all geofencing features</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Automatic Speed Limiting</label>
                      <p className="text-xs text-gray-500">Automatically limit speed in restricted zones</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Zone Violation Alerts</label>
                      <p className="text-xs text-gray-500">Send alerts when scooters violate zone rules</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Zone Form Modal */}
      <AnimatePresence>
        {showCreateForm && <ZoneForm />}
      </AnimatePresence>
    </div>
  );
};

export default Geofencing;