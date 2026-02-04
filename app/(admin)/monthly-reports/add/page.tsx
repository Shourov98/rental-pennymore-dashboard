"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Link } from "lucide-react";
import { useState } from "react";
import ReportDateSelector from "@/components/ReportDateSelector";
import { apiClient } from "@/lib/apiClient";

const monthNames = [
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

export default function ReportAddPage() {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const monthIndex = monthNames.indexOf(month) + 1;

      await apiClient.post(
        "/monthly-reports/admin",
        {
          link,
          month: monthIndex,
          year: Number(year),
        });

      router.push("/monthly-reports");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add report.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      <div className="bg-white rounded-xl shadow-sm flex justify-between items-center px-6 py-4 mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft
            size={18}
            className="cursor-pointer"
            onClick={() => router.push("/monthly-reports")}
          />
          <span>Report</span>
          <span className="text-gray-400">›</span>
          <span className="text-blue-600 font-medium">Add Report</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/monthly-reports")}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Link</p>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
            <Link size={18} className="text-blue-500 mr-2" />
            <input
              type="text"
              placeholder="Enter link"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              className="bg-transparent outline-none text-sm text-gray-800 w-full"
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Date</p>
          <ReportDateSelector
            defaultMonth={month}
            defaultYear={year}
            onChange={(selectedMonth, selectedYear) => {
              setMonth(selectedMonth);
              setYear(selectedYear);
            }}
          />
        </div>
        {error ? (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
