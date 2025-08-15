// src/components/dashboard/TrendsAnalytics.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Calendar,
  Users,
  Bike,
  MapPin,
  TrendingUp,
  BarChart3,
  Activity,
} from "lucide-react";

// Import individual trend components
import BookingTrends from "./BookingTrends";
import UserTrends from "./UserTrends";
import FleetTrends from "./FleetTrends";
import LocationTrends from "./LocationTrends";

// Import the new Revenue component we'll create
import RevenueTrends from "./RevenueTrends";

const TrendsAnalytics = () => {
  const [activeTab, setActiveTab] = useState("revenue");

  const tabs = [
    {
      id: "revenue",
      label: "Revenue Metrics",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      component: RevenueTrends,
    },
    {
      id: "bookings",
      label: "Booking Trends",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      component: BookingTrends,
    },
    {
      id: "users",
      label: "User Activity",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      component: UserTrends,
    },
    {
      id: "fleet",
      label: "Fleet Performance",
      icon: Bike,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      component: FleetTrends,
    },
    {
      id: "locations",
      label: "Location Analytics",
      icon: MapPin,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      component: LocationTrends,
    },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-gray-600" />
            Analytics Dashboard
          </h2>
          
          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? `${tab.bgColor} ${tab.color} ${tab.borderColor} border-2 shadow-sm` 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {ActiveComponent && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveComponent />
          </motion.div>
        )}
      </div>

      {/* Tab Indicator */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Activity className="h-3 w-3 mr-1" />
            <span>Real-time data updates every 60 seconds</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>Showing {activeTabData?.label.toLowerCase()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrendsAnalytics;
