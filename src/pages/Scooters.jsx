// src/pages/Scooters.jsx
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import ScooterList from "../components/scooters/ScooterList";
import ScooterDetails from "../components/scooters/ScooterDetails";
import ScooterForm from "../components/scooters/ScooterForm";
import MapInterface from "../components/scooters/MapInterface";

const Scooters = () => {
  const { t } = useTranslation();
  const [selectedScooter, setSelectedScooter] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [scooterToEdit, setScooterToEdit] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // list, map
  // Local state for demo mode with some initial demo scooters
  const [localScooters, setLocalScooters] = useState([
    {
      id: "demo-001",
      name: "Test-Scooter-001",
      model: "X-1000",
      batteryLevel: 100,
      status: "available",
      location: "24.7118,46.6747",
      lastStation: "RYD-001",
      lastMaintenance: "2025-05-31",
      totalRides: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: "demo-002",
      name: "Test-Scooter-174825450653",
      model: "Standard",
      batteryLevel: 100,
      status: "available",
      location: "24.7136,46.6753",
      lastStation: "RYD-001",
      lastMaintenance: "2025-05-31",
      totalRides: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: "demo-003",
      name: "Test-Scooter-174825767002",
      model: "Standard",
      batteryLevel: 100,
      status: "available",
      location: "24.7128,46.6760",
      lastStation: "RYD-001",
      lastMaintenance: "2025-05-31",
      totalRides: 0,
      createdAt: new Date().toISOString(),
    }
  ]);

  const handleScooterSelect = (scooter) => {
    setSelectedScooter(scooter);
  };

  const handleAddScooter = () => {
    setScooterToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditScooter = (scooter) => {
    setScooterToEdit(scooter);
    setIsFormOpen(true);
  };

  const queryClient = useQueryClient();

  const handleFormSubmit = (scooterData, isEdit) => {
    // Handle local state for demo mode
    if (isEdit && scooterToEdit) {
      // Update existing scooter in local state
      setLocalScooters(prev =>
        prev.map(scooter =>
          (scooter.id === scooterToEdit.id || scooter._id === scooterToEdit._id)
            ? { ...scooter, ...scooterData, id: scooter.id || scooter._id }
            : scooter
        )
      );
    } else {
      // Add new scooter to local state
      const newScooter = {
        ...scooterData,
        id: `local-${Date.now()}`, // Generate a unique ID
        _id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
        totalRides: 0,
      };
      setLocalScooters(prev => [newScooter, ...prev]);
    }

    // Try to invalidate queries for API data
    try {
      queryClient.invalidateQueries("scooters");
    } catch (error) {
      console.log("Query invalidation skipped - demo mode");
    }

    setIsFormOpen(false);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setScooterToEdit(null);
  };

  return (
    <div className="space-y-6">
      {selectedScooter ? (
        <ScooterDetails
          scooter={selectedScooter}
          onBack={() => setSelectedScooter(null)}
        />
      ) : (
        <>
          {/* View Mode Toggle */}
          <div className="flex justify-between items-center">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  viewMode === "map"
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Map View
              </button>
            </div>
          </div>

          {/* Content based on view mode */}
          {viewMode === "list" ? (
            <ScooterList
              onScooterSelect={handleScooterSelect}
              onAddScooter={handleAddScooter}
              localScooters={localScooters}
            />
          ) : (
            <MapInterface />
          )}
        </>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <ScooterForm
            scooter={scooterToEdit}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scooters;
