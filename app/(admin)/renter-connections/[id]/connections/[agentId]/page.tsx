"use client";

import {
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RenterPreferenceForm from "@/components/RenterPreferenceForm";
import AgentContactCard from "@/components/AgentContactCard";
import RenterContactCard from "@/components/RenterContactCard";
import { apiClient } from "@/lib/apiClient";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCurrentRequest,
  type RenterRequestDetail,
} from "@/store/renterConnectionSlice";

export default function AgentConnectionViewPage() {
  const [openSection, setOpenSection] = useState<string | null>("renter");
  const [request, setRequest] = useState<RenterRequestDetail | null>(null);
  const [fetchStatus, setFetchStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams<{ id: string; agentId: string }>();
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const currentRequest = useAppSelector(
    (state) => state.renterConnection.currentRequest,
  );

  const requestId = useMemo(() => {
    if (!params?.id) return "";
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params]);

  const agentId = useMemo(() => {
    if (!params?.agentId) return "";
    return Array.isArray(params.agentId) ? params.agentId[0] : params.agentId;
  }, [params]);

  const useStoredRequest = Boolean(
    currentRequest && currentRequest._id === requestId,
  );
  const activeRequest = useStoredRequest ? currentRequest : request;
  const activeStatus = useStoredRequest ? "succeeded" : fetchStatus;

  const loadRequest = useCallback(
    async (signal?: AbortSignal) => {
      if (!requestId) return;
      setFetchStatus("loading");
      setError(null);

      try {
        const tokenFromStorage =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
        const token = accessToken || tokenFromStorage;

        const response = await apiClient.get<{
          data: RenterRequestDetail;
        }>(`/pre-market/admin/requests/${requestId}`, {
          signal,
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        });

        setRequest(response.data.data);
        dispatch(setCurrentRequest(response.data.data));
        setFetchStatus("succeeded");
      } catch (err) {
        if (signal?.aborted) return;
        setFetchStatus("failed");
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load agent connection.");
        }
      }
    },
    [accessToken, dispatch, requestId],
  );

  useEffect(() => {
    if (!requestId || useStoredRequest) return;

    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRequest(controller.signal);
    return () => controller.abort();
  }, [loadRequest, requestId, useStoredRequest]);

  const selectedAgentRequest = useMemo(() => {
    if (!activeRequest?.agentRequests || !agentId) return null;
    return (
      activeRequest.agentRequests.find(
        (agentRequest) =>
          agentRequest.agent?.agentId === agentId ||
          agentRequest.agentId === agentId ||
          agentRequest._id === agentId,
      ) ?? null
    );
  }, [agentId, activeRequest]);

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "-" : parsed.toLocaleDateString();
  };

  const preferenceData = useMemo(() => {
    const neighborhoods =
      activeRequest?.locations?.flatMap((loc) => loc.neighborhoods || []) ?? [];

    const unitFeatures: string[] = [];
    if (activeRequest?.unitFeatures?.laundryInUnit) {
      unitFeatures.push("Laundry in unit");
    }
    if (activeRequest?.unitFeatures?.privateOutdoorSpace) {
      unitFeatures.push("Private outdoor space");
    }
    if (activeRequest?.unitFeatures?.dishwasher) {
      unitFeatures.push("Dishwasher");
    }

    const buildingFeatures: string[] = [];
    if (activeRequest?.buildingFeatures?.doorman) {
      buildingFeatures.push("Doorman");
    }
    if (activeRequest?.buildingFeatures?.elevator) {
      buildingFeatures.push("Elevator");
    }
    if (activeRequest?.buildingFeatures?.laundryInBuilding) {
      buildingFeatures.push("Laundry in building");
    }

    const petPolicy: string[] = [];
    if (activeRequest?.petPolicy?.catsAllowed) {
      petPolicy.push("Cats allowed");
    }
    if (activeRequest?.petPolicy?.dogsAllowed) {
      petPolicy.push("Dogs allowed");
    }

    const guarantor: string[] = [];
    if (activeRequest?.guarantorRequired?.personalGuarantor) {
      guarantor.push("Personal guarantor");
    }
    if (activeRequest?.guarantorRequired?.thirdPartyGuarantor) {
      guarantor.push("Third party guarantor");
    }

    return {
      borough: activeRequest?.locations?.[0]?.borough ?? "",
      neighborhoods,
      minPrice: formatCurrency(activeRequest?.priceRange?.min),
      maxPrice: formatCurrency(activeRequest?.priceRange?.max),
      earliestDate: formatDate(activeRequest?.movingDateRange?.earliest),
      latestDate: formatDate(activeRequest?.movingDateRange?.latest),
      bedrooms: activeRequest?.bedrooms?.[0] ?? "-",
      bathrooms: activeRequest?.bathrooms?.[0] ?? "-",
      unitFeatures,
      buildingFeatures,
      petPolicy,
      guarantor,
      preferences: activeRequest?.preferences ?? [],
    };
  }, [activeRequest]);

  const paymentAmount = selectedAgentRequest?.payment?.amount ?? 0;
  const paymentStatus = selectedAgentRequest?.payment?.status ?? "pending";
  const isPaid = paymentStatus === "paid";
  const isFree = paymentStatus === "free";
  const agentStatus = selectedAgentRequest?.status ?? "pending";
  const statusLabel =
    agentStatus === "rejected"
      ? "Rejected"
      : isFree
        ? "Free"
        : isPaid
          ? "Paid"
          : agentStatus === "approved"
            ? "Approved"
            : "Pending";

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      {/* Breadcrumb + Header */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft size={18} />
        </button>
        <span>Renter Connection</span>
        <span className="text-gray-400">›</span>
        <span>View</span>
        <span className="text-gray-400">›</span>
        <span className="text-blue-600 font-medium">View Agent Listing</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#0A093D]">
          {activeRequest?.requestName || "Renter Connection"}
        </h1>

        <span
          className={`mt-3 sm:mt-0 inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium ${
            statusLabel === "Paid"
              ? "bg-green-50 text-green-600"
              : statusLabel === "Approved"
                ? "bg-blue-50 text-blue-600"
                : statusLabel === "Rejected"
                  ? "bg-red-50 text-red-600"
                  : statusLabel === "Free"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-yellow-50 text-yellow-600"
          }`}
        >
          {statusLabel}
          <span
            className={`w-2 h-2 rounded-full ${
            statusLabel === "Paid"
              ? "bg-green-500"
              : statusLabel === "Approved"
                ? "bg-blue-500"
                : statusLabel === "Rejected"
                  ? "bg-red-500"
                  : statusLabel === "Free"
                    ? "bg-emerald-500"
                    : "bg-yellow-500"
            }`}
          />
        </span>
      </div>

      {activeStatus === "loading" && (
        <div className="mb-4 text-sm text-gray-600">Loading connection...</div>
      )}
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      {activeRequest && (
        <>
          <div className="pb-2 md:pb-3 lg:pb-5">
            <AgentContactCard
              agent={{
                name: selectedAgentRequest?.agent?.fullName ?? "Unknown agent",
                email: selectedAgentRequest?.agent?.email ?? "N/A",
                phone: selectedAgentRequest?.agent?.phoneNumber ?? "N/A",
                license: "-",
                brokerage: "-",
                image: selectedAgentRequest?.agent?.profileImageUrl,
              }}
            />
          </div>

          <div className="mb-6">
            <RenterContactCard
              renter={{
                image: activeRequest.renterInfo?.profileImageUrl,
                name: activeRequest.renterInfo?.fullName ?? "Unknown renter",
                email: activeRequest.renterInfo?.email ?? "N/A",
                phone: activeRequest.renterInfo?.phoneNumber ?? "N/A",
                referrerName:
                  activeRequest.renterInfo?.referralInfo?.referrerName,
                referralType:
                  activeRequest.renterInfo?.referralInfo?.referrerType,
              }}
            />
          </div>
        </>
      )}

      {/* Renter Preference Section */}
      <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden transition-all duration-300">
        {/* Header */}
        <div
          className="p-4 flex justify-between items-center cursor-pointer"
          onClick={() =>
            setOpenSection(openSection === "renter" ? null : "renter")
          }
        >
          <h2 className="text-lg font-semibold text-[#0A093D]">
            Renter Preference
          </h2>
          <button className="text-blue-600 font-medium text-lg">
            {openSection === "renter" ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
        </div>

        {/* Dropdown content */}
        {openSection === "renter" && activeRequest && (
          <div className="border-t border-gray-100 px-6 pb-6 pt-4 animate-fadeIn overflow-y-auto">
            <form className="grid grid-cols-1 gap-6 text-sm text-gray-700">
              <RenterPreferenceForm data={preferenceData} />
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>

      {/* Cost Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#0A093D] mb-3">Cost</h2>
        <div className="border rounded-lg px-4 py-3 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">
              {isPaid ? "Paid" : isFree ? "Free" : "Pending"}
            </p>
            <p className="text-gray-500 text-sm">Amount</p>
          </div>
          <div className="flex items-center gap-2">
            {isPaid || isFree ? (
              <CheckCircle size={18} className="text-green-500" />
            ) : (
              <AlertCircle size={18} className="text-yellow-500" />
            )}
            <p className="font-semibold text-gray-800">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(paymentAmount)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
