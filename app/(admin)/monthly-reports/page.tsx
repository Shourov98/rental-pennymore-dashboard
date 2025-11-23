"use client";

import { useState } from "react";
import { Copy, Eye, Edit2, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const dummyReports = [
  {
    id: 1,
    link: "https://www.figma.com/design/xyz123-example-figma-link",
    date: "Dec, 2025",
  },
];

export default function ReportListPage() {
  const [reports, setReports] = useState(dummyReports);
  const router = useRouter();

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    alert("Link copied!");
  };

  const handleDelete = (id: number) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold text-[#0A093D]">Report</h1>
        <button
          onClick={() => router.push("/reports/add")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition mt-3 sm:mt-0"
        >
          <Plus size={16} /> Add Report
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-[#CFE4FF] text-[#0A093D] font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">No</th>
              <th className="px-4 py-3 text-left">Link</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, idx) => (
              <tr
                key={report.id}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">
                  {String(idx + 1).padStart(2, "0")}
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <span className="truncate max-w-[200px]">
                    {report.link.slice(0, 25)}...
                  </span>
                  <button
                    onClick={() => handleCopy(report.link)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Copy size={16} />
                  </button>
                </td>
                <td className="px-4 py-3">{report.date}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => router.push(`/reports/edit/${report.id}`)}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                    >
                      <Edit2 size={16} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => router.push(`/reports/view/${report.id}`)}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                    >
                      <Eye size={16} className="text-gray-800" />
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        No of Results {reports.length} out of 100
      </p>
    </section>
  );
}
