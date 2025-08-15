// src/components/notifications/NotificationList.jsx
import React from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  Send, 
  Clock, 
  Users, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

const NotificationList = ({ searchTerm, filterStatus, onEdit, onSend, onDelete, notifications: propNotifications }) => {
  // Use prop notifications or fallback to mock data
  const defaultNotifications = [
    {
      id: 1,
      title: "Welcome to BarqScoot!",
      message: "Start your first ride with 20% off using code WELCOME20",
      type: "promotional",
      status: "sent",
      audience: "new_users",
      audienceCount: 145,
      sentAt: "2024-01-15 10:30",
      openRate: 68.5,
      clickRate: 12.3,
      deliveryStatus: {
        sent: 145,
        delivered: 138,
        failed: 7,
        opened: 99,
        clicked: 18,
        deliveryRate: 95,
      },
      channels: ["push", "email"],
    },
    {
      id: 2,
      title: "Maintenance Alert",
      message: "Scheduled maintenance in your area from 2-4 AM",
      type: "system",
      status: "scheduled",
      audience: "location_based",
      audienceCount: 89,
      scheduledFor: "2024-01-16 02:00",
      openRate: null,
      clickRate: null,
      channels: ["push", "sms"],
    },
    {
      id: 3,
      title: "Weekend Special Offer",
      message: "Enjoy 15% off all weekend rides!",
      type: "promotional",
      status: "draft",
      audience: "active_users",
      audienceCount: 567,
      createdAt: "2024-01-14 15:45",
      openRate: null,
      clickRate: null,
      channels: ["push", "email", "in-app"],
    },
  ];

  const notifications = propNotifications && propNotifications.length > 0 ? propNotifications : defaultNotifications;

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "draft":
        return <Edit className="h-4 w-4 text-gray-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "promotional":
        return "bg-purple-100 text-purple-800";
      case "system":
        return "bg-orange-100 text-orange-800";
      case "alert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || notification.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Create your first notification to get started"
            }
          </p>
        </div>
      ) : (
        filteredNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {notification.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                    {getStatusIcon(notification.status)}
                    <span className="ml-1">{notification.status}</span>
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                    {notification.type}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{notification.message}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {notification.audienceCount.toLocaleString()} users
                    </span>
                  </div>
                  
                  {notification.status === "sent" && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {notification.openRate}% opened
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Send className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {notification.clickRate}% clicked
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          Sent {notification.sentAt}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {notification.status === "scheduled" && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        Scheduled for {notification.scheduledFor}
                      </span>
                    </div>
                  )}
                  
                  {notification.status === "draft" && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        Created {notification.createdAt}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-6">
                <button
                  onClick={() => onEdit(notification)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit notification"
                >
                  <Edit className="h-4 w-4" />
                </button>
                {notification.status !== "sent" && onSend && (
                  <button
                    onClick={() => onSend(notification)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Send notification"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(notification)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default NotificationList;
