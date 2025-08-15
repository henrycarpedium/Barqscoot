// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Bike,
  Calendar,
  FileText,
  Bell,
  Tag,
  Activity,
  MapPin,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Headphones,
  DollarSign,
  BarChart3,
  Shield,
  Lightbulb,
  Truck
} from "lucide-react";

const Sidebar = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState(new Set(["Operations", "Marketing"]));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define menu items with translation keys
  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, labelKey: "sidebar.dashboard" },
    { path: "/users", icon: Users, labelKey: "sidebar.users" },
    { path: "/scooters", icon: Bike, labelKey: "sidebar.scooters" },
    { path: "/bookings", icon: Calendar, labelKey: "sidebar.bookings" },
    { path: "/support", icon: Headphones, labelKey: "sidebar.customerSupport" },
    { path: "/pricing", icon: DollarSign, labelKey: "sidebar.dynamicPricing" },
    { path: "/reports", icon: FileText, labelKey: "sidebar.reportsAnalytics" },
    {
      labelKey: "sidebar.operations",
      isGroup: true,
      items: [
        { path: "/fleet-monitoring", icon: Truck, labelKey: "sidebar.fleetMonitoring" },
        { path: "/geofencing", icon: MapPin, labelKey: "sidebar.geofencing" },
        { path: "/incidents", icon: AlertTriangle, labelKey: "sidebar.incidents" },
      ]
    },
    {
      labelKey: "sidebar.marketing",
      isGroup: true,
      items: [
        { path: "/notifications", icon: Bell, labelKey: "sidebar.notifications" },
        { path: "/promotions", icon: Tag, labelKey: "sidebar.promotions" },
      ]
    },
    { path: "/settings", icon: Settings, labelKey: "sidebar.settings" },
  ];

  const toggleGroup = (groupLabel) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupLabel)) {
      newExpanded.delete(groupLabel);
    } else {
      newExpanded.add(groupLabel);
    }
    setExpandedGroups(newExpanded);
  };

  const MenuItem = ({ icon: Icon, labelKey, path }) => {
    return (
      <NavLink
        to={path}
        className={({ isActive }) =>
          `flex items-center px-4 py-3 text-gray-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors duration-200 ${
            isActive ? "bg-teal-50 text-teal-700" : ""
          }`
        }>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Icon className="h-5 w-5" />
        </motion.div>
        <span className="ml-3">{t(labelKey)}</span>
      </NavLink>
    );
  };

  const GroupHeader = ({ labelKey, isExpanded, onToggle }) => {
    return (
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
      >
        <span>{t(labelKey)}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="h-4 w-4" />
        </motion.div>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Bike className="h-8 w-8 text-teal-600" />
          <span className="text-xl font-bold text-gray-900">{t('sidebar.brand')}</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            if (item.isGroup) {
              const groupLabel = t(item.labelKey);
              const isExpanded = expandedGroups.has(groupLabel);
              return (
                <div key={item.labelKey}>
                  <GroupHeader
                    labelKey={item.labelKey}
                    isExpanded={isExpanded}
                    onToggle={() => toggleGroup(groupLabel)}
                  />
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 space-y-1"
                    >
                      {item.items.map((subItem) => (
                        <MenuItem key={subItem.path} {...subItem} />
                      ))}
                    </motion.div>
                  )}
                </div>
              );
            }
            return <MenuItem key={item.path} {...item} />;
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200 w-full">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <LogOut className="h-5 w-5" />
          </motion.div>
          <span className="ml-3">{t('sidebar.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
