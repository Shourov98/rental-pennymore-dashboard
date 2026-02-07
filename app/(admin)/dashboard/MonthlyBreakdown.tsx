"use client";

import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

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

export default function MonthlyBreakdown() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return String(now.getMonth() + 1);
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    const now = new Date();
    return String(now.getFullYear());
  });
  const [incomeStatus, setIncomeStatus] = useState<
    "idle" | "loading" | "failed"
  >("idle");
  const [incomeError, setIncomeError] = useState<string | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState<
    MonthlyIncomeResponse["data"] | null
  >(null);

  useEffect(() => {
    if (!selectedYear || !selectedMonth) return;

    let isMounted = true;

    const fetchMonthlyIncome = async () => {
      try {
        setIncomeStatus("loading");
        setIncomeError(null);

        const response = await apiClient.get<MonthlyIncomeResponse>(
          `/grant-access/admin/income/monthly/${selectedYear}/${selectedMonth}`,
        );

        if (!isMounted) return;
        setMonthlyIncome(response.data.data);
        setIncomeStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setIncomeStatus("failed");
        setIncomeError(
          err instanceof Error ? err.message : "Unable to load income data.",
        );
      }
    };

    fetchMonthlyIncome();

    return () => {
      isMounted = false;
    };
  }, [selectedMonth, selectedYear]);

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = Array.from({ length: 6 }, (_, i) =>
    (new Date().getFullYear() - 2 + i).toString(),
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#0B0B2C]">
          Monthly Breakdown
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm focus:outline-none w-full sm:w-auto"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm focus:outline-none w-full sm:w-auto"
          >
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">Total</p>
          {incomeStatus === "loading" ? (
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0B0B2C]">
              Loading...
            </h3>
          ) : (
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0B0B2C]">
              {monthlyIncome?.currency ?? "USD"}{" "}
              {monthlyIncome?.totalRevenue?.toLocaleString() ?? "0"}
            </h3>
          )}
          {incomeError ? (
            <p className="text-sm text-red-600 mt-2">{incomeError}</p>
          ) : null}
        </div>

        <div className="bg-blue-100 p-4 rounded-full">
          <Wallet className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>
  );
}
