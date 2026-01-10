"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Eye, Edit2, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { useAppSelector } from "@/store/hooks";

type Report = {
  _id: string;
  link: string;
  month: string;
  year: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ReportsResponse = {
  success: boolean;
  message: string;
  data: Report[];
  timestamp: string;
};

export default function ReportListPage() {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [reports, setReports] = useState<Report[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
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

        if (!isMounted) return;
        setReports(response.data.data);
        setStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setStatus("failed");
        setError(
          err instanceof Error ? err.message : "Unable to load reports."
        );
      }
    };

    fetchReports();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const monthLabel = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
    return (month: string, year: number) => {
      const monthNumber = Number.parseInt(month, 10);
      if (!Number.isFinite(monthNumber) || monthNumber < 1 || monthNumber > 12) {
        return `${month}, ${year}`;
      }
      const date = new Date(Date.UTC(year, monthNumber - 1, 1));
      return `${formatter.format(date)}, ${year}`;
    };
  }, []);

  const handleCopy = async (link: string, id: string) => {
    await navigator.clipboard.writeText(link);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDelete = async (id: string) => {
    try {
      const tokenFromStorage =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const token = accessToken || tokenFromStorage;
      await apiClient.delete(`/monthly-reports/admin/${id}/hard-delete`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete report.");
    }
  };

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#0A093D]">
          Report
        </h1>

        <button
          onClick={() => router.push("/monthly-reports/add")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition mt-3 sm:mt-0"
        >
          <Plus size={16} /> Add Report
        </button>
      </div>

      {/* TABLE WRAPPER */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          <table className="min-w-max w-full text-sm text-gray-800 border-collapse">
            <thead className="bg-[#CFE4FF] text-[#0A093D] font-semibold">
              <tr>
                {["No", "Link", "Month", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {status === "loading" ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-sm text-gray-500">
                    Loading reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-sm text-gray-500">
                    {error ?? "No reports found."}
                  </td>
                </tr>
              ) : (
                reports.map((report, idx) => (
                  <tr
                    key={report._id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    {/* NO */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {String(idx + 1).padStart(2, "0")}
                    </td>

                    {/* LINK + COPY */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2 max-w-[240px]">
                        <span className="truncate text-blue-600">
                          {report.link}
                        </span>
                        <button
                          onClick={() => handleCopy(report.link, report._id)}
                          className="text-blue-500 hover:text-blue-700 shrink-0 text-xs"
                        >
                          {copiedId === report._id ? "Copied" : <Copy size={16} />}
                        </button>
                      </div>
                    </td>

                    {/* MONTH */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {monthLabel(report.month, report.year)}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex justify-start gap-2">
                        <button
                          onClick={() =>
                            router.push(`/monthly-reports/edit/${report._id}`)
                          }
                          className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                        >
                          <Edit2 size={16} className="text-blue-600" />
                        </button>

                        <button
                          onClick={() =>
                            router.push(`/monthly-reports/view/${report._id}`)
                          }
                          className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                        >
                          <Eye size={16} className="text-gray-800" />
                        </button>

                        <button
                          onClick={() => handleDelete(report._id)}
                          className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <p className="text-xs text-gray-500">
        No of Results {reports.length} out of {reports.length}
      </p>
    </section>
  );
}
