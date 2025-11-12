"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign } from "lucide-react";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Dummy revenue data
const monthlyData = months.map((month) => ({
  name: month,
  revenue: Math.floor(Math.random() * 80) + 20,
}));

const years = Array.from({ length: 10 }, (_, i) => 2025 - i);

export default function AnalyticsPage() {
  const [selectedMonth, setSelectedMonth] = useState("Month");
  const [selectedYear, setSelectedYear] = useState("Year");

  const totalRevenue = "$120";

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold text-[#0A093D]">Analytics</h1>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-0">
          Monthly Breakdown
        </h2>

        <div className="flex gap-3">
          {/* Month Dropdown */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-blue-100 text-black rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option>Month</option>
            {months.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-blue-100 text-black rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option>Year</option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Total Revenue Box */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-800 mb-1">Total</p>
          <h2 className="text-2xl font-semibold text-[#0A093D]">
            {totalRevenue}
          </h2>
        </div>

        <div className="bg-blue-500 text-white p-3 rounded-full">
          <DollarSign size={24} />
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="bg-[#CFE4FF] px-6 py-4 flex justify-between items-center rounded-t-xl">
          <h3 className="text-lg font-semibold text-[#0A093D]">Revenue</h3>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-blue-100 text-black rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option>Year</option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Chart */}
        <div className="p-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Bar
                dataKey="revenue"
                fill="#1E90FF"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
