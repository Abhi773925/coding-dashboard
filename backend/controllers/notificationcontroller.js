const Notification = require('../models/Notification');

// Get notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const userEmail = req.query.email;
    
    if (!userEmail) {
      return res.status(400).json({ message: "❌ User email is required" });
    }
    
    const notifications = await Notification.find({ recipient: userEmail })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.query.email;
    
    if (!userEmail) {
      return res.status(400).json({ message: "❌ User email is required" });
    }
    
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ message: "❌ Notification not found" });
    }
    
    if (notification.recipient !== userEmail) {
      return res.status(403).json({ message: "❌ You don't have permission to modify this notification" });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.status(200).json({ message: "✅ Notification marked as read", notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userEmail = req.query.email;
    
    if (!userEmail) {
      return res.status(400).json({ message: "❌ User email is required" });
    }
    
    await Notification.updateMany(
      { recipient: userEmail, isRead: false },
      { isRead: true }
    );
    
    res.status(200).json({ message: "✅ All notifications marked as read" });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.query.email;
    
    if (!userEmail) {
      return res.status(400).json({ message: "❌ User email is required" });
    }
    
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ message: "❌ Notification not found" });
    }
    
    if (notification.recipient !== userEmail) {
      return res.status(403).json({ message: "❌ You don't have permission to delete this notification" });
    }
    
    await Notification.findByIdAndDelete(id);
    
    res.status(200).json({ message: "✅ Notification deleted successfully" });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// Create a new notification
const createNotification = async (recipient, message, relatedTask, type, createdBy) => {
  try {
    console.log(`Creating notification: recipient=${recipient}, type=${type}, task=${relatedTask}`);
    
    // Validate required parameters
    if (!recipient) {
      console.error('Error creating notification: recipient is required');
      return null;
    }
    
    if (!message) {
      console.error('Error creating notification: message is required');
      return null;
    }
    
    if (!type) {
      console.error('Error creating notification: type is required');
      return null;
    }
    
    // Check if type is one of the allowed values
    const allowedTypes = ['task_assigned', 'task_updated', 'comment_added', 'file_uploaded', 'status_changed'];
    if (!allowedTypes.includes(type)) {
      console.error(`Error creating notification: invalid type "${type}"`);
      return null;
    }
    
    // Create and save the notification
    const notification = new Notification({
      recipient,
      message,
      relatedTask,
      type,
      createdBy,
      isRead: false,
      createdAt: new Date()
    });
    
    const savedNotification = await notification.save();
    console.log(`Notification created successfully: ${savedNotification._id}`);
    
    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

exports.createNotification = createNotification;