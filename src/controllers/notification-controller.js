import { validationResult } from "express-validator";

// Mock notifications database
let notifications = [
  {
    id: "1",
    type: "info",
    title: "New Service Available",
    message: "We now offer premium nail art designs with Swarovski crystals!",
    read: false,
    createdAt: "2024-01-20T10:00:00Z",
    actionUrl: "/services",
  },
  {
    id: "2",
    type: "success",
    title: "Booking Confirmed",
    message: "Your appointment for January 25th at 2:00 PM has been confirmed.",
    read: false,
    createdAt: "2024-01-19T14:30:00Z",
    actionUrl: "/booking",
  },
  {
    id: "3",
    type: "warning",
    title: "Appointment Reminder",
    message: "Don't forget your appointment tomorrow at 3:00 PM.",
    read: true,
    createdAt: "2024-01-18T09:00:00Z",
    actionUrl: "/booking",
  },
];

// Get all notifications
export const getNotifications = (req, res) => {
  try {
    const unreadCount = notifications.filter((n) => !n.read).length;

    res.json({
      notifications: notifications.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
      unreadCount: unreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark notification as read
export const markNotificationAsRead = (req, res) => {
  try {
    const notificationIndex = notifications.findIndex(
      (n) => n.id === req.params.id
    );
    if (notificationIndex === -1) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notifications[notificationIndex].read = true;

    res.json({
      ...notifications[notificationIndex],
      message: "Notification marked as read",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Subscribe to push notifications
export const subscribeToPushNotifications = (req, res) => {
  try {
    const { subscription } = req.body;

    // In a real app, you would save the subscription to the database
    console.log("Push subscription:", subscription);

    res.json({
      message: "Push notification subscription successful",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Send notification (Admin only)
export const sendNotification = (req, res) => {
  try {
    const { type, title, message, actionUrl } = req.body;

    const newNotification = {
      id: (notifications.length + 1).toString(),
      type: type || "info",
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: actionUrl || null,
    };

    notifications.unshift(newNotification);

    res.status(201).json({
      ...newNotification,
      message: "Notification sent successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
