"use client";

import { useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Navbar */}
      <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 pt-16">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto py-8 px-2 lg:px-8 lg:pl-[18rem]">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 bg-opacity-40 z-40 lg:hidden"
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r z-50 transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onItemClick={() => setSidebarOpen(false)} />
      </div>
    </div>
  );
}
