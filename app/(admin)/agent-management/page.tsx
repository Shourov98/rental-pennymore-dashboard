"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Download } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

type AgentUser = {
  _id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  accountStatus?: string;
};

type Agent = {
  _id: string;
  userInfo: AgentUser;
  isActive: boolean;
  createdAt: string;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

type AgentsResponse = {
  success: boolean;
  message: string;
  data: Agent[];
  pagination: Pagination;
  timestamp: string;
};

type AgentExcelResponse = {
  success: boolean;
  message: string;
  data: {
    downloadUrl?: {
      url: string;
      key: string;
    };
  };
};

export default function AgentManagement() {
  const router = useRouter();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<
    "idle" | "loading" | "failed"
  >("idle");
  const [exportError, setExportError] = useState<string | null>(null);
  const [toggleId, setToggleId] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState<string | null>(null);
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

  // Toggle access
  const toggleAccess = async (
    agentId: string,
    userId: string,
    currentStatus: boolean
  ) => {
    setToggleError(null);
    setToggleId(agentId);
    setAgents((prev) =>
      prev.map((agent) =>
        agent._id === agentId
          ? { ...agent, isActive: !agent.isActive }
          : agent
      )
    );

    try {

      await apiClient.post(
        `/agent/admin/${userId}/toggle-active`,
        {});
    } catch (err) {
      setAgents((prev) =>
        prev.map((agent) =>
          agent._id === agentId
            ? { ...agent, isActive: currentStatus }
            : agent
        )
      );
      setToggleError(
        err instanceof Error ? err.message : "Unable to toggle agent status."
      );
    } finally {
      setToggleId(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAgents = async () => {
      try {
        setStatus("loading");
        setError(null);

        const response = await apiClient.get<AgentsResponse>(
          "/agent/admin/all",
          {
            params: { page, limit },
          }
        );

        if (!isMounted) return;
        setAgents(response.data.data);
        setPagination(response.data.pagination);
        setStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setStatus("failed");
        setError(err instanceof Error ? err.message : "Unable to load agents.");
      }
    };

    fetchAgents();

    return () => {
      isMounted = false;
    };
  }, [page]);

  const handleExport = async () => {
    try {
      setExportStatus("loading");
      setExportError(null);

      const response = await apiClient.get<AgentExcelResponse>(
        "/agent/admin/excel-download");

      console.log(response.data);

      const downloadUrl = response.data.data?.downloadUrl?.url;
      if (!downloadUrl) {
        throw new Error("Download URL not available.");
      }

      downloadFile(downloadUrl);
      setExportStatus("idle");
    } catch (err) {
      setExportStatus("failed");
      setExportError(
        err instanceof Error ? err.message : "Unable to export agents."
      );
    }
  };

  const isExporting = exportStatus === "loading";

  const totalItems = pagination?.total ?? agents.length;
  const itemsPerPage = pagination?.limit ?? limit;
  const currentPage = pagination?.page ?? page;
  const totalPages = pagination?.pages
    ? Math.max(1, pagination.pages)
    : Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const prevPage = hasPrev ? currentPage - 1 : null;
  const nextPage = hasNext ? currentPage + 1 : null;

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];
    const total = totalPages;
    const current = currentPage;
    const windowSize = 5;
    const start = Math.max(1, current - Math.floor(windowSize / 2));
    const end = Math.min(total, start + windowSize - 1);
    const adjustedStart = Math.max(1, end - windowSize + 1);
    return Array.from(
      { length: end - adjustedStart + 1 },
      (_, i) => adjustedStart + i
    );
  }, [currentPage, totalPages]);

  const formatDate = (value: string | null | undefined) => {
    if (!value) return "Not Yet";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not Yet";
    return date.toISOString().slice(0, 10);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#0B0B2C]">Agent Management</h1>

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
      {toggleError ? (
        <p className="text-sm text-red-600">{toggleError}</p>
      ) : null}

      {/* TABLE WRAPPER — scrollable container */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          <table className="min-w-max w-full border-collapse">
            <thead className="bg-blue-200 text-[#0B0B2C]">
              <tr>
                {[
                  "Register Date",
                  "Name",
                  "Email",
                  "Phone",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-sm font-semibold py-3 px-6 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {status === "loading" ? (
                <tr>
                  <td colSpan={6} className="py-6 px-6 text-sm text-gray-500">
                    Loading agents...
                  </td>
                </tr>
              ) : agents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 px-6 text-sm text-gray-500">
                    {error ?? "No agents found."}
                  </td>
                </tr>
              ) : (
                agents.map((agent) => (
                  <tr
                    key={agent._id}
                    className="border-b border-gray-200 text-black last:border-none hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      {formatDate(agent.createdAt)}
                    </td>

                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      {agent.userInfo?.fullName ?? "Unknown"}
                    </td>

                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      {agent.userInfo?.email ?? "Unknown"}
                    </td>

                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      {agent.userInfo?.phoneNumber ?? "Unknown"}
                    </td>

                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          agent.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {agent.isActive ? "Active" : "Deactive"}
                      </span>
                    </td>

                    <td className="py-3 px-6 flex items-center gap-3 whitespace-nowrap">
                      <button
                        onClick={() =>
                          toggleAccess(
                            agent._id,
                            agent.userInfo._id,
                            agent.isActive
                          )
                        }
                        disabled={toggleId === agent._id}
                        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition ${
                          agent.isActive
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        } ${
                          toggleId === agent._id
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {agent.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/agent-management/${agent.userInfo._id}`)
                        }
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 border border-blue-100 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <p className="text-sm text-[#0B0B2C] font-medium">
          Showing <span className="text-blue-600 font-semibold">{agents.length}</span>{" "}
          of <span className="text-blue-600 font-semibold">{totalItems}</span>{" "}
          items • Total pages:{" "}
          <span className="text-blue-600 font-semibold">{totalPages}</span>
        </p>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            className="w-9 h-9 rounded-full border border-blue-200 bg-white text-[#0B0B2C] hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={!hasPrev || status === "loading"}
            onClick={() => (prevPage ? setPage(prevPage) : null)}
          >
            &lt;
          </button>

          {pageNumbers.map((pageNumber) => {
            const isActive = pageNumber === currentPage;
            return (
              <button
                key={pageNumber}
                className={`w-9 h-9 rounded-full border text-sm font-medium transition ${
                  isActive
                    ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                    : "border-blue-200 bg-white text-[#0B0B2C] hover:bg-blue-50"
                }`}
                disabled={status === "loading"}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            className="w-9 h-9 rounded-full border border-blue-200 bg-white text-[#0B0B2C] hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={!hasNext || status === "loading"}
            onClick={() => (nextPage ? setPage(nextPage) : null)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
