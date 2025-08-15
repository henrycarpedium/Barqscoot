// src/components/notifications/EnhancedNotificationForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Send,
  Save,
  Users,
  Calendar,
  Type,
  Target,
  MapPin,
  Clock,
  Zap,
  Eye,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Settings,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const EnhancedNotificationForm = ({ notification, onClose, onSubmit }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("content");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: notification?.title || "",
    message: notification?.message || "",
    type: notification?.type || "promotional",
    priority: notification?.priority || "normal",

    // Targeting
    audience: notification?.audience || "all_users",
    userGroups: notification?.userGroups || [],
    customFilters: notification?.customFilters || {
      location: [],
      ageRange: { min: "", max: "" },
      registrationDate: { from: "", to: "" },
      activityLevel: "",
      deviceType: [],
    },

    // Scheduling
    scheduledFor: notification?.scheduledFor || "",
    timezone: notification?.timezone || "UTC",
    sendImmediately: notification?.sendImmediately !== false,

    // Automation
    isAutomated: notification?.isAutomated || false,
    automationRules: notification?.automationRules || {
      systemUpdates: false,
      promotions: false,
      outages: false,
      lowBattery: false,
      maintenanceAlerts: false,
    },

    // Delivery options
    channels: notification?.channels || ["push", "email"],
    deliveryOptions: notification?.deliveryOptions || {
      retryAttempts: 3,
      retryInterval: 30,
      fallbackChannel: "email",
    },

    // Testing
    testMode: false,
    testUsers: [],

    ...notification,
  });

  // Mock user groups data
  const userGroups = [
    { id: "new_users", name: "New Users", count: 1234 },
    { id: "active_users", name: "Active Users", count: 5678 },
    { id: "inactive_users", name: "Inactive Users", count: 890 },
    { id: "premium_users", name: "Premium Users", count: 234 },
    { id: "students", name: "Students", count: 456 },
  ];

  // Mutations - Using mock implementation for demo
  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock successful response
      return { id: Date.now(), ...data, status: 'sent' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      onSubmit(formData);
      onClose();
      alert("✅ Notification created successfully!");
    },
    onError: (error) => {
      setErrors({ submit: "Failed to create notification - API not connected" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock successful response
      return { ...notification, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      onSubmit(formData);
      onClose();
      alert("✅ Notification updated successfully!");
    },
    onError: (error) => {
      setErrors({ submit: "Failed to update notification - API not connected" });
    },
  });

  const testMutation = useMutation({
    mutationFn: async (data) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Mock successful response
      return { success: true };
    },
    onSuccess: () => {
      alert("✅ Test notification sent successfully to " + formData.testUsers.join(", "));
    },
    onError: () => {
      alert("❌ Failed to send test notification - API not connected");
    },
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (formData.audience === "custom" && formData.userGroups.length === 0) {
      newErrors.userGroups = "Select at least one user group for custom audience";
    }
    if (formData.testMode && formData.testUsers.length === 0) {
      newErrors.testUsers = "Add test users for test mode";
    }
    if (formData.channels.length === 0) {
      newErrors.channels = "Select at least one delivery channel";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (notification?.id) {
        updateMutation.mutate(formData);
      } else {
        createMutation.mutate(formData);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const addTestUser = () => {
    const email = prompt("Enter test user email:");
    if (email && !formData.testUsers.includes(email)) {
      setFormData(prev => ({
        ...prev,
        testUsers: [...prev.testUsers, email]
      }));
    }
  };

  const removeTestUser = (email) => {
    setFormData(prev => ({
      ...prev,
      testUsers: prev.testUsers.filter(user => user !== email)
    }));
  };

  const handleTestSend = () => {
    if (validateForm()) {
      testMutation.mutate(formData);
    }
  };

  const tabs = [
    { id: "content", label: "Content", icon: Type },
    { id: "targeting", label: "Targeting", icon: Target },
    { id: "scheduling", label: "Scheduling", icon: Calendar },
    { id: "automation", label: "Automation", icon: Zap },
    { id: "delivery", label: "Delivery", icon: Send },
  ];

  const getChannelIcon = (channel) => {
    switch (channel) {
      case "push": return Bell;
      case "email": return Mail;
      case "sms": return MessageSquare;
      case "in-app": return Smartphone;
      default: return Bell;
    }
  };

  const getEstimatedReach = () => {
    if (formData.audience === "all_users") return "~10,000 users";
    if (formData.audience === "custom") {
      const selectedGroups = userGroups.filter(g => formData.userGroups.includes(g.id));
      const total = selectedGroups.reduce((sum, group) => sum + group.count, 0);
      return `~${total.toLocaleString()} users`;
    }
    const group = userGroups.find(g => g.id === formData.audience);
    return group ? `~${group.count.toLocaleString()} users` : "Unknown";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Send className="h-6 w-6 text-orange-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {notification ? "Edit Notification" : "Create Notification"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Estimated reach: {getEstimatedReach()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleTestSend}
              disabled={testMutation.isPending || !formData.testUsers.length}
              className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              Test Send
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Content Tab */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter notification title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="promotional">Promotional</option>
                    <option value="system">System Update</option>
                    <option value="alert">Alert/Outage</option>
                    <option value="reminder">Reminder</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your notification message"
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Users
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={addTestUser}
                      className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Test User
                    </button>
                    <span className="text-sm text-gray-600">
                      {formData.testUsers.length} users
                    </span>
                  </div>
                  {formData.testUsers.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {formData.testUsers.map((email) => (
                        <div key={email} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                          <span className="text-sm">{email}</span>
                          <button
                            type="button"
                            onClick={() => removeTestUser(email)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Targeting Tab */}
          {activeTab === "targeting" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Target Audience
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="audience"
                      value="all_users"
                      checked={formData.audience === "all_users"}
                      onChange={handleChange}
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Users (~10,000)</span>
                  </label>

                  {userGroups.map(group => (
                    <label key={group.id} className="flex items-center">
                      <input
                        type="radio"
                        name="audience"
                        value={group.id}
                        checked={formData.audience === group.id}
                        onChange={handleChange}
                        className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {group.name} (~{group.count.toLocaleString()})
                      </span>
                    </label>
                  ))}

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="audience"
                      value="custom"
                      checked={formData.audience === "custom"}
                      onChange={handleChange}
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Custom Selection</span>
                  </label>
                </div>
              </div>

              {formData.audience === "custom" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select User Groups
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {userGroups.map(group => (
                      <label key={group.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.userGroups.includes(group.id)}
                          onChange={() => handleArrayChange("userGroups", group.id)}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">
                          {group.name} ({group.count.toLocaleString()})
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.userGroups && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.userGroups}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Scheduling Tab */}
          {activeTab === "scheduling" && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="sendImmediately"
                    checked={formData.sendImmediately}
                    onChange={handleChange}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Send Immediately</span>
                </label>
              </div>

              {!formData.sendImmediately && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduledFor"
                      value={formData.scheduledFor}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="CST">Central Time</option>
                      <option value="MST">Mountain Time</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Automation Tab */}
          {activeTab === "automation" && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="isAutomated"
                    checked={formData.isAutomated}
                    onChange={handleChange}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Enable Automation</span>
                </label>
                <p className="text-xs text-gray-500">
                  Automatically send this notification when specific events occur
                </p>
              </div>

              {formData.isAutomated && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Automation Triggers
                  </label>
                  <div className="space-y-3">
                    {[
                      { key: "systemUpdates", label: "System Updates", desc: "Send when system updates are available" },
                      { key: "promotions", label: "New Promotions", desc: "Send when new promotions are created" },
                      { key: "outages", label: "Service Outages", desc: "Send during service disruptions" },
                      { key: "lowBattery", label: "Low Battery Alerts", desc: "Send when scooter batteries are low" },
                      { key: "maintenanceAlerts", label: "Maintenance Alerts", desc: "Send for scheduled maintenance" },
                    ].map(rule => (
                      <div key={rule.key} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={formData.automationRules[rule.key]}
                          onChange={(e) => handleNestedChange("automationRules", rule.key, e.target.checked)}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{rule.label}</p>
                          <p className="text-xs text-gray-600">{rule.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Delivery Tab */}
          {activeTab === "delivery" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Delivery Channels *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: "push", label: "Push Notification", icon: Bell },
                    { key: "email", label: "Email", icon: Mail },
                    { key: "sms", label: "SMS", icon: MessageSquare },
                    { key: "in-app", label: "In-App", icon: Smartphone },
                  ].map(channel => {
                    const IconComponent = channel.icon;
                    return (
                      <label key={channel.key} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.channels.includes(channel.key)}
                          onChange={() => handleArrayChange("channels", channel.key)}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <IconComponent className="h-5 w-5 text-gray-600" />
                        <span className="text-sm text-gray-700">{channel.label}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.channels && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.channels}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retry Attempts
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={formData.deliveryOptions.retryAttempts}
                    onChange={(e) => handleNestedChange("deliveryOptions", "retryAttempts", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retry Interval (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.deliveryOptions.retryInterval}
                    onChange={(e) => handleNestedChange("deliveryOptions", "retryInterval", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fallback Channel
                  </label>
                  <select
                    value={formData.deliveryOptions.fallbackChannel}
                    onChange={(e) => handleNestedChange("deliveryOptions", "fallbackChannel", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push</option>
                    <option value="in-app">In-App</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-700">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              {createMutation.isPending || updateMutation.isPending ? "Sending..." :
               formData.sendImmediately ? "Send Now" : "Schedule"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EnhancedNotificationForm;
