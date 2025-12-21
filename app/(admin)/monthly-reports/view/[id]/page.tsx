"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
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

export default function ReportViewPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [report, setReport] = useState<Report | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        const selected = response.data.data.find(
          (item) => item._id === reportId
        );
        if (!isMounted) return;
        if (!selected) {
          setError("Report not found.");
          setStatus("failed");
          return;
        }
        setReport(selected);
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

  const monthLabel = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
    return (month: string, year: number) => {
      const monthIndex = Number(month) - 1;
      if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
        return `${month}, ${year}`;
      }
      const date = new Date(Date.UTC(year, monthIndex, 1));
      return `${formatter.format(date)}, ${year}`;
    };
  }, []);

  const handleDelete = async () => {
    if (!reportId) return;
    try {
      setIsDeleting(true);
      const tokenFromStorage =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const token = accessToken || tokenFromStorage;
      await apiClient.delete(`/monthly-reports/admin/${reportId}/hard-delete`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      router.push("/monthly-reports");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete report.");
    } finally {
      setIsDeleting(false);
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
          <span className="text-blue-600 font-medium">View Report</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Trash2 size={16} /> Delete
          </button>
          <button
            onClick={() =>
              report?._id ? router.push(`/monthly-reports/edit/${report._id}`) : null
            }
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Edit2 size={16} /> Edit
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {status === "loading" ? (
          <p className="text-sm text-gray-500">Loading report...</p>
        ) : report ? (
          <>
            <div>
              <p className="text-sm text-gray-500 mb-1">Link</p>
              <p className="text-sm text-gray-800 border-b border-gray-300 pb-1">
                {report.link}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Month</p>
              <p className="text-sm text-gray-800 border-b border-gray-300 pb-1">
                {monthLabel(report.month, report.year)}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">
            {error ?? "No report found."}
          </p>
        )}
      </div>
      {error ? (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
