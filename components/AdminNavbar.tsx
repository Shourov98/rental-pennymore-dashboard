"use client";

import Image from "next/image";
import { Bell, Menu } from "lucide-react";
import Link from "next/link";

import { selectAuth } from "@/store/auth/authSlice";
import { useAppSelector } from "@/store/hooks";

export default function AdminNavbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { user } = useAppSelector(selectAuth);
  const displayName = user?.fullName || user?.email || "Admin";
  const role = user?.role || "Admin";
  const initials = (user?.fullName || user?.email || "A")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16 flex items-center justify-between px-6">
      {/* Logo */}
      <Link href="/">
        <Image
          className="w-[120px] md:w-[150px] lg:w-[180px] h-auto"
          src="/Logo_1.svg"
          alt="Logo"
          width={180}
          height={150}
        />
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900 leading-none">
              Hello, {displayName}
            </p>
            <p className="text-xs text-gray-500">{role}</p>
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
