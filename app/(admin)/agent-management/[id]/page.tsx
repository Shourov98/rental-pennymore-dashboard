"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AgentDetails() {
  const router = useRouter();
  const [grantFree, setGrantFree] = useState(false);

  const agent = {
    name: "John Doe",
    email: "example@gmail.com",
    phone: "+8801XXXXXXX",
    license: "56666666",
    brokerage: "Alice",
    image: "https://randomuser.me/api/portraits/men/31.jpg",
  };

  const handleToggleAccess = () => {
    setGrantFree((prev) => !prev);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <ArrowLeft
            className="w-4 h-4 cursor-pointer"
            onClick={() => router.push("/admin/agents")}
          />
          <span>Agent Management</span> <span>›</span> <span>View Agent</span>
        </div>
        <h1 className="py-5 text-3xl font-bold text-[#0B0B2C]">
          Agent Management
        </h1>
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row gap-10 items-center md:items-start">
        {/* Profile Image */}
        <div className="shrink-0">
          <Image
            src={agent.image}
            alt="Agent"
            width={160}
            height={160}
            className="rounded-full object-cover border-4 border-gray-100 shadow-sm"
          />
        </div>

        {/* Contact Info */}
        <div className="flex-1 w-full">
          <h2 className="text-xl font-semibold text-[#0B0B2C] mb-4">
            Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
            <div>
              <p className="text-gray-500 text-sm mb-1">Name</p>
              <p className="font-medium text-gray-900 text-base">
                {agent.name}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">Email</p>
              <p className="font-medium text-gray-900 text-base">
                {agent.email}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">Phone Number</p>
              <p className="font-medium text-gray-900 text-base">
                {agent.phone}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">License No.</p>
              <p className="font-medium text-gray-900 text-base">
                {agent.license}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">Brokerage Name</p>
              <p className="font-medium text-gray-900 text-base">
                {agent.brokerage}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grant Access */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-[#0B0B2C]">
            Grant Agent Access
          </h2>
          <p className="text-gray-500 text-sm">
            Enable agents to connect with renters for free matches.
          </p>
        </div>
        <button
          onClick={handleToggleAccess}
          className={`px-6 py-2.5 text-sm font-medium rounded-2xl transition ${
            grantFree
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {grantFree ? "Revoke Access" : "Grant Access"}
        </button>
      </div>
    </div>
  );
}
