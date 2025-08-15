// src/components/dashboard/UsageHeatmap.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MapPin, Clock, Users, Filter } from "lucide-react";

const UsageHeatmap = () => {
  const { t } = useTranslation();
  const [viewType, setViewType] = useState("location"); // location, time, both

  // Mock heatmap data - in real implementation, this would come from API
  const locationData = [
    { zone: t('dashboard.fleetStatus.locations.downtown'), usage: 85, rides: 142, color: "bg-red-500" },
    { zone: t('dashboard.fleetStatus.locations.university'), usage: 72, rides: 98, color: "bg-orange-500" },
    { zone: t('dashboard.fleetStatus.locations.businessDistrict'), usage: 68, rides: 89, color: "bg-yellow-500" },
    { zone: t('dashboard.fleetStatus.locations.residentialNorth'), usage: 45, rides: 56, color: "bg-green-500" },
    { zone: t('dashboard.fleetStatus.locations.shoppingMall'), usage: 58, rides: 73, color: "bg-yellow-400" },
    { zone: t('dashboard.fleetStatus.locations.airport'), usage: 35, rides: 42, color: "bg-green-400" },
    { zone: t('dashboard.fleetStatus.locations.beachArea'), usage: 62, rides: 78, color: "bg-orange-400" },
    { zone: t('dashboard.fleetStatus.locations.industrial'), usage: 28, rides: 31, color: "bg-green-300" },
  ];

  const timeData = [
    { hour: "6 AM", usage: 15, rides: 12 },
    { hour: "7 AM", usage: 35, rides: 28 },
    { hour: "8 AM", usage: 75, rides: 65 },
    { hour: "9 AM", usage: 85, rides: 78 },
    { hour: "10 AM", usage: 45, rides: 38 },
    { hour: "11 AM", usage: 55, rides: 47 },
    { hour: "12 PM", usage: 70, rides: 62 },
    { hour: "1 PM", usage: 80, rides: 71 },
    { hour: "2 PM", usage: 65, rides: 58 },
    { hour: "3 PM", usage: 60, rides: 52 },
    { hour: "4 PM", usage: 70, rides: 63 },
    { hour: "5 PM", usage: 90, rides: 85 },
    { hour: "6 PM", usage: 95, rides: 92 },
    { hour: "7 PM", usage: 75, rides: 68 },
    { hour: "8 PM", usage: 55, rides: 48 },
    { hour: "9 PM", usage: 40, rides: 35 },
    { hour: "10 PM", usage: 25, rides: 22 },
    { hour: "11 PM", usage: 15, rides: 13 },
  ];

  const getIntensityColor = (usage) => {
    if (usage >= 80) return "bg-red-500";
    if (usage >= 60) return "bg-orange-500";
    if (usage >= 40) return "bg-yellow-500";
    if (usage >= 20) return "bg-green-500";
    return "bg-green-300";
  };

  const getIntensityOpacity = (usage) => {
    return Math.max(0.2, usage / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            {t('dashboard.usageHeatmap.title')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('dashboard.usageHeatmap.subtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="location">{t('dashboard.usageHeatmap.viewTypes.location')}</option>
            <option value="time">{t('dashboard.usageHeatmap.viewTypes.time')}</option>
            <option value="both">{t('dashboard.usageHeatmap.viewTypes.both')}</option>
          </select>
        </div>
      </div>

      {viewType === "location" && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 mb-3">{t('dashboard.usageHeatmap.locationBased')}</h4>
          <div className="grid grid-cols-2 gap-3">
            {locationData.map((zone, index) => (
              <motion.div
                key={zone.zone}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{zone.zone}</p>
                    <p className="text-xs text-gray-600">{zone.rides} {t('dashboard.usageHeatmap.rides')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{zone.usage}%</p>
                    <div className="w-12 h-2 bg-gray-200 rounded-full mt-1">
                      <div
                        className={`h-full rounded-full ${getIntensityColor(zone.usage)}`}
                        style={{ width: `${zone.usage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {viewType === "time" && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 mb-3">{t('dashboard.usageHeatmap.timeBased')}</h4>
          <div className="grid grid-cols-6 gap-2">
            {timeData.map((time, index) => (
              <motion.div
                key={time.hour}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div
                  className={`h-8 rounded ${getIntensityColor(time.usage)} cursor-pointer transition-all hover:scale-105`}
                  style={{ opacity: getIntensityOpacity(time.usage) }}
                  title={`${time.hour}: ${time.usage}% ${t('dashboard.usageHeatmap.usageIntensity')}, ${time.rides} ${t('dashboard.usageHeatmap.rides')}`}
                />
                <p className="text-xs text-gray-600 text-center mt-1">{time.hour}</p>
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {time.usage}% {t('dashboard.usageHeatmap.usageIntensity')}<br/>{time.rides} {t('dashboard.usageHeatmap.rides')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {viewType === "both" && (
        <div className="space-y-6">
          {/* Top zones summary */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">{t('dashboard.usageHeatmap.topUsageZones')}</h4>
            <div className="flex flex-wrap gap-2">
              {locationData
                .sort((a, b) => b.usage - a.usage)
                .slice(0, 4)
                .map((zone) => (
                  <div
                    key={zone.zone}
                    className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                  >
                    {zone.zone} ({zone.usage}%)
                  </div>
                ))}
            </div>
          </div>

          {/* Peak hours */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">{t('dashboard.usageHeatmap.peakHours')}</h4>
            <div className="flex items-center space-x-4">
              {timeData
                .sort((a, b) => b.usage - a.usage)
                .slice(0, 3)
                .map((time, index) => (
                  <div key={time.hour} className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{time.hour}</span>
                    <span className="text-xs text-gray-600">({time.usage}%)</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{t('dashboard.usageHeatmap.usageIntensity')}:</span>
          <div className="flex items-center space-x-2">
            <span>{t('dashboard.usageHeatmap.low')}</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-green-300 rounded"></div>
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <div className="w-3 h-3 bg-red-500 rounded"></div>
            </div>
            <span>{t('dashboard.usageHeatmap.high')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UsageHeatmap;
