"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { useAppSelector } from "@/store/hooks";

type PaymentAgent = {
  _id: string;
  email?: string;
  phoneNumber?: string;
  fullName?: string;
};

type PaymentRequest = {
  _id: string;
  requestId?: string;
};

type PaymentItem = {
  id: string;
  agentId?: PaymentAgent;
  agentName?: string;
  agentEmail?: string;
  agentPhone?: string;
  preMarketRequestId?: PaymentRequest;
  listingRequestId?: string;
  status?: string;
  paymentStatus?: string;
  amount?: number;
  currency?: string;
  isFree?: boolean;
  failureCount?: number;
  createdAt?: string;
  updatedAt?: string;
  decisionNotes?: string;
  decisionDate?: string;
};

type PaymentsResponse = {
  success: boolean;
  message: string;
  data: PaymentItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  timestamp: string;
};

export default function PaymentListPage() {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaymentsResponse["pagination"]>(
    undefined,
  );
  const limit = 10;

  const handleDelete = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const formatStatus = (payment: PaymentItem) => {
    const rawStatus = payment.paymentStatus ?? payment.status ?? "pending";
    const normalized = rawStatus.toLowerCase();
    return normalized === "paid" ? "Paid" : "Pending";
  };

  const getStatusBadge = (payment: PaymentItem) => {
    const label = formatStatus(payment);
    const isPaid = label === "Paid";
    const style = isPaid
      ? "bg-green-50 text-green-700"
      : "bg-yellow-50 text-yellow-700";
    const dotColor = isPaid ? "bg-green-400" : "bg-yellow-400";

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${style}`}
      >
        {label}
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      </span>
    );
  };

  const formatAmount = (amount?: number, currency?: string) => {
    if (amount == null) return "-";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
      }).format(amount);
    } catch {
      return `${currency || "USD"} ${amount}`;
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(parsed);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchPayments = async () => {
      try {
        setStatus("loading");
        setError(null);
        const tokenFromStorage =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
        const token = accessToken || tokenFromStorage;

        const response = await apiClient.get<PaymentsResponse>(
          "/grant-access/admin/payments",
          {
            params: { page, limit },
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          },
        );

        if (!isMounted) return;
        setPayments(response.data.data || []);
        setPagination(response.data.pagination);
        setStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setStatus("failed");
        setError(
          err instanceof Error ? err.message : "Unable to load payments.",
        );
      }
    };

    fetchPayments();

    return () => {
      isMounted = false;
    };
  }, [accessToken, page]);

  const totalResults = pagination?.total ?? payments.length;
  const pageNumbers = useMemo(() => {
    if (!pagination) return [];
    return Array.from({ length: pagination.pages }, (_, i) => i + 1);
  }, [pagination]);

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#0A093D]">
          Payment Management
        </h1>
      </div>
      {status === "loading" && (
        <p className="text-sm text-gray-600">Loading payments...</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Scrollable Table Container */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          <table className="min-w-max w-full text-sm text-gray-800 border-collapse">
            <thead className="bg-[#CFE4FF] text-[#0A093D] font-semibold">
              <tr>
                {["No", "Agent Name", "Price", "Date", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-600"
                  >
                    {status === "loading"
                      ? "Loading payments..."
                      : "No payments found."}
                  </td>
                </tr>
              ) : (
                payments.map((item, idx) => {
                  const agentName =
                    item.agentName || item.agentId?.fullName || "Unknown agent";
                  const dateValue = item.decisionDate || item.createdAt;
                  return (
                    <tr
                      key={item.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {agentName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatAmount(item.amount, item.currency)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatDate(dateValue)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(item)}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => router.push(`/payments/${item.id}`)}
                            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                          >
                            <Eye size={16} className="text-gray-800" />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
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

      {/* Footer */}
      <p className="text-xs text-gray-500">
        No of Results {payments.length} out of {totalResults}
      </p>
      {pagination && pagination.pages > 1 ? (
        <div className="flex items-center gap-2">
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm ${
                page === pageNumber
                  ? "bg-white border-blue-500 text-blue-600"
                  : "border-gray-200 hover:bg-gray-100 text-gray-700"
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
