// src/components/geofencing/GeofencingMap.jsx
import React, { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

const GeofencingMap = ({ zones = [] }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Mock zones data if none provided
  const defaultZones = [
    {
      id: "zone-001",
      name: "King Fahd District",
      nameAr: "حي الملك فهد",
      coordinates: "24.7136, 46.6753",
      radius: 500,
      type: "allowed",
      status: "active",
      rules: {
        maxSpeed: 15,
        parkingAllowed: true,
        ridingAllowed: true,
        timeRestrictions: "24/7"
      }
    },
    {
      id: "zone-002",
      name: "King Saud University",
      nameAr: "جامعة الملك سعود",
      coordinates: "24.7277, 46.6186",
      radius: 300,
      type: "restricted",
      status: "active",
      rules: {
        maxSpeed: 10,
        parkingAllowed: false,
        ridingAllowed: true,
        timeRestrictions: "6 AM - 10 PM"
      }
    },
    {
      id: "zone-003",
      name: "Al Olaya District",
      nameAr: "حي العليا",
      coordinates: "24.6877, 46.6857",
      radius: 400,
      type: "no-ride",
      status: "active",
      rules: {
        maxSpeed: 0,
        parkingAllowed: false,
        ridingAllowed: false,
        timeRestrictions: "Always"
      }
    },
    {
      id: "zone-004",
      name: "Kingdom Centre Mall",
      nameAr: "مركز المملكة التجاري",
      coordinates: "24.7118, 46.6758",
      radius: 200,
      type: "parking-only",
      status: "active",
      rules: {
        maxSpeed: 5,
        parkingAllowed: true,
        ridingAllowed: false,
        timeRestrictions: "24/7"
      }
    }
  ];

  const activeZones = zones.length > 0 ? zones : defaultZones;

  const getZoneColor = (type) => {
    switch (type) {
      case "allowed": return "#10b981"; // Green
      case "restricted": return "#f59e0b"; // Orange
      case "no-ride": return "#dc2626"; // Red
      case "parking-only": return "#3b82f6"; // Blue
      default: return "#6b7280"; // Gray
    }
  };

  const parseCoordinates = (coordString) => {
    const [lat, lng] = coordString.split(',').map(coord => parseFloat(coord.trim()));
    return [lat, lng];
  };

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Dynamically import Leaflet to avoid SSR issues
      Promise.all([
        import('leaflet'),
        import('leaflet/dist/leaflet.css')
      ]).then(([L]) => {
        // Initialize map centered on Riyadh
        const map = L.map(mapRef.current).setView([24.7136, 46.6753], 12);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Store map instance
        mapInstanceRef.current = map;

        // Add zones to map
        const bounds = [];
        activeZones.forEach(zone => {
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
              <div class="p-3 min-w-[200px]">
                <h3 class="font-semibold text-gray-900 mb-2">${zone.name}</h3>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Type:</span>
                    <span class="px-2 py-1 rounded text-xs font-medium" style="background-color: ${color}20; color: ${color}">
                      ${zone.type.replace('-', ' ')}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Radius:</span>
                    <span class="text-gray-900">${zone.radius}m</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Max Speed:</span>
                    <span class="text-gray-900">${zone.rules.maxSpeed} km/h</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Status:</span>
                    <span class="px-2 py-1 rounded text-xs ${zone.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                      ${zone.status}
                    </span>
                  </div>
                  <div class="mt-2 pt-2 border-t border-gray-200">
                    <div class="flex justify-between">
                      <span class="px-2 py-1 rounded text-xs ${zone.rules.parkingAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        Parking ${zone.rules.parkingAllowed ? 'Allowed' : 'Forbidden'}
                      </span>
                    </div>
                    <div class="flex justify-between mt-1">
                      <span class="px-2 py-1 rounded text-xs ${zone.rules.ridingAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        Riding ${zone.rules.ridingAllowed ? 'Allowed' : 'Forbidden'}
                      </span>
                    </div>
                    ${zone.rules.timeRestrictions ? `
                      <div class="mt-1">
                        <span class="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                          ${zone.rules.timeRestrictions}
                        </span>
                      </div>
                    ` : ''}
                  </div>
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
      }).catch(error => {
        console.error('Failed to load map:', error);
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeZones]);

  return (
    <div className="h-96 w-full rounded-lg border border-gray-200 overflow-hidden" style={{ minHeight: '400px' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} className="rounded-lg">
        {/* Fallback content while map loads */}
        <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Interactive Map...</h3>
            <p className="text-gray-600">
              Visual representation of all geofencing zones with real-time data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeofencingMap;
