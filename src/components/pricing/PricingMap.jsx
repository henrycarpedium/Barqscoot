// src/components/pricing/PricingMap.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Zap,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  Settings,
  RefreshCw,
  Maximize,
  Filter,
  Lock,
  Layers,
  Navigation,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pricingService } from "../../services/pricingApi";
import { mapsService } from "../../services/mapsService";
import { SurgePermissionGuard } from "../common/PermissionGuard";
import { usePermissions } from "../../services/permissionService";
import { MapContainer, TileLayer, Circle, Popup, Marker, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PricingMap = ({ zones, isLoading }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterLevel, setFilterLevel] = useState("all");
  const [scooterLocations, setScooterLocations] = useState({});
  const [mapView, setMapView] = useState('zones'); // 'zones', 'scooters', or 'demand'
  const [mapStyle, setMapStyle] = useState('streets'); // 'streets', 'satellite', 'terrain'
  const [demandView, setDemandView] = useState('zones'); // 'zones', 'heatmap'
  const mapRef = useRef(null);
  const queryClient = useQueryClient();
  const { canManualSurge } = usePermissions();

  // Riyadh center coordinates
  const RIYADH_CENTER = [24.7136, 46.6753];
  const DEFAULT_ZOOM = 11;

  // Manual surge override mutation
  const manualSurgeMutation = useMutation({
    mutationFn: async ({ zoneId, multiplier, duration }) => {
      return await pricingService.manualSurgeOverride(zoneId, multiplier, duration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pricing-zones"]);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600">Loading pricing map...</span>
      </div>
    );
  }

  if (!zones) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
        <p>Unable to load zone data</p>
      </div>
    );
  }

  // Load scooter locations
  useEffect(() => {
    const loadScooters = () => {
      const locations = mapsService.getAllScooterLocations();
      setScooterLocations(locations);
      console.log('🗺️ Scooter locations updated');
    };

    loadScooters();
    // Refresh every 30 seconds
    const interval = setInterval(loadScooters, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickSurge = (zoneId, multiplier) => {
    if (!canManualSurge()) {
      alert('⚠️ You need Admin or Pricing Manager role to control surge pricing.');
      return;
    }

    manualSurgeMutation.mutate({
      zoneId,
      multiplier,
      duration: 60 // 60 minutes
    });
  };

  // Get tile layer URL based on map style
  const getTileLayerUrl = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  // Get zone color based on pricing multiplier
  const getZoneColor = (multiplier, surgeActive) => {
    if (surgeActive) return '#ef4444'; // Red for active surge
    if (multiplier >= 2.0) return '#dc2626'; // Dark red
    if (multiplier >= 1.5) return '#f59e0b'; // Orange
    if (multiplier >= 1.2) return '#eab308'; // Yellow
    return '#10b981'; // Green
  };

  // Create custom icon for scooters
  const createScooterIcon = (status) => {
    const color = status === 'available' ? '#10b981' :
                  status === 'in_use' ? '#3b82f6' : '#ef4444';

    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-scooter-icon',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  };

  const getDemandColor = (level) => {
    switch (level) {
      case 'very_high': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDemandColorHex = (level) => {
    switch (level) {
      case 'very_high': return '#dc2626'; // Red-600
      case 'high': return '#ef4444'; // Red-500
      case 'medium': return '#eab308'; // Yellow-500
      case 'low': return '#10b981'; // Green-500
      default: return '#6b7280'; // Gray-500
    }
  };

  const getDemandRadius = (level) => {
    switch (level) {
      case 'very_high': return 1000;
      case 'high': return 800;
      case 'medium': return 600;
      case 'low': return 400;
      default: return 300;
    }
  };

  const getDemandOpacity = (level) => {
    switch (level) {
      case 'very_high': return 0.6;
      case 'high': return 0.5;
      case 'medium': return 0.4;
      case 'low': return 0.3;
      default: return 0.2;
    }
  };

  const getZoneColorByMultiplier = (multiplier) => {
    if (multiplier >= 2.0) return '#dc2626'; // Red for high surge
    if (multiplier >= 1.5) return '#f59e0b'; // Orange for medium surge
    if (multiplier >= 1.2) return '#eab308'; // Yellow for low surge
    return '#10b981'; // Green for normal pricing
  };

  const getMultiplierColor = (multiplier) => {
    if (multiplier >= 2.0) return 'border-red-500 bg-red-50';
    if (multiplier >= 1.5) return 'border-orange-500 bg-orange-50';
    if (multiplier >= 1.2) return 'border-yellow-500 bg-yellow-50';
    return 'border-green-500 bg-green-50';
  };

  const filteredZones = zones.filter(zone => {
    if (filterLevel === "all") return true;
    return zone.demandLevel === filterLevel;
  });

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800">Live Pricing Map</h2>
          <button
            onClick={() => queryClient.invalidateQueries(["pricing-zones"])}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Maximize className="h-4 w-4 mr-2" />
            Fullscreen
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by demand:</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Zones</option>
              <option value="very_high">Very High Demand</option>
              <option value="high">High Demand</option>
              <option value="medium">Medium Demand</option>
              <option value="low">Low Demand</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Map Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Low Demand (1.0x - 1.2x)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Medium Demand (1.2x - 1.5x)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>High Demand (1.5x - 2.0x)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded animate-pulse"></div>
            <span>Very High Demand (2.0x+)</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Map Controls */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900">Live Map View</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMapView('zones')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    mapView === 'zones'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Pricing Zones
                </button>
                <button
                  onClick={() => setMapView('demand')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    mapView === 'demand'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Demand Areas
                </button>
                <button
                  onClick={() => setMapView('scooters')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    mapView === 'scooters'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Live Scooters
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="relative bg-gray-100 h-[500px]">
          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMapStyle(mapStyle === 'streets' ? 'satellite' : mapStyle === 'satellite' ? 'terrain' : 'streets')}
              className="bg-white rounded-lg p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              title={`Switch to ${mapStyle === 'streets' ? 'Satellite' : mapStyle === 'satellite' ? 'Terrain' : 'Streets'} View`}
            >
              <Layers className="w-5 h-5 text-gray-600" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => mapRef.current?.setView(RIYADH_CENTER, DEFAULT_ZOOM)}
              className="bg-white rounded-lg p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Reset View"
            >
              <Navigation className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg p-3 shadow-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              {mapView === 'demand' ? '🔥 Demand Areas' : '🗺️ Interactive Geofencing Map'}
            </h4>
            <div className="space-y-1 text-xs">
              {mapView === 'demand' ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Low Demand</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Medium Demand</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>High Demand</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                    <span>Very High Demand</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Allowed (1.0x - 1.2x)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Restricted (1.2x - 1.5x)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>No-Ride (2.0x+)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Parking Only</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Live Data Indicator */}
          <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg p-2 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-700">Live Data</span>
            </div>
          </div>

          {/* Conditional Map Content */}
          <div className="relative h-full">
            {mapView === 'zones' ? (
              // Real Interactive Leaflet Map
              <MapContainer
                center={RIYADH_CENTER}
                zoom={DEFAULT_ZOOM}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
                className="rounded-lg"
              >
                <TileLayer
                  url={getTileLayerUrl()}
                  attribution={mapStyle === 'satellite' ?
                    '&copy; <a href="https://www.esri.com/">Esri</a>' :
                    mapStyle === 'terrain' ?
                    '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>' :
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  }
                />

                {/* Zone Circles */}
                {filteredZones?.map((zone) => {
                  const zoneData = mapsService.getZoneById(zone.id);
                  if (!zoneData) return null;

                  const color = getZoneColor(zone.currentMultiplier, zone.surgeActive);
                  const radius = zone.demandLevel === 'high' ? 800 :
                               zone.demandLevel === 'medium' ? 600 : 400;

                  return (
                    <Circle
                      key={zone.id}
                      center={zoneData.center}
                      radius={radius}
                      pathOptions={{
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.3,
                        weight: 3,
                        opacity: zone.surgeActive ? 1 : 0.7
                      }}
                      eventHandlers={{
                        click: () => setSelectedZone(zone)
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                          <p className="text-sm text-gray-600">{zone.nameAr}</p>
                          <div className="mt-2 space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Price:</span>
                              <span className="font-medium">{(zone.basePrice * zone.currentMultiplier).toFixed(2)} SAR</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Multiplier:</span>
                              <span className="font-medium">{zone.currentMultiplier}x</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Demand:</span>
                              <span className={`font-medium capitalize ${
                                zone.demandLevel === 'high' ? 'text-red-600' :
                                zone.demandLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {zone.demandLevel}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Temperature:</span>
                              <span className="font-medium">{zone.temperature}°C</span>
                            </div>
                            {zone.surgeActive && (
                              <div className="text-red-600 font-medium text-center mt-1">
                                ⚡ SURGE ACTIVE
                              </div>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </Circle>
                  );
                })}

                {/* Zone Boundaries as Polygons */}
                {filteredZones?.map((zone) => {
                  const zoneData = mapsService.getZoneById(zone.id);
                  if (!zoneData) return null;

                  // Create polygon from bounds
                  const [[swLat, swLng], [neLat, neLng]] = zoneData.bounds;
                  const polygonCoords = [
                    [swLat, swLng],
                    [swLat, neLng],
                    [neLat, neLng],
                    [neLat, swLng]
                  ];

                  const color = getZoneColor(zone.currentMultiplier, zone.surgeActive);

                  return (
                    <Polygon
                      key={`${zone.id}-boundary`}
                      positions={polygonCoords}
                      pathOptions={{
                        color: color,
                        weight: 2,
                        opacity: 0.8,
                        fillOpacity: 0.1,
                        dashArray: zone.surgeActive ? '10, 5' : undefined
                      }}
                    />
                  );
                })}
              </MapContainer>
            ) : mapView === 'demand' ? (
              // Demand Areas View - Enhanced Demand Visualization
              <MapContainer
                center={RIYADH_CENTER}
                zoom={DEFAULT_ZOOM}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
                className="rounded-lg"
              >
                <TileLayer
                  url={getTileLayerUrl()}
                  attribution={mapStyle === 'satellite' ?
                    '&copy; <a href="https://www.esri.com/">Esri</a>' :
                    mapStyle === 'terrain' ?
                    '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>' :
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  }
                />

                {/* Enhanced Demand Circles with Animation */}
                {filteredZones?.map((zone) => {
                  const zoneData = mapsService.getZoneById(zone.id);
                  if (!zoneData) return null;

                  const demandColor = getDemandColorHex(zone.demandLevel);
                  const radius = getDemandRadius(zone.demandLevel);
                  const opacity = getDemandOpacity(zone.demandLevel);

                  return (
                    <Circle
                      key={`${zone.id}-demand`}
                      center={zoneData.center}
                      radius={radius}
                      pathOptions={{
                        color: demandColor,
                        fillColor: demandColor,
                        fillOpacity: opacity,
                        weight: zone.demandLevel === 'very_high' ? 4 : 3,
                        opacity: zone.demandLevel === 'very_high' ? 1 : 0.8,
                        className: zone.demandLevel === 'very_high' ? 'animate-pulse' : ''
                      }}
                      eventHandlers={{
                        click: () => setSelectedZone(zone)
                      }}
                    >
                      <Popup>
                        <div className="p-3">
                          <h3 className="font-semibold text-gray-900 mb-2">{zone.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{zone.nameAr}</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Demand Level:</span>
                              <span className={`font-bold capitalize ${
                                zone.demandLevel === 'very_high' ? 'text-red-600' :
                                zone.demandLevel === 'high' ? 'text-red-500' :
                                zone.demandLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {zone.demandLevel.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Active Rides:</span>
                              <span className="font-medium">{zone.activeRides}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Available Scooters:</span>
                              <span className="font-medium">{zone.availableScooters}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Demand Ratio:</span>
                              <span className="font-medium">
                                {(zone.activeRides / Math.max(zone.availableScooters, 1)).toFixed(2)}:1
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Current Price:</span>
                              <span className="font-medium">{(zone.basePrice * zone.currentMultiplier).toFixed(2)} SAR</span>
                            </div>
                            {zone.demandLevel === 'very_high' && (
                              <div className="text-red-600 font-bold text-center mt-2 animate-pulse">
                                🔥 VERY HIGH DEMAND
                              </div>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </Circle>
                  );
                })}

                {/* Zone Boundaries (Very Light) */}
                {filteredZones?.map((zone) => {
                  const zoneData = mapsService.getZoneById(zone.id);
                  if (!zoneData) return null;

                  const [[swLat, swLng], [neLat, neLng]] = zoneData.bounds;
                  const polygonCoords = [
                    [swLat, swLng],
                    [swLat, neLng],
                    [neLat, neLng],
                    [neLat, swLng]
                  ];

                  return (
                    <Polygon
                      key={`${zone.id}-demand-boundary`}
                      positions={polygonCoords}
                      pathOptions={{
                        color: '#9ca3af',
                        weight: 1,
                        opacity: 0.2,
                        fillOpacity: 0,
                        dashArray: '2, 4'
                      }}
                    />
                  );
                })}
              </MapContainer>
            ) : (
              // Scooter View - Real Map with Scooter Markers
              <MapContainer
                center={RIYADH_CENTER}
                zoom={DEFAULT_ZOOM}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
                className="rounded-lg"
              >
                <TileLayer
                  url={getTileLayerUrl()}
                  attribution={mapStyle === 'satellite' ?
                    '&copy; <a href="https://www.esri.com/">Esri</a>' :
                    mapStyle === 'terrain' ?
                    '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>' :
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  }
                />

                {/* Zone Boundaries (Light) */}
                {filteredZones?.map((zone) => {
                  const zoneData = mapsService.getZoneById(zone.id);
                  if (!zoneData) return null;

                  const [[swLat, swLng], [neLat, neLng]] = zoneData.bounds;
                  const polygonCoords = [
                    [swLat, swLng],
                    [swLat, neLng],
                    [neLat, neLng],
                    [neLat, swLng]
                  ];

                  return (
                    <Polygon
                      key={`${zone.id}-boundary-light`}
                      positions={polygonCoords}
                      pathOptions={{
                        color: '#6b7280',
                        weight: 1,
                        opacity: 0.3,
                        fillOpacity: 0.05,
                        dashArray: '5, 5'
                      }}
                    />
                  );
                })}

                {/* Scooter Markers */}
                {Object.entries(scooterLocations).map(([zoneId, scooters]) =>
                  scooters.map((scooter) => (
                    <Marker
                      key={scooter.id}
                      position={scooter.position}
                      icon={createScooterIcon(scooter.status)}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-gray-900">Scooter {scooter.id.split('-').pop()}</h3>
                          <div className="mt-2 space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <span className={`font-medium capitalize ${
                                scooter.status === 'available' ? 'text-green-600' :
                                scooter.status === 'in_use' ? 'text-blue-600' : 'text-red-600'
                              }`}>
                                {scooter.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Battery:</span>
                              <span className={`font-medium ${
                                scooter.battery > 50 ? 'text-green-600' :
                                scooter.battery > 20 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {scooter.battery}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Zone:</span>
                              <span className="font-medium">{zoneId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Location:</span>
                              <span className="font-medium text-xs">
                                {scooter.position[0].toFixed(4)}, {scooter.position[1].toFixed(4)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))
                )}
              </MapContainer>
            )}
          </div>
        </div>
      </div>

      {/* Zone Details Panel */}
      {selectedZone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedZone.name}</h3>
              <p className="text-sm text-gray-500">{selectedZone.nameAr}</p>
              <p className="text-xs text-gray-600">{selectedZone.id} • {selectedZone.city}</p>
            </div>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {(selectedZone.basePrice * selectedZone.currentMultiplier).toFixed(2)} SAR
              </div>
              <div className="text-xs text-gray-600">Current Price</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {selectedZone.currentMultiplier}x
              </div>
              <div className="text-xs text-gray-600">Multiplier</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {selectedZone.activeRides}
              </div>
              <div className="text-xs text-gray-600">Active Rides</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {selectedZone.avgWaitTime}m
              </div>
              <div className="text-xs text-gray-600">Avg Wait</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Supply & Demand</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Scooters:</span>
                  <span className="font-medium">{selectedZone.availableScooters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Demand Level:</span>
                  <span className={`font-medium capitalize ${
                    selectedZone.demandLevel === 'very_high' ? 'text-red-700' :
                    selectedZone.demandLevel === 'high' ? 'text-red-600' :
                    selectedZone.demandLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {selectedZone.demandLevel.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Surge Status:</span>
                  <span className={`font-medium ${selectedZone.surgeActive ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedZone.surgeActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className={`font-medium ${
                    selectedZone.temperature >= 45 ? 'text-red-600' :
                    selectedZone.temperature >= 40 ? 'text-orange-600' :
                    selectedZone.temperature >= 35 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {selectedZone.temperature}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weather:</span>
                  <span className="font-medium capitalize">{selectedZone.weatherCondition}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Revenue Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Today's Revenue:</span>
                  <span className="font-medium text-green-600">{selectedZone.revenueToday} SAR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-medium">{selectedZone.basePrice} SAR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue/Ride:</span>
                  <span className="font-medium">
                    {(selectedZone.revenueToday / Math.max(selectedZone.activeRides, 1)).toFixed(2)} SAR
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <SurgePermissionGuard showError={false}>
              <button
                onClick={() => handleQuickSurge(selectedZone.id, selectedZone.surgeActive ? 1.0 : 1.5)}
                disabled={manualSurgeMutation.isLoading}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                  selectedZone.surgeActive
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Zap className="h-4 w-4 mr-2" />
                {selectedZone.surgeActive ? 'Stop Surge' : 'Start Surge'}
              </button>
            </SurgePermissionGuard>

            {!canManualSurge() && (
              <div className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-center">
                🔒 Admin Only
              </div>
            )}

            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PricingMap;
