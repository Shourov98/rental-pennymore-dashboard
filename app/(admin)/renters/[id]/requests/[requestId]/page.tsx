"use client";

import { useParams } from "next/navigation";
import { MapPin, DollarSign, Calendar } from "lucide-react";
import Image from "next/image";

// Reusable read-only info box
function InfoBox({
  icon: Icon,
  value,
  placeholder,
}: {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: string;
  placeholder: string;
}) {
  return (
    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 flex-1 cursor-not-allowed">
      {Icon && (
        <Icon width={16} height={16} className="text-blue-600 mr-2 shrink-0" />
      )}
      <span className="text-sm text-gray-800">{value || placeholder}</span>
    </div>
  );
}

export default function RequestDetailsPage() {
  const { requestId } = useParams<{ requestId: string }>();

  // ---- Request data should come from API later ----
  // (for now using mock sample)
  const renter = {
    firstName: "John",
    lastName: "Doe",
    email: "example@gmail.com",
    phone: "+8801XXXXXXX",
    image: "https://randomuser.me/api/portraits/men/31.jpg",
  };

  const request = {
    id: requestId,
    requestName: "BeforeListed-1",
    borough: "Manhattan",
    neighborhoods: ["West Chelsea", "Hudson Yards"], // ⬅ MULTIPLE support
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
    <div className="space-y-4">
      {/* Contact */}
      <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row gap-10 items-center md:items-start">
        <Image
          src={renter.image}
          alt="Renter"
          width={160}
          height={160}
          className="rounded-full object-cover border-4 border-gray-100 shadow-sm"
        />
        <div className="flex-1 w-full">
          <h2 className="text-xl font-semibold text-[#0B0B2C] mb-4">
            Contact Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
            <div>
              <p className="text-gray-500 text-sm mb-1">Name</p>
              <p className="font-medium text-gray-900 text-base">
                {renter.firstName + " " + renter.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Email</p>
              <p className="font-medium text-gray-900 text-base">
                {renter.email}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Phone Number</p>
              <p className="font-medium text-gray-900 text-base">
                {renter.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
      <section className="w-full bg-white rounded-xl shadow-sm p-6 sm:p-8 md:p-10">
        {/* ------------------------------------------------ */}
        {/* HEADER AREA WITH REQUEST NAME + RENTER FIRST NAME */}
        {/* ------------------------------------------------ */}
        <div className="mb-8 flex flex-col gap-1">
          <div className="flex flex-col items-left justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              {request.requestName}
            </h1>
            <span className="text-md font-semibold text-gray-700 py-1.5 rounded-lg">
              Renter: {renter.firstName}
            </span>
          </div>

          <p className="text-sm text-gray-500">
            Review renter’s pre-market request information
          </p>
        </div>

        {/* Borough */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-1">Borough</p>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                checked={(request.borough ?? "") === "Manhattan"}
                readOnly
                className="accent-blue-600"
              />
              Manhattan
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                checked={(request.borough ?? "") === "Brooklyn"}
                readOnly
                className="accent-blue-600"
              />
              Brooklyn
            </label>
          </div>
        </div>

        {/* Neighborhood – Multiple */}
        <div className="flex flex-col mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Neighborhoods
          </label>

          <div className="flex flex-wrap gap-2">
            {request.neighborhoods.length > 0 ? (
              request.neighborhoods.map((hood) => (
                <span
                  key={hood}
                  className="bg-gray-100 border border-gray-300 text-gray-800 rounded-md px-3 py-1 text-sm"
                >
                  {hood}
                </span>
              ))
            ) : (
              <InfoBox icon={MapPin} value="" placeholder="No neighborhoods" />
            )}
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
            Estimated date range
          </label>
          <InfoBox
            icon={Calendar}
            value={request.dateRange}
            placeholder="From"
          />
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
    </div>
  );
}
