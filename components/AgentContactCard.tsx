"use client";

import Image from "next/image";

interface AgentContactCardProps {
  agent: {
    image: string;
    name: string;
    email: string;
    phone: string;
    license: string;
    brokerage: string;
  };
}

export default function AgentContactCard({ agent }: AgentContactCardProps) {
  return (
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
            <p className="font-medium text-gray-900 text-base">{agent.name}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-1">Email</p>
            <p className="font-medium text-gray-900 text-base">{agent.email}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-1">Phone Number</p>
            <p className="font-medium text-gray-900 text-base">{agent.phone}</p>
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
  );
}
