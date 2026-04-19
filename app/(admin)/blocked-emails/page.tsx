"use client";

import { useEffect, useMemo, useState } from "react";
import { Ban, CheckCircle2, Loader2, ShieldOff } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

const BLOCK_REASONS = [
  "Spam Activity",
  "Fake Registration",
  "Suspicious Behavior",
  "Duplicate Account",
  "Policy Violation",
  "Admin Decision",
] as const;

type BlockReason = (typeof BLOCK_REASONS)[number];
type BlockStatus = "active" | "removed";

type BlockedEmail = {
  _id: string;
  email: string;
  reason: BlockReason;
  status: BlockStatus;
  blockedAt: string;
  blockedBy: {
    fullName: string | null;
    email: string | null;
  };
  removedAt?: string | null;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response &&
    "data" in error.response
  ) {
    const data = error.response.data as { message?: string };
    return data.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

export default function BlockedEmailsPage() {
  const [blockedEmails, setBlockedEmails] = useState<BlockedEmail[]>([]);
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState<BlockReason>("Spam Activity");
  const [status, setStatus] = useState<"idle" | "loading">("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const activeCount = useMemo(
    () => blockedEmails.filter((item) => item.status === "active").length,
    [blockedEmails],
  );

  const loadBlockedEmails = async () => {
    try {
      setStatus("loading");
      setError(null);
      const response =
        await apiClient.get<ApiResponse<BlockedEmail[]>>("/blocked-emails");
      setBlockedEmails(response.data.data);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load blocked emails."));
    } finally {
      setStatus("idle");
    }
  };

  useEffect(() => {
    void loadBlockedEmails();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Email address is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setNotice(null);
      const response = await apiClient.post<ApiResponse<BlockedEmail>>(
        "/blocked-emails",
        {
          email: normalizedEmail,
          reason,
        },
      );

      setBlockedEmails((prev) => {
        const next = prev.filter((item) => item._id !== response.data.data._id);
        return [response.data.data, ...next];
      });
      setEmail("");
      setReason("Spam Activity");
      setNotice("Email blocked successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to block email."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnblock = async (item: BlockedEmail) => {
    try {
      setMutatingId(item._id);
      setError(null);
      setNotice(null);
      const response = await apiClient.patch<ApiResponse<BlockedEmail>>(
        `/blocked-emails/${item._id}/unblock`,
      );

      setBlockedEmails((prev) =>
        prev.map((blockedEmail) =>
          blockedEmail._id === item._id ? response.data.data : blockedEmail,
        ),
      );
      setNotice("Email unblocked successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to unblock email."));
    } finally {
      setMutatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-sm">
        <div className="relative p-6 md:p-8">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-blue-500/20" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-100">
                <ShieldOff className="h-4 w-4" />
                Access Control
              </div>
              <h1 className="text-3xl font-bold">Blocked Emails</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Blocked emails cannot register, login, submit requests, or
                continue using active sessions.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4">
              <p className="text-xs uppercase tracking-wide text-slate-300">
                Active blocks
              </p>
              <p className="mt-1 text-3xl font-bold">{activeCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-red-50 p-3 text-red-600">
              <Ban className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Add blocked email
              </h2>
              <p className="text-sm text-gray-500">
                The blocked date and admin are recorded automatically.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Email address
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="renter@example.com"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Reason for block
              </span>
              <select
                value={reason}
                onChange={(event) => setReason(event.target.value as BlockReason)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {BLOCK_REASONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
              Block email
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Blocked list
              </h2>
              <p className="text-sm text-gray-500">
                Removed records remain visible for audit history.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadBlockedEmails()}
              className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>

          {error ? (
            <div className="mx-6 mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {notice ? (
            <div className="mx-6 mt-6 flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              {notice}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Date blocked</th>
                  <th className="px-6 py-4">Blocked by</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {status === "loading" ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                      <p className="mt-2 text-gray-500">
                        Loading blocked emails...
                      </p>
                    </td>
                  </tr>
                ) : blockedEmails.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No blocked emails have been added yet.
                    </td>
                  </tr>
                ) : (
                  blockedEmails.map((item) => (
                    <tr key={item._id} className="text-gray-700">
                      <td className="px-6 py-4 font-medium text-slate-950">
                        {item.email}
                      </td>
                      <td className="px-6 py-4">{item.reason}</td>
                      <td className="px-6 py-4">{formatDate(item.blockedAt)}</td>
                      <td className="px-6 py-4">
                        {item.blockedBy.fullName ||
                          item.blockedBy.email ||
                          "Unknown admin"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "active"
                              ? "bg-red-50 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.status === "active" ? "Active" : "Removed"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => void handleUnblock(item)}
                          disabled={
                            item.status !== "active" || mutatingId === item._id
                          }
                          className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {mutatingId === item._id ? "Removing..." : "Unblock"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
