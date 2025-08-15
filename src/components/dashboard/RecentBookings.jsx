// src/components/dashboard/RecentBookings.jsx
import React from "react";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

const RecentBookings = ({ bookings }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Bookings
      </h3>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <motion.div
            key={booking.id}
            whileHover={{ scale: 1.01 }}
            className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={booking.userAvatar || "/api/placeholder/32/32"}
                  alt={booking.userName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    {booking.userName}
                  </h4>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{booking.duration} mins</span>
                    <MapPin className="w-4 h-4 ml-3 mr-1" />
                    <span>{booking.distance} km</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ${booking.amount}
                </p>
                <p className="text-sm text-gray-500">{booking.status}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <button className="mt-4 text-teal-600 hover:text-teal-700 text-sm font-medium">
        View all bookings →
      </button>
    </motion.div>
  );
};

export default RecentBookings;
