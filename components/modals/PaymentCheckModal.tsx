"use client";

import { useEffect, useRef, useState } from "react";
import { X, Percent } from "lucide-react";

interface PaymentCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentCheckModal({ isOpen, onClose }: PaymentCheckModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState<
    "free" | "charge" | null
  >(null);
  const [percentage, setPercentage] = useState("");

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

  if (!isOpen) return null;

  const handleSend = () => {
    console.log({
      option: selectedOption,
      percentage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-900 text-center">
          Pre-Market Payment Check
        </h2>
        <p className="text-sm text-gray-600 text-center mt-2 mb-6">
          Choose which option you prefer for the agent
        </p>

        {/* Options */}
        <div className="flex items-center justify-center gap-6 mb-5">
          <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="free"
              checked={selectedOption === "free"}
              onChange={() => setSelectedOption("free")}
              className="accent-blue-600"
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
            />
            Charge for grant access
          </label>
        </div>

        {/* Percentage input */}
        <div className="relative mb-8">
          <Percent
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
          />
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            placeholder="Enter percentage"
            className="w-full pl-8 pr-3 py-2.5 text-sm text-black border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
