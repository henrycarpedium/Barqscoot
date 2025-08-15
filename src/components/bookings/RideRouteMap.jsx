// src/components/bookings/RideRouteMap.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Route,
  Navigation,
  Gauge,
  Battery,
  Calendar,
  User,
} from "lucide-react";
import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const RideRouteMap = ({ bookingId, onClose }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  // Mock ride data for Riyadh (will be replaced with API data later)
  const mockRideData = {
    id: bookingId || "BOOK-001",
    userId: "USER-789",
    userName: "User",
    scooterId: "SCOOT-RYD-123",
    startTime: "2024-01-15T10:30:00Z",
    endTime: "2024-01-15T11:15:00Z",
    duration: 45, // minutes
    distance: 8.5, // kilometers
    averageSpeed: 18.5, // km/h
    maxSpeed: 25.0, // km/h
    startLocation: {
      lat: 24.7136,
      lng: 46.6753,
      address: "King Fahd Road, Riyadh",
      name: "Riyadh Metro Station"
    },
    endLocation: {
      lat: 24.6877,
      lng: 46.7219,
      address: "Prince Mohammed Bin Abdulaziz Road, Riyadh",
      name: "Al Faisaliyah Center"
    },
    // Route points within Riyadh boundaries
    route: [
      { lat: 24.7136, lng: 46.6753, timestamp: 0, speed: 0, battery: 85 },
      { lat: 24.7120, lng: 46.6780, timestamp: 120, speed: 15, battery: 84 },
      { lat: 24.7100, lng: 46.6820, timestamp: 240, speed: 18, battery: 82 },
      { lat: 24.7080, lng: 46.6860, timestamp: 360, speed: 20, battery: 80 },
      { lat: 24.7050, lng: 46.6900, timestamp: 480, speed: 22, battery: 78 },
      { lat: 24.7020, lng: 46.6950, timestamp: 600, speed: 19, battery: 76 },
      { lat: 24.7000, lng: 46.7000, timestamp: 720, speed: 21, battery: 74 },
      { lat: 24.6980, lng: 46.7050, timestamp: 840, speed: 18, battery: 72 },
      { lat: 24.6950, lng: 46.7100, timestamp: 960, speed: 16, battery: 70 },
      { lat: 24.6920, lng: 46.7150, timestamp: 1080, speed: 20, battery: 68 },
      { lat: 24.6900, lng: 46.7180, timestamp: 1200, speed: 15, battery: 66 },
      { lat: 24.6877, lng: 46.7219, timestamp: 1320, speed: 0, battery: 64 },
    ],
    events: [
      { timestamp: 0, type: "ride_start", description: "Ride started", location: "Riyadh Metro Station" },
      { timestamp: 480, type: "speed_limit", description: "Speed limit area", speed: 15 },
      { timestamp: 720, type: "traffic_light", description: "Traffic light stop", duration: 30 },
      { timestamp: 1080, type: "slow_zone", description: "Pedestrian area - reduced speed" },
      { timestamp: 1320, type: "ride_end", description: "Ride completed", location: "Al Faisaliyah Center" },
    ],
  };

  // Riyadh city boundaries (approximate)
  const riyadhBounds = [
    [24.4539, 46.3619], // Southwest
    [24.9738, 47.1291], // Northeast
  ];

  // Riyadh center coordinates
  const riyadhCenter = [24.7136, 46.6753];

  // Custom icons
  const startIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const endIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-7xl mx-4 max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Route className="h-6 w-6 text-blue-600 mr-2" />
                Ride Route - {mockRideData.id}
              </h3>
              <p className="text-gray-600 mt-1">
                {mockRideData.startLocation.name} → {mockRideData.endLocation.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[80vh]">
          {/* Map Area */}
          <div className="flex-1 relative">
            {mapLoaded && (
              <MapContainer
                center={riyadhCenter}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
                maxBounds={riyadhBounds}
                maxBoundsViscosity={1.0}
                minZoom={10}
                maxZoom={18}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Riyadh boundary circle */}
                <Circle
                  center={riyadhCenter}
                  radius={25000}
                  pathOptions={{
                    color: "#3b82f6",
                    fillColor: "#3b82f6",
                    fillOpacity: 0.05,
                    weight: 2,
                    dashArray: "5, 5",
                  }}
                />

                {/* Start marker */}
                <Marker position={[mockRideData.startLocation.lat, mockRideData.startLocation.lng]} icon={startIcon}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-semibold text-green-700">Ride Start</h4>
                      <p className="text-sm text-gray-600">{mockRideData.startLocation.address}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(mockRideData.startTime).toLocaleString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>

                {/* End marker */}
                <Marker position={[mockRideData.endLocation.lat, mockRideData.endLocation.lng]} icon={endIcon}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-semibold text-red-700">Ride End</h4>
                      <p className="text-sm text-gray-600">{mockRideData.endLocation.address}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(mockRideData.endTime).toLocaleString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>

                {/* Route polyline */}
                <Polyline
                  positions={mockRideData.route.map(point => [point.lat, point.lng])}
                  pathOptions={{
                    color: "#10b981",
                    weight: 4,
                    opacity: 0.8,
                    dashArray: "10, 5",
                  }}
                />

                {/* Event markers */}
                {mockRideData.events.map((event, index) => {
                  const routePoint = mockRideData.route.find(p => Math.abs(p.timestamp - event.timestamp) <= 60);
                  if (!routePoint) return null;

                  return (
                    <Marker
                      key={index}
                      position={[routePoint.lat, routePoint.lng]}
                      icon={new L.Icon({
                        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
                        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                        iconSize: [20, 32],
                        iconAnchor: [10, 32],
                        popupAnchor: [1, -28],
                        shadowSize: [32, 32],
                      })}
                    >
                      <Popup>
                        <div className="p-2">
                          <h4 className="font-semibold text-yellow-700">{event.description}</h4>
                          <p className="text-xs text-gray-500">Time: {formatTime(event.timestamp)}</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}

            {/* Map overlay info */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                Riyadh, Saudi Arabia
              </h4>
              <p className="text-sm text-gray-600">
                Route restricted to Riyadh city boundaries for safety and compliance.
              </p>
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-6">
              {/* Ride Summary */}
              <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Navigation className="h-5 w-5 text-blue-600 mr-2" />
                  Ride Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Route className="h-4 w-4 mr-2" />
                      Distance
                    </span>
                    <span className="text-sm font-medium text-gray-900">{mockRideData.distance} km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Duration
                    </span>
                    <span className="text-sm font-medium text-gray-900">{formatDuration(mockRideData.duration)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Gauge className="h-4 w-4 mr-2" />
                      Avg Speed
                    </span>
                    <span className="text-sm font-medium text-gray-900">{mockRideData.averageSpeed} km/h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Gauge className="h-4 w-4 mr-2" />
                      Max Speed
                    </span>
                    <span className="text-sm font-medium text-gray-900">{mockRideData.maxSpeed} km/h</span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 text-green-600 mr-2" />
                  Rider Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm font-medium text-gray-900">{mockRideData.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">User ID:</span>
                    <span className="text-sm font-medium text-gray-900">{mockRideData.userId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Scooter ID:</span>
                    <span className="text-sm font-medium text-gray-900">{mockRideData.scooterId}</span>
                  </div>
                </div>
              </div>

              {/* Route Details */}
              <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                  Route Details
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-gray-900">Start Location</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-5">{mockRideData.startLocation.address}</p>
                    <p className="text-xs text-gray-500 ml-5">
                      {new Date(mockRideData.startTime).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-gray-900">End Location</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-5">{mockRideData.endLocation.address}</p>
                    <p className="text-xs text-gray-500 ml-5">
                      {new Date(mockRideData.endTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Events Timeline */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 text-orange-600 mr-2" />
                  Events Timeline
                </h4>
                <div className="space-y-3">
                  {mockRideData.events.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        event.type === 'ride_start' ? 'bg-green-500' :
                        event.type === 'ride_end' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.description}</p>
                        <p className="text-xs text-gray-500">{formatTime(event.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

RideRouteMap.propTypes = {
  bookingId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RideRouteMap;
