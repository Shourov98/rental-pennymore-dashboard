"use client";

import { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

type NotificationItem = {
  _id: string;
  title: string;
  message: string;
  type: string;
  actionUrl?: string;
  actionData?: {
    listingTitle?: string;
    renterName?: string;
    location?: Array<{
      borough?: string;
      neighborhoods?: string[];
    }>;
  };
  isRead: boolean;
  createdAt: string;
};

type NotificationsResponse = {
  success: boolean;
  message: string;
  data: {
    count: number;
    total: number;
    notifications: NotificationItem[];
  };
  timestamp: string;
};

type UnreadCountResponse = {
  success: boolean;
  message: string;
  data: {
    unreadCount: number;
  };
  timestamp: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<
    "idle" | "processing" | "failed"
  >("idle");

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        setStatus("loading");
        setError(null);

        const [notificationsResponse, unreadResponse] = await Promise.all([
          apiClient.get<NotificationsResponse>("/notifications/user"),
          apiClient.get<UnreadCountResponse>("/notifications/unread-count"),
        ]);

        if (!isMounted) return;
        setNotifications(notificationsResponse.data.data.notifications ?? []);
        setUnreadCount(unreadResponse.data.data.unreadCount ?? 0);
        setStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setStatus("failed");
        setError(
          err instanceof Error ? err.message : "Unable to load notifications."
        );
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatTimestamp = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getMessage = (notification: NotificationItem) => {
    const rawLocation = notification.actionData?.location;
    const locations = Array.isArray(rawLocation) ? rawLocation : [];
    const boroughs = locations
      .map((location) => location.borough)
      .filter((borough): borough is string => Boolean(borough));

    if (boroughs.length === 0) {
      return notification.message;
    }

    const uniqueBoroughs = Array.from(new Set(boroughs));
    const renterName = notification.actionData?.renterName ?? "Someone";
    const listingTitle = notification.actionData?.listingTitle ?? "a listing";

    return `${renterName} posted "${listingTitle}" in ${uniqueBoroughs.join(
      ", "
    )}.`;
  };

  const handleMarkAllRead = async () => {
    try {
      setActionStatus("processing");
      setError(null);
      await apiClient.patch(
        "/notifications/read-all",
        {});

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
      setActionStatus("idle");
    } catch (err) {
      setActionStatus("failed");
      setError(
        err instanceof Error ? err.message : "Unable to mark all as read."
      );
    }
  };

  const handleMarkRead = async (notification: NotificationItem) => {
    // if (notification.isRead) {
    //   if (notification.actionUrl) {
    //     router.push(notification.actionUrl);
    //   }
    //   return;
    // }

    try {
      setActionStatus("processing");
      setError(null);
      await apiClient.patch(
        `/notifications/${notification._id}/read`,
        {});

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id ? { ...item, isRead: true } : item
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
      setActionStatus("idle");

      // if (notification.actionUrl) {
      //   router.push(notification.actionUrl);
      // }
    } catch (err) {
      setActionStatus("failed");
      setError(
        err instanceof Error ? err.message : "Unable to mark notification read."
      );
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      setActionStatus("processing");
      setError(null);
      await apiClient.delete(`/notifications/${notificationId}`);

      setNotifications((prev) =>
        prev.filter((item) => item._id !== notificationId)
      );
      setUnreadCount((prev) =>
        Math.max(
          prev -
            (notifications.find((item) => item._id === notificationId)?.isRead
              ? 0
              : 1),
          0
        )
      );
      setActionStatus("idle");
    } catch (err) {
      setActionStatus("failed");
      setError(
        err instanceof Error ? err.message : "Unable to delete notification."
      );
    }
  };

  const isBusy = status === "loading" || actionStatus === "processing";

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 sm:px-6 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#0A093D]">
            Notifications
          </h1>
          <p className="text-sm text-gray-500">
            {unreadCount} unread notifications
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          disabled={isBusy || unreadCount === 0}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            unreadCount > 0 && !isBusy
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
        {status === "loading" && (
          <div className="px-6 py-8 text-sm text-gray-500">
            Loading notifications...
          </div>
        )}

        {status === "failed" && (
          <div className="px-6 py-8 text-sm text-red-500">
            {error ?? "Unable to load notifications."}
          </div>
        )}

        {status === "idle" && notifications.length === 0 && (
          <div className="px-6 py-8 text-sm text-gray-500">
            No notifications yet.
          </div>
        )}

        {status === "idle" &&
          notifications.map((notification) => (
            <div
              key={notification._id}
              role="button"
              tabIndex={0}
              onClick={() => handleMarkRead(notification)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  handleMarkRead(notification);
                }
              }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-6 py-5 hover:bg-gray-50 transition cursor-pointer"
            >
              {/* Left Section */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-full shrink-0">
                  <Bell size={20} className="text-blue-600" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-[#0A093D]">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {getMessage(notification)}
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex flex-row sm:flex-col justify-between sm:items-end gap-2">
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatTimestamp(notification.createdAt)}
                </span>

                <div className="flex items-center gap-2 sm:justify-end">
                  {!notification.isRead && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium w-fit bg-blue-100 text-blue-600">
                      Unread
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(notification._id);
                    }}
                    disabled={isBusy}
                    className={`p-2 rounded-full border transition ${
                      isBusy
                        ? "border-gray-200 text-gray-300 cursor-not-allowed"
                        : "border-gray-200 text-gray-500 hover:bg-gray-100"
                    }`}
                    aria-label="Delete notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {actionStatus === "failed" && error && (
        <div className="text-sm text-red-500">{error}</div>
      )}
    </section>
  );
}
