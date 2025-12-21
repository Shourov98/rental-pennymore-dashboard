"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Link } from "lucide-react";
import ReportDateSelector from "@/components/ReportDateSelector";
import { apiClient } from "@/lib/apiClient";
import { useAppSelector } from "@/store/hooks";

type Report = {
  _id: string;
  link: string;
  month: string;
  year: number;
};

type ReportsResponse = {
  success: boolean;
  message: string;
  data: Report[];
  timestamp: string;
};

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

export default function ReportEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [link, setLink] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportId = params?.id;

  useEffect(() => {
    if (!reportId) return;
    let isMounted = true;

    const fetchReport = async () => {
      try {
        setStatus("loading");
        setError(null);
        const tokenFromStorage =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
        const token = accessToken || tokenFromStorage;

        const response = await apiClient.get<ReportsResponse>(
          "/monthly-reports/admin/all",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );
        const report = response.data.data.find((item) => item._id === reportId);
        if (!isMounted) return;
        if (!report) {
          setError("Report not found.");
          setStatus("failed");
          return;
        }
        setLink(report.link);
        const monthIndex = Number(report.month) - 1;
        setMonth(monthNames[monthIndex] ?? "");
        setYear(String(report.year));
        setStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setStatus("failed");
        setError(err instanceof Error ? err.message : "Unable to load report.");
      }
    };

    fetchReport();

    return () => {
      isMounted = false;
    };
  }, [accessToken, reportId]);

  const handleSave = async () => {
    if (!reportId) return;
    try {
      setIsSaving(true);
      setError(null);
      const tokenFromStorage =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const token = accessToken || tokenFromStorage;
      const monthIndex = monthNames.indexOf(month) + 1;

      await apiClient.put(
        `/monthly-reports/admin/${reportId}`,
        {
          link,
          month: monthIndex,
          year: Number(year),
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      router.push("/monthly-reports");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update report.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm flex justify-between items-center px-6 py-4 mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft
            size={18}
            className="cursor-pointer"
            onClick={() => router.push("/monthly-reports")}
          />
          <span>Report</span>
          <span className="text-gray-400">›</span>
          <span className="text-blue-600 font-medium">Edit Report</span>
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
            disabled={isSaving || status === "loading"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        {/* Link */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Link</p>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
            <Link size={18} className="text-blue-500 mr-2" />
            <input
              type="text"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              className="bg-transparent outline-none text-sm text-gray-800 w-full"
            />
          </div>
        </div>

        {/* Month and Year Dropdown */}
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
        {status === "loading" ? (
          <p className="text-sm text-gray-500">Loading report...</p>
        ) : null}
        {error ? (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
