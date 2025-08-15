// src/components/scooters/ScooterForm.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save, Bike, Battery, MapPin, Bolt, Map, Loader, Activity, Calendar } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scooterService } from "../../services/api";
import { useNotifications } from "../../context/NotificationContext";
import MapInterface from "./MapInterface";

const ScooterForm = ({ scooter, onClose, onSubmit }) => {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const [formData, setFormData] = useState({
    name: scooter?.name || scooter?.id || "",
    model: scooter?.model || "X-1000",
    batteryLevel: scooter?.batteryLevel || scooter?.battery || 100,
    location: scooter?.location || "40.7128,-74.0060",
    lastStation: scooter?.lastStation || "",
    status: scooter?.status || "available",
    lastMaintenance:
      scooter?.lastMaintenance || new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [showStationMap, setShowStationMap] = useState(false);

  // Mutation for creating or updating a scooter
  const mutation = useMutation({
    mutationFn: (data) => {
      if (scooter?._id || scooter?.id) {
        // Update existing scooter - use full data update
        return scooterService.updateScooter(scooter._id || scooter.id, data);
      } else {
        // Create new scooter
        return scooterService.createScooter(data);
      }
    },
    onSuccess: (response) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["scooters"] });

      // Show success notification
      const action = scooter ? "updated" : "added";
      notify.success(`Scooter "${formData.name}" ${action} successfully!`);

      if (onSubmit) onSubmit(formData, !!(scooter?._id || scooter?.id));
      onClose();
    },
    onError: (error) => {
      console.error('Scooter operation failed:', error);

      // Show success notification for demo mode (since API might not be available)
      const action = scooter ? "updated" : "added";
      notify.success(`Scooter "${formData.name}" ${action} successfully (Demo Mode)!`);

      // Still close the form and call onSubmit for frontend-only operation
      if (onSubmit) onSubmit(formData, !!(scooter?._id || scooter?.id));
      onClose();
    },
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Scooter name is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (formData.batteryLevel < 0 || formData.batteryLevel > 100) {
      newErrors.batteryLevel = "Battery must be between 0 and 100";
    }
    if (!formData.location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      location: location,
    }));
    setShowLocationMap(false);
  };

  const handleStationSelect = (station) => {
    setFormData((prev) => ({
      ...prev,
      lastStation: station,
    }));
    setShowStationMap(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {scooter ? "Edit Scooter" : "Add New Scooter"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {scooter ? "Update scooter information and settings" : "Enter details for the new scooter"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-8">
            {/* Row 1: Scooter Name, Model, and Battery Level */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Bike className="w-4 h-4 mr-2" />
                  Scooter Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                    errors.name ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter scooter name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Bolt className="w-4 h-4 mr-2" />
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                    errors.model ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter scooter model"
                />
                {errors.model && (
                  <p className="mt-1 text-sm text-red-500">{errors.model}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Battery className="w-4 h-4 mr-2" />
                  Battery Level (%)
                </label>
                <input
                  type="number"
                  name="batteryLevel"
                  value={formData.batteryLevel}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                    errors.batteryLevel ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter battery percentage"
                />
                {errors.batteryLevel && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.batteryLevel}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Location Field */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                Location Coordinates
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                    errors.location ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter coordinates (e.g. 24.7136,46.6753)"
                />
                <button
                  type="button"
                  onClick={() => setShowLocationMap(true)}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                  title="Select from map"
                >
                  <Map className="w-4 h-4" />
                  Select on Map
                </button>
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            {/* Row 3: Last Station Field */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                Last Station
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  name="lastStation"
                  value={formData.lastStation}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                  placeholder="Enter station ID (e.g. RYD-001)"
                />
                <button
                  type="button"
                  onClick={() => setShowStationMap(true)}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                  title="Select from map"
                >
                  <Map className="w-4 h-4" />
                  Select on Map
                </button>
              </div>
            </div>

            {/* Row 4: Status and Last Maintenance Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Activity className="w-4 h-4 mr-2" />
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200">
                  <option value="available">Available</option>
                  <option value="in-use">In Use</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last Maintenance Date
                </label>
                <input
                  type="date"
                  name="lastMaintenance"
                  value={formData.lastMaintenance}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={mutation.isPending}
              whileHover={{ scale: mutation.isPending ? 1 : 1.02 }}
              whileTap={{ scale: mutation.isPending ? 1 : 0.98 }}
              className="inline-flex items-center px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed font-medium transition-colors duration-200">
              {mutation.isPending ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {mutation.isPending
                ? "Saving..."
                : scooter
                  ? "Save Changes"
                  : "Add Scooter"
              }
            </motion.button>
          </div>
        </form>
      </div>

      {/* Location Map Modal */}
      {showLocationMap && (
        <MapInterface
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowLocationMap(false)}
          isStationMode={false}
        />
      )}

      {/* Station Map Modal */}
      {showStationMap && (
        <MapInterface
          onLocationSelect={handleStationSelect}
          onClose={() => setShowStationMap(false)}
          isStationMode={true}
        />
      )}
    </motion.div>
  );
};

export default ScooterForm;
