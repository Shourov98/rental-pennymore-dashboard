"use client";

import { useState, useEffect } from "react";
import { Copy, Wallet } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { selectAuth } from "@/store/auth/authSlice";
import { useAppSelector } from "@/store/hooks";

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

export default function AdminDashboard() {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const { user } = useAppSelector(selectAuth);
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

  const referralLink = user?.referralLink ?? "";

  const handleCopy = async () => {
    if (!referralLink) return;
    setCopyError(null);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(referralLink);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = referralLink;
        textArea.style.position = "fixed";
        textArea.style.top = "-1000px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (!copied) {
          throw new Error("Copy failed");
        }
      }
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    } catch (err) {
      setCopyError("Unable to copy link.");
    }
  };

  useEffect(() => {
    if (!selectedYear || !selectedMonth) return;

    let isMounted = true;

    const fetchMonthlyIncome = async () => {
      try {
        setIncomeStatus("loading");
        setIncomeError(null);

        const response = await apiClient.get<MonthlyIncomeResponse>(
          `/grant-access/admin/income/monthly/${selectedYear}/${selectedMonth}`);

        if (!isMounted) return;
        setMonthlyIncome(response.data.data);
        setIncomeStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setIncomeStatus("failed");
        setIncomeError(
          err instanceof Error ? err.message : "Unable to load income data."
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
    (new Date().getFullYear() - 2 + i).toString()
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Title */}
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B0B2C]">
          Dashboard
        </h1>
      </div>

      {/* Special Link Section */}
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <p className="font-semibold text-[#0B0B2C] text-sm">Special Link</p>
            <p className="text-gray-500 text-sm">
              This link is for special customers
            </p>
          </div>

          <button
            onClick={handleCopy}
            disabled={!referralLink}
            className="flex items-center justify-center sm:justify-start gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 text-sm font-medium rounded-2xl transition w-full sm:w-auto"
          >
            <Copy className="w-4 h-4" />
            {copySuccess ? "Copied!" : "Copy Link"}
          </button>
        </div>

        <input
          type="text"
          readOnly
          value={referralLink}
          className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none"
        />
        {copyError ? (
          <p className="text-sm text-red-600">{copyError}</p>
        ) : null}
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
        {/* Header */}
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

        {/* Total Section */}
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
    </div>
  );
}
