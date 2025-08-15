// Simple weather service for Saudi Arabia (Mock Data)
// Ready for API integration when needed

// Saudi zones with Riyadh coordinates
const ZONES = {
  'zone-1': { lat: 24.7136, lon: 46.6753, name: 'Riyadh Central' },
  'zone-2': { lat: 24.7500, lon: 46.6000, name: 'Riyadh North' },
  'zone-3': { lat: 24.6800, lon: 46.7200, name: 'Riyadh East' },
  'zone-4': { lat: 24.6500, lon: 46.6200, name: 'Riyadh South' },
  'zone-5': { lat: 24.7200, lon: 46.5800, name: 'Riyadh West' }
};

// Get weather for one zone (Mock Data)
const getZoneWeather = async (zoneId) => {
  const zone = ZONES[zoneId];
  if (!zone) {
    throw new Error('Zone not found');
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Return realistic mock data for Saudi Arabia
  const mockTemperatures = {
    'zone-1': 43, // Riyadh Central - typically hottest
    'zone-2': 41, // Riyadh North
    'zone-3': 42, // Riyadh East
    'zone-4': 40, // Riyadh South
    'zone-5': 39  // Riyadh West
  };

  return {
    zoneId,
    temperature: mockTemperatures[zoneId] || 42,
    condition: 'clear',
    description: 'clear sky',
    humidity: Math.floor(Math.random() * 20) + 10, // 10-30% (typical for Saudi)
    windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
    isLive: false, // Mock data
    timestamp: new Date().toISOString(),
    apiSource: 'Mock Data'
  };
};

// Get weather for all zones
const getAllZonesWeather = async () => {
  console.log('🌤️ Fetching weather data...');

  const promises = Object.keys(ZONES).map(zoneId => getZoneWeather(zoneId));
  const results = await Promise.all(promises);

  const weatherData = {};
  results.forEach(weather => {
    weatherData[weather.zoneId] = weather;
  });

  console.log('✅ Weather data loaded:', Object.keys(weatherData).length, 'zones');
  return weatherData;
};

export const weatherService = {
  getZoneWeather,
  getAllZonesWeather,
  ZONES
};

export default weatherService;
