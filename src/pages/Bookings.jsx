// src/pages/Bookings.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import BookingList from "../components/bookings/BookingList";
import BookingDetails from "../components/bookings/BookingDetails";
import BookingStats from "../components/bookings/BookingStats";
import BookingManagementSummary from "../components/bookings/BookingManagementSummary";
import DisputeManagement from "../components/bookings/DisputeManagement";
import RideHistoryReplay from "../components/bookings/RideHistoryReplay";
import RideRouteMap from "../components/bookings/RideRouteMap";

const Bookings = () => {
  const { t } = useTranslation();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [view, setView] = useState("list"); // 'list', 'stats', 'overview', 'disputes'
  const [showRideReplay, setShowRideReplay] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState(null);
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  const handleBookingSelect = (booking) => {
    setSelectedBooking(booking);
  };

  const handleBack = () => {
    setSelectedBooking(null);
  };

  const handleViewRideHistory = (rideId) => {
    setSelectedRideId(rideId);
    setShowRideReplay(true);
  };

  const handleCloseRideReplay = () => {
    setShowRideReplay(false);
    setSelectedRideId(null);
  };

  const handleViewRoute = (rideId) => {
    setSelectedRouteId(rideId);
    setShowRouteMap(true);
  };

  const handleCloseRouteMap = () => {
    setShowRouteMap(false);
    setSelectedRouteId(null);
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      {!selectedBooking && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setView("overview")}
              className={`px-4 py-2 rounded-lg ${
                view === "overview"
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}>
              {t('viewModes.overview')}
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-4 py-2 rounded-lg ${
                view === "list"
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}>
              {t('viewModes.bookingsList')}
            </button>
            <button
              onClick={() => setView("disputes")}
              className={`px-4 py-2 rounded-lg ${
                view === "disputes"
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}>
              {t('viewModes.disputeManagement')}
            </button>
            <button
              onClick={() => setView("stats")}
              className={`px-4 py-2 rounded-lg ${
                view === "stats"
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}>
              {t('viewModes.analytics')}
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {selectedBooking ? (
        <BookingDetails booking={selectedBooking} onBack={handleBack} />
      ) : (
        <>
          {view === "overview" && <BookingManagementSummary />}
          {view === "list" && (
            <BookingList
              onBookingSelect={handleBookingSelect}
              onViewRideHistory={handleViewRideHistory}
              onViewRoute={handleViewRoute}
            />
          )}
          {view === "disputes" && <DisputeManagement />}
          {view === "stats" && <BookingStats />}
        </>
      )}

      {/* Ride History Replay Modal */}
      {showRideReplay && selectedRideId && (
        <RideHistoryReplay
          bookingId={selectedRideId}
          onClose={handleCloseRideReplay}
        />
      )}

      {/* Route Map Modal */}
      {showRouteMap && selectedRouteId && (
        <RideRouteMap
          bookingId={selectedRouteId}
          onClose={handleCloseRouteMap}
        />
      )}
    </div>
  );
};

export default Bookings;
