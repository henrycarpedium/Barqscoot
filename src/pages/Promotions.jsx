// src/pages/Promotions.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Plus,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  Search,
  Filter,
} from "lucide-react";
import PromotionList from "../components/promotions/PromotionList";
import PromotionForm from "../components/promotions/PromotionForm";
import PromotionScheduler from "../components/promotions/PromotionScheduler";
import PromotionAnalytics from "../components/promotions/PromotionAnalytics";

const Promotions = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    region: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  // Enhanced promotions data
  const promotions = [
    {
      id: 1,
      name: "New User Welcome",
      code: "WELCOME20",
      type: "percentage",
      value: 20,
      status: "active",
      used: 145,
      usageLimit: 500,
      perUserLimit: 1,
      startDate: "2024-01-01T00:00",
      endDate: "2024-03-31T23:59",
      revenue: 2850,
      conversionRate: 68.5,
      regions: ["all"],
      targetAudience: "new_users",
      description: "Welcome new users with 20% off their first ride",
    },
    {
      id: 2,
      name: "Weekend Special",
      code: "WEEKEND15",
      type: "percentage",
      value: 15,
      status: "active",
      used: 89,
      usageLimit: 200,
      perUserLimit: 2,
      startDate: "2024-01-15T00:00",
      endDate: "2024-02-15T23:59",
      revenue: 1245,
      conversionRate: 45.2,
      regions: ["downtown", "university"],
      targetAudience: "active_users",
      description: "Special weekend discount for frequent riders",
    },
    {
      id: 3,
      name: "Student Discount",
      code: "STUDENT10",
      type: "fixed",
      value: 5,
      status: "paused",
      used: 67,
      usageLimit: 1000,
      perUserLimit: 5,
      startDate: "2024-01-01T00:00",
      endDate: "2024-12-31T23:59",
      revenue: 890,
      conversionRate: 32.1,
      regions: ["university", "campus"],
      targetAudience: "students",
      description: "Fixed $5 discount for verified students",
    },
    {
      id: 4,
      name: "Summer Campaign",
      code: "SUMMER25",
      type: "percentage",
      value: 25,
      status: "scheduled",
      used: 0,
      usageLimit: 1000,
      perUserLimit: 3,
      startDate: "2024-06-01T00:00",
      endDate: "2024-08-31T23:59",
      revenue: 0,
      conversionRate: 0,
      regions: ["tourist", "downtown"],
      targetAudience: "all_users",
      description: "Summer promotion for tourist areas",
    },
  ];

  // Filter and search promotions
  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filters.status || promotion.status === filters.status;
    const matchesType = !filters.type || promotion.type === filters.type;
    const matchesRegion = !filters.region || promotion.regions.includes(filters.region);

    return matchesSearch && matchesStatus && matchesType && matchesRegion;
  });

  // Calculate tab counts
  const tabCounts = {
    active: promotions.filter(p => p.status === "active").length,
    scheduled: promotions.filter(p => p.status === "scheduled").length,
    expired: promotions.filter(p => p.status === "expired").length,
    paused: promotions.filter(p => p.status === "paused").length,
  };

  const tabs = [
    { id: "active", label: "Active Promotions", count: tabCounts.active },
    { id: "scheduled", label: "Scheduled", count: tabCounts.scheduled },
    { id: "expired", label: "Expired", count: tabCounts.expired },
    { id: "analytics", label: "Analytics", count: null },
  ];

  // Event handlers
  const handleCreatePromotion = () => {
    setSelectedPromotion(null);
    setShowForm(true);
  };

  const handleEditPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setShowForm(true);
  };

  const handleSchedulePromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setShowScheduler(true);
  };

  const handleFormSubmit = (formData) => {
    // Form submission is handled by the PromotionForm component
    setShowForm(false);
    setSelectedPromotion(null);
  };

  const handleScheduleSubmit = (scheduleData) => {
    // Schedule submission is handled by the PromotionScheduler component
    setShowScheduler(false);
    setSelectedPromotion(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      type: "",
      region: "",
    });
    setSearchTerm("");
  };

  // Get promotions for current tab
  const getPromotionsForTab = () => {
    let tabPromotions = filteredPromotions;

    if (activeTab !== "analytics") {
      tabPromotions = filteredPromotions.filter(promotion => {
        if (activeTab === "active") return promotion.status === "active";
        if (activeTab === "scheduled") return promotion.status === "scheduled";
        if (activeTab === "expired") return promotion.status === "expired";
        return true;
      });
    }

    return tabPromotions;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Tag className="h-6 w-6 mr-3 text-purple-600" />
            Promotions Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage promotional campaigns to boost user engagement
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCreatePromotion}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </button>
          <button
            onClick={() => handleSchedulePromotion(null)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
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
              <p className="text-sm text-gray-600">Active Promotions</p>
              <p className="text-2xl font-bold text-green-600">{tabCounts.active}</p>
              <p className="text-xs text-green-600 mt-1">2 ending soon</p>
            </div>
            <Tag className="h-8 w-8 text-green-600" />
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
              <p className="text-sm text-gray-600">Total Redemptions</p>
              <p className="text-2xl font-bold text-blue-600">1,234</p>
              <p className="text-xs text-blue-600 mt-1">+15% this month</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
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
              <p className="text-sm text-gray-600">Revenue Impact</p>
              <p className="text-2xl font-bold text-purple-600">$12,450</p>
              <p className="text-xs text-purple-600 mt-1">Generated revenue</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
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
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-orange-600">24.5%</p>
              <p className="text-xs text-orange-600 mt-1">+3.2% vs last month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      {activeTab !== "analytics" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search promotions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="paused">Paused</option>
                <option value="expired">Expired</option>
              </select>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              {(filters.status || filters.type || filters.region || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <button className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="h-4 w-4 mr-1" />
                More Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "analytics" ? (
            <PromotionAnalytics />
          ) : (
            <PromotionList
              promotions={getPromotionsForTab()}
              onEdit={handleEditPromotion}
              onSchedule={handleSchedulePromotion}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <PromotionForm
            promotion={selectedPromotion}
            onClose={() => setShowForm(false)}
            onSubmit={handleFormSubmit}
          />
        )}
        {showScheduler && (
          <PromotionScheduler
            promotion={selectedPromotion}
            onClose={() => setShowScheduler(false)}
            onSave={handleScheduleSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Promotions;
