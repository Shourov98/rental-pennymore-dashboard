"use client";

import { useEffect, useMemo, useState } from "react";
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
import { apiClient } from "@/lib/apiClient";

type YearlyIncomeResponse = {
  success: boolean;
  message: string;
  data: {
    year: number;
    totalRevenue: number;
    totalPayments: number;
    monthlyBreakdown: Array<{
      month: string;
      monthName: string;
      totalRevenue: number;
      paymentCount: number;
      averagePayment: number;
      currency: string;
    }>;
  };
};

type MonthlyIncomeResponse = {
  success: boolean;
  message: string;
  data: {
    month: string;
    monthName: string;
    totalRevenue: number;
    paymentCount: number;
    averagePayment: number;
    currency: string;
  };
};

const months = [
  { value: 1, short: "Jan", label: "January" },
  { value: 2, short: "Feb", label: "February" },
  { value: 3, short: "Mar", label: "March" },
  { value: 4, short: "Apr", label: "April" },
  { value: 5, short: "May", label: "May" },
  { value: 6, short: "Jun", label: "June" },
  { value: 7, short: "Jul", label: "July" },
  { value: 8, short: "Aug", label: "August" },
  { value: 9, short: "Sep", label: "September" },
  { value: 10, short: "Oct", label: "October" },
  { value: 11, short: "Nov", label: "November" },
  { value: 12, short: "Dec", label: "December" },
];

export default function AnalyticsPage() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    now.getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    now.getFullYear(),
  );
  const [, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [, setError] = useState<string | null>(null);
  const [yearlyIncome, setYearlyIncome] = useState<
    YearlyIncomeResponse["data"] | null
  >(null);
  const [monthlyStatus, setMonthlyStatus] = useState<
    "idle" | "loading" | "failed"
  >("idle");
  const [monthlyError, setMonthlyError] = useState<string | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState<
    MonthlyIncomeResponse["data"] | null
  >(null);

  useEffect(() => {
    let isMounted = true;

    const fetchYearlyIncome = async () => {
      try {
        setStatus("loading");
        setError(null);

        const response = await apiClient.get<YearlyIncomeResponse>(
          `/grant-access/admin/income/${selectedYear}`
        );

        if (!isMounted) return;
        setYearlyIncome(response.data.data);
        setStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setStatus("failed");
        setError(
          err instanceof Error ? err.message : "Unable to load income data.",
        );
      }
    };

    fetchYearlyIncome();

    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedYear || !selectedMonth) return;
    let isMounted = true;

    const fetchMonthlyIncome = async () => {
      try {
        setMonthlyStatus("loading");
        setMonthlyError(null);

        const response = await apiClient.get<MonthlyIncomeResponse>(
          `/grant-access/admin/income/monthly/${selectedYear}/${selectedMonth}`
        );

        if (!isMounted) return;
        setMonthlyIncome(response.data.data);
        setMonthlyStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setMonthlyStatus("failed");
        setMonthlyError(
          err instanceof Error ? err.message : "Unable to load monthly income.",
        );
      }
    };

    fetchMonthlyIncome();

    return () => {
      isMounted = false;
    };
  }, [selectedMonth, selectedYear]);

  const monthlyData = useMemo(() => {
    const lookup = new Map<number, number>();
    yearlyIncome?.monthlyBreakdown.forEach((item) => {
      const [, monthValue] = item.month.split("-");
      const monthNumber = Number(monthValue);
      if (!Number.isNaN(monthNumber)) {
        lookup.set(monthNumber, item.totalRevenue);
      }
    });

    return months.map((month) => ({
      name: month.short,
      revenue: lookup.get(month.value) ?? 0,
    }));
  }, [yearlyIncome]);

  const monthLabel =
    months.find((month) => month.value === selectedMonth)?.label ??
    "Selected month";

  const years = Array.from({ length: 10 }, (_, i) => now.getFullYear() - i);

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 sm:px-6 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#0A093D]">
          Analytics
        </h1>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 space-y-5">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Monthly Breakdown
        </h2>

        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-blue-100 text-black rounded-lg px-4 py-2 text-sm sm:text-base font-medium focus:ring-2 focus:ring-blue-400 outline-none w-full sm:w-auto"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-blue-100 text-black rounded-lg px-4 py-2 text-sm sm:text-base font-medium focus:ring-2 focus:ring-blue-400 outline-none w-full sm:w-auto"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Total Revenue Box */}
      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-700">
            {monthLabel} Total
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0A093D]">
            {monthlyStatus === "loading"
              ? "Loading..."
              : `${monthlyIncome?.currency ?? "USD"} ${(
                  monthlyIncome?.totalRevenue ?? 0
                ).toLocaleString()}`}
          </h2>
          {monthlyError ? (
            <p className="text-sm text-red-600 mt-2">{monthlyError}</p>
          ) : null}
        </div>

        <div className="bg-blue-500 text-white p-3 rounded-full">
          <DollarSign size={24} />
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-[#CFE4FF] px-5 sm:px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h3 className="text-lg sm:text-xl font-semibold text-[#0A093D]">
            Revenue
          </h3>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-blue-100 text-black rounded-lg px-3 py-1.5 text-sm sm:text-base font-medium focus:ring-2 focus:ring-blue-400 outline-none w-full sm:w-auto"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Chart */}
        <div className="p-4 sm:p-6 h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
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
