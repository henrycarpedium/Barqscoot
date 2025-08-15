// src/components/dashboard/StatCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const StatCard = ({ title, value, icon: Icon, trend, color = "teal", subtitle }) => {
  const { t } = useTranslation();
  const colorClasses = {
    teal: "bg-teal-50 text-teal-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    orange: "bg-orange-50 text-orange-700",
    green: "bg-green-50 text-green-700",
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return TrendingUp;
    if (trend < 0) return TrendingDown;
    return null;
  };

  const TrendIcon = getTrendIcon(trend);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-semibold mt-2">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend !== undefined && trend !== 0 && (
            <div className={`flex items-center mt-2 ${getTrendColor(trend)}`}>
              {TrendIcon && <TrendIcon className="h-3 w-3 mr-1" />}
              <span className="text-xs font-medium">
                {Math.abs(trend).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">
                {t('dashboard.stats.vsLastPeriod')}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
