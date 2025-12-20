"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RequestCard from "@/components/RequestCard";
import RenterContactCard from "@/components/RenterContactCard";
import { apiClient } from "@/lib/apiClient";
import { useAppSelector } from "@/store/hooks";

type Listing = {
  _id: string;
  requestId: string;
  requestName: string;
  isActive: boolean;
  status: "active" | "deactive" | string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  locations?: Array<{
    borough?: string;
    neighborhoods?: string[];
  }>;
  movingDateRange?: {
    earliest?: string;
    latest?: string;
  };
};

type RenterDetails = {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  referralInfo?: {
    registrationType?: string;
    referredByAgent?: {
      referredBy?: string;
      referrerName?: string;
      referrerEmail?: string;
    };
  };
  preMarketListings?: Listing[];
  createdAt: string;
};

type RenterResponse = {
  success: boolean;
  message: string;
  data: RenterDetails;
  timestamp: string;
};

export default function RenterDetailsPage() {
  const router = useRouter();
  const { id: renterId } = useParams<{ id: string }>();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [renter, setRenter] = useState<RenterDetails | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRenter = async () => {
      try {
        setStatus("loading");
        setError(null);
        const tokenFromStorage =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
        const token = accessToken || tokenFromStorage;

        const response = await apiClient.get<RenterResponse>(
          `/renter/admin/renters/${renterId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          },
        );

        if (!isMounted) return;
        setRenter(response.data.data);
        setStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setStatus("failed");
        setError(
          err instanceof Error ? err.message : "Unable to load renter details.",
        );
      }
    };

    if (renterId) {
      fetchRenter();
    }

    return () => {
      isMounted = false;
    };
  }, [accessToken, renterId]);

  const mapDateRange = (listing?: Listing) => {
    const earliest = listing?.movingDateRange?.earliest;
    const latest = listing?.movingDateRange?.latest;
    if (!earliest || !latest) return "-";
    const earliestDate = new Date(earliest).toLocaleDateString();
    const latestDate = new Date(latest).toLocaleDateString();
    return `${earliestDate} - ${latestDate}`;
  };

  const mapLocations = (listing?: Listing) => {
    const location = listing?.locations?.[0];
    if (!location) return { borough: "-", neighborhood: "-" };
    return {
      borough: location.borough ?? "-",
      neighborhood: location.neighborhoods?.[0] ?? "-",
    };
  };

  const mapPrice = (listing?: Listing) => {
    const min = listing?.priceRange?.min;
    const max = listing?.priceRange?.max;
    if (min == null && max == null) return "-";
    const format = (value?: number) =>
      value != null ? `$${value.toLocaleString()}` : "-";
    return `${format(min)} - ${format(max)}`;
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

      {status === "loading" ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 text-sm text-gray-500">
          Loading renter details...
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 text-sm text-red-600">
          {error}
        </div>
      ) : renter ? (
        <>
          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <RenterContactCard
              renter={{
                name: renter.fullName,
                email: renter.email,
                phone: renter.phoneNumber,
                image: "https://randomuser.me/api/portraits/men/31.jpg",
                referrerName:
                  renter.referralInfo?.referredByAgent?.referrerName,
                referralType: renter.referralInfo?.registrationType ?? "normal",
              }}
            />
          </div>

          {/* REQUEST CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(renter.preMarketListings ?? []).map((listing) => {
              const { borough, neighborhood } = mapLocations(listing);
              return (
                <RequestCard
                  key={listing._id}
                  requestName={listing.requestName}
                  borough={borough}
                  neighborhood={neighborhood}
                  dateRange={mapDateRange(listing)}
                  price={mapPrice(listing)}
                  beds={0}
                  baths={0}
                  status={listing.status === "active" ? "active" : "deactive"}
                  disableActivate={listing.status !== "active"}
                  onToggleStatus={() => null}
                  onView={() =>
                    router.push(`/renters/${renterId}/requests/${listing.requestId}`)
                  }
                />
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
