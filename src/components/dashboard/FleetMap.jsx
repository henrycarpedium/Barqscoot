// src/components/dashboard/FleetMap.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Battery,
  Wifi,
  WifiOff,
  Heart,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Navigation,
  Zap,
  Maximize2,
  Minimize2,
} from "lucide-react";

const FleetMap = ({ scooters = [] }) => {
  const [selectedScooter, setSelectedScooter] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter scooters with valid coordinates
  const validScooters = scooters.filter(scooter => 
    scooter.coordinates && 
    scooter.coordinates.lat && 
    scooter.coordinates.lng
  );

  // Calculate map bounds to fit all scooters
  useEffect(() => {
    if (validScooters.length > 0) {
      const lats = validScooters.map(s => s.coordinates.lat);
      const lngs = validScooters.map(s => s.coordinates.lng);
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
      setMapCenter({ lat: centerLat, lng: centerLng });
    }
  }, [validScooters]);

  const getScooterMarkerColor = (scooter) => {
    if (scooter.damage?.isDamaged) return "bg-red-500";
    if (scooter.health?.status === "critical") return "bg-red-600";
    if (scooter.health?.status === "warning") return "bg-yellow-500";
    if (scooter.status === "in_use") return "bg-blue-500";
    if (scooter.status === "available") return "bg-green-500";
    if (scooter.status === "maintenance") return "bg-orange-500";
    return "bg-gray-500";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-3 w-3 text-white" />;
      case "in_use":
        return <Navigation className="h-3 w-3 text-white" />;
      case "maintenance":
        return <AlertTriangle className="h-3 w-3 text-white" />;
      case "offline":
        return <XCircle className="h-3 w-3 text-white" />;
      default:
        return <MapPin className="h-3 w-3 text-white" />;
    }
  };

  const getBatteryColor = (battery) => {
    if (battery >= 60) return "text-green-600";
    if (battery >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthIcon = (healthStatus) => {
    switch (healthStatus) {
      case "healthy":
        return <Heart className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "critical":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Heart className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCommunicationIcon = (communication) => {
    switch (communication) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-600" />;
      case "intermittent":
        return <Wifi className="h-4 w-4 text-yellow-600" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-600" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative bg-gray-100 rounded-lg overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 bg-white" : "h-full"
      }`}
    >
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="bg-white rounded-lg shadow-sm px-3 py-2">
          <h4 className="text-sm font-medium text-gray-900">
            Fleet Map - {validScooters.length} scooters
          </h4>
        </div>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-white rounded-lg shadow-sm p-2 hover:bg-gray-50 transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4 text-gray-600" />
          ) : (
            <Maximize2 className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Simulated Map Background */}
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative">
        {/* Grid pattern to simulate map */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 grid-rows-8 h-full">
            {Array.from({ length: 96 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>

        {/* Street lines to simulate map */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gray-300"></div>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300"></div>
          <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-gray-300"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        </div>

        {/* Scooter Markers */}
        {validScooters.map((scooter, index) => {
          // Convert coordinates to map position (simplified)
          const x = ((scooter.coordinates.lng + 74.1) * 1000) % 100;
          const y = ((scooter.coordinates.lat - 40.7) * 1000) % 100;
          
          return (
            <motion.div
              key={scooter.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${Math.max(10, Math.min(90, x))}%`,
                top: `${Math.max(10, Math.min(90, y))}%`,
              }}
              onClick={() => setSelectedScooter(scooter)}
            >
              <div
                className={`w-8 h-8 rounded-full ${getScooterMarkerColor(
                  scooter
                )} shadow-lg flex items-center justify-center hover:scale-110 transition-transform`}
              >
                {getStatusIcon(scooter.status)}
              </div>
              
              {/* Pulse animation for active scooters */}
              {scooter.status === "in_use" && (
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
              )}
              
              {/* Warning indicator for damaged scooters */}
              {scooter.damage?.isDamaged && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
              )}
            </motion.div>
          );
        })}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-sm p-3">
          <h5 className="text-xs font-medium text-gray-900 mb-2">Legend</h5>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>In Use</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Maintenance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Damaged/Critical</span>
            </div>
          </div>
        </div>

        {/* Scooter Details Popup */}
        {selectedScooter && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-4 max-w-sm w-full mx-4 z-20"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-900">
                {selectedScooter.id}
              </h4>
              <button
                onClick={() => setSelectedScooter(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Location:</span>
                <span className="text-sm font-medium">{selectedScooter.location}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Battery:</span>
                <div className="flex items-center space-x-1">
                  <Battery className={`h-4 w-4 ${getBatteryColor(selectedScooter.battery)}`} />
                  <span className={`text-sm font-medium ${getBatteryColor(selectedScooter.battery)}`}>
                    {selectedScooter.battery}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Health:</span>
                <div className="flex items-center space-x-1">
                  {getHealthIcon(selectedScooter.health?.status)}
                  <span className="text-sm font-medium">
                    {selectedScooter.health?.status || 'unknown'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Communication:</span>
                <div className="flex items-center space-x-1">
                  {getCommunicationIcon(selectedScooter.health?.communication)}
                  <span className="text-sm font-medium">
                    {selectedScooter.health?.communication || 'unknown'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Ping:</span>
                <span className="text-sm font-medium">
                  {selectedScooter.health?.lastPing || 'N/A'}
                </span>
              </div>
              
              {selectedScooter.damage?.isDamaged && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {selectedScooter.damage.reportedIssues?.length || 0} reported issues
                    </span>
                  </div>
                  {selectedScooter.damage.reportedIssues?.length > 0 && (
                    <div className="mt-1 text-xs text-gray-600">
                      {selectedScooter.damage.reportedIssues.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* No scooters message */}
        {validScooters.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Scooters to Display</h3>
              <p className="text-gray-600">
                No scooters with valid coordinates found for the current filter.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FleetMap;