"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, Eye, Trash2 } from "lucide-react";
import FilterModal, { type FilterType } from "@/components/modals/FilterModals";
import { useRouter } from "next/navigation";

import { AdminScopeToggle } from "@/components/adminScope/AdminScopeToggle";
import {
  fetchAdminRequests,
  selectAdminRequests,
  type AdminRequest,
} from "@/store/adminRequestsSlice";
import { apiClient } from "@/lib/apiClient";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
export default function RenterConnectionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, status, error, pagination } =
    useAppSelector(selectAdminRequests);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const [deleteTarget, setDeleteTarget] = useState<AdminRequest | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterType>({
    borough: null,
    neighborhoods: [],
    maxPrice: null,
    bedrooms: [],
    bathrooms: [],
  });

  useEffect(() => {
    dispatch(fetchAdminRequests({ page: currentPage, limit }));
  }, [currentPage, dispatch, limit]);

  const filteredData = useMemo(() => {
    let results: AdminRequest[] = items;

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

  const totalItems = pagination?.totalItems ?? filteredData.length;
  const itemsPerPage = pagination?.itemsPerPage ?? 20;
  const totalPages = pagination?.totalPages
    ? Math.max(1, pagination.totalPages)
    : Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const pageNumber = pagination?.currentPage ?? currentPage;
  const hasPrev = pagination?.hasPrev ?? pageNumber > 1;
  const hasNext = pagination?.hasNext ?? pageNumber < totalPages;
  const prevPage =
    pagination?.prevPage ?? (hasPrev ? Math.max(1, pageNumber - 1) : null);
  const nextPage = pagination?.nextPage ?? (hasNext ? pageNumber + 1 : null);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];
    const windowSize = 5;
    const start = Math.max(1, pageNumber - Math.floor(windowSize / 2));
    const end = Math.min(totalPages, start + windowSize - 1);
    const adjustedStart = Math.max(1, end - windowSize + 1);
    return Array.from(
      { length: end - adjustedStart + 1 },
      (_, i) => adjustedStart + i
    );
  }, [pageNumber, totalPages]);

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
    if (prevPage) {
      setCurrentPage(prevPage);
    }
  };

  const handleNext = () => {
    if (nextPage) {
      setCurrentPage(nextPage);
    }
  };

  useEffect(() => {
    if (pagination?.totalPages && currentPage > pagination.totalPages) {
      setCurrentPage(pagination.totalPages);
    }
  }, [currentPage, pagination?.totalPages]);

  const closeDeleteModal = useCallback(() => {
    if (isDeleting) return;
    setDeleteTarget(null);
  }, [isDeleting]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await apiClient.delete(
        `/pre-market/admin/requests/${deleteTarget._id}`);
      setDeleteTarget(null);
      dispatch(fetchAdminRequests({ page: currentPage, limit }));
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Unable to delete this request."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!deleteTarget) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        deleteModalRef.current &&
        !deleteModalRef.current.contains(e.target as Node)
      ) {
        closeDeleteModal();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDeleteModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeDeleteModal, deleteTarget]);

  const isInitialLoading = status === "loading" && items.length === 0;

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#0A093D]">
          Renter Connection
        </h1>

        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="mt-3 sm:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-full shadow-sm transition"
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
                <th className="px-4 py-3 text-left min-w-[200px]">Scope</th>
                <th className="px-4 py-3 text-left">No. Bedrooms</th>
                <th className="px-4 py-3 text-left">No. of Bath</th>
                <th className="px-4 py-3 text-left">
                  Agents Approved / Requested
                </th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isInitialLoading ? (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-gray-600"
                    colSpan={10}
                  >
                    Loading requests...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-red-600"
                    colSpan={10}
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-gray-600"
                    colSpan={10}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <span>No requests found.</span>
                    </div>
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
                      <td className="px-4 py-3 min-w-[200px]">
                        <AdminScopeToggle
                          requestId={item._id}
                          currentScope={item.scope}
                          variant="compact"
                          locked={item.marketScopeSwitchLocked === true}
                          lockedReason={item.marketScopeSwitchLockedReason}
                          onChanged={() => {
                            dispatch(
                              fetchAdminRequests({ page: currentPage, limit }),
                            );
                          }}
                        />
                      </td>
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

                          <button
                            onClick={() => {
                              setDeleteTarget(item);
                              setDeleteError(null);
                            }}
                            className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
                          >
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

      <div className="mt-4 bg-white rounded-2xl shadow-sm p-4 sm:p-5 border border-blue-100 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <p className="text-sm text-[#0B0B2C] font-medium">
          Showing page <span className="text-blue-600 font-semibold">{pageNumber}</span>{" "}
          of <span className="text-blue-600 font-semibold">{totalPages}</span> •{" "}
          Total items: <span className="text-blue-600 font-semibold">{totalItems}</span>
        </p>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrev}
            disabled={!hasPrev || isInitialLoading}
            className="w-9 h-9 rounded-full border border-blue-200 bg-white text-[#0B0B2C] hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            &lt;
          </button>

          {pageNumbers.map((p) => {
            const isActive = p === pageNumber;
            return (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                disabled={isInitialLoading}
                className={`w-9 h-9 rounded-full border text-sm font-medium transition ${
                  isActive
                    ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                    : "border-blue-200 bg-white text-[#0B0B2C] hover:bg-blue-50"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={handleNext}
            disabled={!hasNext || isInitialLoading}
            className="w-9 h-9 rounded-full border border-blue-200 bg-white text-[#0B0B2C] hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            &gt;
          </button>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={setFilters}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            ref={deleteModalRef}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Request?
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              This will permanently delete the request{" "}
              <span className="font-medium text-gray-800">
                {deleteTarget.requestName || "Unnamed request"}
              </span>
              . This action cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-4 text-sm text-red-600" role="alert">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
