"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import AgentContactCard from "@/components/AgentContactCard";
import { apiClient } from "@/lib/apiClient";

type AgentUser = {
  _id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  accountStatus?: string;
  profileImageUrl?: string;
};

type AgentDetail = {
  _id: string;
  userInfo: AgentUser;
  licenseNumber: string;
  brokerageName: string;
  isActive: boolean;
  hasGrantAccess: boolean;
  createdAt: string;
  updatedAt: string;
};

type AgentDetailResponse = {
  success: boolean;
  message: string;
  data: AgentDetail;
  timestamp: string;
};

type GrantAccessResponse = {
  success: boolean;
  message: string;
  data: {
    agentId: string;
    hasGrantAccess: boolean;
    previousAccess: boolean;
  };
  timestamp: string;
};

export default function AgentDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [hasGrantAccess, setHasGrantAccess] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [isTogglingAccess, setIsTogglingAccess] = useState(false);

  const agentId = params?.id;

  useEffect(() => {
    if (!agentId) return;
    let isMounted = true;

    const fetchAgent = async () => {
      try {
        setStatus("loading");
        setError(null);

        const response = await apiClient.get<AgentDetailResponse>(
          `/agent/admin/${agentId}`);

        if (!isMounted) return;
        setAgent(response.data.data);
        setHasGrantAccess(response.data.data.hasGrantAccess ?? false);
        setStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setStatus("failed");
        setError(err instanceof Error ? err.message : "Unable to load agent.");
      }
    };

    fetchAgent();

    return () => {
      isMounted = false;
    };
  }, [agentId]);

  const contactCardAgent = useMemo(() => {
    if (!agent) return null;
    return {
      name: agent.userInfo?.fullName ?? "Unknown",
      email: agent.userInfo?.email ?? "Unknown",
      phone: agent.userInfo?.phoneNumber ?? "Unknown",
      license: agent.licenseNumber ?? "N/A",
      brokerage: agent.brokerageName ?? "N/A",
      image: agent.userInfo?.profileImageUrl ?? undefined,
    };
  }, [agent]);

  const handleToggleGrantAccess = async () => {
    if (!agent?._id) return;
    try {
      setIsTogglingAccess(true);
      setAccessError(null);

      const response = await apiClient.post<GrantAccessResponse>(
        `/agent/${agent._id}/toggle-access`,
        {});

      if (response.data.data?.hasGrantAccess !== undefined) {
        setHasGrantAccess(response.data.data.hasGrantAccess);
        setAgent((prev) =>
          prev
            ? { ...prev, hasGrantAccess: response.data.data.hasGrantAccess }
            : prev
        );
      } else {
        setHasGrantAccess((prev) => !prev);
      }
    } catch (err) {
      setAccessError(
        err instanceof Error ? err.message : "Unable to update access."
      );
    } finally {
      setIsTogglingAccess(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <ArrowLeft
            className="w-4 h-4 cursor-pointer"
            onClick={() => router.push("/agent-management")}
          />
          <span>Agent Management</span> <span>›</span> <span>View Agent</span>
        </div>
        <h1 className="py-5 text-3xl font-bold text-[#0B0B2C]">
          Agent Management
        </h1>
      </div>

      {/* Contact Details */}
      {status === "loading" ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 text-sm text-gray-500">
          Loading agent...
        </div>
      ) : contactCardAgent ? (
        <AgentContactCard agent={contactCardAgent} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-6 text-sm text-gray-500">
          {error ?? "No agent found."}
        </div>
      )}

      {/* Grant Access */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-[#0B0B2C]">
            Grant Agent Access
          </h2>
          <p className="text-gray-500 text-sm">
            Enable agents to connect with renters for free matches.
          </p>
        </div>
        <button
          onClick={handleToggleGrantAccess}
          disabled={!agent || isTogglingAccess}
          className={`px-6 py-2.5 text-sm font-medium rounded-2xl transition disabled:opacity-60 ${
            hasGrantAccess
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {hasGrantAccess ? "Revoke Access" : "Grant Access"}
        </button>
      </div>
      {error || accessError ? (
        <p className="text-sm text-red-500" role="alert">
          {error ?? accessError}
        </p>
      ) : null}
    </div>
  );
}
