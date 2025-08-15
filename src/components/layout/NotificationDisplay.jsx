// src/components/layout/NotificationDisplay.jsx
import React from "react";
import { AnimatePresence } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";
import Notification from "../common/Notification";

const NotificationDisplay = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            isVisible={true}
            onClose={() => removeNotification(notification.id)}
            duration={4000}
            position="top-right"
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDisplay;
