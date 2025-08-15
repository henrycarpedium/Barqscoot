import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Battery, Navigation, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const VehicleLocationMap = ({ vehicles = [], onVehicleSelect }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Sample vehicle data for Riyadh (if no vehicles provided)
  const defaultVehicles = [
    {
      id: 1,
      name: "Test-Scooter-001",
      lat: 24.7118,
      lng: 46.6747,
      status: "available",
      battery: 100,
      lastUpdate: "2024-01-20T10:30:00Z",
      location: "Kingdom Centre Tower",
      station: "RYD-001"
    },
    {
      id: 2,
      name: "Scooter-002",
      lat: 24.7200,
      lng: 46.6800,
      status: "in-use",
      battery: 85,
      lastUpdate: "2024-01-20T10:25:00Z",
      location: "Olaya District",
      station: "RYD-002"
    },
    {
      id: 3,
      name: "Scooter-003",
      lat: 24.7100,
      lng: 46.6700,
      status: "available",
      battery: 67,
      lastUpdate: "2024-01-20T10:20:00Z",
      location: "Al Malaz District",
      station: "RYD-003"
    },
    {
      id: 4,
      name: "Scooter-004",
      lat: 24.7180,
      lng: 46.6850,
      status: "maintenance",
      battery: 45,
      lastUpdate: "2024-01-20T09:15:00Z",
      location: "Diplomatic Quarter",
      station: "RYD-004"
    },
    {
      id: 5,
      name: "Scooter-005",
      lat: 24.7050,
      lng: 46.6650,
      status: "available",
      battery: 92,
      lastUpdate: "2024-01-20T10:35:00Z",
      location: "King Fahd Road",
      station: "RYD-005"
    },
    {
      id: 6,
      name: "Scooter-006",
      lat: 24.7250,
      lng: 46.6900,
      status: "offline",
      battery: 12,
      lastUpdate: "2024-01-20T08:45:00Z",
      location: "Al Nakheel District",
      station: "RYD-006"
    }
  ];

  const vehicleData = vehicles.length > 0 ? vehicles : defaultVehicles;

  const getStatusColor = (status) => {
    const colors = {
      available: "text-green-600 bg-green-100",
      "in-use": "text-blue-600 bg-blue-100",
      maintenance: "text-red-600 bg-red-100",
      offline: "text-gray-600 bg-gray-100",
    };
    return colors[status] || colors.offline;
  };

  const getBatteryColor = (level) => {
    if (level > 60) return "text-green-600";
    if (level > 30) return "text-yellow-600";
    return "text-red-600";
  };

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    if (onVehicleSelect) {
      onVehicleSelect(vehicle);
    }
  };

  const getStatusStats = () => {
    const stats = vehicleData.reduce((acc, vehicle) => {
      acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: vehicleData.length,
      available: stats.available || 0,
      inUse: stats['in-use'] || 0,
      maintenance: stats.maintenance || 0,
      offline: stats.offline || 0
    };
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Fleet Location Map</h2>
            <p className="text-gray-600">Real-time vehicle tracking in Riyadh</p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <div className="text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.inUse}</div>
              <div className="text-gray-600">In Use</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.maintenance}</div>
              <div className="text-gray-600">Maintenance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.offline}</div>
              <div className="text-gray-600">Offline</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>In Use</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Offline</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-96">
          <MapContainer
            center={[24.7136, 46.6753]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {vehicleData.map((vehicle) => (
              <Marker
                key={vehicle.id}
                position={[vehicle.lat, vehicle.lng]}
                eventHandlers={{
                  click: () => handleVehicleClick(vehicle),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-48">
                    <div className="font-semibold text-gray-900 mb-2">
                      {vehicle.name}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-gray-900">{vehicle.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Station:</span>
                        <span className="text-gray-900">{vehicle.station}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Battery:</span>
                        <span className={`font-medium ${getBatteryColor(vehicle.battery)}`}>
                          {vehicle.battery}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Last Update:</span>
                        <span className="text-gray-900">
                          {new Date(vehicle.lastUpdate).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Selected Vehicle Details */}
      {selectedVehicle && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Selected Vehicle Details</h3>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Vehicle ID</div>
              <div className="font-medium text-gray-900">{selectedVehicle.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Status</div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedVehicle.status)}`}>
                {selectedVehicle.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Battery Level</div>
              <div className={`font-medium ${getBatteryColor(selectedVehicle.battery)}`}>
                {selectedVehicle.battery}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Location</div>
              <div className="font-medium text-gray-900">{selectedVehicle.location}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Station: {selectedVehicle.station}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Last Update: {new Date(selectedVehicle.lastUpdate).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleLocationMap;
