"use client";

import Image from "next/image";
import { Bell } from "lucide-react";

export default function AdminNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm h-16 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="text-2xl font-bold text-gray-900">Logo</div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-1.5 rounded-full">
            12
          </span>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 cursor-pointer">
          <Image
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Admin"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 leading-none">
              Hello, Steve
            </p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
