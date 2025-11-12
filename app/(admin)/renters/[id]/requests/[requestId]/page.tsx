"use client";

import { useParams } from "next/navigation";
import {
  MapPin,
  DollarSign,
  Calendar,
  Home,
  Hash,
  LucideIcon,
} from "lucide-react";

// ✅ Move this component OUTSIDE of the main render
function InfoBox({
  icon: Icon,
  value,
  placeholder,
}: {
  icon?: LucideIcon;
  value: string;
  placeholder: string;
}) {
  return (
    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 flex-1 cursor-not-allowed">
      {Icon && <Icon size={16} className="text-blue-600 mr-2 shrink-0" />}
      <span className="text-sm text-gray-800">{value || placeholder}</span>
    </div>
  );
}

export default function RequestDetailsPage() {
  const { requestId } = useParams<{ requestId: string }>();

  const request = {
    id: requestId,
    neighborhood: "Manhattan",
    borough: "West Chelsea",
    address: "123 Hudson St",
    apartment: "5A",
    price: "$4,250.00",
    dateRange: "5/21/25 - 6/21/25",
    bedrooms: "2BR",
    bathrooms: "1",
    unitFeatures: ["Laundry in unit", "Dishwasher"],
    buildingFeatures: ["Doorman", "Elevator"],
    petPolicy: ["Cats allowed"],
    guarantor: ["Personal guarantor"],
    note: "I want the room clean.",
  };

  return (
    <section className="w-full bg-white rounded-xl shadow-sm p-6 sm:p-8 md:p-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Request Details
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review renter’s pre-market request information
        </p>
      </div>

      {/* Neighborhood */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Neighborhood</p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="radio" checked readOnly className="accent-blue-600" />
            Manhattan
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="radio" readOnly className="accent-blue-600" />
            Brooklyn
          </label>
        </div>
      </div>

      {/* Borough */}
      <div className="flex flex-col mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Borough
        </label>
        <InfoBox icon={MapPin} value={request.borough} placeholder="Borough" />
      </div>

      {/* Address & Apartment */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <InfoBox icon={Home} value={request.address} placeholder="Address" />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Apartment
          </label>
          <InfoBox icon={Hash} value={request.apartment} placeholder="Number" />
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Pre-Market Price
        </label>
        <InfoBox
          icon={DollarSign}
          value={request.price}
          placeholder="Minimum price"
        />
      </div>

      {/* Date */}
      <div className="flex flex-col mb-6">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Estimate date when the listing stops being Pre-Market
        </label>
        <InfoBox icon={Calendar} value={request.dateRange} placeholder="From" />
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="max-w-8/10 flex flex-col gap-4 mb-6">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 mb-1">Bedrooms</p>
          <div className="flex gap-1">
            {["Studio", "1BR", "2BR", "3BR", "4BR+"].map((br) => (
              <div
                key={br}
                className={`flex-1 border text-center py-2 text-sm rounded-sm ${
                  request.bedrooms === br
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                {br}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 mb-1">Bathrooms</p>
          <div className="flex gap-1">
            {["1", "2", "3", "4+"].map((b) => (
              <div
                key={b}
                className={`flex-1 border text-center py-2 text-sm rounded-sm ${
                  request.bathrooms === b
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Unit Features
          </p>
          {["Laundry in unit", "Private outdoor space", "Dishwasher"].map(
            (item) => (
              <label key={item} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={request.unitFeatures.includes(item)}
                  readOnly
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">{item}</span>
              </label>
            )
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Building Features
          </p>
          {["Doorman", "Elevator", "Laundry in building"].map((item) => (
            <label key={item} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={request.buildingFeatures.includes(item)}
                readOnly
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Pet Policy</p>
          {["Cats allowed", "Dogs allowed"].map((item) => (
            <label key={item} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={request.petPolicy.includes(item)}
                readOnly
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Guarantor */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Accept Guarantor
        </p>
        {["Personal guarantor", "Third party guarantor"].map((item) => (
          <label key={item} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={request.guarantor.includes(item)}
              readOnly
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700">{item}</span>
          </label>
        ))}
      </div>

      {/* Notes */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Note</p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800 min-h-[80px]">
          {request.note}
        </div>
      </div>
    </section>
  );
}
