"use client";

import { useEffect, useRef, useState } from "react";
import { X, DollarSign } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { useAppSelector } from "@/store/hooks";

interface PaymentCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  onSuccess?: () => void;
}

export function PaymentCheckModal({
  isOpen,
  onClose,
  requestId,
  onSuccess,
}: PaymentCheckModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState<
    "free" | "charge" | null
  >(null);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("Approved");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAppSelector((state) => state.auth);

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedOption(null);
      setAmount("");
      setNotes("Approved");
      setError(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedOption === "free") {
      setNotes("Approved");
      return;
    }

    if (selectedOption === "charge") {
      setNotes("Standard fee");
    }
  }, [selectedOption]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!selectedOption) {
      setError("Please select an option.");
      return;
    }

    const chargeAmount =
      selectedOption === "free"
        ? 0
        : Number.isNaN(Number(amount))
        ? NaN
        : Number(amount);

    if (
      selectedOption === "charge" &&
      (!amount || Number.isNaN(chargeAmount))
    ) {
      setError("Please enter a valid amount.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const tokenFromStorage =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const token = accessToken || tokenFromStorage;

      const isFree = chargeAmount <= 0;
      const baseUrl = `/pre-market/grant-access/admin/${requestId}`;
      const defaultNotes = isFree ? "Approved" : "Standard fee";
      const notesToSend = notes || defaultNotes;

      const endpoint = isFree
        ? `${baseUrl}/approve/`
        : `${baseUrl}/charge`;

      const payload = isFree
        ? { notes: notesToSend }
        : { chargeAmount, notes: notesToSend };

      await apiClient.post(endpoint, payload, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to submit payment request.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          disabled={submitting}
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 text-center">
          Pre-Market Payment Check
        </h2>
        <p className="text-sm text-gray-600 text-center mt-2 mb-6">
          Choose which option you prefer for the agent
        </p>

        <div className="flex items-center justify-center gap-6 mb-5">
          <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="free"
              checked={selectedOption === "free"}
              onChange={() => setSelectedOption("free")}
              className="accent-blue-600"
              disabled={submitting}
            />
            Free of Cost
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="charge"
              checked={selectedOption === "charge"}
              onChange={() => setSelectedOption("charge")}
              className="accent-blue-600"
              disabled={submitting}
            />
            Charge for grant access
          </label>
        </div>

        <div className="relative mb-4">
          <DollarSign
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount"
            className="w-full pl-8 pr-3 py-2.5 text-sm text-black border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={selectedOption === "free" || submitting}
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs text-gray-600 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
            disabled={submitting}
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 mb-4" role="alert">
            {error}
          </div>
        )}

        <div className="flex justify-end items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-60"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
