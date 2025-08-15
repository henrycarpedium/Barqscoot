// src/components/notifications/NotificationTemplates.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  MessageSquare,
  Plus,
  Tag,
  AlertTriangle,
  Gift,
  Bell,
  Users,
  Calendar,
  Edit,
  Copy,
  Trash2,
  Search,
} from "lucide-react";

const NotificationTemplates = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const templates = [
    {
      id: 1,
      name: "Welcome New User",
      category: "onboarding",
      type: "promotional",
      title: "Welcome to BarqScoot! 🛴",
      message: "Start your first ride with 20% off using code WELCOME20. Download the app and explore your city!",
      audience: "new_users",
      channels: ["push", "email"],
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      usageCount: 1234,
    },
    {
      id: 2,
      name: "Promotional Offer",
      category: "marketing",
      type: "promotional",
      title: "Weekend Special - 15% Off! 🎉",
      message: "Enjoy 15% off all rides this weekend. Use code WEEKEND15 and save on every trip!",
      audience: "active_users",
      channels: ["push", "email", "sms"],
      icon: Gift,
      color: "bg-purple-100 text-purple-600",
      usageCount: 890,
    },
    {
      id: 3,
      name: "Maintenance Alert",
      category: "system",
      type: "alert",
      title: "Scheduled Maintenance Notice ⚠️",
      message: "We'll be performing maintenance in your area from 2-4 AM tonight. Service may be temporarily unavailable.",
      audience: "location_based",
      channels: ["push", "sms"],
      icon: AlertTriangle,
      color: "bg-orange-100 text-orange-600",
      usageCount: 567,
    },
    {
      id: 4,
      name: "Ride Reminder",
      category: "engagement",
      type: "reminder",
      title: "Ready for your next ride? 🚀",
      message: "It's been a while since your last ride. Book now and get back on the road!",
      audience: "inactive_users",
      channels: ["push", "email"],
      icon: Bell,
      color: "bg-green-100 text-green-600",
      usageCount: 445,
    },
    {
      id: 5,
      name: "Payment Failed",
      category: "transactional",
      type: "alert",
      title: "Payment Issue - Action Required 💳",
      message: "We couldn't process your payment. Please update your payment method to continue using BarqScoot.",
      audience: "payment_failed",
      channels: ["push", "email", "sms"],
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600",
      usageCount: 234,
    },
    {
      id: 6,
      name: "Ride Completed",
      category: "transactional",
      type: "confirmation",
      title: "Ride Complete - Thanks! ✅",
      message: "Your ride is complete. Total: $12.50. Rate your experience and help us improve!",
      audience: "recent_riders",
      channels: ["push", "email"],
      icon: Tag,
      color: "bg-teal-100 text-teal-600",
      usageCount: 2156,
    },
  ];

  const categories = [
    { id: "all", label: t('templates.categories.all'), count: templates.length },
    { id: "onboarding", label: t('templates.categories.onboarding'), count: templates.filter(t => t.category === "onboarding").length },
    { id: "marketing", label: t('templates.categories.marketing'), count: templates.filter(t => t.category === "marketing").length },
    { id: "system", label: "System", count: templates.filter(t => t.category === "system").length },
    { id: "engagement", label: "Engagement", count: templates.filter(t => t.category === "engagement").length },
    { id: "transactional", label: t('templates.categories.transactional'), count: templates.filter(t => t.category === "transactional").length },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template) => {
    console.log("📝 Using template:", template.name);
    alert(`Template "${template.name}" will be loaded into the notification form.`);
  };

  const handleEditTemplate = (template) => {
    console.log("✏️ Editing template:", template.name);
    alert(`Edit template "${template.name}" functionality would open here.`);
  };

  const handleCopyTemplate = (template) => {
    console.log("📋 Copying template:", template.name);
    alert(`Template "${template.name}" has been copied.`);
  };

  const handleDeleteTemplate = (template) => {
    console.log("🗑️ Deleting template:", template.name);
    if (window.confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      alert(`Template "${template.name}" has been deleted.`);
    }
  };

  const handleCreateTemplate = () => {
    console.log("➕ Creating new template");
    alert("Create new template functionality would open here.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t('templates.title')}</h2>
          <p className="text-gray-600 mt-1">{t('templates.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('templates.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={handleCreateTemplate}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('templates.createTemplate')}
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-orange-100 text-orange-700 border border-orange-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('templates.noTemplatesFound')}</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== "all"
                ? t('templates.tryAdjustingFilters')
                : t('templates.createFirstTemplate')
              }
            </p>
          </div>
        ) : (
          filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${template.color}`}>
                    <template.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{template.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title={t('templates.editTemplate')}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleCopyTemplate(template)}
                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                    title={t('templates.copyTemplate')}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title={t('templates.deleteTemplate')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Title</h4>
                  <p className="text-gray-700">{template.title}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Message</h4>
                  <p className="text-gray-600 text-sm line-clamp-3">{template.message}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{t('templates.usedTimes', { count: template.usageCount.toLocaleString() })}</span>
                  <span className="capitalize">{template.type}</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {template.channels.map(channel => (
                    <span
                      key={channel}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs capitalize"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleUseTemplate(template)}
                className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              >
                {t('templates.useTemplate')}
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationTemplates;
