const express = require("express");
const router = express.Router();
const { 
    getUserNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
} = require("../controllers/notificationcontroller");

router.get("/notifications", getUserNotifications);  // Fetch user notifications
router.patch("/notifications/:id/read", markAsRead);  // Mark single notification as read
router.patch("/notifications/read-all", markAllAsRead); // Mark all notifications as read
router.delete("/notifications/:id", deleteNotification);  // Delete a notification

module.exports = router;