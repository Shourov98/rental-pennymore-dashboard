"use client";

import Image from "next/image";

export interface RenterContactCardProps {
  renter: {
    image?: string;
    name: string;
    email: string;
    phone: string;
    referrerName?: string;
    referralType?: "normal" | "admin_referral" | "agent_referral" | string;
  };
}

export default function RenterContactCard({ renter }: RenterContactCardProps) {
  const initial = renter.name.trim().charAt(0).toUpperCase() || "?";
  const formatAgentName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    if (!firstName) return fullName;
    return `${firstName[0]}. ${lastName}`;
  };

  const normalizedReferralType = renter.referralType?.toLowerCase();
  const isAgentReferral =
    normalizedReferralType === "agent_referral" ||
    normalizedReferralType === "agent";
  const isAdminReferral =
    normalizedReferralType === "admin_referral" ||
    normalizedReferralType === "admin";

  const referralLabel = isAgentReferral
    ? renter.referrerName
      ? formatAgentName(renter.referrerName)
      : "None"
    : isAdminReferral
      ? renter.referrerName
        ? formatAgentName(renter.referrerName)
        : "Admin"
      : "None";

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row gap-10 items-center md:items-start">
      {/* Profile Image */}
      <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-gray-100 shadow-sm">
        {renter.image ? (
          <Image
            src={renter.image}
            alt="Renter"
            width={160}
            height={160}
            className="rounded-full object-cover w-full h-full"
          />
        ) : (
          <span className="text-4xl font-semibold text-gray-500">
            {initial}
          </span>
        )}
      </div>

      {/* Contact Info */}
      <div className="flex-1 w-full">
        <h2 className="text-xl font-semibold text-[#0B0B2C] mb-4">
          Contact Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
          {/* Name */}
          <div>
            <p className="text-gray-500 text-sm mb-1">Name</p>
            <p className="font-medium text-gray-900 text-base">{renter.name}</p>
          </div>

          {/* Email */}
          <div>
            <p className="text-gray-500 text-sm mb-1">Email</p>
            <p className="font-medium text-gray-900 text-base">
              {renter.email}
            </p>
          </div>

          {/* Phone */}
          <div>
            <p className="text-gray-500 text-sm mb-1">Phone Number</p>
            <p className="font-medium text-gray-900 text-base">
              {renter.phone}
            </p>
          </div>

          {/* Badge */}
          <div className="mt-4 md:mt-0">
            <span className="px-4 py-1 border border-blue-400 text-blue-500 rounded-full text-xs font-medium">
              {referralLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
