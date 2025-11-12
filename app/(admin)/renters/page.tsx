"use client";

import { useRouter } from "next/navigation";
import { Eye, Download } from "lucide-react";

export default function RenterManagement() {
  const router = useRouter();

  const renters = [
    {
      id: 1,
      name: "Nick Albasta",
      email: "example@gmail.com",
      phone: "+9595999659",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#0B0B2C]">Renter Management</h1>
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
              {["No", "Name", "Email", "Phone", "Actions"].map((h) => (
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
            {renters.map((renter, index) => (
              <tr
                key={renter.id}
                className="text-[#0B0B2C] border-b last:border-none hover:bg-gray-50 transition"
              >
                <td className="py-3 px-6 text-sm">
                  {String(index + 1).padStart(2, "0")}
                </td>
                <td className="py-3 px-6 text-sm">{renter.name}</td>
                <td className="py-3 px-6 text-sm">{renter.email}</td>
                <td className="py-3 px-6 text-sm">{renter.phone}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => router.push(`/renters/${renter.id}`)}
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
        <p>No of Results 8 out of 100</p>
        <div className="flex items-center gap-2">
          <button className="border rounded-full p-2 text-gray-600 hover:bg-gray-100">
            &lt;
          </button>
          <button className="border border-blue-500 text-blue-500 rounded-full w-8 h-8">
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
