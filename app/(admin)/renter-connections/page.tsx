"use client";

import { useState } from "react";
import { SlidersHorizontal, Eye, Trash2 } from "lucide-react";
import { FilterModal, type FilterState } from "@/components/modals/FilterModal";
import { useRouter } from "next/navigation";

interface RenterConnection {
  id: number;
  requestName: string;
  dateSubmitted: string;
  renterName: string;
  borough: string;
  priceRange: string;
  bedrooms: number;
  bathrooms: number;
  agentsApproved: number;
  agentsRequested: number;
  status: "active" | "inactive";
}

const renterConnections: RenterConnection[] = [
  {
    id: 1,
    requestName: "BeforeListed-1", // ⭐ NEW
    dateSubmitted: "11/22/2025",
    renterName: "John Oliver",
    borough: "Manhattan",
    priceRange: "$7500.55",
    bedrooms: 5,
    bathrooms: 2,
    agentsApproved: 2,
    agentsRequested: 8,
    status: "active",
  },
  {
    id: 2,
    requestName: "BeforeListed-2",
    dateSubmitted: "11/19/2025",
    renterName: "Adam Driver",
    borough: "Manhattan",
    priceRange: "$7500.55",
    bedrooms: 5,
    bathrooms: 2,
    agentsApproved: 4,
    agentsRequested: 4,
    status: "inactive",
  },
  {
    id: 3,
    requestName: "BeforeListed-3",
    dateSubmitted: "11/13/2025",
    renterName: "Felix Domen",
    borough: "Manhattan",
    priceRange: "$7500.55",
    bedrooms: 5,
    bathrooms: 2,
    agentsApproved: 5,
    agentsRequested: 11,
    status: "active",
  },
];

export default function RenterConnectionPage() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ✅ Properly typed filter state
  const [filters, setFilters] = useState<FilterState>({
    borough: "Manhattan",
    neighborhoods: [],
    maxPrice: 10000,
    bedrooms: [],
    bathrooms: [],
  });

  const [filteredData, setFilteredData] = useState(renterConnections);

  const applyFilters = () => {
    let results = renterConnections;

    if (filters.borough) {
      results = results.filter((item) => item.borough === filters.borough);
    }

    if (filters.maxPrice) {
      results = results.filter(
        (item) => Number(item.priceRange.replace("$", "")) <= filters.maxPrice
      );
    }

    // ✅ MULTI-SELECT BEDROOM FILTER FIXED
    if (filters.bedrooms.length > 0) {
      results = results.filter((item) =>
        filters.bedrooms.includes(`${item.bedrooms}BR`)
      );
    }

    // ✅ MULTI-SELECT BATHROOM FILTER FIXED
    if (filters.bathrooms.length > 0) {
      results = results.filter((item) =>
        filters.bathrooms.includes(String(item.bathrooms))
      );
    }

    setFilteredData(results);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      borough: "Manhattan",
      neighborhoods: [],
      maxPrice: 10000,
      bedrooms: [],
      bathrooms: [],
    });

    setFilteredData(renterConnections);
  };

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#0A093D]">
          Renter Connection
        </h1>

        <button
          onClick={() => setIsFilterOpen(true)}
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
                <th className="px-4 py-3 text-left">Date Submitted</th>
                <th className="px-4 py-3 text-left">Request Name</th>
                <th className="px-4 py-3 text-left">Renter name</th>
                <th className="px-4 py-3 text-left">Borough</th>
                <th className="px-4 py-3 text-left">Price Range</th>
                <th className="px-4 py-3 text-left">No. Bedrooms</th>
                <th className="px-4 py-3 text-left">No. of Bath</th>
                <th className="px-4 py-3 text-left">
                  Agents Approved / Requested
                </th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{item.dateSubmitted}</td>
                  <td className="px-4 py-3">{item.requestName}</td>
                  <td className="px-4 py-3">{item.renterName}</td>
                  <td className="px-4 py-3">{item.borough}</td>
                  <td className="px-4 py-3">{item.priceRange}</td>
                  <td className="px-4 py-3">{item.bedrooms}</td>
                  <td className="px-4 py-3">{item.bathrooms}</td>

                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {item.agentsApproved} / {item.agentsRequested}
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

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={applyFilters}
        onReset={resetFilters}
      />
    </section>
  );
}
