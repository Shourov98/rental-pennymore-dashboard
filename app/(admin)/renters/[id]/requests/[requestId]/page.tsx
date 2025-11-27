"use client";

import { useParams } from "next/navigation";
import { MapPin, DollarSign, Calendar } from "lucide-react";
import Image from "next/image";
import RenterPreferenceForm from "@/components/RenterPreferenceForm";
import RenterContactCard from "@/components/RenterContactCard";

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
    referrerName: "Tuval Mor",
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
      <RenterContactCard
        renter={{
          ...renter,
          name: `${renter.firstName} ${renter.lastName}`,
        }}
      />
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
        <RenterPreferenceForm
          data={{
            borough: "Brooklyn",
            neighborhoods: ["West Chelsea"],
            minPrice: "4250",
            maxPrice: "5000",
            earliestDate: "05/21/2025",
            latestDate: "06/21/2025",
            bedrooms: "Studio",
            bathrooms: 1,
            unitFeatures: ["Laundry in unit", "Dishwasher"],
            buildingFeatures: ["Doorman", "Elevator"],
            petPolicy: ["Cats allowed"],
            guarantor: ["Personal guarantor"],
            note: "I want the room clean.",
          }}
        />
      </section>
    </div>
  );
}
