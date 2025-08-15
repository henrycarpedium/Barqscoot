// src/services/pricingApi.js
import { v4 as uuidv4 } from 'uuid';
import { weatherService } from './weatherApi';

// Mock data for pricing zones in Saudi Arabia
const mockPricingZones = [
  {
    id: 'zone-001',
    name: 'King Fahd District',
    nameAr: 'حي الملك فهد',
    city: 'Riyadh',
    coordinates: [
      { lat: 24.7136, lng: 46.6753 },
      { lat: 24.7180, lng: 46.6820 },
      { lat: 24.7090, lng: 46.6850 },
      { lat: 24.7046, lng: 46.6783 }
    ],
    basePrice: 8.00, // SAR
    currentMultiplier: 2.5,
    surgeActive: true,
    demandLevel: 'very_high',
    activeRides: 45,
    availableScooters: 12,
    avgWaitTime: 3.2,
    revenueToday: 4502.40, // SAR
    weatherCondition: 'hot',
    temperature: 42, // Celsius
    weatherImpact: 'high', // High demand due to heat (people prefer short rides)
    color: '#ef4444' // red for high surge
  },
  {
    id: 'zone-002',
    name: 'King Saud University',
    nameAr: 'جامعة الملك سعود',
    city: 'Riyadh',
    coordinates: [
      { lat: 24.7277, lng: 46.6186 },
      { lat: 24.7320, lng: 46.6240 },
      { lat: 24.7250, lng: 46.6280 },
      { lat: 24.7207, lng: 46.6226 }
    ],
    basePrice: 6.00, // SAR
    currentMultiplier: 1.3,
    surgeActive: true,
    demandLevel: 'medium',
    activeRides: 28,
    availableScooters: 18,
    avgWaitTime: 2.1,
    revenueToday: 3201.60, // SAR
    weatherCondition: 'pleasant',
    temperature: 28, // Celsius (evening/morning)
    weatherImpact: 'medium',
    color: '#f59e0b' // yellow for medium surge
  },
  {
    id: 'zone-003',
    name: 'Al Olaya District',
    nameAr: 'حي العليا',
    city: 'Riyadh',
    coordinates: [
      { lat: 24.6877, lng: 46.6857 },
      { lat: 24.6920, lng: 46.6910 },
      { lat: 24.6850, lng: 46.6950 },
      { lat: 24.6807, lng: 46.6897 }
    ],
    basePrice: 7.00, // SAR
    currentMultiplier: 1.0,
    surgeActive: false,
    demandLevel: 'low',
    activeRides: 8,
    availableScooters: 35,
    avgWaitTime: 1.5,
    revenueToday: 1152.54, // SAR
    weatherCondition: 'mild',
    temperature: 35, // Celsius
    weatherImpact: 'low',
    color: '#10b981' // green for normal pricing
  },
  {
    id: 'zone-004',
    name: 'Kingdom Centre Mall',
    nameAr: 'مركز المملكة التجاري',
    city: 'Riyadh',
    coordinates: [
      { lat: 24.7118, lng: 46.6758 },
      { lat: 24.7150, lng: 46.6800 },
      { lat: 24.7080, lng: 46.6840 },
      { lat: 24.7048, lng: 46.6798 }
    ],
    basePrice: 9.00, // SAR
    currentMultiplier: 1.8,
    surgeActive: true,
    demandLevel: 'high',
    activeRides: 32,
    availableScooters: 22,
    avgWaitTime: 2.8,
    revenueToday: 3781.08, // SAR
    weatherCondition: 'hot',
    temperature: 45, // Celsius
    weatherImpact: 'high', // High demand for AC malls during hot weather
    color: '#f59e0b'
  },
  {
    id: 'zone-005',
    name: 'King Khalid Airport',
    nameAr: 'مطار الملك خالد الدولي',
    city: 'Riyadh',
    coordinates: [
      { lat: 24.9576, lng: 46.6988 },
      { lat: 24.9620, lng: 46.7040 },
      { lat: 24.9530, lng: 46.7080 },
      { lat: 24.9486, lng: 46.7028 }
    ],
    basePrice: 12.00, // SAR (higher for airport)
    currentMultiplier: 2.2,
    surgeActive: true,
    demandLevel: 'very_high',
    activeRides: 52,
    availableScooters: 8,
    avgWaitTime: 4.5,
    revenueToday: 6051.24, // SAR
    weatherCondition: 'sandstorm',
    temperature: 38, // Celsius
    weatherImpact: 'very_high', // Sandstorm increases demand for covered transport
    color: '#dc2626' // dark red for very high surge
  }
];

// Mock pricing rules for Saudi Arabia
const mockPricingRules = [
  {
    id: 'rule-001',
    name: 'Morning Rush Hour',
    nameAr: 'ساعة الذروة الصباحية',
    description: 'Increased pricing during morning commute hours (avoiding prayer times)',
    type: 'time_based',
    isActive: true,
    conditions: {
      timeRange: { start: '07:00', end: '09:00' }, // Before Dhuhr prayer
      daysOfWeek: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'], // Saudi work week
      zones: ['zone-001', 'zone-004'],
      excludePrayerTimes: true
    },
    pricing: {
      multiplier: 1.8,
      maxMultiplier: 2.5,
      minDemandThreshold: 20
    },
    createdAt: '2024-01-15T10:00:00Z',
    lastModified: '2024-01-20T14:30:00Z',
    performance: {
      avgRevenueLift: 35.2,
      customerSatisfaction: 3.8,
      utilizationIncrease: 12.5
    }
  },
  {
    id: 'rule-002',
    name: 'Evening Rush Hour',
    nameAr: 'ساعة الذروة المسائية',
    description: 'Surge pricing for evening commute (post-Asr prayer)',
    type: 'time_based',
    isActive: true,
    conditions: {
      timeRange: { start: '16:30', end: '19:00' }, // After Asr prayer
      daysOfWeek: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
      zones: ['zone-001', 'zone-002', 'zone-004'],
      excludePrayerTimes: true
    },
    pricing: {
      multiplier: 1.6,
      maxMultiplier: 2.2,
      minDemandThreshold: 25
    },
    createdAt: '2024-01-15T10:00:00Z',
    lastModified: '2024-01-18T16:45:00Z',
    performance: {
      avgRevenueLift: 28.7,
      customerSatisfaction: 4.1,
      utilizationIncrease: 18.3
    }
  },
  {
    id: 'rule-003',
    name: 'Weekend Premium',
    nameAr: 'تسعير نهاية الأسبوع',
    description: 'Higher pricing during weekend peak hours (Friday-Saturday)',
    type: 'time_based',
    isActive: true,
    conditions: {
      timeRange: { start: '15:00', end: '23:00' }, // After Friday prayer
      daysOfWeek: ['friday', 'saturday'], // Saudi weekend
      zones: ['zone-002', 'zone-004'],
      excludePrayerTimes: true
    },
    pricing: {
      multiplier: 1.4,
      maxMultiplier: 2.0,
      minDemandThreshold: 15
    },
    createdAt: '2024-01-10T09:00:00Z',
    lastModified: '2024-01-19T11:20:00Z',
    performance: {
      avgRevenueLift: 22.1,
      customerSatisfaction: 4.3,
      utilizationIncrease: 15.8
    }
  },
  {
    id: 'rule-004',
    name: 'Extreme Heat Surge',
    nameAr: 'زيادة أسعار الحر الشديد',
    description: 'Weather-based surge during extreme heat (45°C+)',
    type: 'weather_based',
    isActive: true,
    conditions: {
      temperatureThreshold: 45, // Celsius
      weatherConditions: ['hot', 'very_hot'],
      timeRange: { start: '11:00', end: '16:00' }, // Peak heat hours
      zones: 'all'
    },
    pricing: {
      multiplier: 1.8,
      maxMultiplier: 2.5,
      minDemandThreshold: 10
    },
    createdAt: '2024-01-12T14:00:00Z',
    lastModified: '2024-01-20T09:15:00Z',
    performance: {
      avgRevenueLift: 52.3,
      customerSatisfaction: 4.2, // High satisfaction due to comfort
      utilizationIncrease: 35.7
    }
  },
  {
    id: 'rule-005',
    name: 'Sandstorm Emergency Surge',
    nameAr: 'زيادة أسعار العاصفة الرملية',
    description: 'Emergency pricing during sandstorms and dust storms',
    type: 'weather_based',
    isActive: true,
    conditions: {
      weatherConditions: ['sandstorm', 'dust_storm'],
      visibilityThreshold: 1000, // meters
      zones: 'all'
    },
    pricing: {
      multiplier: 2.8,
      maxMultiplier: 4.0,
      minDemandThreshold: 5
    },
    createdAt: '2024-01-08T16:00:00Z',
    lastModified: '2024-01-15T13:40:00Z',
    performance: {
      avgRevenueLift: 95.2,
      customerSatisfaction: 4.8, // Very high due to safety
      utilizationIncrease: 78.4
    }
  },
  {
    id: 'rule-006',
    name: 'Ramadan Evening Surge',
    nameAr: 'زيادة أسعار مساء رمضان',
    description: 'Special pricing during Ramadan evening hours (post-Iftar)',
    type: 'cultural_event',
    isActive: false, // Seasonal activation
    conditions: {
      timeRange: { start: '20:00', end: '02:00' }, // Post-Iftar to Suhoor
      culturalEvent: 'ramadan',
      zones: ['zone-001', 'zone-002', 'zone-004']
    },
    pricing: {
      multiplier: 1.6,
      maxMultiplier: 2.2,
      minDemandThreshold: 15
    },
    createdAt: '2024-01-08T16:00:00Z',
    lastModified: '2024-01-15T13:40:00Z',
    performance: {
      avgRevenueLift: 42.8,
      customerSatisfaction: 4.1,
      utilizationIncrease: 28.9
    }
  }
];

// Mock pricing analytics for Saudi Arabia
const mockPricingAnalytics = {
  overview: {
    totalRevenue: 55514.76, // SAR (converted from USD)
    surgeRevenue: 24831.62, // SAR
    avgMultiplier: 1.6,
    activeZones: 4,
    totalZones: 5,
    revenueGrowth: 23.5,
    customerSatisfaction: 4.2, // Higher due to weather-appropriate pricing
    weatherImpactRevenue: 8327.21, // SAR from weather-based pricing
    currency: 'SAR'
  },
  revenueByHour: [
    { hour: '00:00', revenue: 434.20, multiplier: 1.0, temperature: 32, weather: 'clear' },
    { hour: '01:00', revenue: 307.48, multiplier: 1.0, temperature: 30, weather: 'clear' },
    { hour: '02:00', revenue: 162.72, multiplier: 1.0, temperature: 29, weather: 'clear' },
    { hour: '03:00', revenue: 115.56, multiplier: 1.0, temperature: 28, weather: 'clear' },
    { hour: '04:00', revenue: 104.04, multiplier: 1.0, temperature: 27, weather: 'clear' },
    { hour: '05:00', revenue: 235.44, multiplier: 1.0, temperature: 28, weather: 'clear' }, // Fajr prayer time
    { hour: '06:00', revenue: 650.52, multiplier: 1.2, temperature: 32, weather: 'clear' },
    { hour: '07:00', revenue: 1514.88, multiplier: 1.8, temperature: 36, weather: 'hot' },
    { hour: '08:00', revenue: 2451.24, multiplier: 2.1, temperature: 40, weather: 'hot' },
    { hour: '09:00', revenue: 1874.16, multiplier: 1.6, temperature: 43, weather: 'very_hot' },
    { hour: '10:00', revenue: 1369.44, multiplier: 1.3, temperature: 45, weather: 'very_hot' },
    { hour: '11:00', revenue: 1620.72, multiplier: 1.4, temperature: 47, weather: 'extreme_heat' },
    { hour: '12:00', revenue: 2234.88, multiplier: 1.7, temperature: 48, weather: 'extreme_heat' }, // Dhuhr prayer impact
    { hour: '13:00', revenue: 2089.08, multiplier: 1.5, temperature: 49, weather: 'extreme_heat' },
    { hour: '14:00', revenue: 1766.52, multiplier: 1.4, temperature: 48, weather: 'extreme_heat' },
    { hour: '15:00', revenue: 1875.24, multiplier: 1.5, temperature: 46, weather: 'very_hot' }, // Asr prayer time
    { hour: '16:00', revenue: 2305.80, multiplier: 1.6, temperature: 44, weather: 'hot' },
    { hour: '17:00', revenue: 3204.72, multiplier: 2.0, temperature: 41, weather: 'hot' },
    { hour: '18:00', revenue: 4034.88, multiplier: 2.3, temperature: 38, weather: 'warm' }, // Maghrib prayer time
    { hour: '19:00', revenue: 3529.44, multiplier: 1.9, temperature: 36, weather: 'pleasant' },
    { hour: '20:00', revenue: 2594.16, multiplier: 1.6, temperature: 34, weather: 'pleasant' }, // Isha prayer time
    { hour: '21:00', revenue: 2089.08, multiplier: 1.4, temperature: 33, weather: 'pleasant' },
    { hour: '22:00', revenue: 1514.88, multiplier: 1.2, temperature: 32, weather: 'pleasant' },
    { hour: '23:00', revenue: 1009.80, multiplier: 1.1, temperature: 31, weather: 'pleasant' }
  ],
  demandHeatmap: [
    { zone: 'King Fahd District', demand: 85, supply: 45, ratio: 1.89, weather: 'hot', temperature: 42 },
    { zone: 'King Saud University', demand: 62, supply: 48, ratio: 1.29, weather: 'pleasant', temperature: 28 },
    { zone: 'Al Olaya District', demand: 28, supply: 65, ratio: 0.43, weather: 'mild', temperature: 35 },
    { zone: 'Kingdom Centre Mall', demand: 74, supply: 52, ratio: 1.42, weather: 'hot', temperature: 45 },
    { zone: 'King Khalid Airport', demand: 95, supply: 38, ratio: 2.50, weather: 'sandstorm', temperature: 38 }
  ],
  weeklyTrends: [
    { day: 'Sunday', revenue: 7849.80, avgMultiplier: 1.7, avgTemperature: 43 }, // Saudi work week starts Sunday
    { day: 'Monday', revenue: 7381.08, avgMultiplier: 1.6, avgTemperature: 44 },
    { day: 'Tuesday', revenue: 7634.88, avgMultiplier: 1.6, avgTemperature: 45 },
    { day: 'Wednesday', revenue: 8211.24, avgMultiplier: 1.8, avgTemperature: 46 },
    { day: 'Thursday', revenue: 9541.44, avgMultiplier: 2.0, avgTemperature: 47 },
    { day: 'Friday', revenue: 10404.72, avgMultiplier: 1.9, avgTemperature: 42 }, // Weekend + Friday prayer
    { day: 'Saturday', revenue: 4495.32, avgMultiplier: 1.3, avgTemperature: 40 } // Weekend
  ],
  weatherImpact: [
    { condition: 'Clear', demandMultiplier: 1.0, revenueShare: 25.3 },
    { condition: 'Hot (40-45°C)', demandMultiplier: 1.4, revenueShare: 35.7 },
    { condition: 'Extreme Heat (45°C+)', demandMultiplier: 1.8, revenueShare: 28.2 },
    { condition: 'Sandstorm', demandMultiplier: 2.5, revenueShare: 8.9 },
    { condition: 'Pleasant (25-35°C)', demandMultiplier: 0.9, revenueShare: 1.9 }
  ]
};

// Mock events data for Saudi Arabia
const mockEvents = [
  {
    id: 'event-001',
    name: 'Riyadh Season Festival',
    nameAr: 'موسم الرياض',
    type: 'cultural_festival',
    location: { lat: 24.7136, lng: 46.6753 },
    startTime: '2024-01-25T20:00:00Z',
    endTime: '2024-01-25T23:30:00Z',
    expectedAttendance: 25000,
    pricingRuleId: 'rule-006',
    isActive: true,
    estimatedDemandIncrease: 400,
    weatherConsideration: true,
    culturalSignificance: 'high'
  },
  {
    id: 'event-002',
    name: 'Al Hilal vs Al Nassr Derby',
    nameAr: 'ديربي الهلال والنصر',
    type: 'sports',
    location: { lat: 24.6877, lng: 46.6857 },
    startTime: '2024-01-27T19:00:00Z',
    endTime: '2024-01-27T22:30:00Z',
    expectedAttendance: 65000,
    pricingRuleId: 'rule-006',
    isActive: false,
    estimatedDemandIncrease: 650,
    weatherConsideration: true,
    culturalSignificance: 'very_high'
  },
  {
    id: 'event-003',
    name: 'Saudi National Day Celebration',
    nameAr: 'احتفال اليوم الوطني السعودي',
    type: 'national_holiday',
    location: { lat: 24.7118, lng: 46.6758 },
    startTime: '2024-09-23T16:00:00Z',
    endTime: '2024-09-23T23:59:00Z',
    expectedAttendance: 100000,
    pricingRuleId: 'rule-006',
    isActive: false,
    estimatedDemandIncrease: 800,
    weatherConsideration: true,
    culturalSignificance: 'extreme'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Add weather data to zones
const addWeatherToZones = async (zones) => {
  try {
    const weatherData = await weatherService.getAllZonesWeather();

    return zones.map(zone => {
      const weather = weatherData[zone.id];
      if (weather && weather.isLive) {
        return {
          ...zone,
          temperature: weather.temperature,
          weatherCondition: weather.condition,
          weatherDescription: weather.description,
          isLiveWeather: true,
          lastWeatherUpdate: weather.timestamp
        };
      }
      return {
        ...zone,
        isLiveWeather: false,
        lastWeatherUpdate: new Date().toISOString()
      };
    });
  } catch (error) {
    console.warn('Weather integration failed:', error);
    return zones.map(zone => ({
      ...zone,
      isLiveWeather: false,
      lastWeatherUpdate: new Date().toISOString()
    }));
  }
};

// Dynamic Pricing API service
export const pricingService = {
  // Get all pricing zones with weather
  getAllZones: async () => {
    await delay(400);
    const zonesWithWeather = await addWeatherToZones(mockPricingZones);
    return { data: zonesWithWeather };
  },

  // Get zone by ID
  getZoneById: async (zoneId) => {
    await delay(300);
    const zone = mockPricingZones.find(z => z.id === zoneId);
    if (!zone) {
      throw new Error('Zone not found');
    }
    return { data: zone };
  },

  // Update zone pricing
  updateZonePricing: async (zoneId, pricingData) => {
    await delay(500);
    const zoneIndex = mockPricingZones.findIndex(z => z.id === zoneId);
    if (zoneIndex === -1) {
      throw new Error('Zone not found');
    }

    mockPricingZones[zoneIndex] = {
      ...mockPricingZones[zoneIndex],
      ...pricingData,
      color: pricingData.currentMultiplier >= 2.0 ? '#dc2626' :
             pricingData.currentMultiplier >= 1.5 ? '#ef4444' :
             pricingData.currentMultiplier >= 1.2 ? '#f59e0b' : '#10b981'
    };

    return { data: mockPricingZones[zoneIndex] };
  },

  // Get all pricing rules
  getAllRules: async (filters = {}) => {
    await delay(400);
    let filteredRules = [...mockPricingRules];

    if (filters.type) {
      filteredRules = filteredRules.filter(rule => rule.type === filters.type);
    }
    if (filters.isActive !== undefined) {
      filteredRules = filteredRules.filter(rule => rule.isActive === filters.isActive);
    }

    return { data: filteredRules };
  },

  // Create new pricing rule
  createRule: async (ruleData) => {
    await delay(600);
    const newRule = {
      id: `rule-${String(mockPricingRules.length + 1).padStart(3, '0')}`,
      ...ruleData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      performance: {
        avgRevenueLift: 0,
        customerSatisfaction: 0,
        utilizationIncrease: 0
      }
    };
    mockPricingRules.unshift(newRule);
    return { data: newRule };
  },

  // Update pricing rule
  updateRule: async (ruleId, updateData) => {
    await delay(400);
    const ruleIndex = mockPricingRules.findIndex(r => r.id === ruleId);
    if (ruleIndex === -1) {
      throw new Error('Rule not found');
    }

    mockPricingRules[ruleIndex] = {
      ...mockPricingRules[ruleIndex],
      ...updateData,
      lastModified: new Date().toISOString()
    };

    return { data: mockPricingRules[ruleIndex] };
  },

  // Delete pricing rule
  deleteRule: async (ruleId) => {
    await delay(300);
    const ruleIndex = mockPricingRules.findIndex(r => r.id === ruleId);
    if (ruleIndex === -1) {
      throw new Error('Rule not found');
    }

    mockPricingRules.splice(ruleIndex, 1);
    return { success: true };
  },

  // Get pricing analytics
  getAnalytics: async (timeRange = '24h') => {
    await delay(500);
    return { data: mockPricingAnalytics };
  },

  // Get events
  getAllEvents: async () => {
    await delay(300);
    return { data: mockEvents };
  },

  // Manual surge override
  manualSurgeOverride: async (zoneId, multiplier, duration) => {
    await delay(400);
    const zone = mockPricingZones.find(z => z.id === zoneId);
    if (!zone) {
      throw new Error('Zone not found');
    }

    zone.currentMultiplier = multiplier;
    zone.surgeActive = multiplier > 1.0;
    zone.demandLevel = multiplier >= 2.0 ? 'high' : multiplier >= 1.5 ? 'medium' : 'low';
    zone.color = multiplier >= 2.0 ? '#dc2626' :
                 multiplier >= 1.5 ? '#ef4444' :
                 multiplier >= 1.2 ? '#f59e0b' : '#10b981';

    return { data: zone };
  }
};

export default pricingService;
