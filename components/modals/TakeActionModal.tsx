"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface TakeActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCharge: () => void;
  onRemove: () => void;
}

export function TakeActionModal({
  isOpen,
  onClose,
  onCharge,
  onRemove,
}: TakeActionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the modal
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold text-center text-gray-900 mb-6">
          Take Action
        </h2>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onRemove}
            className="w-32 py-2 rounded-md bg-red-50 text-red-600 font-medium hover:bg-red-100 transition"
          >
            Remove
          </button>
          <button
            onClick={onCharge}
            className="w-32 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Charge
          </button>
        </div>
      </div>
    </div>
  );
}
