"use client";
import { INotificationModalProps, Notification } from "@/types/notification/notification.interface";
import {
  getNotificationsClient,
  markAllNotificationsAsReadClient,
  markNotificationAsReadClient,
} from "@/lib/client-network";
import { X, Bell } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";

const NotificationModal: React.FC<INotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      // Poll for new notifications every 30 seconds when modal is open
      intervalRef.current = setInterval(() => {
        loadNotifications();
      }, 30000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotificationsClient({ limit: 50 });
      setNotifications(Array.isArray(data) ? data : []);
      // Update unread count
      const unread = data.filter((n: Notification) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsReadClient(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsReadClient();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-start justify-center z-50 p-4 pt-44 font-sans">
      <div className="relative bg-white dark:bg-gray-800 px-6 pt-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Notifications</h2>
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto py-2">
          {loading ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Oops! No notifications found.
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                You're all caught up! There are no notifications at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    !notification.read
                      ? "bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500 dark:border-indigo-400"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`text-sm font-semibold ${
                            !notification.read
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;

