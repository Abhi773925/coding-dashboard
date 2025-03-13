import React, { useEffect, useState } from "react";
import { Bell, Check, Trash2, Star } from "lucide-react";

const API_URL = "http://localhost:5000/api/Zidio/notifications";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, important

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser || !parsedUser.email) {
        setError("Invalid user data");
        setLoading(false);
        return;
      }

      setUserEmail(parsedUser.email);
    } catch (err) {
      setError("Failed to load user data");
      setLoading(false);
    }
  }, []);

  const fetchNotifications = async () => {
    if (!userEmail) return;

    try {
      const response = await fetch(`${API_URL}?email=${userEmail}`);
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching notifications");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchNotifications();
    }
  }, [userEmail]);

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_URL}/read-all?email=${userEmail}`, {
        method: "PATCH"
      });
      if (!response.ok) throw new Error("Failed to mark all as read");
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}?email=${userEmail}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete notification");
      setNotifications(notifications.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const toggleImportant = async (id, currentValue) => {
    try {
      // This is a mock implementation as your API doesn't have this endpoint yet
      const response = await fetch(`${API_URL}/${id}/important?email=${userEmail}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isImportant: !currentValue })
      });
      
      if (!response.ok) throw new Error("Failed to toggle importance");
      
      // Update local state for immediate UI update
      setNotifications(
        notifications.map((notif) =>
          notif._id === id
            ? { ...notif, isImportant: !notif.isImportant }
            : notif
        )
      );
    } catch (error) {
      console.error("Error toggling important status:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/read?email=${userEmail}`, {
        method: "PATCH"
      });
      
      if (!response.ok) throw new Error("Failed to mark as read");
      
      // Update local state
      setNotifications(
        notifications.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead;
    if (filter === "important") return notif.isImportant;
    return true; // "all" filter
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "task_assigned":
        return "🔔";
      case "task_updated":
        return "📝";
      case "comment_added":
        return "💬";
      case "file_uploaded":
        return "📎";
      case "status_changed":
        return "🔄";
      default:
        return "📩";
    }
  };

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "";
    
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) return (
    <div className="flex items-center justify-center p-6 bg-[#090e1a]  text-white h-32 rounded-lg">
      <div className="animate-spin h-6 w-6 border-t-2 border-indigo-500 rounded-full mr-2"></div>
      <p>Loading notifications...</p>
    </div>
  );
  
  if (error) return (
    <div className="bg-[#090e1a]  border border-red-500 text-red-400 p-4 rounded-lg">
      <p className="font-medium">{error}</p>
      <p className="text-sm mt-1 text-red-300">Please try again or contact support</p>
    </div>
  );

  return (
    <div className="bg-[#090e1a]  text-white rounded-lg w-fit shadow-xl border border-gray-900 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-[#090e1a]  border-b border-gray-900">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold">Notifications</h2>
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="ml-2 bg-purple-600 text-xs px-2 py-1 rounded-full">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </div>
          <button
            className="text-purple-500 hover:text-purple-400 text-sm font-medium flex items-center"
            onClick={markAllAsRead}
          >
            <span className="mr-1">✓✓</span>
            Mark all read
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex mt-3 border-b border-gray-900">
          <button
            className={`px-3 py-2 text-sm font-medium ${
              filter === "all"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-500 hover:text-white"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium ${
              filter === "unread"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-500 hover:text-white"
            }`}
            onClick={() => setFilter("unread")}
          >
            Unread
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium ${
              filter === "important"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-500 hover:text-white"
            }`}
            onClick={() => setFilter("important")}
          >
            Important
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          <ul className="divide-y divide-gray-900">
            {filteredNotifications.map((notif) => (
              <li
                key={notif._id}
                className={`relative ${
                  notif.isRead 
                    ? "bg-[#090e1a]  hover:bg-gray-900" 
                    : "bg-gray-900 hover:bg-gray-800"
                } transition-colors`}
              >
                {notif.isImportant && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <div className="flex items-start">
                        <span className="text-lg mr-2">
                          {getTypeIcon(notif.type)}
                        </span>
                        <div>
                          <div className="flex items-center">
                            <h3 className={`font-medium ${!notif.isRead ? "text-white" : "text-gray-400"}`}>
                              {notif.title || notif.type?.replace(/_/g, " ")}
                            </h3>
                            {!notif.isRead && (
                              <span className="ml-2 w-2 h-2 bg-purple-500 rounded-full"></span>
                            )}
                          </div>
                          <p className={`text-sm ${!notif.isRead ? "text-gray-300" : "text-gray-500"}`}>
                            {notif.message}
                          </p>
                          <div className="text-xs text-gray-600 mt-1">
                            {getRelativeTime(notif.createdAt)}
                            {notif.relatedTask && (
                              <span className="ml-2 bg-gray-900 px-2 py-0.5 rounded text-gray-400">
                                Task #{notif.relatedTask.substring(0, 6)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2 ml-2">
                      <button
                        onClick={() => toggleImportant(notif._id, notif.isImportant)}
                        className={notif.isImportant ? "text-yellow-500" : "text-gray-700 hover:text-gray-500"}
                        title={notif.isImportant ? "Remove from important" : "Mark as important"}
                      >
                        {notif.isImportant ? (
                          <Star className="h-4 w-4" />
                        ) : (
                          <span className="text-xs">☆</span>
                        )}
                      </button>
                      
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif._id)}
                          className="text-gray-700 hover:text-purple-500"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notif._id)}
                        className="text-gray-700 hover:text-red-500"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-gray-700">
            <Bell className="h-12 w-12 mb-2 opacity-30" />
            <p className="text-center">
              {filter === "all" 
                ? "No notifications found." 
                : filter === "unread" 
                  ? "No unread notifications." 
                  : "No important notifications."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;