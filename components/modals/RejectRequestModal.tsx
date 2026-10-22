"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface RejectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  onSuccess?: () => void;
}

export function RejectRequestModal({
  isOpen,
  onClose,
  requestId,
  onSuccess,
}: RejectRequestModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState("Credentials don't meet requirements");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setNotes("Credentials don't meet requirements");
    setError(null);
    setSubmitting(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleReject = async () => {
    setSubmitting(true);
    setError(null);

    try {

      await apiClient.post(
        `/pre-market/grant-access/admin/${requestId}/reject`,
        { notes: notes || "Credentials don't meet requirements" }
      );

      onSuccess?.();
      handleClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to reject this request.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg relative"
      >
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
          disabled={submitting}
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 text-center">
          Reject Request
        </h2>
        <p className="text-sm text-gray-600 text-center mt-2 mb-6">
          Confirm rejection and provide a note for the agent.
        </p>

        <div className="mb-6">
          <label className="block text-xs text-gray-600 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-gray-700 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
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
            onClick={handleClose}
            className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-60"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}
