"use client";

import { Download } from "lucide-react";

export default function ReportListPage() {
  const downloadFile = (url: string) => {
    // Trigger browser download
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      {/* Renter Request Report */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold text-[#0A093D]">
          Renter Request Report
        </h1>

        <button
          onClick={() =>
            downloadFile(
              "https://docs.google.com/spreadsheets/d/1P-Ut1SwqAV9PAui_XpuUVKTiu5_c0UfIsP8v41EuiSU/export?format=xlsx"
            )
          }
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition mt-3 sm:mt-0"
        >
          <Download size={16} /> Download Report
        </button>
      </div>

      {/* Request Matches Report */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold text-[#0A093D]">
          Request Matches Report
        </h1>

        <button
          onClick={() =>
            downloadFile(
              "https://docs.google.com/spreadsheets/d/1qwL1tE6FyAodVJ74SfFStjp7D_CHNdzeU2peqyXRVec/export?format=xlsx"
            )
          }
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition mt-3 sm:mt-0"
        >
          <Download size={16} /> Download Report
        </button>
      </div>
    </section>
  );
}
