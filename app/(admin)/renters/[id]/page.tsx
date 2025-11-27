"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import RequestCard from "@/components/RequestCard";
import Image from "next/image";
import RenterContactCard from "@/components/RenterContactCard";

interface Request {
  id: number;
  requestName: string;
  borough: string;
  neighborhood: string;
  dateRange: string;
  price: string;
  beds: number;
  baths: number;
  status: "active" | "deactive";
}

export default function RenterDetails() {
  const router = useRouter();
  const { id: renterId } = useParams<{ id: string }>();

  // -----------------------------
  // INITIAL REQUEST DATA
  // -----------------------------
  const renter = {
    name: "John Doe",
    email: "example@gmail.com",
    phone: "+8801XXXXXXX",
    image: "https://randomuser.me/api/portraits/men/31.jpg",
    referrerName: "Tuval Mor",
  };

  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      requestName: "BeforeListed-1",
      borough: "Manhattan",
      neighborhood: "West Chelsea",
      dateRange: "5/21/25 - 6/21/30",
      price: "$4,250.00",
      beds: 2,
      baths: 1,
      status: "active",
    },
    {
      id: 2,
      requestName: "BeforeListed-2",
      borough: "Brooklyn",
      neighborhood: "Williamsburg",
      dateRange: "5/25/25 - 1/01/24",
      price: "$4,100.00",
      beds: 3,
      baths: 2,
      status: "active",
    },
    {
      id: 3,
      requestName: "BeforeListed-3",
      borough: "Queens",
      neighborhood: "Astoria",
      dateRange: "1/01/24 - 1/01/25",
      price: "$3,950.00",
      beds: 1,
      baths: 1,
      status: "deactive",
    },
    {
      id: 4,
      requestName: "BeforeListed-4",
      borough: "Upper East Side",
      neighborhood: "Yorkville",
      dateRange: "7/01/25 - 8/01/25",
      price: "$5,300.00",
      beds: 2,
      baths: 2,
      status: "deactive",
    },
    {
      id: 5,
      requestName: "BeforeListed-5",
      borough: "West Chelsea",
      neighborhood: "Hudson Yards",
      dateRange: "6/01/25 - 6/30/25",
      price: "$4,800.00",
      beds: 3,
      baths: 2,
      status: "active",
    },
  ]);

  // -----------------------------
  // DATE EXPIRED CHECK
  // -----------------------------
  const isExpired = (dateRange: string) => {
    const [, end] = dateRange.split(" - ");
    const endDate = new Date(end);
    const today = new Date();

    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return today > endDate;
  };

  // -----------------------------
  // ACTIVATE / DEACTIVATE BUTTON
  // -----------------------------
  const toggleRequestStatus = (id: number) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;

        const expired = isExpired(req.dateRange);
        if (expired) {
          return { ...req, status: "deactive" };
        }

        return {
          ...req,
          status: req.status === "active" ? "deactive" : "active",
        };
      })
    );
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <ArrowLeft
            className="w-4 h-4 cursor-pointer"
            onClick={() => router.push("/admin/renters")}
          />
          <span>Renter Management › View Customer</span>
        </div>
        <h1 className="text-3xl font-bold text-[#0B0B2C]">Renter Management</h1>
      </div>

      {/* Contact */}
      <RenterContactCard renter={renter} />

      {/* REQUEST CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => {
          const expired = isExpired(req.dateRange);

          return (
            <RequestCard
              key={req.id}
              requestName={req.requestName}
              borough={req.borough}
              neighborhood={req.neighborhood}
              dateRange={req.dateRange}
              price={req.price}
              beds={req.beds}
              baths={req.baths}
              status={req.status}
              disableActivate={expired}
              onToggleStatus={() => toggleRequestStatus(req.id)}
              onView={() =>
                router.push(`/renters/${renterId}/requests/${req.id}`)
              }
            />
          );
        })}
      </div>
    </div>
  );
}
