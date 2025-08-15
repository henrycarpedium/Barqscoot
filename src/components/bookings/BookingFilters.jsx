// src/components/bookings/BookingFilters.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Filter, Calendar, DollarSign, Clock, MapPin, User, CreditCard, ChevronDown } from "lucide-react";

const BookingFilters = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState({
    dateRange: {
      start: "",
      end: "",
    },
    priceRange: {
      min: "",
      max: "",
    },
    duration: {
      min: "",
      max: "",
    },
    status: "",
    paymentMethod: "",
    distanceRange: {
      min: "",
      max: "",
    },
  });

  const handleChange = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dateRange: { start: "", end: "" },
      priceRange: { min: "", max: "" },
      duration: { min: "", max: "" },
      status: "",
      paymentMethod: "",
      distanceRange: { min: "", max: "" },
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-[2px]">
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Filter Bookings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6">
          {/* Row 1: Date Range and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Date Range */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    handleChange("dateRange", {
                      ...filters.dateRange,
                      start: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) =>
                    handleChange("dateRange", {
                      ...filters.dateRange,
                      end: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
          </div>

          {/* Row 2: Price Range, Duration, and Payment Method */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Price Range */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 mr-2" />
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) =>
                    handleChange("priceRange", {
                      ...filters.priceRange,
                      min: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) =>
                    handleChange("priceRange", {
                      ...filters.priceRange,
                      max: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                Duration (minutes)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.duration.min}
                  onChange={(e) =>
                    handleChange("duration", {
                      ...filters.duration,
                      min: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.duration.max}
                  onChange={(e) =>
                    handleChange("duration", {
                      ...filters.duration,
                      max: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Method
              </label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => handleChange("paymentMethod", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">All Payment Methods</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Apple Pay">Apple Pay</option>
                <option value="Google Pay">Google Pay</option>
              </select>
            </div>
          </div>

          {/* Row 3: Distance Range */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
            {/* Distance Range */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                Distance Range (km)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.distanceRange.min}
                  onChange={(e) =>
                    handleChange("distanceRange", {
                      ...filters.distanceRange,
                      min: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.distanceRange.max}
                  onChange={(e) =>
                    handleChange("distanceRange", {
                      ...filters.distanceRange,
                      max: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50">
            Reset All
          </button>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800">
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApply}
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingFilters;
