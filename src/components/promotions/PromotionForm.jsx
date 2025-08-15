// src/components/promotions/PromotionForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Tag,
  DollarSign,
  Percent,
  Users,
  Calendar,
  MapPin,
  Save,
  Send,
  AlertCircle,
} from "lucide-react";

const PromotionForm = ({ promotion, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: promotion?.name || "",
    code: promotion?.code || "",
    description: promotion?.description || "",
    type: promotion?.type || "percentage",
    value: promotion?.value || "",
    usageLimit: promotion?.usageLimit || "",
    perUserLimit: promotion?.perUserLimit || 1,
    startDate: promotion?.startDate || "",
    endDate: promotion?.endDate || "",
    targetAudience: promotion?.targetAudience || "all_users",
    regions: promotion?.regions || ["all"],
    status: promotion?.status || "draft",
    ...promotion,
  });

  const [errors, setErrors] = useState({});

  const targetAudienceOptions = [
    { value: "all_users", label: "All Users", count: "10,000" },
    { value: "new_users", label: "New Users", count: "1,234" },
    { value: "active_users", label: "Active Users", count: "5,678" },
    { value: "inactive_users", label: "Inactive Users", count: "890" },
    { value: "premium_users", label: "Premium Users", count: "234" },
    { value: "students", label: "Students", count: "456" },
  ];

  const regionOptions = [
    { value: "all", label: "All Regions" },
    { value: "downtown", label: "Downtown" },
    { value: "university", label: "University Area" },
    { value: "campus", label: "Campus" },
    { value: "tourist", label: "Tourist Areas" },
    { value: "residential", label: "Residential" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Promotion name is required";
    if (!formData.code.trim()) newErrors.code = "Promotion code is required";
    if (!formData.value || formData.value <= 0) newErrors.value = "Valid discount value is required";
    if (!formData.usageLimit || formData.usageLimit <= 0) newErrors.usageLimit = "Usage limit is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    if (formData.type === "percentage" && formData.value > 100) {
      newErrors.value = "Percentage discount cannot exceed 100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleRegionChange = (region) => {
    setFormData(prev => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region]
    }));
  };

  const generateCode = () => {
    const name = formData.name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6);
    const random = Math.floor(Math.random() * 100);
    const code = `${name}${random}`;
    setFormData(prev => ({ ...prev, code }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Promotion form submitted:", formData);
      
      // Create promotion object
      const promotionData = {
        ...formData,
        id: promotion?.id || Date.now(),
        used: promotion?.used || 0,
        revenue: promotion?.revenue || 0,
        conversionRate: promotion?.conversionRate || 0,
        createdAt: promotion?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSubmit(promotionData);
      alert(`✅ Promotion "${formData.name}" has been ${promotion ? 'updated' : 'created'} successfully!`);
    }
  };

  const handleSaveDraft = () => {
    const draftData = { ...formData, status: "draft" };
    console.log("Saving promotion as draft:", draftData);
    onSubmit(draftData);
    alert(`💾 Promotion "${formData.name}" has been saved as draft.`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Tag className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {promotion ? "Edit Promotion" : "Create New Promotion"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Set up promotional campaigns to boost user engagement
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
          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promotion Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., New User Welcome"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promotion Code *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.code ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g., WELCOME20"
                    />
                    <button
                      type="button"
                      onClick={generateCode}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                  {errors.code && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.code}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Brief description of the promotion"
                />
              </div>
            </div>

            {/* Discount Configuration */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Discount Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="value"
                      value={formData.value}
                      onChange={handleChange}
                      min="0"
                      max={formData.type === "percentage" ? "100" : undefined}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.value ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder={formData.type === "percentage" ? "20" : "5"}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {formData.type === "percentage" ? (
                        <Percent className="h-4 w-4 text-gray-400" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  {errors.value && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.value}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Per User Limit
                  </label>
                  <input
                    type="number"
                    name="perUserLimit"
                    value={formData.perUserLimit}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>
              </div>
            </div>

            {/* Usage Limits */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Limits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Usage Limit *
                  </label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.usageLimit ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="500"
                  />
                  {errors.usageLimit && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.usageLimit}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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
            </div>

            {/* Targeting */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Targeting</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Target Audience
                  </label>
                  <div className="space-y-2">
                    {targetAudienceOptions.map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="targetAudience"
                          value={option.value}
                          checked={formData.targetAudience === option.value}
                          onChange={handleChange}
                          className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {option.label} (~{option.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Target Regions
                  </label>
                  <div className="space-y-2">
                    {regionOptions.map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.regions.includes(option.value)}
                          onChange={() => handleRegionChange(option.value)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              {promotion ? "Update Promotion" : "Create Promotion"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PromotionForm;
