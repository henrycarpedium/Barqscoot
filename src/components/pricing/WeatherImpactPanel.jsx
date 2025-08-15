// src/components/pricing/WeatherImpactPanel.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Thermometer,
  Eye,
  AlertTriangle,
  TrendingUp,
  Droplets,
} from "lucide-react";

const WeatherImpactPanel = ({ zones, analytics }) => {
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'hot':
      case 'very_hot':
      case 'extreme_heat':
        return <Sun className="h-5 w-5 text-orange-500" />;
      case 'sandstorm':
      case 'dust_storm':
        return <Wind className="h-5 w-5 text-yellow-600" />;
      case 'rain':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'pleasant':
      case 'mild':
        return <Cloud className="h-5 w-5 text-green-500" />;
      default:
        return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 45) return 'text-red-600';
    if (temp >= 40) return 'text-orange-600';
    if (temp >= 35) return 'text-yellow-600';
    if (temp >= 25) return 'text-green-600';
    return 'text-blue-600';
  };

  const getWeatherImpactColor = (impact) => {
    switch (impact) {
      case 'very_high': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getArabicWeatherName = (condition) => {
    const weatherNames = {
      'hot': 'حار',
      'very_hot': 'حار جداً',
      'extreme_heat': 'حر شديد',
      'sandstorm': 'عاصفة رملية',
      'dust_storm': 'عاصفة ترابية',
      'pleasant': 'معتدل',
      'mild': 'لطيف',
      'clear': 'صافي',
      'rain': 'مطر'
    };
    return weatherNames[condition] || condition;
  };

  // Calculate weather impact metrics
  const avgTemperature = zones?.reduce((sum, zone) => sum + zone.temperature, 0) / (zones?.length || 1) || 0;
  const highTempZones = zones?.filter(zone => zone.temperature >= 45)?.length || 0;
  const weatherImpactRevenue = analytics?.overview?.weatherImpactRevenue || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg border border-gray-200"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
          Weather Impact Analysis
          <span className="text-sm text-gray-500 mr-2 font-normal">تحليل تأثير الطقس</span>
          {zones && zones.length > 0 && (
            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
              zones[0]?.isLiveWeather
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {zones[0]?.isLiveWeather ? '🌐 Live Data' : '📊 Mock Data'}
            </span>
          )}
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Avg Temp: {avgTemperature.toFixed(1)}°C</span>
          <span>•</span>
          <span>{highTempZones} zones above 45°C</span>
        </div>
      </div>

      {/* Weather Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Weather Revenue Impact</p>
              <p className="text-2xl font-bold text-orange-900">
                {weatherImpactRevenue.toLocaleString()} SAR
              </p>
              <p className="text-xs text-orange-600 mt-1">
                {((weatherImpactRevenue / analytics?.overview?.totalRevenue) * 100).toFixed(1)}% of total
              </p>
            </div>
            <Sun className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Extreme Heat Zones</p>
              <p className="text-2xl font-bold text-yellow-900">{highTempZones}</p>
              <p className="text-xs text-yellow-600 mt-1">Above 45°C threshold</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Demand Multiplier</p>
              <p className="text-2xl font-bold text-blue-900">
                {(analytics?.weatherImpact?.find(w => w.condition.includes('Heat'))?.demandMultiplier || 1.0).toFixed(1)}x
              </p>
              <p className="text-xs text-blue-600 mt-1">Heat-based surge</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Zone Weather Details */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 mb-3">Zone Weather Conditions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones?.map((zone) => (
            <div
              key={zone.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="font-medium text-gray-900">{zone.name}</h5>
                  <p className="text-xs text-gray-500">{zone.nameAr}</p>
                </div>
                {getWeatherIcon(zone.weatherCondition)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Temperature:</span>
                  <span className={`font-medium ${getTemperatureColor(zone.temperature)}`}>
                    {zone.temperature}°C
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Condition:</span>
                  <div className="text-right">
                    <span className="text-sm font-medium capitalize">{zone.weatherCondition}</span>
                    <p className="text-xs text-gray-500">{getArabicWeatherName(zone.weatherCondition)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Impact:</span>
                  <span className={`px-2 py-1 text-xs rounded-full capitalize ${getWeatherImpactColor(zone.weatherImpact)}`}>
                    {zone.weatherImpact.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Multiplier:</span>
                  <span className="font-medium text-gray-900">{zone.currentMultiplier}x</span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Revenue Today:</span>
                    <span className="font-medium text-green-600">{zone.revenueToday} SAR</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Impact Chart */}
      {analytics?.weatherImpact && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Weather Condition Impact on Revenue</h4>
          <div className="space-y-3">
            {analytics.weatherImpact.map((weather, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getWeatherIcon(weather.condition.toLowerCase())}
                  <div>
                    <span className="font-medium text-gray-900">{weather.condition}</span>
                    <p className="text-xs text-gray-500">
                      Demand Multiplier: {weather.demandMultiplier}x
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{weather.revenueShare}%</div>
                  <div className="text-xs text-gray-500">of total revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather Alerts */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
          Weather Alerts & Recommendations
        </h4>
        <div className="space-y-2">
          {highTempZones > 0 && (
            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <Sun className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">Extreme Heat Alert</p>
                <p className="text-sm text-orange-700">
                  {highTempZones} zones experiencing extreme heat (45°C+). Consider increasing surge multipliers
                  and deploying more scooters to air-conditioned areas.
                </p>
              </div>
            </div>
          )}

          {zones?.some(zone => zone.weatherCondition === 'sandstorm') && (
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Wind className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Sandstorm Warning</p>
                <p className="text-sm text-yellow-700">
                  Sandstorm conditions detected. Activate emergency surge pricing and ensure scooter safety protocols.
                </p>
              </div>
            </div>
          )}

          {avgTemperature < 35 && (
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Cloud className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Pleasant Weather Opportunity</p>
                <p className="text-sm text-green-700">
                  Favorable weather conditions. Consider promotional pricing to increase ridership.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherImpactPanel;
