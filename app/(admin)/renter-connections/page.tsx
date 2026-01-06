"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Eye, Trash2 } from "lucide-react";
import FilterModal, {
  type FilterType,
} from "@/components/modals/FilterModals";
import { useRouter } from "next/navigation";

import {
  fetchAdminRequests,
  selectAdminRequests,
  type AdminRequest,
} from "@/store/adminRequestsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
export default function RenterConnectionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, status, error, pagination } =
    useAppSelector(selectAdminRequests);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<FilterType>({
    borough: null,
    neighborhoods: [],
    maxPrice: null,
    bedrooms: [],
    bathrooms: [],
  });

  useEffect(() => {
    dispatch(fetchAdminRequests({ page: currentPage }));
  }, [currentPage, dispatch]);

  console.log(items);

  const filteredData = useMemo(() => {
    let results = items;

    if (filters.borough) {
      results = results.filter((item) => {
        const borough = item.locations?.[0]?.borough;
        return borough === filters.borough;
      });
    }

    if (filters.neighborhoods.length > 0) {
      results = results.filter((item) => {
        const neighborhoods =
          item.locations?.flatMap((loc) => loc.neighborhoods || []) || [];
        return filters.neighborhoods.every((n) => neighborhoods.includes(n));
      });
    }

    const maxPrice = filters.maxPrice;
    if (maxPrice !== null) {
      results = results.filter(
        (item) => (item.priceRange?.max ?? Infinity) <= maxPrice
      );
    }

    if (filters.bedrooms.length > 0) {
      const selectedBedrooms = new Set(filters.bedrooms.map(String));
      results = results.filter((item) =>
        item.bedrooms?.some((b) => selectedBedrooms.has(b))
      );
    }

    if (filters.bathrooms.length > 0) {
      const selectedBathrooms = new Set(filters.bathrooms.map(String));
      results = results.filter((item) =>
        item.bathrooms?.some((b) => selectedBathrooms.has(b))
      );
    }

    return results;
  }, [filters, items]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  };

  const formatMaxPrice = (item: AdminRequest) => {
    const max = item.priceRange?.max;
    if (max === undefined || max === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(max);
  };

  const handlePrev = () => {
    if (pagination?.hasPrev && pagination.prevPage) {
      setCurrentPage(pagination.prevPage);
    }
  };

  const handleNext = () => {
    if (pagination?.hasNext && pagination.nextPage) {
      setCurrentPage(pagination.nextPage);
    }
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm text-gray-800">
            <thead className="bg-[#CFE4FF] text-[#0A093D] font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">Date Submitted</th>
                <th className="px-4 py-3 text-left">Request Name</th>
                <th className="px-4 py-3 text-left">Renter name</th>
                <th className="px-4 py-3 text-left">Borough</th>
                <th className="px-4 py-3 text-left">Max Price</th>
                <th className="px-4 py-3 text-left">No. Bedrooms</th>
                <th className="px-4 py-3 text-left">No. of Bath</th>
                <th className="px-4 py-3 text-left">
                  Agents Approved / Requested
                </th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {status === "loading" ? (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-gray-600"
                    colSpan={9}
                  >
                    Loading requests...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-red-600"
                    colSpan={9}
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-gray-600"
                    colSpan={9}
                  >
                    No requests found.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const borough = item.locations?.[0]?.borough || "-";
                  const bedrooms = item.bedrooms?.join(", ") || "-";
                  const bathrooms = item.bathrooms?.join(", ") || "-";
                  const agentsApproved = item.agentRequestSummary?.approve ?? 0;
                  const agentsRequested = item.agentRequestSummary?.total ?? 0;
                  const requestIdentifier = item._id;

                  return (
                    <tr
                      key={item._id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3">{item.requestName}</td>
                      <td className="px-4 py-3">
                        {item.renterInfo?.fullName || "-"}
                      </td>
                      <td className="px-4 py-3">{borough}</td>
                      <td className="px-4 py-3">{formatMaxPrice(item)}</td>
                      <td className="px-4 py-3">{bedrooms}</td>
                      <td className="px-4 py-3">{bathrooms}</td>

                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {agentsApproved} / {agentsRequested}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/renter-connections/${requestIdentifier}`
                              )
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
        <p className="text-sm text-gray-600">
          Page {pagination?.currentPage ?? 1} of {pagination?.totalPages ?? 1} •{" "}
          {pagination?.totalItems ?? filteredData.length} total
        </p>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={!pagination?.hasPrev || status === "loading"}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!pagination?.hasNext || status === "loading"}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={setFilters}
      />
    </section>
  );
}
