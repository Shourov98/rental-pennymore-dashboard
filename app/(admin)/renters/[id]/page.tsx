"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import RequestCard from "@/components/RequestCard";

export default function RenterDetails() {
  const router = useRouter();
  const [renterPreference, setRenterPreference] = useState(false);
  const [renterInfo, setRenterInfo] = useState(false);
  const { id: renterId } = useParams<{ id: string }>();

  const renter = {
    name: "John Doe",
    email: "example@gmail.com",
    phone: "+8801XXXXXXX",
    image: "https://randomuser.me/api/portraits/men/31.jpg",
  };

  const requests = [
    {
      id: 1,
      area: "Manhattan",
      dateRange: "5/21/25 - 6/21/25",
      price: "$4,250.00",
      beds: 2,
      baths: 1,
    },
    {
      id: 2,
      area: "Brooklyn",
      dateRange: "5/25/25 - 6/25/25",
      price: "$4,100.00",
      beds: 3,
      baths: 2,
    },
    {
      id: 3,
      area: "Queens",
      dateRange: "6/01/25 - 7/01/25",
      price: "$3,950.00",
      beds: 1,
      baths: 1,
    },
    {
      id: 4,
      area: "Upper East Side",
      dateRange: "5/30/25 - 6/30/25",
      price: "$5,300.00",
      beds: 2,
      baths: 2,
    },
    {
      id: 5,
      area: "West Chelsea",
      dateRange: "6/05/25 - 7/05/25",
      price: "$4,800.00",
      beds: 3,
      baths: 2,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <ArrowLeft
            className="w-4 h-4 cursor-pointer"
            onClick={() => router.push("/admin/renters")}
          />
          <span>Renter Management</span> <span>›</span>{" "}
          <span>View Customer</span>
        </div>
        <h1 className="text-3xl font-bold text-[#0B0B2C]">Renter Management</h1>
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row gap-10 items-center md:items-start">
        <Image
          src={renter.image}
          alt="Renter"
          width={160}
          height={160}
          className="rounded-full object-cover border-4 border-gray-100 shadow-sm"
        />
        <div className="flex-1 w-full">
          <h2 className="text-xl font-semibold text-[#0B0B2C] mb-4">
            Contact Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
            <div>
              <p className="text-gray-500 text-sm mb-1">Name</p>
              <p className="font-medium text-gray-900 text-base">
                {renter.name}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Email</p>
              <p className="font-medium text-gray-900 text-base">
                {renter.email}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Phone Number</p>
              <p className="font-medium text-gray-900 text-base">
                {renter.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Preference Section */}
      {!renterPreference && !renterInfo && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-center text-[#0B0B2C] mb-4">
            Renter Preference
          </h2>
          <div className="space-y-3 text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input type="radio" name="pref" className="accent-blue-500" />
              Yes, please have the renter specialist reach out to help me secure
              on market and premarket listings.
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="pref" className="accent-blue-500" />
              Subscribe to email service.
            </label>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <RequestCard
            key={req.id}
            area={req.area}
            dateRange={req.dateRange}
            price={req.price}
            beds={req.beds}
            baths={req.baths}
            onView={() =>
              router.push(`/renters/${renterId}/requests/${req.id}`)
            }
          />
        ))}
      </div>
    </div>
  );
}
