// Simple maps service for Saudi Arabia zones

// Saudi zone boundaries (Riyadh area)
const SAUDI_ZONES = {
  'zone-001': {
    id: 'zone-001',
    name: 'King Fahd District',
    nameAr: 'حي الملك فهد',
    center: [24.7136, 46.6753],
    bounds: [[24.7000, 46.6600], [24.7272, 46.6906]]
  },
  'zone-002': {
    id: 'zone-002',
    name: 'King Saud University',
    nameAr: 'جامعة الملك سعود',
    center: [24.7277, 46.6186],
    bounds: [[24.7207, 46.6126], [24.7347, 46.6246]]
  },
  'zone-003': {
    id: 'zone-003',
    name: 'Al Olaya District',
    nameAr: 'حي العليا',
    center: [24.6877, 46.6857],
    bounds: [[24.6807, 46.6797], [24.6947, 46.6917]]
  },
  'zone-004': {
    id: 'zone-004',
    name: 'Kingdom Centre Mall',
    nameAr: 'مركز المملكة التجاري',
    center: [24.7118, 46.6758],
    bounds: [[24.7048, 46.6698], [24.7188, 46.6818]]
  },
  'zone-005': {
    id: 'zone-005',
    name: 'King Khalid Airport',
    nameAr: 'مطار الملك خالد الدولي',
    center: [24.9576, 46.6988],
    bounds: [[24.9486, 46.6928], [24.9666, 46.7048]]
  }
};

// Generate mock scooter locations
const generateScooterLocations = (zoneId, count = 8) => {
  const zone = SAUDI_ZONES[zoneId];
  if (!zone) return [];

  const scooters = [];
  const [swLat, swLng] = zone.bounds[0];
  const [neLat, neLng] = zone.bounds[1];

  for (let i = 0; i < count; i++) {
    const lat = swLat + Math.random() * (neLat - swLat);
    const lng = swLng + Math.random() * (neLng - swLng);

    scooters.push({
      id: `scooter-${zoneId}-${i + 1}`,
      position: [lat, lng],
      status: Math.random() > 0.3 ? 'available' : Math.random() > 0.5 ? 'in_use' : 'maintenance',
      battery: Math.floor(Math.random() * 100),
      zoneId
    });
  }

  return scooters;
};

// Get all scooter locations
const getAllScooterLocations = () => {
  const allScooters = {};

  Object.keys(SAUDI_ZONES).forEach(zoneId => {
    allScooters[zoneId] = generateScooterLocations(zoneId, Math.floor(Math.random() * 10) + 5);
  });

  return allScooters;
};

// Get zone boundaries
const getZoneBoundaries = () => {
  return Object.values(SAUDI_ZONES);
};

// Get zone by ID
const getZoneById = (zoneId) => {
  return SAUDI_ZONES[zoneId] || null;
};

// Get zone color based on pricing
const getZoneColor = (zone, pricingData) => {
  if (!pricingData) return '#10b981'; // Green

  const multiplier = pricingData.currentMultiplier || 1.0;

  if (multiplier >= 2.0) return '#dc2626'; // Red
  if (multiplier >= 1.5) return '#f59e0b'; // Orange
  if (multiplier >= 1.2) return '#eab308'; // Yellow
  return '#10b981'; // Green
};

export const mapsService = {
  getZoneBoundaries,
  getZoneById,
  getAllScooterLocations,
  generateScooterLocations,
  getZoneColor,
  SAUDI_ZONES
};

export default mapsService;
