// src/components/bookings/BookingManagementSummary.jsx
import { motion } from "framer-motion";
import {
  Calendar,
  Filter,
  AlertTriangle,
  Eye,
  Play,
  CheckCircle,
  Clock,
  Users,
  MapPin,
  TrendingUp,
} from "lucide-react";

const BookingManagementSummary = () => {
  const features = [
    {
      title: "Advanced Filtering",
      description: "Filter bookings by user, region, time range, status, and amount",
      icon: Filter,
      color: "bg-blue-50 text-blue-600",
      items: [
        "Quick date range selection (Today, Yesterday, Last 7/30 days)",
        "Custom date range picker",
        "Filter by region (Downtown, University, Airport, etc.)",
        "User type filtering (Regular, Premium, Student, Corporate)",
        "Amount and duration range filters",
        "User search by ID, email, or phone",
        "Status filtering including disputed bookings",
      ],
    },
    {
      title: "Dispute Management",
      description: "Handle booking disputes and overcharge resolutions efficiently",
      icon: AlertTriangle,
      color: "bg-orange-50 text-orange-600",
      items: [
        "View all disputes with priority levels",
        "Filter disputes by status (Pending, Investigating, Resolved)",
        "Detailed dispute information with user details",
        "Evidence attachment viewing",
        "Resolution workflow with notes",
        "Approve/reject disputes with refund processing",
        "Dispute history tracking",
      ],
    },
    {
      title: "Ride History Replay",
      description: "Replay ride history for verification and analysis",
      icon: Play,
      color: "bg-green-50 text-green-600",
      items: [
        "Interactive ride replay with timeline",
        "Real-time event tracking during rides",
        "Speed, battery, and location monitoring",
        "Playback controls (Play, Pause, Speed adjustment)",
        "Event-based navigation",
        "Route visualization on map",
        "Detailed ride summary and statistics",
      ],
    },
  ];

  const stats = [
    {
      title: "Live Bookings",
      value: "1,247",
      change: "+12%",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Historical Records",
      value: "45,892",
      change: "+8%",
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Active Disputes",
      value: "23",
      change: "-15%",
      icon: AlertTriangle,
      color: "text-orange-600",
    },
    {
      title: "Resolved Issues",
      value: "156",
      change: "+25%",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Comprehensive booking management with advanced filtering, dispute resolution,
          and ride history replay capabilities for complete operational control.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-gray-50`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {feature.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Quick Actions
          </h3>
          <p className="text-gray-600">
            Access key booking management features instantly
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <Eye className="w-5 h-5 text-blue-600 mr-3" />
            <span className="font-medium text-gray-900">View Live Bookings</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <AlertTriangle className="w-5 h-5 text-orange-600 mr-3" />
            <span className="font-medium text-gray-900">Manage Disputes</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <Play className="w-5 h-5 text-green-600 mr-3" />
            <span className="font-medium text-gray-900">Replay Ride History</span>
          </motion.button>
        </div>
      </div>

      {/* Implementation Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Implementation Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Enhanced Filters</p>
              <p className="text-sm text-gray-600">Fully implemented</p>
            </div>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Dispute Management</p>
              <p className="text-sm text-gray-600">Fully implemented</p>
            </div>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Ride History Replay</p>
              <p className="text-sm text-gray-600">Fully implemented</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManagementSummary;
