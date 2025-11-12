"use client";

import { useState, useEffect } from "react";
import { Copy, CalendarDays, Wallet } from "lucide-react";

export default function AdminDashboard() {
  const [copySuccess, setCopySuccess] = useState(false);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const defaultLink =
    "https://premarket-platform.com/referral/special-link-2025";

  // Initialize with current date values
  useState(() => {
    const month = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear().toString();
    setSelectedMonth(month);
    setSelectedYear(year);
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from({ length: 6 }, (_, i) =>
    (new Date().getFullYear() - 2 + i).toString()
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-[#0B0B2C]">Dashboard</h1>
      </div>

      {/* Special Link Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-semibold text-[#0B0B2C] text-sm">Special Link</p>
            <p className="text-gray-500 text-sm">
              This link is for special customers
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 text-sm font-medium rounded-2xl transition"
          >
            <Copy className="w-4 h-4" />
            {copySuccess ? "Copied!" : "Copy Link"}
          </button>
        </div>

        <input
          type="text"
          readOnly
          value={defaultLink}
          className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#0B0B2C]">
            Monthly Breakdown
          </h2>
          <div className="flex gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Total Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total</p>
            <h3 className="text-3xl font-bold text-[#0B0B2C]">$120</h3>
          </div>
          <div className="bg-blue-100 p-4 rounded-full">
            <Wallet className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
