// src/components/bookings/BookingDetails.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scooterService } from "../../services/api";
import {
  ChevronLeft,
  User,
  Bike,
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Loader,
  Route,
  Eye,
} from "lucide-react";
import RideRouteMap from "./RideRouteMap";

const BookingDetails = ({ booking, onBack }) => {
  const [showRouteMap, setShowRouteMap] = useState(false);

  // Fetch detailed booking info if needed
  // const queryClient = useQueryClient();
  // const { data: bookingDetails, isLoading } = useQuery({
  //   queryKey: ["booking", booking.id],
  //   queryFn: async () => {
  //     const response = await scooterService.getRideById(booking.id);
  //     return response.data;
  //   },
  //   enabled: !!booking?.id, // Only run query if we have a booking id
  // });

  // We're using the booking prop data for now
  // const currentBooking = bookingDetails || booking;
  const currentBooking = booking;

  const getStatusColor = (status) => {
    const colors = {
      completed: "text-green-600",
      active: "text-blue-600",
      cancelled: "text-red-600",
      pending: "text-yellow-600",
    };
    return colors[status] || "text-gray-600";
  }; // End ride mutation (for active rides)
  const queryClient = useQueryClient();
  const endRideMutation = useMutation({
    mutationFn: () => scooterService.endRide(currentBooking.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["rides"]);
      onBack(); // Go back to the list
    },
    onError: (error) => {
      console.error("Error ending ride:", error);
      alert("Failed to end ride. Please try again.");
    },
  });

  const handleEndRide = () => {
    if (window.confirm("Are you sure you want to end this ride?")) {
      endRideMutation.mutate();
    }
  };

  if (!currentBooking) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin mr-2" />
        <span>Loading booking details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Booking Details - {currentBooking?.id}
              </h2>
              <p
                className={`mt-1 font-medium ${getStatusColor(
                  currentBooking?.status
                )}`}>
                {currentBooking?.status?.charAt(0).toUpperCase() +
                  currentBooking?.status?.slice(1)}
              </p>
            </div>
          </div>{" "}
          {currentBooking?.status === "active" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={handleEndRide}>
              {endRideMutation.isLoading ? "Ending..." : "End Ride"}
            </motion.button>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Booking Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Start Time
              </div>
              <span className="font-medium">
                {new Date(currentBooking?.startTime).toLocaleString()}
              </span>
            </div>
            {currentBooking?.endTime && (
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  End Time
                </div>
                <span className="font-medium">
                  {new Date(currentBooking?.endTime).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Duration
              </div>
              <span className="font-medium">
                {currentBooking?.duration} mins
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                Distance
              </div>
              <span className="font-medium">{currentBooking?.distance} km</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-4 h-4 mr-2" />
                Amount
              </div>
              <span className="font-medium">
                ${currentBooking?.amount?.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            User Information
          </h3>
          <div className="flex items-center mb-4">
            <img
              src={`https://ui-avatars.com/api/?name=${currentBooking?.userName}&background=0D8ABC&color=fff`}
              alt={currentBooking?.userName}
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-4">
              <div className="text-lg font-medium text-gray-900">
                {currentBooking?.userName}
              </div>
              <div className="text-sm text-gray-500">
                {currentBooking?.userId}
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-6">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <User className="w-4 h-4 mr-2" />
              View User Profile
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact User
            </button>
          </div>
        </motion.div>

        {/* Scooter Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Scooter Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Bike className="w-4 h-4 mr-2" />
                Scooter ID
              </div>
              <span className="font-medium">{currentBooking?.scooterId}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </div>
              <span className="font-medium">{currentBooking?.location}</span>
            </div>
          </div>
          <div className="mt-6">
            <a
              href={`/scooters/${currentBooking?.scooterId}`}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Bike className="w-4 h-4 mr-2" />
              View Scooter Details
            </a>
          </div>
        </motion.div>
      </div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Route className="h-5 w-5 text-blue-600 mr-2" />
            Ride Route
          </h3>
          <button
            onClick={() => setShowRouteMap(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Full Route
          </button>
        </div>

        <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-blue-200 relative overflow-hidden">
          {/* Map Preview */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Interactive Route Map</h4>
            <p className="text-gray-600 mb-4 max-w-md">
              View the complete ride route on an interactive map with detailed statistics,
              events timeline, and location markers within Riyadh city boundaries.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-center mb-1">
                  <Route className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-gray-700">Distance</span>
                </div>
                <p className="text-lg font-bold text-green-600">{currentBooking?.distance || '8.5'} km</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-sm font-medium text-gray-700">Duration</span>
                </div>
                <p className="text-lg font-bold text-blue-600">{currentBooking?.duration || '45'} min</p>
              </div>
            </div>

            <button
              onClick={() => setShowRouteMap(true)}
              className="mt-4 flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Open Interactive Map
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-blue-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-green-200 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-yellow-200 rounded-full opacity-20"></div>
        </div>
      </motion.div>

      {/* Issues Section */}
      {currentBooking?.status === "completed" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Report Issues
          </h3>
          <button className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report a Problem
          </button>
        </motion.div>
      )}

      {/* Route Map Modal */}
      {showRouteMap && (
        <RideRouteMap
          bookingId={currentBooking?.id}
          onClose={() => setShowRouteMap(false)}
        />
      )}
    </div>
  );
};

export default BookingDetails;
