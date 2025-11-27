"use client";

import Image from "next/image";
import {
  ChevronLeft,
  DollarSign,
  X,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import RenterPreferenceForm from "@/components/RenterPreferenceForm";
import AgentContactCard from "@/components/AgentContactCard";

export default function AgentConnectionViewPage() {
  const [open, setOpen] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>("renter");
  // Dummy data
  const connection = {
    status: "Paid & Approved", // or "Pending"
    agent: {
      name: "John Doe",
      email: "example@gmail.com",
      phone: "+8801XXXXXXX",
      license: "56666666",
      brokerage: "Alice",
      image: "https://randomuser.me/api/portraits/men/31.jpg",
    },
    renter: {
      name: "John Doe",
      email: "example@gmail.com",
      phone: "+8801XXXXXXX",
      image: "https://i.pravatar.cc/150?img=3",
    },
    payment: {
      paid: true,
      amount: 171.5,
    },
  };

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      {/* Breadcrumb + Header */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <ChevronLeft size={18} className="cursor-pointer" />
        <span>Renter Connection</span>
        <span className="text-gray-400">›</span>
        <span>View</span>
        <span className="text-gray-400">›</span>
        <span className="text-blue-600 font-medium">View Agent Listing</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#0A093D]">
          Renter Connection
        </h1>

        {/* Status badge */}
        <span
          className={`mt-3 sm:mt-0 inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium ${
            connection.status === "Paid & Approved"
              ? "bg-green-50 text-green-600"
              : "bg-yellow-50 text-yellow-600"
          }`}
        >
          {connection.status}
          <span
            className={`w-2 h-2 rounded-full ${
              connection.status === "Paid & Approved"
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
          ></span>
        </span>
      </div>

      {/* Agent Contact Details */}
      <div className="pb-2 md:pb-3 lg:pb-5">
        <AgentContactCard agent={connection.agent} />
      </div>

      {/* Renter Contact Details */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#0A093D]">
            Renter Contact Details
          </h2>
          <span className="px-4 py-1 border border-blue-400 text-blue-500 rounded-full text-xs font-medium">
            T. Mor
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="w-28 h-28 rounded-full overflow-hidden">
            <Image
              src={connection.renter.image}
              alt="Renter"
              width={112}
              height={112}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-1 text-gray-800">
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Name</p>
              <p className="font-medium text-lg">{connection.renter.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Email</p>
              <p className="font-medium text-lg">{connection.renter.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Phone Number</p>
              <p className="font-medium text-lg">{connection.renter.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Renter Preference Section */}
      <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden transition-all duration-300">
        {/* Header */}
        <div
          className="p-4 flex justify-between items-center cursor-pointer"
          onClick={() =>
            setOpenSection(openSection === "renter" ? null : "renter")
          }
        >
          <h2 className="text-lg font-semibold text-[#0A093D]">
            Renter Preference
          </h2>
          <button className="text-blue-600 font-medium text-lg">
            {openSection === "renter" ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
        </div>

        {/* Dropdown content */}
        {openSection === "renter" && (
          <div className="border-t border-gray-100 px-6 pb-6 pt-4 animate-fadeIn overflow-y-auto">
            <form className="grid grid-cols-1 gap-6 text-sm text-gray-700">
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
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>

      {/* Cost Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#0A093D] mb-3">Cost</h2>
        <div className="border rounded-lg px-4 py-3 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">
              {connection.payment.paid ? "Paid" : "Pending"}
            </p>
            <p className="text-gray-500 text-sm">Amount</p>
          </div>
          <div className="flex items-center gap-2">
            {connection.payment.paid ? (
              <CheckCircle size={18} className="text-green-500" />
            ) : (
              <AlertCircle size={18} className="text-yellow-500" />
            )}
            <p className="font-semibold text-gray-800">
              ${connection.payment.amount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
