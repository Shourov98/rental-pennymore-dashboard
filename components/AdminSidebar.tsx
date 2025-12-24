"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  CircleQuestionMark,
} from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/auth/authSlice";

export default function AdminSidebar({
  onItemClick,
}: {
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const handleLogout = async () => {
    const tokenFromStorage =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const token = accessToken || tokenFromStorage;

    try {
      await apiClient.post(
        "/auth/logout",
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      );
    } catch {
      // Logout should still clear local state even if API fails.
    } finally {
      dispatch(logout());
      if (typeof window !== "undefined") {
        localStorage.removeItem("profileSnapshot");
      }
      router.push("/signin");
      onItemClick?.();
    }
  };

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
        {
          label: "FAQ Management",
          icon: CircleQuestionMark,
          href: "/faq-management",
        },
      ],
    },
    {
      section: "Personal",
      items: [
        { label: "Profile", icon: User, href: "/profile" },
        { label: "Logout", icon: LogOut, href: "/signin" },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 lg:top-16 w-64 h-[calc(100vh-4rem)] bg-gray-50 overflow-y-auto px-4 pt-4 pb-8 flex flex-col gap-6">
      {navLinks.map((section) => (
        <div key={section.section}>
          <p className="text-xs text-gray-400 uppercase mb-2">
            {section.section}
          </p>

          <div className="space-y-2">
            {section.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                item.label === "Logout" ? (
                  <button
                    key={item.label}
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition bg-white hover:bg-gray-100 text-gray-800 border-gray-200"
                  >
                    <Icon className="w-4 h-4 text-gray-700" />
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onItemClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition ${
                      isActive
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-white hover:bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-white" : "text-gray-700"
                      }`}
                    />
                    {item.label}
                  </Link>
                )
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
