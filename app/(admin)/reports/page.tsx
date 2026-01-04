"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { useAppSelector } from "@/store/hooks";

type PreMarketExcelResponse = {
  success: boolean;
  message: string;
  data: {
    downloadUrl?: {
      url: string;
      key: string;
    };
  };
};

export default function ReportListPage() {
  const [preMarketStatus, setPreMarketStatus] = useState<
    "idle" | "loading" | "failed"
  >("idle");
  const [preMarketError, setPreMarketError] = useState<string | null>(null);
  const [requestMatchStatus, setRequestMatchStatus] = useState<
    "idle" | "loading" | "failed"
  >("idle");
  const [requestMatchError, setRequestMatchError] = useState<string | null>(
    null
  );
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const downloadFile = (url: string) => {
    // Trigger browser download
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreMarketDownload = async () => {
    try {
      setPreMarketStatus("loading");
      setPreMarketError(null);

      const tokenFromStorage =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const token = accessToken || tokenFromStorage;

      const response = await apiClient.get<PreMarketExcelResponse>(
        "/pre-market/admin/excel-download",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      const downloadUrl = response.data.data?.downloadUrl?.url;
      if (!downloadUrl) {
        throw new Error("Download URL not available.");
      }

      downloadFile(downloadUrl);
      setPreMarketStatus("idle");
    } catch (err) {
      setPreMarketStatus("failed");
      setPreMarketError(
        err instanceof Error ? err.message : "Unable to download report."
      );
    }
  };

  const handleRequestMatchDownload = async () => {
    try {
      setRequestMatchStatus("loading");
      setRequestMatchError(null);

      const tokenFromStorage =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const token = accessToken || tokenFromStorage;

      const response = await apiClient.get<PreMarketExcelResponse>(
        "/pre-market/admin/excel-renter-listings",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      const downloadUrl = response.data.data?.downloadUrl?.url;
      if (!downloadUrl) {
        throw new Error("Download URL not available.");
      }

      downloadFile(downloadUrl);
      setRequestMatchStatus("idle");
    } catch (err) {
      setRequestMatchStatus("failed");
      setRequestMatchError(
        err instanceof Error ? err.message : "Unable to download report."
      );
    }
  };

  const isPreMarketBusy = preMarketStatus === "loading";
  const isRequestMatchBusy = requestMatchStatus === "loading";

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      {/* Renter Request Report */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold text-[#0A093D]">
          All Renter Requests Report
        </h1>

        <button
          onClick={handlePreMarketDownload}
          disabled={isPreMarketBusy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition mt-3 sm:mt-0 ${
            isPreMarketBusy
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <Download size={16} />
          {isPreMarketBusy ? "Downloading..." : "Download Report"}
        </button>
      </div>
      {preMarketError ? (
        <p className="text-sm text-red-600 mb-6">{preMarketError}</p>
      ) : null}

      {/* Request Matches Report */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold text-[#0A093D]">
          Agent Request Engagement Report
        </h1>

        <button
          onClick={handleRequestMatchDownload}
          disabled={isRequestMatchBusy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition mt-3 sm:mt-0 ${
            isRequestMatchBusy
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <Download size={16} />
          {isRequestMatchBusy ? "Downloading..." : "Download Report"}
        </button>
      </div>
      {requestMatchError ? (
        <p className="text-sm text-red-600 mb-6">{requestMatchError}</p>
      ) : null}
    </section>
  );
}
