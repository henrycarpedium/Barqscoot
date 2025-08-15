// src/components/dashboard/RecentActivities.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Activity,
  User,
  Bike,
  DollarSign,
  MapPin,
  Clock,
  Settings,
  AlertTriangle,
  CheckCircle,
  Filter,
  RefreshCw,
} from "lucide-react";

const RecentActivities = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all"); // all, rides, maintenance, users, system
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock recent activities data
  const activities = [
    {
      id: 1,
      type: "ride",
      title: "Ride Completed",
      description: "User John D. completed a 15-minute ride",
      details: "SC-001 • Downtown → University • $4.75",
      time: "2 minutes ago",
      icon: Bike,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: 2,
      type: "user",
      title: "New User Registration",
      description: "Sarah M. created a new account",
      details: "Email verified • Payment method added",
      time: "5 minutes ago",
      icon: User,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      id: 3,
      type: "maintenance",
      title: "Maintenance Completed",
      description: "SC-003 maintenance task finished",
      details: "Battery replacement • Brake adjustment",
      time: "8 minutes ago",
      icon: Settings,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      id: 4,
      type: "ride",
      title: "Ride Started",
      description: "User Mike R. started a new ride",
      details: "SC-007 • Business District",
      time: "10 minutes ago",
      icon: MapPin,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: 5,
      type: "system",
      title: "Low Battery Alert",
      description: "SC-005 battery dropped below 20%",
      details: "Current: 18% • Location: Shopping Mall",
      time: "12 minutes ago",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      id: 6,
      type: "ride",
      title: "Payment Processed",
      description: "Payment of $6.25 processed successfully",
      details: "User: Emma K. • Ride ID: R-1234",
      time: "15 minutes ago",
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      id: 7,
      type: "system",
      title: "Scooter Back Online",
      description: "SC-002 reconnected to network",
      details: "Offline for 45 minutes • All systems normal",
      time: "18 minutes ago",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      id: 8,
      type: "maintenance",
      title: "Maintenance Scheduled",
      description: "SC-009 scheduled for tomorrow",
      details: "Routine inspection • 500km milestone",
      time: "22 minutes ago",
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      id: 9,
      type: "user",
      title: "Account Suspended",
      description: "User account temporarily suspended",
      details: "Multiple violations • Manual review required",
      time: "25 minutes ago",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      id: 10,
      type: "ride",
      title: "Ride Cancelled",
      description: "User cancelled ride before starting",
      details: "SC-004 • No charges applied",
      time: "28 minutes ago",
      icon: Bike,
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
  ];

  const filteredActivities = activities.filter(activity => {
    if (filter === "all") return true;
    return activity.type === filter;
  });

  const getFilterCount = (type) => {
    if (type === "all") return activities.length;
    return activities.filter(a => a.type === type).length;
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
            <Activity className="h-5 w-5 mr-2 text-purple-600" />
            Recent Activities
          </h3>
          <p className="text-sm text-gray-600">
            Live feed of system activities and events
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm ${
              autoRefresh 
                ? "bg-green-100 text-green-700" 
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <RefreshCw className={`h-3 w-3 ${autoRefresh ? "animate-spin" : ""}`} />
            <span>Auto</span>
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Activities ({getFilterCount("all")})</option>
            <option value="ride">Rides ({getFilterCount("ride")})</option>
            <option value="user">Users ({getFilterCount("user")})</option>
            <option value="maintenance">Maintenance ({getFilterCount("maintenance")})</option>
            <option value="system">System ({getFilterCount("system")})</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredActivities.map((activity, index) => {
          const IconComponent = activity.icon;
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${activity.bg} flex-shrink-0`}>
                <IconComponent className={`h-4 w-4 ${activity.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                
                {activity.details && (
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.details}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Activity Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600">Rides Today</p>
            <p className="text-lg font-semibold text-blue-600">
              {activities.filter(a => a.type === "ride").length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">New Users</p>
            <p className="text-lg font-semibold text-green-600">
              {activities.filter(a => a.type === "user" && a.title.includes("New")).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Maintenance</p>
            <p className="text-lg font-semibold text-orange-600">
              {activities.filter(a => a.type === "maintenance").length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Alerts</p>
            <p className="text-lg font-semibold text-red-600">
              {activities.filter(a => a.icon === AlertTriangle).length}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
          View All Activities
        </button>
      </div>
    </motion.div>
  );
};

export default RecentActivities;
