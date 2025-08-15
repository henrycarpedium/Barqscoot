// src/context/NotificationContext.jsx
import { createContext, useState, useContext, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

// Create notification context
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = "info") => {
    const id = uuidv4();
    setNotifications((prev) => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  // Helper methods for different notification types
  const notify = {
    success: (message) => addNotification(message, "success"),
    error: (message) => addNotification(message, "error"),
    warning: (message) => addNotification(message, "warning"),
    info: (message) => addNotification(message, "info"),
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, notify, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for using notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
