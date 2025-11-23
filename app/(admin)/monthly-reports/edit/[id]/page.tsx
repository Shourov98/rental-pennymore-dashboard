"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Link } from "lucide-react";
import ReportDateSelector from "@/components/ReportDateSelector";

export default function ReportEditPage() {
  const router = useRouter();

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
          <span className="text-blue-600 font-medium">Edit Report</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/reports")}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
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
              defaultValue="https://www.figma.com/design/xyz123-example-figma-link"
              className="bg-transparent outline-none text-sm text-gray-800 w-full"
            />
          </div>
        </div>

        {/* Month and Year Dropdown */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Date</p>
          <ReportDateSelector
            defaultMonth="December"
            defaultYear="2025"
            onChange={(month, year) => console.log("Selected:", month, year)}
          />
        </div>
      </div>
    </section>
  );
}
