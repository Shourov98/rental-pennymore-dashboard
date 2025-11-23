"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Bell,
  Users,
  Handshake,
  Megaphone,
  CreditCard,
  FileText,
  NotebookTabs,
  User,
  LogOut,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navLinks = [
    {
      section: "Main",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Analytics", icon: BarChart3, href: "/analytics" },
        { label: "Notifications", icon: Bell, href: "/notifications" },
      ],
    },
    {
      section: "Core",
      items: [
        { label: "Agent Management", icon: Users, href: "/agent-management" },
        { label: "Renter Management", icon: Users, href: "/renters" },
        {
          label: "Renter Connection",
          icon: Handshake,
          href: "/renter-connections",
        },
        { label: "Notice", icon: Megaphone, href: "/notice" },
        {
          label: "Payment Management",
          icon: CreditCard,
          href: "/payments",
        },
        { label: "Download Report", icon: FileText, href: "/reports" },
        {
          label: "Monthly Report",
          icon: NotebookTabs,
          href: "/monthly-reports",
        },
      ],
    },
    {
      section: "Personal Information",
      items: [
        { label: "Profile", icon: User, href: "/profile" },
        { label: "Logout", icon: LogOut, href: "/signin" },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-gray-50 border-r overflow-y-auto p-4 space-y-6">
      {navLinks.map((section) => (
        <div key={section.section}>
          <p className="text-xs text-gray-400 uppercase mb-2">
            {section.section}
          </p>
          <div className="space-y-2">
            {section.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium border transition ${
                    active
                      ? "bg-blue-500 text-white border-blue-600"
                      : "bg-white hover:bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      active ? "text-white" : "text-gray-700"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
