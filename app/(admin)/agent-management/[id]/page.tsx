"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Copy, X } from "lucide-react";
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
  powerFormLink?: string;
  docuSignPowerFormLink?: string;
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

type ActivateWithLinkResponse = {
  success: boolean;
  message: string;
  data?: {
    agentId?: string;
    hasGrantAccess?: boolean;
    activationLink?: string;
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
  const [isActivatingWithLink, setIsActivatingWithLink] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [docusignLink, setDocusignLink] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const agentId = params?.id;

  useEffect(() => {
    if (!agentId) return;
    let isMounted = true;

    const fetchAgent = async () => {
      try {
        setStatus("loading");
        setError(null);

        const response = await apiClient.get<AgentDetailResponse>(
          `/agent/admin/${agentId}`
        );

        if (!isMounted) return;
        setAgent(response.data.data);
        setHasGrantAccess(response.data.data.hasGrantAccess ?? false);
        const incomingLink =
          response.data.data.docuSignPowerFormLink ??
          response.data.data.powerFormLink ??
          "";
        setDocusignLink(incomingLink);
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

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timeout);
  }, [copied]);

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
        {}
      );

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

  const handleAddLink = () => {
    const value = linkInput.trim();
    if (!value) {
      setLinkError("Please enter a link.");
      return;
    }

    try {
      const parsed = new URL(value);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        setLinkError("Link must start with http:// or https://.");
        return;
      }
    } catch {
      setLinkError("Please enter a valid URL.");
      return;
    }

    setDocusignLink(value);
    setLinkInput("");
    setLinkError(null);
    setIsLinkModalOpen(false);
  };

  const handleActivateWithLink = async () => {
    if (!agent?._id || !docusignLink) return;
    try {
      setIsActivatingWithLink(true);
      setAccessError(null);

      const response = await apiClient.post<ActivateWithLinkResponse>(
        `/agent/admin/${agent._id}/activate-with-link`,
        { activationLink: docusignLink }
      );

      const nextAccess = response.data.data?.hasGrantAccess ?? true;
      setHasGrantAccess(nextAccess);
      setAgent((prev) =>
        prev
          ? {
              ...prev,
              hasGrantAccess: nextAccess,
              docuSignPowerFormLink:
                response.data.data?.activationLink ?? docusignLink,
            }
          : prev
      );
    } catch (err) {
      setAccessError(
        err instanceof Error ? err.message : "Unable to activate agent."
      );
    } finally {
      setIsActivatingWithLink(false);
    }
  };

  const handleCopyLink = async () => {
    if (!docusignLink) return;
    try {
      await navigator.clipboard.writeText(docusignLink);
      setCopied(true);
    } catch {
      setAccessError("Unable to copy link.");
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

      {/* DocuSign Link Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div className="text-sm text-red-500 font-semibold">Required for Agent Activation</div>

        <div className="space-y-1">
          <h2 className="text-base font-semibold text-[#0B0B2C]">
            Agent DocuSign PowerForm - Brokerage Client Registration & Disclosures
          </h2>
          <p className="text-sm text-gray-500">
            Paste the agent&apos;s DocuSign PowerForm link exactly as provided by DocuSign (must include PowerFormId=).
          </p>
          <p className="text-sm text-gray-500">
            The disclosure template must include a <span className="font-semibold">Text field labeled renter_name</span> for auto-fill where the renter&apos;s name is required.
          </p>
        </div>

        <button
          onClick={() => {
            setLinkInput(docusignLink);
            setLinkError(null);
            setIsLinkModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition"
        >
          Add link
        </button>

        <div>
          <p className="text-xs text-gray-400 mb-2">Preview</p>
          {docusignLink ? (
            <div className="flex items-center gap-2 text-sm text-blue-500">
              <a
                href={docusignLink}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate max-w-[360px] hover:underline"
              >
                {docusignLink}
              </a>
              <button
                onClick={handleCopyLink}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Copy link"
              >
                <Copy className="w-4 h-4" />
              </button>
              {copied ? <span className="text-xs text-green-600">Copied</span> : null}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No link added yet.</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleActivateWithLink}
            disabled={!agent || !docusignLink || isActivatingWithLink}
            className="px-6 py-2.5 text-sm font-medium rounded-2xl transition bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-60"
          >
            {isActivatingWithLink ? "Processing..." : "Tested & approved"}
          </button>
        </div>
      </div>

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

      {isLinkModalOpen ? (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#0B0B2C]">Add DocuSign link</h3>
              <button
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setLinkError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label htmlFor="docusign-link" className="text-sm text-gray-600">
                PowerForm URL
              </label>
              <input
                id="docusign-link"
                type="url"
                value={linkInput}
                onChange={(event) => {
                  setLinkInput(event.target.value);
                  if (linkError) setLinkError(null);
                }}
                placeholder="https://powerforms.docusign.net/..."
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {linkError ? <p className="text-sm text-red-500">{linkError}</p> : null}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setLinkError(null);
                }}
                className="px-4 py-2 text-sm rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLink}
                className="px-4 py-2 text-sm rounded-xl bg-blue-500 text-white hover:bg-blue-600"
              >
                Save link
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {error || accessError ? (
        <p className="text-sm text-red-500" role="alert">
          {error ?? accessError}
        </p>
      ) : null}
    </div>
  );
}
