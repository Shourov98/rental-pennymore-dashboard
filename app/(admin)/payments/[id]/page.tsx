"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Coins } from "lucide-react";

const renter = {
  name: "John Doe",
  email: "example@gmail.com",
  phone: "+8801XXXXXXX",
};

const agent = {
  name: "John Doe",
  email: "example@gmail.com",
  phone: "+8801XXXXXXX",
  license: "56666666",
  brokerage: "Alice",
};

export default function PaymentDetailsPage() {
  const router = useRouter();

  const payment = {
    status: "Paid", // change to "Pending" to test both designs
    amount: "$171.50",
  };

  const isPaid = payment.status === "Paid";

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm flex justify-between items-center px-6 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft
            size={18}
            className="cursor-pointer"
            onClick={() => router.push("/payments")}
          />
          <span>Payment Management</span>
          <span className="text-gray-400">›</span>
          <span className="text-blue-600 font-medium">View</span>
        </div>

        {/* Status Badge */}
        <div
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
            isPaid
              ? "bg-green-50 text-green-700"
              : "bg-yellow-50 text-yellow-700"
          }`}
        >
          {isPaid ? "Paid & Approved" : "Pending"}
          <span
            className={`w-2 h-2 rounded-full ${
              isPaid ? "bg-green-400" : "bg-yellow-400"
            }`}
          />
        </div>
      </div>

      {/* Cost Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Cost</p>
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <div>
            <p className="text-sm text-gray-600">{payment.status}</p>
            <p className="font-semibold text-gray-900">{payment.amount}</p>
          </div>
          <div
            className={`p-2 rounded-full ${
              isPaid
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {isPaid ? <CheckCircle2 size={20} /> : <Coins size={20} />}
          </div>
        </div>
      </div>

      {/* Renter Contact Details */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-[#0A093D]">
            Renter Contact Details
          </h2>
          <span className="border border-blue-400 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">
            Tuval’s Client
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Image
            src="/profile.png"
            alt="Renter"
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <div>
              <p className="text-xs text-gray-500 mb-1">Name</p>
              <p className="text-gray-900">{renter.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-gray-900">{renter.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone Number</p>
              <p className="text-gray-900">{renter.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Renter Preference */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-[#0A093D] font-semibold">Renter Preference</h3>
      </div>

      {/* Agent Contact Details */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#0A093D] mb-6">
          Agent Contact Details
        </h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Image
            src="/profile.png"
            alt="Agent"
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <div>
              <p className="text-xs text-gray-500 mb-1">Name</p>
              <p className="text-gray-900">{agent.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-gray-900">{agent.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone Number</p>
              <p className="text-gray-900">{agent.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">License no.</p>
              <p className="text-gray-900">{agent.license}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Brokerage Name</p>
              <p className="text-gray-900">{agent.brokerage}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
