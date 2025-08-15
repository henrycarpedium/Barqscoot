// src/components/dashboard/SystemAlerts.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  X,
  Bell,
  Clock,
  Filter,
} from "lucide-react";

const SystemAlerts = ({ alerts = [] }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all"); // all, warning, error, info, success
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  // Mock additional alerts if none provided
  const defaultAlerts = [
    {
      id: 1,
      type: "warning",
      title: t('dashboard.alerts.lowBattery'),
      message: t('dashboard.alerts.lowBatteryMessage'),
      time: t('dashboard.alerts.timeAgo.2minutes'),
      icon: AlertTriangle,
      actionable: true,
    },
    {
      id: 2,
      type: "error",
      title: t('dashboard.alerts.scooterOffline'),
      message: t('dashboard.alerts.scooterOfflineMessage'),
      time: t('dashboard.alerts.timeAgo.5minutes'),
      icon: AlertCircle,
      actionable: true,
    },
    {
      id: 3,
      type: "info",
      title: t('dashboard.alerts.maintenanceScheduled'),
      message: t('dashboard.alerts.maintenanceScheduledMessage'),
      time: t('dashboard.alerts.timeAgo.10minutes'),
      icon: Info,
      actionable: false,
    },
    {
      id: 4,
      type: "success",
      title: t('dashboard.alerts.fleetUpdateComplete'),
      message: t('dashboard.alerts.fleetUpdateMessage'),
      time: t('dashboard.alerts.timeAgo.15minutes'),
      icon: CheckCircle,
      actionable: false,
    },
  ];

  const allAlerts = alerts.length > 0 ? alerts : defaultAlerts;
  
  const filteredAlerts = allAlerts.filter((alert) => {
    if (dismissedAlerts.has(alert.id)) return false;
    if (filter === "all") return true;
    return alert.type === filter;
  });

  const getAlertStyles = (type) => {
    switch (type) {
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-800",
          icon: "text-red-600",
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-800",
          icon: "text-yellow-600",
        };
      case "info":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-800",
          icon: "text-blue-600",
        };
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-800",
          icon: "text-green-600",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-800",
          icon: "text-gray-600",
        };
    }
  };

  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const getFilterCount = (type) => {
    if (type === "all") return allAlerts.filter(a => !dismissedAlerts.has(a.id)).length;
    return allAlerts.filter(a => a.type === type && !dismissedAlerts.has(a.id)).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-orange-600" />
            {t('dashboard.alerts.systemAlerts')}
          </h3>
          <p className="text-sm text-gray-600">
            {filteredAlerts.length} {t('dashboard.alerts.activeAlerts')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">{t('dashboard.alerts.filters.all')} ({getFilterCount("all")})</option>
            <option value="error">{t('dashboard.alerts.filters.errors')} ({getFilterCount("error")})</option>
            <option value="warning">{t('dashboard.alerts.filters.warnings')} ({getFilterCount("warning")})</option>
            <option value="info">{t('dashboard.alerts.filters.info')} ({getFilterCount("info")})</option>
            <option value="success">{t('dashboard.alerts.filters.success')} ({getFilterCount("success")})</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {filteredAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">{t('dashboard.alerts.noAlertsToDisplay')}</p>
              <p className="text-sm text-gray-500">{t('dashboard.alerts.allSystemsRunning')}</p>
            </motion.div>
          ) : (
            filteredAlerts.map((alert, index) => {
              const styles = getAlertStyles(alert.type);
              const IconComponent = alert.icon;

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${styles.bg} ${styles.border} relative group`}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`h-5 w-5 mt-0.5 ${styles.icon} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${styles.text}`}>
                          {alert.title}
                        </h4>
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white hover:bg-opacity-50 rounded"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                      <p className={`text-sm ${styles.text} opacity-80 mt-1`}>
                        {alert.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {alert.time}
                        </div>
                        {alert.actionable && (
                          <button className={`text-xs font-medium ${styles.text} hover:underline`}>
                            {t('dashboard.alerts.takeAction')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {filteredAlerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <button className="text-sm text-gray-600 hover:text-gray-800">
              {t('dashboard.alerts.markAllAsRead')}
            </button>
            <button className="text-sm text-orange-600 hover:text-orange-800 font-medium">
              {t('dashboard.alerts.viewAllAlerts')}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SystemAlerts;
