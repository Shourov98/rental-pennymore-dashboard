"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface FilterState {
  borough: string;
  neighborhoods: string[];
  maxPrice: number;
  bedrooms: string[];
  bathrooms: string[];
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  filters: FilterState;
  setFilters: (data: FilterState) => void;
}

export function FilterModal({
  isOpen,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters,
}: FilterModalProps) {
  if (!isOpen) return null;

  // Borough → Neighborhood Map
  const boroughNeighborhoods: Record<string, string[]> = {
    Manhattan: [
      "Harlem",
      "Upper West Side",
      "Upper East Side",
      "Hell’s Kitchen",
      "Midtown East",
      "Chelsea",
      "SoHo",
      "Tribeca",
      "Financial District",
      "West Village",
      "East Village",
      "Lower East Side",
      "Chinatown",
    ],
    Brooklyn: [
      "Williamsburg",
      "Greenpoint",
      "Bushwick",
      "Bedford-Stuyvesant",
      "Brooklyn Heights",
      "Park Slope",
      "Fort Greene",
      "Clinton Hill",
      "Crown Heights",
      "Flatbush",
      "Kensington",
      "Bay Ridge",
      "Bensonhurst",
      "Brighton Beach",
      "Sheepshead Bay",
      "DUMBO",
    ],
  };

  const priceOptions = Array.from({ length: 11 }, (_, i) => i * 1000);

  const selectedNeighborhoods = boroughNeighborhoods[filters.borough] || [];

  const toggleNeighborhood = (hood: string) => {
    if (filters.neighborhoods.includes(hood)) {
      setFilters({
        ...filters,
        neighborhoods: filters.neighborhoods.filter((n) => n !== hood),
      });
    } else {
      setFilters({
        ...filters,
        neighborhoods: [...filters.neighborhoods, hood],
      });
    }
  };

  // ---------------------------
  // MULTI-SELECT TOGGLE HELPERS
  // ---------------------------
  const toggleBedroom = (b: string) => {
    setFilters({
      ...filters,
      bedrooms: filters.bedrooms.includes(b)
        ? filters.bedrooms.filter((x) => x !== b)
        : [...filters.bedrooms, b],
    });
  };

  const toggleBathroom = (b: string) => {
    setFilters({
      ...filters,
      bathrooms: filters.bathrooms.includes(b)
        ? filters.bathrooms.filter((x) => x !== b)
        : [...filters.bathrooms, b],
    });
  };

  return (
    <div className="fixed inset-0 flex z-50">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="w-[340px] bg-white text-gray-700 h-full shadow-xl p-6 overflow-y-auto overflow-x-visible">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Filter</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Borough */}
        <p className="text-sm font-medium text-gray-700 mb-1">Borough</p>
        <div className="flex gap-6 mb-4">
          {["Manhattan", "Brooklyn"].map((b) => (
            <label
              key={b}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="radio"
                name="borough"
                checked={filters.borough === b}
                onChange={() =>
                  setFilters({ ...filters, borough: b, neighborhoods: [] })
                }
                className="accent-blue-600"
              />
              {b}
            </label>
          ))}
        </div>

        {/* Neighborhood */}
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Neighborhood
        </label>

        <select
          className="w-full border border-gray-400 px-3 py-2 rounded-lg mb-3 text-sm relative z-50"
          onChange={(e) => {
            if (e.target.value) toggleNeighborhood(e.target.value);
          }}
        >
          <option value="">Select neighborhood</option>
          {selectedNeighborhoods.map((hood) => (
            <option key={hood} value={hood}>
              {hood}
            </option>
          ))}
        </select>

        {/* Multi-select chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.neighborhoods.map((hood) => (
            <span
              key={hood}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {hood}
              <button
                onClick={() => toggleNeighborhood(hood)}
                className="text-blue-700 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Max Price */}
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Max Price
        </label>

        <select
          className="w-full border border-gray-400 px-3 py-2 rounded-lg text-sm mb-4 relative z-50"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: Number(e.target.value) })
          }
        >
          {priceOptions.map((v) => (
            <option key={v} value={v}>
              ${v}
            </option>
          ))}
        </select>

        {/* Bedrooms */}
        <p className="text-sm font-medium text-gray-700 mb-1">Bedrooms</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Studio", "1BR", "2BR", "3BR", "4BR+"].map((b) => (
            <button
              key={b}
              onClick={() => toggleBedroom(b)}
              className={`px-4 py-2 rounded-lg text-sm border ${
                filters.bedrooms.includes(b)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-50 border-gray-300"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Bathrooms */}
        <p className="text-sm font-medium text-gray-700 mb-1">Bathrooms</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {["1", "2", "3", "4+"].map((b) => (
            <button
              key={b}
              onClick={() => toggleBathroom(b)}
              className={`px-4 py-2 rounded-lg text-sm border ${
                filters.bathrooms.includes(b)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-50 border-gray-300"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm border rounded-lg text-gray-700 border-gray-300"
          >
            Reset
          </button>

          <button
            onClick={onApply}
            className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg shadow"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
