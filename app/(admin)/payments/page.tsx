"use client";

import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const dummyPayments = [
  {
    id: 1,
    agentName: "John Wick",
    price: "$525.00",
    date: "Dec 2nd, 2025",
    status: "Pending",
  },
  {
    id: 2,
    agentName: "John Wick",
    price: "$525.00",
    date: "Dec 2nd, 2025",
    status: "Paid",
  },
];

export default function PaymentListPage() {
  const router = useRouter();
  const [payments, setPayments] = useState(dummyPayments);

  const handleDelete = (id: number) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const getStatusBadge = (status: string) => {
    const style =
      status === "Paid"
        ? "bg-green-50 text-green-700"
        : "bg-yellow-50 text-yellow-700";
    const dotColor = status === "Paid" ? "bg-green-400" : "bg-yellow-400";

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${style}`}
      >
        {status}
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      </span>
    );
  };

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#0A093D]">
          Payment Management
        </h1>
      </div>

      {/* Scrollable Table Container */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          <table className="min-w-max w-full text-sm text-gray-800 border-collapse">
            <thead className="bg-[#CFE4FF] text-[#0A093D] font-semibold">
              <tr>
                {["No", "Agent Name", "Price", "Date", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {payments.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.agentName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.price}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => router.push(`/payments/${item.id}`)}
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                      >
                        <Eye size={16} className="text-gray-800" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500">
        No of Results {payments.length} out of 100
      </p>
    </section>
  );
}
