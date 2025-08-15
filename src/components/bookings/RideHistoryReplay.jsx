// src/components/bookings/RideHistoryReplay.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Add CSS for pulse animation
const pulseStyle = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
  .custom-marker div {
    animation: pulse 2s infinite;
  }
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = pulseStyle;
  document.head.appendChild(style);
}
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  MapPin,
  Clock,
  Battery,
  Gauge,
  Calendar,
  User,
  Route,
  XCircle,
} from "lucide-react";
import PropTypes from "prop-types";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for different marker types
const createCustomIcon = (color, type) => {
  const iconHtml = type === 'current'
    ? `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); animation: pulse 2s infinite;"></div>`
    : `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 2px rgba(0,0,0,0.3);"></div>`;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Component to update map view based on current position
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

const RideHistoryReplay = ({ bookingId, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock ride data with Riyadh coordinates
  const rideData = {
    id: bookingId || "BOOK-001",
    userId: "USER-789",
    userName: "John Doe",
    scooterId: "SCOOT-123",
    startTime: "2024-01-15T10:30:00Z",
    endTime: "2024-01-15T11:15:00Z",
    duration: 45,
    distance: 8.5,
    startLocation: { lat: 24.7136, lng: 46.6753, address: "King Fahd Road, Riyadh" },
    endLocation: { lat: 24.6877, lng: 46.7219, address: "Al Faisaliyah Center, Riyadh" },
    route: [
      { lat: 24.7136, lng: 46.6753, timestamp: 0, speed: 0, battery: 85, location: "King Fahd Road" },
      { lat: 24.7120, lng: 46.6780, timestamp: 120, speed: 15, battery: 84, location: "Al Olaya District" },
      { lat: 24.7100, lng: 46.6820, timestamp: 240, speed: 18, battery: 82, location: "Business District" },
      { lat: 24.7050, lng: 46.6900, timestamp: 360, speed: 20, battery: 80, location: "King Abdul Aziz Road" },
      { lat: 24.7000, lng: 46.7000, timestamp: 480, speed: 22, battery: 78, location: "Al Malaz District" },
      { lat: 24.6950, lng: 46.7100, timestamp: 600, speed: 19, battery: 76, location: "Al Murabba" },
      { lat: 24.6900, lng: 46.7150, timestamp: 660, speed: 16, battery: 75, location: "Downtown Riyadh" },
      { lat: 24.6877, lng: 46.7219, timestamp: 720, speed: 0, battery: 74, location: "Al Faisaliyah Center" },
    ],
    events: [
      { timestamp: 0, type: "ride_start", description: "Ride started", location: "King Fahd Road", lat: 24.7136, lng: 46.6753 },
      { timestamp: 180, type: "speed_warning", description: "Speed limit exceeded (25 km/h)", speed: 25, lat: 24.7120, lng: 46.6780 },
      { timestamp: 300, type: "battery_low", description: "Battery below 80%", battery: 79, lat: 24.7100, lng: 46.6820 },
      { timestamp: 450, type: "pause", description: "Ride paused at traffic light", duration: 30, lat: 24.7000, lng: 46.7000 },
      { timestamp: 480, type: "resume", description: "Ride resumed", lat: 24.7000, lng: 46.7000 },
      { timestamp: 600, type: "speed_zone", description: "Entered slow speed zone", lat: 24.6950, lng: 46.7100 },
      { timestamp: 720, type: "ride_end", description: "Ride completed", location: "Al Faisaliyah Center", lat: 24.6877, lng: 46.7219 },
    ],
  };

  const totalDuration = rideData.route[rideData.route.length - 1].timestamp;

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + (playbackSpeed * 10);
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalDuration]);

  const getCurrentPosition = () => {
    const route = rideData.route;
    for (let i = 0; i < route.length - 1; i++) {
      if (currentTime >= route[i].timestamp && currentTime <= route[i + 1].timestamp) {
        const progress = (currentTime - route[i].timestamp) / (route[i + 1].timestamp - route[i].timestamp);
        return {
          lat: route[i].lat + (route[i + 1].lat - route[i].lat) * progress,
          lng: route[i].lng + (route[i + 1].lng - route[i].lng) * progress,
          speed: route[i].speed + (route[i + 1].speed - route[i].speed) * progress,
          battery: route[i].battery + (route[i + 1].battery - route[i].battery) * progress,
        };
      }
    }
    return route[0];
  };

  const getCurrentEvents = () => {
    return rideData.events.filter(event => 
      Math.abs(event.timestamp - currentTime) <= 10
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPosition = getCurrentPosition();
  const currentEvents = getCurrentEvents();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Ride History Replay</h3>
              <p className="text-gray-600 mt-1">Booking ID: {rideData.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[70vh]">
          {/* Interactive Map Area */}
          <div className="flex-1 relative">
            <MapContainer
              center={[currentPosition.lat, currentPosition.lng]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              <MapUpdater center={[currentPosition.lat, currentPosition.lng]} zoom={13} />

              {/* Route Polyline */}
              <Polyline
                positions={rideData.route.map(point => [point.lat, point.lng])}
                color="#3B82F6"
                weight={4}
                opacity={0.7}
              />

              {/* Completed Route (up to current time) */}
              <Polyline
                positions={rideData.route
                  .filter(point => point.timestamp <= currentTime)
                  .map(point => [point.lat, point.lng])}
                color="#10B981"
                weight={6}
                opacity={0.9}
              />

              {/* Start Marker */}
              <Marker
                position={[rideData.startLocation.lat, rideData.startLocation.lng]}
                icon={createCustomIcon('#10B981', 'start')}
              >
                <Popup>
                  <div className="text-center">
                    <h4 className="font-semibold text-green-600">Ride Start</h4>
                    <p className="text-sm">{rideData.startLocation.address}</p>
                    <p className="text-xs text-gray-500">{new Date(rideData.startTime).toLocaleTimeString()}</p>
                  </div>
                </Popup>
              </Marker>

              {/* End Marker */}
              <Marker
                position={[rideData.endLocation.lat, rideData.endLocation.lng]}
                icon={createCustomIcon('#EF4444', 'end')}
              >
                <Popup>
                  <div className="text-center">
                    <h4 className="font-semibold text-red-600">Ride End</h4>
                    <p className="text-sm">{rideData.endLocation.address}</p>
                    <p className="text-xs text-gray-500">{new Date(rideData.endTime).toLocaleTimeString()}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Current Position Marker */}
              <Marker
                position={[currentPosition.lat, currentPosition.lng]}
                icon={createCustomIcon('#3B82F6', 'current')}
              >
                <Popup>
                  <div className="text-center">
                    <h4 className="font-semibold text-blue-600">Current Position</h4>
                    <p className="text-sm">Speed: {currentPosition.speed.toFixed(1)} km/h</p>
                    <p className="text-sm">Battery: {currentPosition.battery.toFixed(0)}%</p>
                    <p className="text-xs text-gray-500">
                      {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
                    </p>
                  </div>
                </Popup>
              </Marker>

              {/* Event Markers */}
              {rideData.events.filter(event => event.lat && event.lng).map((event, index) => (
                <Marker
                  key={index}
                  position={[event.lat, event.lng]}
                  icon={createCustomIcon(
                    event.type === 'ride_start' ? '#10B981' :
                    event.type === 'ride_end' ? '#EF4444' :
                    event.type === 'speed_warning' ? '#F59E0B' :
                    event.type === 'battery_low' ? '#EAB308' :
                    '#8B5CF6',
                    'event'
                  )}
                >
                  <Popup>
                    <div className="text-center">
                      <h4 className="font-semibold">{event.description}</h4>
                      <p className="text-sm">{event.location}</p>
                      <p className="text-xs text-gray-500">
                        Time: {formatTime(event.timestamp)}
                      </p>
                      {event.speed && <p className="text-xs">Speed: {event.speed} km/h</p>}
                      {event.battery && <p className="text-xs">Battery: {event.battery}%</p>}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Current Events Overlay */}
            {currentEvents.length > 0 && (
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10">
                <h4 className="font-medium text-gray-900 mb-2">Current Events</h4>
                {currentEvents.map((event, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      event.type === 'ride_start' ? 'bg-green-500' :
                      event.type === 'ride_end' ? 'bg-red-500' :
                      event.type === 'speed_warning' ? 'bg-orange-500' :
                      event.type === 'battery_low' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <span className="text-sm text-gray-700">{event.description}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Real-time Stats */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <Gauge className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Speed</p>
                  <p className="text-lg font-bold text-gray-900">{currentPosition.speed.toFixed(1)} km/h</p>
                </div>
                <div className="text-center">
                  <Battery className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Battery</p>
                  <p className="text-lg font-bold text-gray-900">{currentPosition.battery.toFixed(0)}%</p>
                </div>
              </div>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
              <h5 className="text-sm font-semibold text-gray-800 mb-2">Legend</h5>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">Start/End</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-600">Current Position</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-green-500"></div>
                  <span className="text-xs text-gray-600">Completed Route</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-blue-400"></div>
                  <span className="text-xs text-gray-600">Full Route</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              {/* Ride Info */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Ride Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">User:</span>
                    <span className="text-sm font-medium text-gray-900">{rideData.userName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Scooter:</span>
                    <span className="text-sm font-medium text-gray-900">{rideData.scooterId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium text-gray-900">{rideData.duration} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Distance:</span>
                    <span className="text-sm font-medium text-gray-900">{rideData.distance} km</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Event Timeline</h4>
                <div className="space-y-3">
                  {rideData.events.map((event, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 p-2 rounded cursor-pointer transition-colors ${
                        Math.abs(event.timestamp - currentTime) <= 10
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentTime(event.timestamp)}
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        event.type === 'ride_start' ? 'bg-green-500' :
                        event.type === 'ride_end' ? 'bg-red-500' :
                        event.type === 'speed_warning' ? 'bg-orange-500' :
                        event.type === 'battery_low' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.description}</p>
                        <p className="text-xs text-gray-500">{formatTime(event.timestamp)}</p>
                        {event.location && (
                          <p className="text-xs text-gray-500">{event.location}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            {/* Playback Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentTime(0)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Reset"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Speed:</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="text-sm border border-gray-200 rounded px-2 py-1"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                </select>
              </div>
            </div>

            {/* Time Display */}
            <div className="text-sm text-gray-600">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="relative">
              <input
                type="range"
                min="0"
                max={totalDuration}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              
              {/* Event Markers */}
              {rideData.events.map((event, index) => (
                <div
                  key={index}
                  className="absolute top-0 w-1 h-2 bg-red-500 rounded"
                  style={{ left: `${(event.timestamp / totalDuration) * 100}%` }}
                  title={event.description}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

RideHistoryReplay.propTypes = {
  bookingId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RideHistoryReplay;
