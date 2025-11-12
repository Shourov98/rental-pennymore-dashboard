"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

export default function ReportViewPage() {
  const router = useRouter();
  const report = {
    id: 1,
    link: "https://www.figma.com/design/xyz123-example-figma-link",
    date: "Dec, 2025",
  };

  const handleDelete = () => {
    alert("Report deleted!");
    router.push("/reports");
  };

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm flex justify-between items-center px-6 py-4 mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft
            size={18}
            className="cursor-pointer"
            onClick={() => router.push("/reports")}
          />
          <span>Report</span>
          <span className="text-gray-400">›</span>
          <span className="text-blue-600 font-medium">View Report</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Trash2 size={16} /> Delete
          </button>
          <button
            onClick={() => router.push(`/reports/edit/${report.id}`)}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Edit2 size={16} /> Edit
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Link</p>
          <p className="text-sm text-gray-800 border-b border-gray-300 pb-1">
            {report.link}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Date</p>
          <p className="text-sm text-gray-800 border-b border-gray-300 pb-1">
            {report.date}
          </p>
        </div>
      </div>
    </section>
  );
}
