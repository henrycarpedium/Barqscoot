// src/components/pricing/PricingRules.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Clock,
  MapPin,
  TrendingUp,
  Users,
  Calendar,
  Zap,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Filter,
  Search,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pricingService } from "../../services/pricingApi";

const PricingRules = ({ rules, zones, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [showNewRuleModal, setShowNewRuleModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    type: "time_based",
    multiplier: 1.5,
    maxMultiplier: 2.0,
    conditions: {}
  });
  const queryClient = useQueryClient();

  // Update rule mutation
  const updateRuleMutation = useMutation({
    mutationFn: async ({ ruleId, updateData }) => {
      return await pricingService.updateRule(ruleId, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pricing-rules"]);
    },
  });

  // Delete rule mutation
  const deleteRuleMutation = useMutation({
    mutationFn: async (ruleId) => {
      return await pricingService.deleteRule(ruleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pricing-rules"]);
    },
  });

  // Create rule mutation
  const createRuleMutation = useMutation({
    mutationFn: async (ruleData) => {
      return await pricingService.createRule(ruleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pricing-rules"]);
      setShowNewRuleModal(false);
      setNewRule({
        name: "",
        description: "",
        type: "time_based",
        multiplier: 1.5,
        maxMultiplier: 2.0,
        conditions: {}
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600">Loading pricing rules...</span>
      </div>
    );
  }

  if (!rules) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
        <p>Unable to load pricing rules</p>
      </div>
    );
  }

  const handleToggleRule = (ruleId, currentStatus) => {
    updateRuleMutation.mutate({
      ruleId,
      updateData: { isActive: !currentStatus }
    });
  };

  const handleDeleteRule = (ruleId) => {
    if (window.confirm('Are you sure you want to delete this pricing rule?')) {
      deleteRuleMutation.mutate(ruleId);
    }
  };

  const handleCreateRule = () => {
    if (!newRule.name.trim() || !newRule.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    createRuleMutation.mutate({
      ...newRule,
      id: `rule-${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      pricing: {
        multiplier: newRule.multiplier,
        maxMultiplier: newRule.maxMultiplier
      },
      performance: {
        avgRevenueLift: 0,
        customerSatisfaction: 4.5,
        utilizationIncrease: 0
      }
    });
  };

  const handleNewRuleClick = () => {
    setShowNewRuleModal(true);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'time_based': return <Clock className="h-4 w-4" />;
      case 'demand_based': return <TrendingUp className="h-4 w-4" />;
      case 'event_based': return <Calendar className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'time_based': return 'bg-blue-100 text-blue-800';
      case 'demand_based': return 'bg-green-100 text-green-800';
      case 'event_based': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (value) => {
    if (value >= 30) return 'text-green-600';
    if (value >= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Filter rules
  let filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || rule.type === filterType;
    const matchesStatus = filterStatus === "" ||
                         (filterStatus === "active" && rule.isActive) ||
                         (filterStatus === "inactive" && !rule.isActive);

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Pricing Rules</h2>
          <p className="text-sm text-gray-600">
            {filteredRules.length} rules found • {rules.filter(r => r.isActive).length} active
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button
            onClick={handleNewRuleClick}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Rule
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search rules by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rule Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Types</option>
                <option value="time_based">Time-Based</option>
                <option value="demand_based">Demand-Based</option>
                <option value="event_based">Event-Based</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setFilterType("");
                setFilterStatus("");
                setSearchTerm("");
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Rules Grid */}
      {filteredRules.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p>No pricing rules found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRules.map((rule) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Rule Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getTypeColor(rule.type)}`}>
                      {getTypeIcon(rule.type)}
                      <span className="ml-1 capitalize">{rule.type.replace('_', ' ')}</span>
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                      rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.isActive ? <CheckCircle className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{rule.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleRule(rule.id, rule.isActive)}
                    disabled={updateRuleMutation.isLoading}
                    className={`p-2 rounded-lg transition-colors ${
                      rule.isActive
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {rule.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setSelectedRule(rule)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    disabled={deleteRuleMutation.isLoading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Rule Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Multiplier Range</div>
                  <div className="font-medium text-gray-900">
                    {rule.pricing.multiplier}x - {rule.pricing.maxMultiplier}x
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Revenue Lift</div>
                  <div className={`font-medium ${getPerformanceColor(rule.performance.avgRevenueLift)}`}>
                    +{rule.performance.avgRevenueLift}%
                  </div>
                </div>
              </div>

              {/* Rule Conditions */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Conditions</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  {rule.type === 'time_based' && rule.conditions.timeRange && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>
                        {rule.conditions.timeRange.start} - {rule.conditions.timeRange.end}
                      </span>
                    </div>
                  )}
                  {rule.conditions.zones && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {Array.isArray(rule.conditions.zones)
                          ? `${rule.conditions.zones.length} zones`
                          : rule.conditions.zones
                        }
                      </span>
                    </div>
                  )}
                  {rule.conditions.daysOfWeek && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>{rule.conditions.daysOfWeek.length} days/week</span>
                    </div>
                  )}
                  {rule.conditions.demandSupplyRatio && (
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-3 w-3" />
                      <span>Demand ratio: {rule.conditions.demandSupplyRatio}x</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs text-gray-600">Revenue Lift</div>
                  <div className={`text-sm font-medium ${getPerformanceColor(rule.performance.avgRevenueLift)}`}>
                    +{rule.performance.avgRevenueLift}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Satisfaction</div>
                  <div className="text-sm font-medium text-gray-900">
                    {rule.performance.customerSatisfaction}/5
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Utilization</div>
                  <div className={`text-sm font-medium ${getPerformanceColor(rule.performance.utilizationIncrease)}`}>
                    +{rule.performance.utilizationIncrease}%
                  </div>
                </div>
              </div>

              {/* Last Modified */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Last modified: {new Date(rule.lastModified).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Rule Details Modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedRule(null)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Rule Details</h3>
                <button
                  onClick={() => setSelectedRule(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rule Name</label>
                  <div className="mt-1 text-sm text-gray-900">{selectedRule.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <div className="mt-1 text-sm text-gray-900">{selectedRule.description}</div>
                </div>
                {/* Add more detailed rule editing form here */}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedRule(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* New Rule Modal */}
      {showNewRuleModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowNewRuleModal(false)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create New Pricing Rule</h3>
                <button
                  onClick={() => setShowNewRuleModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rule Name *
                    </label>
                    <input
                      type="text"
                      value={newRule.name}
                      onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                      placeholder="e.g., Peak Hour Surge"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rule Type
                    </label>
                    <select
                      value={newRule.type}
                      onChange={(e) => setNewRule({...newRule, type: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="time_based">Time-Based</option>
                      <option value="demand_based">Demand-Based</option>
                      <option value="event_based">Event-Based</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newRule.description}
                    onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                    placeholder="Describe when and how this rule should be applied..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Pricing Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={newRule.multiplier}
                      onChange={(e) => setNewRule({...newRule, multiplier: parseFloat(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={newRule.maxMultiplier}
                      onChange={(e) => setNewRule({...newRule, maxMultiplier: parseFloat(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                  <div className="text-sm text-gray-600">
                    <p><strong>Rule:</strong> {newRule.name || 'Untitled Rule'}</p>
                    <p><strong>Type:</strong> {newRule.type.replace('_', ' ').charAt(0).toUpperCase() + newRule.type.replace('_', ' ').slice(1)}</p>
                    <p><strong>Pricing:</strong> {newRule.multiplier}x - {newRule.maxMultiplier}x multiplier</p>
                    <p><strong>Example:</strong> Base price 8 SAR → {(8 * newRule.multiplier).toFixed(1)} SAR - {(8 * newRule.maxMultiplier).toFixed(1)} SAR</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewRuleModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRule}
                  disabled={createRuleMutation.isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {createRuleMutation.isLoading ? 'Creating...' : 'Create Rule'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingRules;
