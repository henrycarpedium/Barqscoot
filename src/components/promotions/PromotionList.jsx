// src/components/promotions/PromotionList.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Tag,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const PromotionList = ({ promotions, onEdit, onSchedule }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleActivatePromotion = (promotion) => {
    console.log("🟢 Activating promotion:", promotion.name);
    alert(`Promotion "${promotion.name}" has been activated!`);
  };

  const handlePausePromotion = (promotion) => {
    console.log("⏸️ Pausing promotion:", promotion.name);
    if (window.confirm(`Are you sure you want to pause "${promotion.name}"?`)) {
      alert(`Promotion "${promotion.name}" has been paused.`);
    }
  };

  const handleDeletePromotion = (promotion) => {
    console.log("🗑️ Deleting promotion:", promotion.name);
    if (window.confirm(`Are you sure you want to delete "${promotion.name}"? This action cannot be undone.`)) {
      alert(`Promotion "${promotion.name}" has been deleted.`);
    }
  };

  if (promotions.length === 0) {
    return (
      <div className="text-center py-12">
        <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No promotions found</h3>
        <p className="text-gray-600">
          Create your first promotion to start boosting user engagement
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {promotions.map((promotion, index) => (
        <motion.div
          key={promotion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {promotion.name}
                </h3>
                <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(promotion.status)}`}>
                  {getStatusIcon(promotion.status)}
                  <span className="ml-1 capitalize">{promotion.status}</span>
                </span>
                <div className="flex items-center space-x-2">
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-mono">
                    {promotion.code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(promotion.code)}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Copy code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {copiedCode === promotion.code && (
                    <span className="text-xs text-green-600 font-medium">Copied!</span>
                  )}
                </div>
              </div>

              {promotion.description && (
                <p className="text-gray-600 mb-3">{promotion.description}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="font-medium">Discount:</span>{" "}
                    {promotion.type === "percentage"
                      ? `${promotion.value}%`
                      : `$${promotion.value}`}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="font-medium">Used:</span>{" "}
                    {promotion.used}/{promotion.usageLimit}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="font-medium">Revenue:</span> $
                    {promotion.revenue.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="font-medium">
                      {promotion.status === "scheduled" ? "Starts:" : "Expires:"}
                    </span>{" "}
                    {new Date(
                      promotion.status === "scheduled" ? promotion.startDate : promotion.endDate
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Usage Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Usage Progress</span>
                  <span>{Math.round((promotion.used / promotion.usageLimit) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((promotion.used / promotion.usageLimit) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Target: {promotion.targetAudience.replace('_', ' ')}</span>
                <span>Regions: {promotion.regions.join(', ')}</span>
                {promotion.conversionRate > 0 && (
                  <span>Conversion: {promotion.conversionRate}%</span>
                )}
                <span>Per User Limit: {promotion.perUserLimit}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-6">
              <button
                onClick={() => onEdit(promotion)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit promotion"
              >
                <Edit className="h-4 w-4" />
              </button>

              {promotion.status === "scheduled" && (
                <button
                  onClick={() => onSchedule(promotion)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Reschedule"
                >
                  <Calendar className="h-4 w-4" />
                </button>
              )}

              {promotion.status === "paused" && (
                <button
                  onClick={() => handleActivatePromotion(promotion)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Activate promotion"
                >
                  <Play className="h-4 w-4" />
                </button>
              )}

              {promotion.status === "active" && (
                <button
                  onClick={() => handlePausePromotion(promotion)}
                  className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                  title="Pause promotion"
                >
                  <Pause className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={() => handleDeletePromotion(promotion)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete promotion"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PromotionList;
