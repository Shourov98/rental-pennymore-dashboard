"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Download } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { useAppSelector } from "@/store/hooks";

type Renter = {
  _id: string;
  userId: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  totalListings: number;
  registrationType?: string;
  referralInfo?: {
    registrationType?: string;
    referredByAgentId?: string | null;
    referredByAdminId?: string | null;
    referredByAgent?: {
      referredBy?: string;
      referrerName?: string;
      referrerEmail?: string;
    } | null;
  };
  createdAt: string;
};

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
  slNo: number;
};

type RentersResponse = {
  success: boolean;
  message: string;
  data: Renter[];
  pagination: Pagination;
  timestamp: string;
};

type RenterExcelResponse = {
  success: boolean;
  message: string;
  data: {
    downloadUrl?: {
      url: string;
      key: string;
    };
  };
};

export default function RenterManagement() {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [renters, setRenters] = useState<Renter[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<
    "idle" | "loading" | "failed"
  >("idle");
  const [exportError, setExportError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const downloadFile = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchRenters = async () => {
      try {
        setStatus("loading");
        setError(null);
        const tokenFromStorage =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
        const token = accessToken || tokenFromStorage;

        const response = await apiClient.get<RentersResponse>(
          "/renter/admin/renters",
          {
            params: { page, limit },
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        if (!isMounted) return;
        setRenters(response.data.data);
        setPagination(response.data.pagination);
        setStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setStatus("failed");
        setError(
          err instanceof Error ? err.message : "Unable to load renters."
        );
      }
    };

    fetchRenters();

    return () => {
      isMounted = false;
    };
  }, [accessToken, page]);

  const handleExport = async () => {
    try {
      setExportStatus("loading");
      setExportError(null);
      const tokenFromStorage =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const token = accessToken || tokenFromStorage;

      const response = await apiClient.get<RenterExcelResponse>(
        "/renter/admin/excel-download",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      const downloadUrl = response.data.data?.downloadUrl?.url;
      if (!downloadUrl) {
        throw new Error("Download URL not available.");
      }

      downloadFile(downloadUrl);
      setExportStatus("idle");
    } catch (err) {
      setExportStatus("failed");
      setExportError(
        err instanceof Error ? err.message : "Unable to export renters."
      );
    }
  };

  const isExporting = exportStatus === "loading";

  const pageNumbers = useMemo(() => {
    if (!pagination) return [];
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    const windowSize = 5;
    const start = Math.max(1, current - Math.floor(windowSize / 2));
    const end = Math.min(total, start + windowSize - 1);
    const adjustedStart = Math.max(1, end - windowSize + 1);
    return Array.from(
      { length: end - adjustedStart + 1 },
      (_, i) => adjustedStart + i
    );
  }, [pagination]);

  const startIndex =
    pagination && pagination.currentPage > 1
      ? (pagination.currentPage - 1) * pagination.itemsPerPage
      : 0;

  const formatReferralName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return fullName;
    const firstInitial = parts[0][0]?.toUpperCase() ?? "";
    const lastName = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    return `${firstInitial}.${lastName}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#0B0B2C]">Renter Management</h1>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`flex items-center gap-2 text-white text-sm font-medium px-5 py-2.5 rounded-2xl transition ${
            isExporting
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <Download className="w-4 h-4" />
          {isExporting ? "Exporting..." : "Export Data"}
        </button>
      </div>
      {exportError ? (
        <p className="text-sm text-red-600">{exportError}</p>
      ) : null}

      {/* TABLE WRAPPER — scrollable */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          <table className="min-w-max w-full border-collapse">
            <thead className="bg-blue-200 text-[#0B0B2C]">
              <tr>
                {["No", "Name", "Email", "Phone", "Referral", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-sm font-semibold py-3 px-6 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {status === "loading" ? (
                <tr>
                  <td colSpan={6} className="py-6 px-6 text-sm text-gray-500">
                    Loading renters...
                  </td>
                </tr>
              ) : renters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 px-6 text-sm text-gray-500">
                    {error ?? "No renters found."}
                  </td>
                </tr>
              ) : (
                renters.map((renter, index) => {
                  const referralType =
                    renter.referralInfo?.registrationType ??
                    renter.registrationType ??
                    "normal";
                  const referralName =
                    referralType === "agent_referral"
                      ? renter.referralInfo?.referredByAgent?.referrerName
                      : referralType === "admin_referral"
                      ? "Admin"
                      : "T. Mor";

                  return (
                    <tr
                      key={renter._id}
                      className="text-[#0B0B2C] border-b border-gray-200 last:border-none hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-6 text-sm whitespace-nowrap">
                        {String(startIndex + index + 1).padStart(2, "0")}
                      </td>

                      <td className="py-3 px-6 text-sm whitespace-nowrap">
                        {renter.fullName}
                      </td>

                      <td className="py-3 px-6 text-sm whitespace-nowrap">
                        {renter.email}
                      </td>

                      <td className="py-3 px-6 text-sm whitespace-nowrap">
                        {renter.phoneNumber}
                      </td>

                      <td className="py-3 px-6 text-sm whitespace-nowrap">
                        {referralName === "Tuval Mor" ? (
                          <span className="text-gray-400">None</span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-blue-500 text-blue-600 px-2.5 py-0.5 text-xs font-semibold">
                            {referralType === "agent_referral" && referralName
                              ? formatReferralName(referralName)
                              : referralName}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-6 whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/renters/${renter._id}`)}
                          className="p-2 rounded-full hover:bg-gray-100 transition"
                        >
                          <Eye className="w-4 h-4 text-gray-700" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <p>
          No of Results {renters.length} out of{" "}
          {pagination?.totalItems ?? renters.length}
        </p>

        <div className="flex items-center gap-2">
          <button
            className="border rounded-full p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            disabled={!pagination?.hasPrev || status === "loading"}
            onClick={() =>
              pagination?.prevPage ? setPage(pagination.prevPage) : null
            }
          >
            &lt;
          </button>

          {pageNumbers.map((pageNumber) => {
            const isActive = pageNumber === (pagination?.currentPage ?? 1);
            return (
              <button
                key={pageNumber}
                className={`border rounded-full w-8 h-8 ${
                  isActive
                    ? "border-blue-500 text-blue-500"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                disabled={status === "loading"}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            className="border rounded-full p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            disabled={!pagination?.hasNext || status === "loading"}
            onClick={() =>
              pagination?.nextPage ? setPage(pagination.nextPage) : null
            }
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
