"use client";

import { Bell, Handshake, CreditCard, Home } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "renter",
    icon: Home,
    title: "New Renter Request",
    message:
      "A new renter request has been submitted for the Manhattan area — 2 bedrooms, $4200/month.",
    time: "2 hours ago",
    badge: "New",
  },
  {
    id: 2,
    type: "agent",
    icon: Handshake,
    title: "Agent Request Approval",
    message:
      "Agent John Wick requested to connect with Renter #124 — pending admin review.",
    time: "Yesterday at 3:20 PM",
    badge: "Pending",
  },
  {
    id: 3,
    type: "payment",
    icon: CreditCard,
    title: "Payment Received",
    message:
      "Agent Alice completed the payment for Renter Connection #892 — marked as Paid & Approved.",
    time: "Nov 12, 2025",
    badge: "Paid",
  },
];

export default function NotificationsPage() {
  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-[#0A093D]">Notifications</h1>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm divide-y">
        {notifications.map((n) => {
          const Icon = n.icon;
          let badgeColor = "";

          if (n.badge === "New") badgeColor = "bg-blue-100 text-blue-600";
          if (n.badge === "Pending")
            badgeColor = "bg-yellow-100 text-yellow-700";
          if (n.badge === "Paid") badgeColor = "bg-green-100 text-green-700";

          return (
            <div
              key={n.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 hover:bg-gray-50 transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-full">
                  <Icon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0A093D] mb-1">
                    {n.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <span className="text-xs text-gray-400">{n.time}</span>
                {n.badge && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}
                  >
                    {n.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
