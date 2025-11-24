"use client";

import Image from "next/image";
import { Bell, Menu } from "lucide-react";
import Link from "next/link";

export default function AdminNavbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm h-16 flex items-center justify-between px-6">
      {/* Logo */}
      <Link href="/">
        <Image className="w-[120px] md:w-[150px] lg:w-[180px] h-auto" src="/Logo_1.svg" alt="Logo" width={180} height={150} />
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <div className="relative hidden sm:block">
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
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 leading-none">
              Hello, Steve
            </p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>

        {/* Hamburger - Visible on mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden block p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-6 h-6 text-gray-800" />
        </button>
      </div>
    </header>
  );
}
