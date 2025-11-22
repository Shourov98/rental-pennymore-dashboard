"use client";

import { useRouter } from "next/navigation";
import { Eye, Download } from "lucide-react";
import { useState } from "react";

export default function AgentManagement() {
  const router = useRouter();

  const [agents, setAgents] = useState([
    {
      id: 1,
      name: "Nick Albasta",
      email: "example@gmail.com",
      phone: "+9595999659",
      access: true,
      firstMatch: "2025-01-12",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@gmail.com",
      phone: "+1 333 777 1212",
      access: false,
      firstMatch: null,
    },
    {
      id: 3,
      name: "David Miller",
      email: "david@example.com",
      phone: "+1 888 443 7721",
      access: true,
      firstMatch: null,
    },
    {
      id: 4,
      name: "Emma Stone",
      email: "emma@example.com",
      phone: "+44 555 221 453",
      access: false,
      firstMatch: "2025-02-01",
    },
  ]);

  // Toggle access state
  const handleAccessChange = (id: number, newStatus: boolean) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, access: newStatus } : agent
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#0B0B2C]">Agent Management</h1>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-2xl transition">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-blue-200 text-[#0B0B2C]">
            <tr>
              {["First Match", "Name", "Email", "Phone", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left text-sm font-semibold py-3 px-6"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {agents.map((agent) => (
              <tr
                key={agent.id}
                className="border-b border-gray-200 text-black last:border-none hover:bg-gray-50 transition"
              >
                {/* First Match */}
                <td className="py-3 px-6 text-sm">
                  {agent.firstMatch ? agent.firstMatch : "Not Yet"}
                </td>

                <td className="py-3 px-6 text-sm">{agent.name}</td>
                <td className="py-3 px-6 text-sm">{agent.email}</td>
                <td className="py-3 px-6 text-sm">{agent.phone}</td>

                {/* Actions */}
                <td className="py-3 px-6 flex items-center gap-2">
                  {/* ACTIVATE BUTTON */}
                  <button
                    disabled={agent.access}
                    onClick={() => handleAccessChange(agent.id, true)}
                    className={`px-3 py-1.5 text-sm rounded-lg 
                      ${
                        agent.access
                          ? "bg-blue-300 text-white cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }
                    `}
                  >
                    Activate
                  </button>

                  {/* DEACTIVATE BUTTON */}
                  <button
                    disabled={!agent.access}
                    onClick={() => handleAccessChange(agent.id, false)}
                    className={`px-3 py-1.5 text-sm rounded-lg 
                      ${
                        !agent.access
                          ? "bg-red-300 text-white cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }
                    `}
                  >
                    Deactivate
                  </button>

                  {/* VIEW BUTTON */}
                  <button
                    onClick={() => router.push(`/agent-management/${agent.id}`)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <Eye className="w-4 h-4 text-gray-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <p>No of Results {agents.length} out of 100</p>
        <div className="flex items-center gap-2">
          <button className="border rounded-full p-2 text-gray-600 hover:bg-gray-100">
            &lt;
          </button>
          <button className="border border-blue-500 bg-blue-300 text-blue-600 rounded-full w-8 h-8">
            1
          </button>
          <button className="border rounded-full w-8 h-8 text-gray-600 hover:bg-gray-100">
            2
          </button>
          <button className="border rounded-full p-2 text-gray-600 hover:bg-gray-100">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
