// src/components/promotions/PromotionScheduler.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Save,
  AlertCircle,
  CheckCircle,
  Users,
  Tag,
} from "lucide-react";

const PromotionScheduler = ({ promotion, onClose, onSave }) => {
  const [scheduleData, setScheduleData] = useState({
    startDate: promotion?.startDate || "",
    endDate: promotion?.endDate || "",
    timezone: promotion?.timezone || "UTC",
    autoActivate: promotion?.autoActivate || true,
    sendNotification: promotion?.sendNotification || true,
    notificationMessage: promotion?.notificationMessage || "",
    reminderSettings: promotion?.reminderSettings || {
      enabled: false,
      reminderTime: "1", // hours before
      reminderMessage: "",
    },
  });

  const [errors, setErrors] = useState({});

  const timezoneOptions = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "EST", label: "EST (Eastern Standard Time)" },
    { value: "PST", label: "PST (Pacific Standard Time)" },
    { value: "CST", label: "CST (Central Standard Time)" },
    { value: "MST", label: "MST (Mountain Standard Time)" },
    { value: "GMT", label: "GMT (Greenwich Mean Time)" },
  ];

  const validateSchedule = () => {
    const newErrors = {};

    if (!scheduleData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!scheduleData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (scheduleData.startDate && scheduleData.endDate) {
      const startDate = new Date(scheduleData.startDate);
      const endDate = new Date(scheduleData.endDate);
      const now = new Date();

      if (startDate <= now) {
        newErrors.startDate = "Start date must be in the future";
      }

      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (scheduleData.sendNotification && !scheduleData.notificationMessage.trim()) {
      newErrors.notificationMessage = "Notification message is required";
    }

    if (scheduleData.reminderSettings.enabled && !scheduleData.reminderSettings.reminderMessage.trim()) {
      newErrors.reminderMessage = "Reminder message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setScheduleData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleReminderChange = (field, value) => {
    setScheduleData(prev => ({
      ...prev,
      reminderSettings: {
        ...prev.reminderSettings,
        [field]: value,
      },
    }));

    // Clear error when user starts typing
    if (errors.reminderMessage) {
      setErrors(prev => ({ ...prev, reminderMessage: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateSchedule()) {
      console.log("Schedule data:", scheduleData);
      
      const scheduledPromotion = {
        ...promotion,
        ...scheduleData,
        status: "scheduled",
        scheduledAt: new Date().toISOString(),
      };

      onSave(scheduledPromotion);
      alert(`📅 Promotion "${promotion?.name || 'New Promotion'}" has been scheduled successfully!`);
    }
  };

  const getScheduleSummary = () => {
    if (!scheduleData.startDate || !scheduleData.endDate) return null;

    const startDate = new Date(scheduleData.startDate);
    const endDate = new Date(scheduleData.endDate);
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    return {
      startDate: startDate.toLocaleDateString(),
      startTime: startDate.toLocaleTimeString(),
      endDate: endDate.toLocaleDateString(),
      endTime: endDate.toLocaleTimeString(),
      duration: duration,
    };
  };

  const summary = getScheduleSummary();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Schedule Promotion
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {promotion ? `Configure schedule for "${promotion.name}"` : "Set up promotion schedule"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Schedule Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={scheduleData.startDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.startDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={scheduleData.endDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.endDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={scheduleData.timezone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {timezoneOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Automation Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Automation Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="autoActivate"
                    checked={scheduleData.autoActivate}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Automatically activate promotion at start time
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="sendNotification"
                    checked={scheduleData.sendNotification}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Send notification when promotion starts
                  </span>
                </label>

                {scheduleData.sendNotification && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Message *
                    </label>
                    <textarea
                      name="notificationMessage"
                      value={scheduleData.notificationMessage}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.notificationMessage ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter notification message for users..."
                    />
                    {errors.notificationMessage && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.notificationMessage}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Reminder Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reminder Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={scheduleData.reminderSettings.enabled}
                    onChange={(e) => handleReminderChange("enabled", e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Send reminder before promotion starts
                  </span>
                </label>

                {scheduleData.reminderSettings.enabled && (
                  <div className="ml-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reminder Time
                      </label>
                      <select
                        value={scheduleData.reminderSettings.reminderTime}
                        onChange={(e) => handleReminderChange("reminderTime", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="1">1 hour before</option>
                        <option value="2">2 hours before</option>
                        <option value="6">6 hours before</option>
                        <option value="12">12 hours before</option>
                        <option value="24">1 day before</option>
                        <option value="48">2 days before</option>
                        <option value="168">1 week before</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reminder Message *
                      </label>
                      <textarea
                        value={scheduleData.reminderSettings.reminderMessage}
                        onChange={(e) => handleReminderChange("reminderMessage", e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.reminderMessage ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter reminder message..."
                      />
                      {errors.reminderMessage && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.reminderMessage}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule Summary */}
            {summary && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="text-sm font-medium text-blue-900">Schedule Summary</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700">
                      <span className="font-medium">Starts:</span> {summary.startDate} at {summary.startTime}
                    </p>
                    <p className="text-blue-700">
                      <span className="font-medium">Ends:</span> {summary.endDate} at {summary.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700">
                      <span className="font-medium">Duration:</span> {summary.duration} days
                    </p>
                    <p className="text-blue-700">
                      <span className="font-medium">Timezone:</span> {scheduleData.timezone}
                    </p>
                  </div>
                </div>
                {promotion && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex items-center space-x-4 text-sm text-blue-700">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        <span>{promotion.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{promotion.targetAudience?.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Schedule Promotion
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PromotionScheduler;
