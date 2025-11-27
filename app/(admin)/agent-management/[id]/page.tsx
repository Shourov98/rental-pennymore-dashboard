"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import AgentContactCard from "@/components/AgentContactCard";

export default function AgentDetailsPage() {
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
      <AgentContactCard agent={agent} />

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
