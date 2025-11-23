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
      photo: "https://i.pravatar.cc/150?img=5",
    },
    renter: {
      name: "John Doe",
      email: "example@gmail.com",
      phone: "+8801XXXXXXX",
      photo: "https://i.pravatar.cc/150?img=3",
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
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-[#0A093D]">
            Agent Contact Details
          </h2>
          <div className="flex gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition">
              <DollarSign size={16} className="text-blue-600" />
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition">
              <X size={16} className="text-red-500" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Profile */}
          <div className="flex items-center gap-8">
            <div className="w-28 h-28 rounded-full overflow-hidden">
              <Image
                src={connection.agent.photo}
                alt="Agent"
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1 text-gray-800">
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Name</p>
                <p className="font-medium text-lg">{connection.agent.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Email</p>
                <p className="font-medium text-lg">{connection.agent.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">License no.</p>
                <p className="font-medium text-lg">
                  {connection.agent.license}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Brokerage Name</p>
                <p className="font-medium text-lg">
                  {connection.agent.brokerage}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-0.5">Phone Number</p>
                <p className="font-medium text-lg">{connection.agent.phone}</p>
              </div>
            </div>
          </div>
        </div>
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
              src={connection.renter.photo}
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
            <form className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-gray-700">
              {/* Borough */}
              <div className="col-span-2">
                <p className="font-medium text-gray-900 mb-2">Borough</p>
                <div className="flex gap-6">
                  {["Manhattan", "Brooklyn"].map((city, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <input
                        type="radio"
                        name="neighborhood"
                        checked={city === "Brooklyn"}
                        disabled
                        className="accent-blue-600"
                      />
                      <span>{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Neighborhood */}
              <div className="col-span-2">
                <p className="font-medium text-gray-900 mb-2">Neighborhoods</p>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <span className="text-blue-500">📍</span>
                  <input
                    type="text"
                    value="West Chelsea"
                    disabled
                    readOnly
                    className="w-full bg-transparent text-gray-700 outline-none"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="col-span-2">
                <p className="font-medium text-gray-900 mb-2">Price Range</p>

                <div className="flex gap-3">
                  {/* Minimum Price */}
                  <div className="col-span-1">
                    <p className="text-xs text-gray-500 mb-1">Minimum Price</p>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <span className="text-blue-500">$</span>
                      <input
                        type="text"
                        value="4250"
                        readOnly
                        disabled
                        className="w-full bg-transparent text-gray-700 outline-none"
                      />
                    </div>
                  </div>

                  {/* Maximum Price */}
                  <div className="col-span-1">
                    <p className="text-xs text-gray-500 mb-1">Maximum Price</p>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <span className="text-blue-500">$</span>
                      <input
                        type="text"
                        value="5000"
                        readOnly
                        disabled
                        className="w-full bg-transparent text-gray-700 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Moving Date */}
              <div className="col-span-2">
                <p className="font-medium text-gray-900 mb-2">Moving Date</p>

                <div className="flex gap-3">
                  {/* Earliest Date */}
                  <div className="col-span-1">
                    <p className="text-xs text-gray-500 mb-1">Earliest Date</p>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <span className="text-blue-500">📅</span>
                      <input
                        type="text"
                        value="05/21/2025"
                        readOnly
                        disabled
                        className="w-full bg-transparent text-gray-700 outline-none"
                      />
                    </div>
                  </div>

                  {/* Latest Date */}
                  <div className="col-span-1">
                    <p className="text-xs text-gray-500 mb-1">Latest Date</p>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <span className="text-blue-500">📅</span>
                      <input
                        type="text"
                        value="06/21/2025"
                        readOnly
                        disabled
                        className="w-full bg-transparent text-gray-700 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div className="col-span-2">
                <p className="font-medium text-gray-900 mb-2">Bedrooms</p>
                <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
                  {["Studio", "1BR", "2BR", "3BR", "4BR+"].map((b) => (
                    <button
                      key={b}
                      type="button"
                      disabled
                      className={`py-2 rounded-lg border text-sm font-medium ${
                        b === "Studio"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-200"
                      } cursor-default`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="col-span-2">
                <p className="font-medium text-gray-900 mb-2">Bathrooms</p>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((b) => (
                    <button
                      key={b}
                      type="button"
                      disabled
                      className={`py-2 rounded-lg border text-sm font-medium ${
                        b === 1
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-200"
                      } cursor-default`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
                {/* Unit Features */}
                <div>
                  <p className="font-medium text-gray-900 mb-2">
                    Unit Features
                  </p>
                  {[
                    "Laundry in unit",
                    "Private outdoor space",
                    "Dishwasher",
                  ].map((f, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled
                        defaultChecked={i !== 1}
                        className="accent-blue-600"
                      />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>

                {/* Building Features */}
                <div>
                  <p className="font-medium text-gray-900 mb-2">
                    Building Features
                  </p>
                  {["Doorman", "Elevator", "Laundry in building"].map(
                    (f, i) => (
                      <label key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          disabled
                          defaultChecked={i < 2}
                          className="accent-blue-600"
                        />
                        <span>{f}</span>
                      </label>
                    )
                  )}
                </div>

                {/* Pet Policy */}
                <div>
                  <p className="font-medium text-gray-900 mb-2">Pet Policy</p>
                  {["Cats allowed", "Dogs allowed"].map((f, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled
                        defaultChecked={i === 0}
                        className="accent-blue-600"
                      />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Guarantor */}
              <div className="col-span-2">
                <p className="font-medium text-gray-900 mb-2">
                  Accept Guarantor
                </p>
                <div className="flex gap-4 text-gray-700">
                  {["Personal guarantor", "Third party guarantor"].map(
                    (f, i) => (
                      <label key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          disabled
                          defaultChecked={i === 0}
                          className="accent-blue-600"
                        />
                        <span>{f}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Note */}
              <div className="col-span-2">
                <p className="font-medium text-gray-900 mb-2">Note</p>
                <textarea
                  value="I want the room clean."
                  readOnly
                  disabled
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 resize-none"
                />
              </div>
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
