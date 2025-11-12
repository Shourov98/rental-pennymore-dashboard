"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [bathrooms, setBathrooms] = useState<string | null>(null);
  const [pets, setPets] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetFilters = () => {
    setBedrooms(null);
    setBathrooms(null);
    setPets(null);
    setPrice(null);
  };

  const applyFilters = () => {
    // you can connect backend filters here
    console.log({ bedrooms, bathrooms, pets, price });
    onClose();
  };

  const renderOption = (
    value: string,
    state: string | null,
    setState: (v: string) => void
  ) => (
    <button
      key={value}
      onClick={() => setState(value)}
      className={`px-4 py-2 rounded-lg text-sm border ${
        state === value
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
      } transition`}
    >
      {value}
    </button>
  );

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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Filter Requests
        </h2>

        {/* Bedrooms */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">Bedrooms</p>
          <div className="flex flex-wrap gap-2">
            {["Studio", "1BR", "2BR", "3BR", "4BR+"].map((b) =>
              renderOption(b, bedrooms, setBedrooms)
            )}
          </div>
        </div>

        {/* Bathrooms */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">Bathrooms</p>
          <div className="flex flex-wrap gap-2">
            {["1", "2", "3", "4+"].map((b) =>
              renderOption(b, bathrooms, setBathrooms)
            )}
          </div>
        </div>

        {/* Pets Allowed */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">Pets Allowed</p>
          <div className="flex gap-2">
            {["Yes", "No"].map((p) => renderOption(p, pets, setPets))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">Price Range</p>
          <div className="flex flex-wrap gap-2">
            {[
              "$1,000 - $2,000",
              "$2,000 - $3,000",
              "$3,000 - $4,000",
              "$4,000+",
            ].map((p) => renderOption(p, price, setPrice))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
