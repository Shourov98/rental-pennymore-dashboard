"use client";

import { useState } from "react";
import { ChevronLeft, Eye, DollarSign, X } from "lucide-react";
import Image from "next/image";
import { TakeActionModal } from "@/components/modals/TakeActionModal";
import { PaymentCheckModal } from "@/components/modals/PaymentCheckModal";
import { useParams, useRouter } from "next/navigation";

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const dummyAgents: Agent[] = [
  { id: 1, name: "John Wick", email: "gsdf@gmail.com", phone: "+6562626" },
  { id: 2, name: "John Wick", email: "gsdf@gmail.com", phone: "+6562626" },
  { id: 3, name: "John Wick", email: "gsdf@gmail.com", phone: "+6562626" },
  { id: 4, name: "John Wick", email: "gsdf@gmail.com", phone: "+6562626" },
  { id: 5, name: "John Wick", email: "gsdf@gmail.com", phone: "+6562626" },
];

export default function RenterConnectionDetailsPage() {
  const [selectedAgents, setSelectedAgents] = useState<number[]>([]);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const { id } = useParams();

  const toggleSelection = (id: number) => {
    setSelectedAgents((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const totalPages = 2;

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      {/* Breadcrumb + Header */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <ChevronLeft size={18} className="cursor-pointer" />
        <span>Renter Connection</span>
        <span className="text-gray-400">›</span>
        <span className="text-blue-600 font-medium">View</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#0A093D]">
          Renter Connection
        </h1>

        <button className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
          Status ⌄
        </button>
      </div>

      {/* Renter Info Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex flex-col md:flex-row items-center md:items-center justify-between">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-8">
          {/* Profile Image */}
          <div className="w-28 h-28 rounded-full overflow-hidden shrink-0">
            <Image
              src="https://i.pravatar.cc/150?img=3"
              alt="Renter photo"
              width={112}
              height={112}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col md:flex-row md:items-center gap-10 text-gray-800">
            {/* Name */}
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Name</p>
              <p className="font-medium text-lg">John Doe</p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Email</p>
              <p className="font-medium text-lg">example@gmail.com</p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Phone Number</p>
              <p className="font-medium text-lg">+8801XXXXXXX</p>
            </div>
          </div>
        </div>

        {/* Right: Badge */}
        <div className="mt-4 md:mt-0">
          <span className="px-4 py-1 border border-blue-400 text-blue-500 rounded-full text-xs font-medium">
            Tuval’s Client
          </span>
        </div>
      </div>

      {/* Agents Table */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-[#0A093D]">Agents</h2>
        <button
          disabled={selectedAgents.length === 0}
          onClick={() => setIsActionModalOpen(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            selectedAgents.length === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Action
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-[#CFE4FF] text-[#0A093D] font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" disabled className="accent-blue-600" />
                </th>
                <th className="px-4 py-3 text-left">No</th>
                <th className="px-4 py-3 text-left">Agent Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyAgents.map((agent, idx) => (
                <tr
                  key={`agent-${agent.id}`}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <label className="cursor-pointer flex items-center">
                      <input
                        name={`agent-${agent.id}`}
                        type="checkbox"
                        checked={selectedAgents.includes(agent.id)}
                        onChange={() => toggleSelection(agent.id)}
                        className="accent-blue-600 cursor-pointer"
                      />
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3">{agent.name}</td>
                  <td className="px-4 py-3">{agent.email}</td>
                  <td className="px-4 py-3">{agent.phone}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/renter-connections/${id}/connections/${agent.id}`
                          )
                        }
                        className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
                      >
                        <Eye size={16} className="text-gray-800" />
                      </button>
                      <button
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
                      >
                        <DollarSign size={16} className="text-blue-600" />
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition">
                        <X size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-3">No of Results 8 out of 100</p>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className={`flex items-center justify-center w-8 h-8 rounded-full border ${
            currentPage === 1
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          &lt;
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-8 h-8 flex items-center justify-center border rounded-md text-sm font-medium ${
              currentPage === i + 1
                ? "bg-white border-blue-500 text-blue-600"
                : "border-gray-200 hover:bg-gray-100 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className={`flex items-center justify-center w-8 h-8 rounded-full border ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          &gt;
        </button>
      </div>

      {/* Modals */}
      <TakeActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onCharge={() => {
          setIsActionModalOpen(false);
          setIsPaymentModalOpen(true);
        }}
      />

      <PaymentCheckModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </section>
  );
}
