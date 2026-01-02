"use client";

import { MapPin, DollarSign, Calendar } from "lucide-react";

export default function RenterPreferenceForm({
  data,
}: {
  data: {
    borough?: string;
    boroughs?: string[];
    locations?: { borough: string; neighborhoods: string[] }[];
    neighborhoods: string[];
    minPrice: string;
    maxPrice: string;
    earliestDate: string;
    latestDate: string;
    bedrooms: string | string[];
    bathrooms: string | number | string[];
    unitFeatures: string[];
    buildingFeatures: string[];
    petPolicy: string[];
    guarantor: string[];
    preferences: string[];
  };
}) {
  const locationGroups =
    data.locations?.length
      ? data.locations
      : data.borough || data.boroughs?.length || data.neighborhoods?.length
        ? [
            {
              borough: data.boroughs?.length
                ? data.boroughs.join(", ")
                : data.borough ?? "Borough",
              neighborhoods: data.neighborhoods ?? [],
            },
          ]
        : [];
  const bedroomList = Array.isArray(data.bedrooms)
    ? data.bedrooms
    : data.bedrooms
      ? [data.bedrooms]
      : [];
  const bathroomList = Array.isArray(data.bathrooms)
    ? data.bathrooms.map(String)
    : data.bathrooms != null
      ? [String(data.bathrooms)]
      : [];
  const renderPreferencesList = (items: string[]) => {
    if (!items.length) {
      return <p className="text-sm text-gray-500">Not specified</p>;
    }

    const mid = Math.ceil(items.length / 2);
    const left = items.slice(0, mid);
    const right = items.slice(mid);

    const renderColumn = (column: string[], offset: number) => (
      <div className="space-y-2">
        {column.map((item, idx) => (
          <div
            key={item}
            className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
          >
            <span className="w-6 text-sm font-semibold text-gray-700">
              {offset + idx + 1}.
            </span>
            <span className="text-sm text-gray-800">{item}</span>
          </div>
        ))}
      </div>
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderColumn(left, 0)}
        {renderColumn(right, left.length)}
      </div>
    );
  };
  return (
    <>
      {/* Borough */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-1">
          Borough & Neighborhoods
        </p>
        <div className="space-y-3">
          {locationGroups.length ? (
            locationGroups.map((location) => (
              <div key={location.borough}>
                <div className="text-lg font-semibold text-gray-900">
                  {location.borough}
                </div>
                <div className="text-sm text-gray-600">
                  {location.neighborhoods?.length
                    ? location.neighborhoods.join(" • ")
                    : "Not specified"}
                </div>
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-500">Not specified</span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Pre-Market Price Range
        </label>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
            <DollarSign width={16} height={16} className="text-blue-600 mr-2" />
            <span className="text-sm text-gray-800">
              {data.minPrice || "-"}
            </span>
          </div>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
            <DollarSign width={16} height={16} className="text-blue-600 mr-2" />
            <span className="text-sm text-gray-800">
              {data.maxPrice || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div>
        <p className="font-semibold text-gray-900 mb-2">Moving Date</p>
        <div className="flex gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Earliest Date</p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <span className="text-blue-500">📅</span>
              <input
                type="text"
                value={data.earliestDate}
                readOnly
                disabled
                className="w-full bg-transparent text-gray-700 outline-none"
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Latest Date</p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <span className="text-blue-500">📅</span>
              <input
                type="text"
                value={data.latestDate}
                readOnly
                disabled
                className="w-full bg-transparent text-gray-700 outline-none"
              />
            </div>
          </div>
        </div>
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
                  bedroomList.includes(br)
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
                  bathroomList.includes(b)
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
                  checked={data.unitFeatures.includes(item)}
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
                checked={data.buildingFeatures.includes(item)}
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
                checked={data.petPolicy.includes(item)}
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
          Guarantor Type Required
        </p>
        {["Personal guarantor", "Third party guarantor"].map((item) => (
          <label key={item} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={data.guarantor.includes(item)}
              readOnly
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700">{item}</span>
          </label>
        ))}
      </div>

      {/* Preferences */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Preferences</p>
        {renderPreferencesList(data.preferences)}
      </div>
    </>
  );
}
