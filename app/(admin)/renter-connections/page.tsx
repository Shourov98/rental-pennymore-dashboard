"use client";

import { useState } from "react";
import { SlidersHorizontal, Eye, Trash2 } from "lucide-react";
import { FilterModal } from "@/components/modals/FilterModal";
import { useRouter } from "next/navigation";

interface RenterConnection {
  id: number;
  neighborhood: string;
  priceRange: string;
  bedrooms: number;
  bathrooms: number;
  status: "Pending" | "Approved" | "Rejected";
}

const renterConnections: RenterConnection[] = [
  {
    id: 1,
    neighborhood: "Manhattan",
    priceRange: "$7500.55",
    bedrooms: 5,
    bathrooms: 2,
    status: "Pending",
  },
  {
    id: 2,
    neighborhood: "Manhattan",
    priceRange: "$7500.55",
    bedrooms: 5,
    bathrooms: 2,
    status: "Pending",
  },
  {
    id: 3,
    neighborhood: "Manhattan",
    priceRange: "$7500.55",
    bedrooms: 5,
    bathrooms: 2,
    status: "Pending",
  },
];

export default function RenterConnectionPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const openFilter = () => setIsFilterOpen(true);
  const closeFilter = () => setIsFilterOpen(false);

  const router = useRouter();

  const totalPages = 2;

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#0A093D]">
          Renter Connection
        </h1>

        <button
          onClick={openFilter}
          className="mt-3 sm:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition"
        >
          <SlidersHorizontal size={18} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm text-gray-800">
            <thead className="bg-[#CFE4FF] text-[#0A093D] font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">No</th>
                <th className="px-4 py-3 text-left">Neighborhood</th>
                <th className="px-4 py-3 text-left">Price Range</th>
                <th className="px-4 py-3 text-left">No. Bed Rooms</th>
                <th className="px-4 py-3 text-left">No. of Bath</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {renterConnections.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    {String(item.id).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3">{item.neighborhood}</td>
                  <td className="px-4 py-3">{item.priceRange}</td>
                  <td className="px-4 py-3">{item.bedrooms}</td>
                  <td className="px-4 py-3">{item.bathrooms}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 bg-[#FFF6E0] text-[#C27C2B] text-xs px-3 py-1.5 rounded-full font-medium">
                      Pending
                      <span className="h-2 w-2 bg-[#C27C2B] rounded-full"></span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/renter-connections/${item.id}`)
                        }
                        className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
                      >
                        <Eye size={16} className="text-gray-800" />
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition">
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-gray-500 mt-3">No of Results 8 out of 100</p>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className={`flex items-center justify-center w-8 h-8 rounded-full border ${
            currentPage === 1
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          &lt;
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-8 h-8 flex items-center justify-center border rounded-md text-sm font-medium ${
              currentPage === i + 1
                ? "bg-white border-blue-500 text-blue-600"
                : "border-gray-200 hover:bg-gray-100 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className={`flex items-center justify-center w-8 h-8 rounded-full border ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          &gt;
        </button>
      </div>

      {/* Filter Modal */}
      <FilterModal isOpen={isFilterOpen} onClose={closeFilter} />
    </section>
  );
}
