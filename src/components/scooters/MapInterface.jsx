import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Battery } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Content component that can be reused
const MapInterfaceContent = ({
  vehicleLocations,
  riyadhStations,
  selectedLocation,
  handleLocationSelect,
  handleStationSelect,
  getStatusColor,
  getBatteryColor,
  setSelectedLocation,
  isStationMode
}) => (
  <div className="space-y-6">
    {/* Map Container */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Vehicle Locations</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>In Use</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Maintenance</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>Offline</span>
            </div>
          </div>
        </div>
      </div>

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

          {/* Vehicle Markers */}
          {vehicleLocations.map((vehicle) => (
            <Marker
              key={vehicle.id}
              position={[vehicle.lat, vehicle.lng]}
              eventHandlers={{
                click: () => handleLocationSelect(vehicle),
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
                      <span className="text-gray-900">{vehicle.displayLocation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Station:</span>
                      <span className="text-gray-900">{vehicle.lastStation}</span>
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
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>

    {/* Vehicle List */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Vehicle Summary</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicleLocations.map((vehicle) => (
            <div
              key={vehicle.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleLocationSelect(vehicle)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{vehicle.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{vehicle.displayLocation}</span>
                </div>
                <div className="flex items-center">
                  <Battery className={`w-4 h-4 mr-2 ${getBatteryColor(vehicle.battery)}`} />
                  <span>{vehicle.battery}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Selected Vehicle Details */}
    {selectedLocation && setSelectedLocation && (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Selected Vehicle Details</h3>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Vehicle ID</div>
              <div className="font-medium text-gray-900">{selectedLocation.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Status</div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedLocation.status)}`}>
                {selectedLocation.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-sm text-gray-600">Location</div>
              <div className="font-medium text-gray-900">{selectedLocation.displayLocation}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Battery</div>
              <div className={`font-medium ${getBatteryColor(selectedLocation.battery)}`}>
                {selectedLocation.battery}%
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Available Stations */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Available Stations</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {riyadhStations.map((station) => (
            <div
              key={station.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-teal-300"
              onClick={() => {
                if (isStationMode && handleStationSelect) {
                  handleStationSelect(station);
                } else if (handleLocationSelect) {
                  handleLocationSelect(station);
                }
              }}
            >
              <div className="font-medium text-gray-900 mb-1">{station.name}</div>
              <div className="text-sm text-gray-600 mb-2">{station.address}</div>
              <div className="text-xs text-gray-500 font-mono">{station.coords}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MapInterface = ({
  onLocationSelect,
  onClose,
  isStationMode = false
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Handle location selection for form mode
  const handleLocationSelect = (location) => {
    if (onLocationSelect) {
      if (isStationMode) {
        // For station mode, use the station ID or lastStation
        onLocationSelect(location.id || location.lastStation);
      } else {
        onLocationSelect(`${location.lat},${location.lng}`);
      }
      if (onClose) onClose();
    } else {
      setSelectedLocation(location);
    }
  };

  // Handle station selection specifically
  const handleStationSelect = (station) => {
    if (onLocationSelect) {
      onLocationSelect(station.id);
      if (onClose) onClose();
    }
  };

  // Sample vehicle locations in Riyadh (frontend display only - backend data unchanged)
  const vehicleLocations = [
    {
      id: 1,
      lat: 24.7118,
      lng: 46.6747,
      name: "Test-Scooter-001",
      status: "available",
      battery: 100,
      lastStation: "RYD-001 (Kingdom Centre)",
      displayLocation: "Kingdom Centre Tower"
    },
    {
      id: 2,
      lat: 24.7200,
      lng: 46.6800,
      name: "Scooter-002",
      status: "in-use",
      battery: 85,
      lastStation: "RYD-002 (Olaya District)",
      displayLocation: "Olaya District"
    },
    {
      id: 3,
      lat: 24.7100,
      lng: 46.6700,
      name: "Scooter-003",
      status: "available",
      battery: 67,
      lastStation: "RYD-003 (Al Malaz)",
      displayLocation: "Al Malaz District"
    },
    {
      id: 4,
      lat: 24.7180,
      lng: 46.6850,
      name: "Scooter-004",
      status: "maintenance",
      battery: 45,
      lastStation: "RYD-004 (Diplomatic Quarter)",
      displayLocation: "Diplomatic Quarter"
    },
    {
      id: 5,
      lat: 24.7050,
      lng: 46.6650,
      name: "Scooter-005",
      status: "available",
      battery: 92,
      lastStation: "RYD-005 (King Fahd Road)",
      displayLocation: "King Fahd Road"
    },
    {
      id: 6,
      lat: 24.7250,
      lng: 46.6900,
      name: "Scooter-006",
      status: "offline",
      battery: 12,
      lastStation: "RYD-006 (Al Nakheel)",
      displayLocation: "Al Nakheel District"
    },
  ];

  // Helper functions for status styling
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

  // Sample Riyadh stations for location selection (frontend display only)
  const riyadhStations = [
    {
      name: "Kingdom Centre Station",
      coords: "24.7118,46.6747",
      address: "Kingdom Centre Station, Riyadh",
      id: "RYD-001",
    },
    {
      name: "Olaya District Station",
      coords: "24.7200,46.6800",
      address: "Olaya District Station, Riyadh",
      id: "RYD-002",
    },
    {
      name: "Al Malaz Station",
      coords: "24.7100,46.6700",
      address: "Al Malaz Station, Riyadh",
      id: "RYD-003",
    },
    {
      name: "Diplomatic Quarter Station",
      coords: "24.7180,46.6850",
      address: "Diplomatic Quarter Station, Riyadh",
      id: "RYD-004",
    },
    {
      name: "King Fahd Road Station",
      coords: "24.7050,46.6650",
      address: "King Fahd Road Station, Riyadh",
      id: "RYD-005",
    },
    {
      name: "Al Nakheel Station",
      coords: "24.7250,46.6900",
      address: "Al Nakheel Station, Riyadh",
      id: "RYD-006",
    },
  ];

  // If used as modal (in form), wrap with modal overlay
  if (onClose) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {isStationMode ? 'Select Station' : 'Select Location'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="p-4">
            <MapInterfaceContent
              vehicleLocations={vehicleLocations}
              riyadhStations={riyadhStations}
              selectedLocation={selectedLocation}
              handleLocationSelect={handleLocationSelect}
              handleStationSelect={handleStationSelect}
              getStatusColor={getStatusColor}
              getBatteryColor={getBatteryColor}
              setSelectedLocation={null}
              isStationMode={isStationMode}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Fleet Map - Riyadh</h2>
        <p className="text-gray-600">Real-time vehicle locations across Riyadh</p>
      </div>

      <MapInterfaceContent
        vehicleLocations={vehicleLocations}
        riyadhStations={riyadhStations}
        selectedLocation={selectedLocation}
        handleLocationSelect={handleLocationSelect}
        handleStationSelect={handleStationSelect}
        getStatusColor={getStatusColor}
        getBatteryColor={getBatteryColor}
        setSelectedLocation={setSelectedLocation}
        isStationMode={isStationMode}
      />
    </div>
  );
};

export default MapInterface;
