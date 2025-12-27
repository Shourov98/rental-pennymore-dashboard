"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, Eye, DollarSign, Check, X } from "lucide-react";
import { TakeActionModal } from "@/components/modals/TakeActionModal";
import { PaymentCheckModal } from "@/components/modals/PaymentCheckModal";
import { RejectRequestModal } from "@/components/modals/RejectRequestModal";
import { useParams, useRouter } from "next/navigation";
import RenterContactCard from "@/components/RenterContactCard";
import { apiClient } from "@/lib/apiClient";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentRequest } from "@/store/renterConnectionSlice";
import type { RenterRequestDetail } from "@/store/renterConnectionSlice";

type AgentInfo = {
  agentId?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
};

type AgentRequest = {
  _id?: string;
  agentId?: string;
  agent?: AgentInfo;
  status?: string;
  requestedAt?: string;
  payment?: {
    amount?: number;
    currency?: string;
    status?: string;
  };
};

type AdminRequestDetail = RenterRequestDetail & {
  agentRequests?: AgentRequest[];
};

type RequestDetailResponse = {
  success: boolean;
  message: string;
  data: AdminRequestDetail;
  timestamp: string;
};

export default function RenterConnectionDetailsPage() {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [request, setRequest] = useState<AdminRequestDetail | null>(null);
  const [fetchStatus, setFetchStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const id = useMemo(() => {
    if (!params?.id) return "";
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params]);

  const loadRequest = useCallback(
    async (signal?: AbortSignal) => {
      if (!id) return;
      setFetchStatus("loading");
      setError(null);

      try {
        const tokenFromStorage =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
        const token = accessToken || tokenFromStorage;

        const response = await apiClient.get<RequestDetailResponse>(
          `/pre-market/admin/requests/${id}`,
          {
            signal,
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : undefined,
          },
        );

        setRequest(response.data.data);
        dispatch(setCurrentRequest(response.data.data));
        setFetchStatus("succeeded");
      } catch (err) {
        if (signal?.aborted) return;
        setFetchStatus("failed");
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load request details.");
        }
      }
    },
    [accessToken, dispatch, id],
  );

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRequest(controller.signal);
    return () => controller.abort();
  }, [id, loadRequest]);

  const toggleSelection = (agentId: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId)
        ? prev.filter((a) => a !== agentId)
        : [...prev, agentId],
    );
  };

  const renterImage = request?.renterInfo?.profileImageUrl;
  const agentRequests = request?.agentRequests ?? [];
  const totalPages = 1;

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft size={18} />
          <span>Back</span>
        </button>
        <span className="text-gray-400">›</span>
        <span className="text-blue-600 font-medium">View</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#0A093D]">
          {request?.requestName || "Renter Connection"}
        </h1>

        <button className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
          {request?.status ? `Status: ${request.status}` : "Status ⌄"}
        </button>
      </div>

      {fetchStatus === "loading" && (
        <div className="mb-4 text-sm text-gray-600">Loading request...</div>
      )}
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      {request && (
        <>
          <RenterContactCard
            renter={{
              image: renterImage,
              name: request.renterInfo?.fullName ?? "Unknown renter",
              email: request.renterInfo?.email ?? "N/A",
              phone: request.renterInfo?.phoneNumber ?? "N/A",
              referrerName: request.renterInfo?.referralInfo?.referrerName,
            }}
          />

          <div className="flex justify-between items-center mb-3 mt-6">
            <h2 className="text-lg font-semibold text-[#0A093D]">Agents</h2>
            <button
              disabled={selectedAgents.length === 0}
              onClick={() => setIsActionModalOpen(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedAgents.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Action
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-800">
                <thead className="bg-[#CFE4FF] text-[#0A093D] font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        disabled
                        className="accent-blue-600"
                      />
                    </th>
                    <th className="px-4 py-3 text-left">No</th>
                    <th className="px-4 py-3 text-left">Agent Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agentRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-gray-600"
                      >
                        No agent requests yet.
                      </td>
                    </tr>
                  ) : (
                    agentRequests.map((agentRequest, idx) => {
                      const agentId =
                        agentRequest.agent?.agentId ||
                        agentRequest.agentId ||
                        agentRequest._id ||
                        String(idx);

                      const agentName =
                        agentRequest.agent?.fullName || "Unknown agent";
                      const agentEmail = agentRequest.agent?.email || "N/A";
                      const agentPhone =
                        agentRequest.agent?.phoneNumber || "N/A";
                      const adminApproved = agentRequest.status === "approved";

                      return (
                        <tr
                          key={`agent-${agentId}`}
                          className="border-t border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3">
                            <label className="cursor-pointer flex items-center">
                              <input
                                name={`agent-${agentId}`}
                                type="checkbox"
                                checked={selectedAgents.includes(agentId)}
                                onChange={() => toggleSelection(agentId)}
                                className="accent-blue-600 cursor-pointer"
                              />
                            </label>
                          </td>
                          <td className="px-4 py-3">
                            {String(idx + 1).padStart(2, "0")}
                          </td>
                          <td className="px-4 py-3">{agentName}</td>
                          <td className="px-4 py-3">{agentEmail}</td>
                          <td className="px-4 py-3">{agentPhone}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/renter-connections/${id}/connections/${agentId}`,
                                  )
                                }
                                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
                              >
                                <Eye size={16} className="text-gray-800" />
                              </button>

                              {adminApproved ? (
                                <button className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition">
                                  <Check size={16} className="text-blue-600" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => setIsPaymentModalOpen(true)}
                                  className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
                                >
                                  <DollarSign
                                    size={16}
                                    className="text-blue-600"
                                  />
                                </button>
                              )}

                              <button
                                onClick={() => setIsRejectModalOpen(true)}
                                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
                              >
                                <X size={16} className="text-red-500" />
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

          <p className="text-xs text-gray-500 mt-3">
            No of Results {agentRequests.length}
          </p>
        </>
      )}

      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={currentPage === 1 || totalPages === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className={`flex items-center justify-center w-8 h-8 rounded-full border ${
            currentPage === 1 || totalPages === 1
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
          disabled={currentPage === totalPages || totalPages === 1}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className={`flex items-center justify-center w-8 h-8 rounded-full border ${
            currentPage === totalPages || totalPages === 1
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          &gt;
        </button>
      </div>

      <TakeActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onRemove={() => {
          setIsActionModalOpen(false);
          setIsRejectModalOpen(true);
        }}
        onCharge={() => {
          setIsActionModalOpen(false);
          setIsPaymentModalOpen(true);
        }}
      />

      <PaymentCheckModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        requestId={request?.requestId ?? id}
        onSuccess={() => loadRequest()}
      />

      <RejectRequestModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        requestId={request?.requestId ?? id}
        onSuccess={() => loadRequest()}
      />
    </section>
  );
}
