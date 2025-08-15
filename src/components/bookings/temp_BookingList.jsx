// src/components/bookings/BookingList.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { scooterService } from "../../services/api";
import { Search, Filter, ChevronDown } from "lucide-react";

const BookingList = ({ onBookingSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch rides (bookings) from the API
  const {
    data: apiRides,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rides", filterStatus],
    queryFn: async () => {
      try {
        const filters = {};
        if (filterStatus !== "all") {
          filters.status = filterStatus;
        }
        const response = await scooterService.getAllRides(filters);
        return response.data || [];
      } catch (err) {
        console.error("Error fetching rides:", err);
        return [];
      }
    },
  });

  // Transform rides data to match our booking structure
  const bookingsData =
    apiRides?.map((ride) => ({
      id: ride._id || ride.id || "",
      userId: ride.userId || "",
      userName: ride.userId || "User", // In a real app, fetch user details
      scooterId: ride.scooterId || "",
      startTime: ride.startTime || new Date().toISOString(),
      endTime: ride.endTime || null,
      duration: ride.duration || 0,
      distance: ride.distance || 0,
      amount: ride.amount || 0,
      status: ride.status || "completed",
      location: ride.startLocation || "Unknown",
    })) || [];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  // Client-side filtering of bookings
  const filteredBookings = bookingsData.filter((booking) => {
    const matchesSearch =
      !searchTerm ||
      (booking.id && booking.id.toLowerCase().includes(searchTerm)) ||
      (booking.userName &&
        booking.userName.toLowerCase().includes(searchTerm)) ||
      (booking.scooterId &&
        booking.scooterId.toLowerCase().includes(searchTerm));

    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      active: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Bookings</h2>
        </div>

        {/* Search and Filter */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="inline-flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-teal-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading bookings...
          </div>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">
          Error loading bookings. Please try again.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scooter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    onClick={() => onBookingSelect(booking)}
                    className="cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(booking.startTime).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={`https://ui-avatars.com/api/?name=${booking.userName}&background=0D8ABC&color=fff`}
                          alt={booking.userName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.userId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {booking.scooterId}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDuration(booking.duration)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.distance} km
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ${booking.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          booking.status
                        )}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-500">
                        <ChevronDown className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredBookings.length} of {bookingsData.length}{" "}
                bookings
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  disabled>
                  Previous
                </button>
                <button
                  className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList;
