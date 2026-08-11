"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, Eye, DollarSign, Check, X } from "lucide-react";
import { TakeActionModal } from "@/components/modals/TakeActionModal";
import { PaymentCheckModal } from "@/components/modals/PaymentCheckModal";
import { RejectRequestModal } from "@/components/modals/RejectRequestModal";
import { useParams, useRouter } from "next/navigation";
import RenterContactCard from "@/components/RenterContactCard";
import RenterPreferenceForm from "@/components/RenterPreferenceForm";
import { AdminScopeToggle } from "@/components/adminScope/AdminScopeToggle";
import { apiClient } from "@/lib/apiClient";
import { useAppDispatch } from "@/store/hooks";
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
  const [selectedAgents] = useState<string[]>([]);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [activeAgentRequestId, setActiveAgentRequestId] = useState<
    string | null
  >(null);
  const [isPreferenceOpen, setIsPreferenceOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [request, setRequest] = useState<AdminRequestDetail | null>(null);
  const [fetchStatus, setFetchStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [error, setError] = useState<string | null>(null);

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

        const response = await apiClient.get<RequestDetailResponse>(
          `/pre-market/admin/requests/${id}`,
          {
            signal,
          }
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
    [dispatch, id]
  );

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRequest(controller.signal);
    return () => controller.abort();
  }, [id, loadRequest]);

  const renterImage = request?.renterInfo?.profileImageUrl;
  const agentRequests = useMemo(() => request?.agentRequests ?? [], [request]);
  const totalPages = 1;
  const formattedRequestData = useMemo(() => {
    const locations = request?.locations ?? [];
    const boroughs = locations
      .map((location) => location.borough)
      .filter((borough): borough is string => Boolean(borough));
    const neighborhoods = locations.flatMap(
      (location) => location.neighborhoods ?? []
    );

    const formatPrice = (value?: number) =>
      value != null ? `$${value.toLocaleString()}` : "-";

    const formatDate = (value?: string) =>
      value ? new Date(value).toLocaleDateString() : "-";

    const unitFeatures: string[] = [];
    if (request?.unitFeatures?.laundryInUnit) {
      unitFeatures.push("Laundry in unit");
    }
    if (request?.unitFeatures?.privateOutdoorSpace) {
      unitFeatures.push("Private outdoor space");
    }
    if (request?.unitFeatures?.dishwasher) {
      unitFeatures.push("Dishwasher");
    }

    const buildingFeatures: string[] = [];
    if (request?.buildingFeatures?.doorman) {
      buildingFeatures.push("Doorman");
    }
    if (request?.buildingFeatures?.elevator) {
      buildingFeatures.push("Elevator");
    }
    if (request?.buildingFeatures?.laundryInBuilding) {
      buildingFeatures.push("Laundry in building");
    }

    const petPolicy: string[] = [];
    if (request?.petPolicy?.catsAllowed) petPolicy.push("Cats allowed");
    if (request?.petPolicy?.dogsAllowed) petPolicy.push("Dogs allowed");

    const guarantor: string[] = [];
    if (request?.guarantorRequired?.personalGuarantor) {
      guarantor.push("Personal guarantor");
    }
    if (request?.guarantorRequired?.thirdPartyGuarantor) {
      guarantor.push("Third party guarantor");
    }

    return {
      locations: locations.map((location) => ({
        borough: location.borough ?? "-",
        neighborhoods: location.neighborhoods ?? [],
      })),
      boroughs,
      neighborhoods,
      minPrice: formatPrice(request?.priceRange?.min),
      maxPrice: formatPrice(request?.priceRange?.max),
      earliestDate: formatDate(request?.movingDateRange?.earliest),
      latestDate: formatDate(request?.movingDateRange?.latest),
      bedrooms: request?.bedrooms ?? [],
      bathrooms: request?.bathrooms ?? [],
      unitFeatures,
      buildingFeatures,
      petPolicy,
      guarantor,
      preferences: request?.preferences ?? [],
    };
  }, [request]);

  const getSelectedAgentRequestId = useCallback(() => {
    if (selectedAgents.length === 0) return null;
    const selectedRequest = agentRequests.find((agentRequest) => {
      const agentId = agentRequest.agent?.agentId || agentRequest.agentId;
      return agentId ? selectedAgents.includes(agentId) : false;
    });
    return selectedRequest?._id ?? null;
  }, [agentRequests, selectedAgents]);

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

        <button className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 text-blue-600 rounded-full bg-white border border-blue-600 transition text-sm font-medium">
          {request?.status ? `${request.status}` : ""}
        </button>
      </div>

      {request && (
        <section
          className="w-full bg-white rounded-xl shadow-sm px-6 py-4 sm:px-8 sm:py-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          aria-label="Market scope"
        >
          <div>
            <h2 className="text-sm font-semibold text-gray-700">Market Scope</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Toggle between Upcoming and All Market. Admins can always change
              the scope, even when a rental specialist is assigned.
            </p>
          </div>
          <AdminScopeToggle
            requestId={request._id}
            currentScope={request.scope}
            variant="full"
            onChanged={() => loadRequest()}
          />
        </section>
      )}

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
              referralType:
                request.renterInfo?.registrationType ??
                request.renterInfo?.referralInfo?.referrerType ??
                "normal",
            }}
          />

          <section className="w-full bg-white rounded-xl shadow-sm mt-6 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsPreferenceOpen((prev) => !prev)}
              className="w-full flex items-center justify-between p-6 sm:p-8 md:p-10 text-left"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-[#0A093D]">
                  Renter Preference
                </h2>
                <p className="text-sm text-gray-500">
                  Review renter’s pre-market request information
                </p>
              </div>
              <span className="text-blue-600 text-lg font-medium">
                {isPreferenceOpen ? "−" : "+"}
              </span>
            </button>
            {isPreferenceOpen && (
              <div className="border-t border-gray-100 px-6 pb-6 sm:px-8 md:px-10">
                <RenterPreferenceForm data={formattedRequestData} />
              </div>
            )}
          </section>

          <div className="flex justify-between items-center mb-3 mt-6">
            <h2 className="text-lg font-semibold text-[#0A093D]">Agents</h2>
            {/* <button
              disabled={selectedAgents.length === 0}
              onClick={() => {
                const selectedRequestId = getSelectedAgentRequestId();
                if (!selectedRequestId) return;
                setActiveAgentRequestId(selectedRequestId);
                setIsActionModalOpen(true);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedAgents.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Action
            </button> */}
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-800">
                <thead className="bg-[#CFE4FF] text-[#0A093D] font-semibold">
                  <tr>
                    {/* <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        disabled
                        className="accent-blue-600"
                      />
                    </th> */}
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
                      const isPending = agentRequest.status === "pending";
                      const isRejected = agentRequest.status === "rejected";

                      return (
                        <tr
                          key={`agent-${agentId}`}
                          className="border-t border-gray-100 hover:bg-gray-50 transition"
                        >
                          {/* <td className="px-4 py-3">
                            <label className="cursor-pointer flex items-center">
                              <input
                                name={`agent-${agentId}`}
                                type="checkbox"
                                checked={selectedAgents.includes(agentId)}
                                onChange={() => toggleSelection(agentId)}
                                className="accent-blue-600 cursor-pointer"
                              />
                            </label>
                          </td> */}
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
                                    `/renter-connections/${id}/connections/${agentId}`
                                  )
                                }
                                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
                              >
                                <Eye size={16} className="text-gray-800" />
                              </button>

                              {isPending ? (
                                <button
                                  onClick={() => {
                                    if (!agentRequest._id) return;
                                    setActiveAgentRequestId(agentRequest._id);
                                    setIsPaymentModalOpen(true);
                                  }}
                                  className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
                                >
                                  <DollarSign
                                    size={16}
                                    className="text-blue-600"
                                  />
                                </button>
                              ) : (
                                <button
                                  className={`rounded-full p-2 transition ${
                                    isRejected
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-green-600 hover:bg-green-700"
                                  }`}
                                >
                                  {isRejected ? (
                                    <X size={16} className="text-white" />
                                  ) : (
                                    <Check size={16} className="text-white" />
                                  )}
                                </button>
                              )}

                              {isPending && (
                                <button
                                  onClick={() => {
                                    if (!agentRequest._id) return;
                                    setActiveAgentRequestId(agentRequest._id);
                                    setIsRejectModalOpen(true);
                                  }}
                                  className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
                                >
                                  <X size={16} className="text-red-500" />
                                </button>
                              )}
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
          disabled={pageIndex === 1 || totalPages === 1}
          onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
          className={`flex items-center justify-center w-8 h-8 rounded-full border ${
            pageIndex === 1 || totalPages === 1
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          &lt;
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPageIndex(i + 1)}
            className={`w-8 h-8 flex items-center justify-center border rounded-md text-sm font-medium ${
              pageIndex === i + 1
                ? "bg-white border-blue-500 text-blue-600"
                : "border-gray-200 hover:bg-gray-100 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={pageIndex === totalPages || totalPages === 1}
          onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
          className={`flex items-center justify-center w-8 h-8 rounded-full border ${
            pageIndex === totalPages || totalPages === 1
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
          const selectedRequestId = getSelectedAgentRequestId();
          if (!selectedRequestId) return;
          setActiveAgentRequestId(selectedRequestId);
          setIsActionModalOpen(false);
          setIsRejectModalOpen(true);
        }}
        onCharge={() => {
          const selectedRequestId = getSelectedAgentRequestId();
          if (!selectedRequestId) return;
          setActiveAgentRequestId(selectedRequestId);
          setIsActionModalOpen(false);
          setIsPaymentModalOpen(true);
        }}
      />

      <PaymentCheckModal
        isOpen={isPaymentModalOpen && Boolean(activeAgentRequestId)}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setActiveAgentRequestId(null);
        }}
        requestId={activeAgentRequestId ?? ""}
        onSuccess={() => loadRequest()}
      />

      <RejectRequestModal
        isOpen={isRejectModalOpen && Boolean(activeAgentRequestId)}
        onClose={() => {
          setIsRejectModalOpen(false);
          setActiveAgentRequestId(null);
        }}
        requestId={activeAgentRequestId ?? ""}
        onSuccess={() => loadRequest()}
      />
    </section>
  );
}
