// src/components/dashboard/LocationTrends.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  MapPin,
  TrendingUp,
  Info,
  Navigation,
  Target,
} from "lucide-react";

// Generate location performance data
const generateLocationData = (timeRange) => {
  const locations = [
    { name: "Downtown", color: "#3b82f6" },
    { name: "University", color: "#10b981" },
    { name: "Business District", color: "#f59e0b" },
    { name: "Residential North", color: "#8b5cf6" },
    { name: "Shopping Mall", color: "#ef4444" },
    { name: "Airport", color: "#06b6d4" },
  ];

  const multipliers = {
    "Downtown": 1.5,
    "University": 1.2,
    "Business District": 1.3,
    "Residential North": 0.8,
    "Shopping Mall": 1.1,
    "Airport": 1.4,
  };

  return locations.map(location => {
    const baseRides = timeRange === "today" ? 25 : timeRange === "week" ? 180 : 750;
    const baseRevenue = timeRange === "today" ? 650 : timeRange === "week" ? 4500 : 19000;
    
    const rides = Math.round(baseRides * multipliers[location.name] * (0.8 + Math.random() * 0.4));
    const revenue = Math.round(baseRevenue * multipliers[location.name] * (0.8 + Math.random() * 0.4));
    
    return {
      ...location,
      rides,
      revenue,
      avgRide: Math.round((revenue / rides) * 100) / 100,
      utilization: Math.round(40 + Math.random() * 40),
    };
  });
};

// Find top performing locations
const findTopLocations = (data) => {
  return data
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3)
    .map(location => ({
      name: location.name,
      revenue: location.revenue,
      rides: location.rides
    }));
};

// Calculate location insights
const calculateLocationInsights = (data) => {
  const totalRides = data.reduce((sum, item) => sum + item.rides, 0);
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const avgUtilization = data.reduce((sum, item) => sum + item.utilization, 0) / data.length;
  
  return {
    totalRides,
    totalRevenue,
    avgUtilization: Math.round(avgUtilization),
    topLocation: data.sort((a, b) => b.revenue - a.revenue)[0]?.name || "N/A"
  };
};

const LocationTrends = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("today");
  const [viewType, setViewType] = useState("bar"); // bar or pie

  // Process data for charts
  const locationData = generateLocationData(timeRange);
  const topLocations = findTopLocations(locationData);
  const insights = calculateLocationInsights(locationData);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label || data.name}</p>
          <p className="text-sm text-blue-600">
            {t('dashboard.locationTrends.metrics.rides')}: {data.rides}
          </p>
          <p className="text-sm text-green-600">
            {t('dashboard.locationTrends.metrics.revenue')}: ${data.revenue}
          </p>
          <p className="text-sm text-purple-600">
            Avg/Ride: ${data.avgRide}
          </p>
          <p className="text-sm text-orange-600">
            {t('dashboard.locationTrends.summaryLabels.avgUtilization')} {data.utilization}%
          </p>
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-red-600" />
            {t('dashboard.locationTrends.title')}
          </h3>
          <div className="relative ml-2 group">
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              {t('dashboard.locationTrends.tooltip')}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="today">{t('dashboard.locationTrends.timeRanges.today')}</option>
            <option value="week">{t('dashboard.locationTrends.timeRanges.week')}</option>
            <option value="month">{t('dashboard.locationTrends.timeRanges.month')}</option>
          </select>
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="bar">{t('dashboard.locationTrends.chartTypes.bar')}</option>
            <option value="pie">{t('dashboard.locationTrends.chartTypes.pie')}</option>
          </select>
        </div>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {viewType === "bar" ? (
            <BarChart data={locationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="rides"
                fill="#3b82f6"
                name={t('dashboard.locationTrends.metrics.rides')}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="revenue"
                fill="#10b981"
                name={t('dashboard.locationTrends.metrics.revenue')}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Performing Locations */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2 text-red-600" />
            {t('dashboard.locationTrends.sections.topPerformers')}
          </h4>
          <div className="space-y-2">
            {topLocations.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{location.name}</span>
                <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                  ${location.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Location Summary */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <Navigation className="h-4 w-4 mr-2 text-green-600" />
            {t('dashboard.locationTrends.sections.locationSummary')}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.locationTrends.summaryLabels.totalRides')}</span>
              <span className="text-sm font-medium">{insights.totalRides.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.locationTrends.summaryLabels.totalRevenue')}</span>
              <span className="text-sm font-medium text-green-600">${insights.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.locationTrends.summaryLabels.avgUtilization')}</span>
              <span className="text-sm font-medium">{insights.avgUtilization}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.locationTrends.summaryLabels.topLocation')}</span>
              <span className="text-sm font-medium text-red-600">{insights.topLocation}</span>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
            {t('dashboard.locationTrends.sections.performanceInsights')}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.locationTrends.insightLabels.growthRate')}</span>
              <span className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.2%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.locationTrends.insightLabels.coverage')}</span>
              <span className="text-sm font-medium">6 {t('dashboard.locationTrends.insightValues.zones')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.locationTrends.insightLabels.demandScore')}</span>
              <span className="text-sm font-medium text-blue-600">8.4/10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.locationTrends.insightLabels.expansion')}</span>
              <span className="text-sm font-medium text-purple-600">2 {t('dashboard.locationTrends.insightValues.planned')}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationTrends;
