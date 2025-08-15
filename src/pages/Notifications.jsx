// src/pages/Notifications.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Bell,
  Plus,
  Send,
  Users,
  MessageSquare,
  Calendar,
  Target,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
} from "lucide-react";
import NotificationForm from "../components/notifications/NotificationForm";
import EnhancedNotificationForm from "../components/notifications/EnhancedNotificationForm";
import NotificationList from "../components/notifications/NotificationList";
import NotificationStats from "../components/notifications/NotificationStats";
import NotificationTemplates from "../components/notifications/NotificationTemplates";

const Notifications = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("list");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [notifications, setNotifications] = useState([]);

  const tabs = [
    { id: "list", label: t('notifications.title'), icon: Bell },
    { id: "stats", label: t('viewModes.analytics'), icon: Target },
    { id: "templates", label: t('templates.welcomeNewUser'), icon: MessageSquare },
  ];

  const handleCreateNotification = () => {
    setSelectedNotification(null);
    setIsFormOpen(true);
  };

  const handleEditNotification = (notification) => {
    setSelectedNotification(notification);
    setIsFormOpen(true);
  };

  const handleSendNotification = async (notification) => {
    console.log("📤 Sending notification:", notification.title);

    if (notification.status === "sent") {
      alert("This notification has already been sent!");
      return;
    }

    if (notification.status === "scheduled") {
      const confirm = window.confirm(`This notification is scheduled. Send it now instead?`);
      if (!confirm) return;
    }

    try {
      // Simulate sending process
      console.log("🚀 Starting send process...");

      // Show loading state
      const sendPromise = new Promise(resolve => setTimeout(resolve, 2000));
      await sendPromise;

      console.log("✅ Notification sent successfully!");
      alert(`✅ Notification "${notification.title}" has been sent successfully!`);

      // Note: In a real app, you would make an API call here to send the notification
      // and update the notification status in your backend

    } catch (error) {
      console.error("❌ Failed to send notification:", error);
      alert("❌ Failed to send notification. Please try again.");
    }
  };

  const handleDeleteNotification = (notification) => {
    console.log("🗑️ Deleting notification:", notification.title);
    if (window.confirm(`Are you sure you want to delete "${notification.title}"?`)) {
      console.log("✅ Notification deleted successfully");
      alert(`Notification "${notification.title}" has been deleted.`);
      // Note: In a real app, you would make an API call here to delete the notification
      // For now, we'll just show the success message
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedNotification(null);
  };

  const handleFormSubmit = (formData) => {
    console.log("Form submitted:", formData);

    // Create new notification object
    const newNotification = {
      id: Date.now(),
      title: formData.title,
      message: formData.message,
      type: formData.type,
      status: formData.sendImmediately ? "sent" : "scheduled",
      audience: formData.audience,
      audienceCount: getAudienceCount(formData.audience, formData.userGroups),
      sentAt: formData.sendImmediately ? new Date().toLocaleString() : null,
      scheduledFor: formData.scheduledFor || null,
      createdAt: new Date().toLocaleString(),
      openRate: formData.sendImmediately ? Math.floor(Math.random() * 30 + 40) : null,
      clickRate: formData.sendImmediately ? Math.floor(Math.random() * 10 + 5) : null,
      deliveryStatus: formData.sendImmediately ? {
        sent: getAudienceCount(formData.audience, formData.userGroups),
        delivered: Math.floor(getAudienceCount(formData.audience, formData.userGroups) * 0.95),
        failed: Math.floor(getAudienceCount(formData.audience, formData.userGroups) * 0.05),
        opened: Math.floor(getAudienceCount(formData.audience, formData.userGroups) * 0.6),
        clicked: Math.floor(getAudienceCount(formData.audience, formData.userGroups) * 0.12),
        deliveryRate: 95 + Math.floor(Math.random() * 5),
      } : null,
      channels: formData.channels,
      automationRules: formData.automationRules,
      priority: formData.priority,
    };

    // Add to notifications list
    if (selectedNotification) {
      // Update existing notification
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === selectedNotification.id
            ? { ...newNotification, id: selectedNotification.id }
            : notif
        )
      );
    } else {
      // Add new notification to the beginning of the list
      setNotifications(prev => [newNotification, ...prev]);
    }

    setIsFormOpen(false);
    setSelectedNotification(null);
  };

  // Helper function to calculate audience count
  const getAudienceCount = (audience, userGroups) => {
    const audienceCounts = {
      all_users: 10000,
      new_users: 1234,
      active_users: 5678,
      inactive_users: 890,
      premium_users: 234,
      students: 456,
      location_based: 2500,
    };

    if (audience === "custom" && userGroups?.length > 0) {
      return userGroups.reduce((total, groupId) => {
        return total + (audienceCounts[groupId] || 0);
      }, 0);
    }

    return audienceCounts[audience] || 1000;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="h-6 w-6 mr-3 text-orange-600" />
            {t('notifications.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('notifications.subtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="sent">Sent</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
            <option value="failed">Failed</option>
          </select>
          <button
            onClick={handleCreateNotification}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('notifications.createNotification')}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold text-green-600">12,456</p>
              <p className="text-xs text-green-600 mt-1">+8.5% this month</p>
            </div>
            <Send className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Rate</p>
              <p className="text-2xl font-bold text-blue-600">68.5%</p>
              <p className="text-xs text-blue-600 mt-1">+2.3% vs last month</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-purple-600">3,247</p>
              <p className="text-xs text-purple-600 mt-1">Notification enabled</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-orange-600">15</p>
              <p className="text-xs text-orange-600 mt-1">Next 7 days</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "list" && (
            <NotificationList
              searchTerm={searchTerm}
              filterStatus={filterStatus}
              onEdit={handleEditNotification}
              onSend={handleSendNotification}
              onDelete={handleDeleteNotification}
              notifications={notifications}
            />
          )}
          {activeTab === "stats" && <NotificationStats />}
          {activeTab === "templates" && <NotificationTemplates />}
        </div>
      </div>

      {/* Notification Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <EnhancedNotificationForm
            notification={selectedNotification}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
