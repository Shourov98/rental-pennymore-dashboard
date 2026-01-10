"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import RenterPreferenceForm from "@/components/RenterPreferenceForm";
import RenterContactCard from "@/components/RenterContactCard";
import { apiClient } from "@/lib/apiClient";
import { useAppSelector } from "@/store/hooks";

type RequestDetails = {
  _id: string;
  requestId: string;
  requestName: string;
  movingDateRange?: {
    earliest?: string;
    latest?: string;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  locations?: Array<{
    borough?: string;
    neighborhoods?: string[];
  }>;
  bedrooms?: string[];
  bathrooms?: string[];
  unitFeatures?: {
    laundryInUnit?: boolean;
    privateOutdoorSpace?: boolean;
    dishwasher?: boolean;
  };
  buildingFeatures?: {
    doorman?: boolean;
    elevator?: boolean;
    laundryInBuilding?: boolean;
  };
  petPolicy?: {
    catsAllowed?: boolean;
    dogsAllowed?: boolean;
  };
  guarantorRequired?: {
    personalGuarantor?: boolean;
    thirdPartyGuarantor?: boolean;
  };
  preferences?: string[];
  renterInfo?: {
    renterId?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    profileImageUrl?: string | null;
    registrationType?: string;
    referralInfo?: {
      registrationType?: string;
      referredByAgent?: {
        referredBy?: string;
        referrerName?: string;
        referrerEmail?: string;
      };
      referredByAdmin?: {
        referredBy?: string;
        referrerName?: string;
        referrerEmail?: string;
      };
    };
  };
};

type RequestDetailsResponse = {
  success: boolean;
  message: string;
  data: RequestDetails;
  timestamp: string;
};

export default function RequestDetailsPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [request, setRequest] = useState<RequestDetails | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRequestDetails = async () => {
      try {
        setStatus("loading");
        setError(null);
        const tokenFromStorage =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
        const token = accessToken || tokenFromStorage;

        const response = await apiClient.get<RequestDetailsResponse>(
          `/pre-market/admin/requests/${requestId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          },
        );

        if (!isMounted) return;
        setRequest(response.data.data);
        setStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setStatus("failed");
        setError(
          err instanceof Error ? err.message : "Unable to load request details.",
        );
      }
    };

    if (requestId) {
      fetchRequestDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [accessToken, requestId]);

  const renter = request?.renterInfo;
  const renterName = renter?.fullName ?? "-";
  const renterFirstName =
    renterName.split(/\s+/).filter(Boolean)[0] ?? renterName;

  const formattedRequestData = useMemo(() => {
    const locations = request?.locations ?? [];
    const boroughs = locations
      .map((location) => location.borough)
      .filter((borough): borough is string => Boolean(borough));
    const neighborhoods = locations.flatMap(
      (location) => location.neighborhoods ?? [],
    );

    const formatPrice = (value?: number) =>
      value != null ? `$${value.toLocaleString()}` : "-";

    const formatDate = (value?: string) =>
      value ? new Date(value).toLocaleDateString() : "-";

    const unitFeatures: string[] = [];
    if (request?.unitFeatures?.laundryInUnit) unitFeatures.push("Laundry in unit");
    if (request?.unitFeatures?.privateOutdoorSpace)
      unitFeatures.push("Private outdoor space");
    if (request?.unitFeatures?.dishwasher) unitFeatures.push("Dishwasher");

    const buildingFeatures: string[] = [];
    if (request?.buildingFeatures?.doorman) buildingFeatures.push("Doorman");
    if (request?.buildingFeatures?.elevator) buildingFeatures.push("Elevator");
    if (request?.buildingFeatures?.laundryInBuilding)
      buildingFeatures.push("Laundry in building");

    const petPolicy: string[] = [];
    if (request?.petPolicy?.catsAllowed) petPolicy.push("Cats allowed");
    if (request?.petPolicy?.dogsAllowed) petPolicy.push("Dogs allowed");

    const guarantor: string[] = [];
    if (request?.guarantorRequired?.personalGuarantor)
      guarantor.push("Personal guarantor");
    if (request?.guarantorRequired?.thirdPartyGuarantor)
      guarantor.push("Third party guarantor");

    return {
      locations: locations.map((location) => ({
        borough: location.borough ?? "-",
        neighborhoods: location.neighborhoods ?? [],
      })),
      boroughs,
      neighborhoods,
      minPrice: formatPrice(request?.priceRange?.min),
      maxPrice: formatPrice(request?.priceRange?.max),
      earliestDate: formatDate(request?.movingDateRange?.earliest),
      latestDate: formatDate(request?.movingDateRange?.latest),
      bedrooms: request?.bedrooms ?? [],
      bathrooms: request?.bathrooms ?? [],
      unitFeatures,
      buildingFeatures,
      petPolicy,
      guarantor,
      preferences: request?.preferences ?? [],
    };
  }, [request]);

  return (
    <div className="space-y-4">
      {status === "loading" ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 text-sm text-gray-500">
          Loading request details...
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 text-sm text-red-600">
          {error}
        </div>
      ) : request ? (
        <>
          {/* Contact */}
          <RenterContactCard
            renter={{
              name: renterName,
              email: renter?.email ?? "-",
              phone: renter?.phoneNumber ?? "-",
              image: renter?.profileImageUrl ?? undefined,
              referrerName:
                renter?.referralInfo?.referredByAgent?.referrerName ??
                renter?.referralInfo?.referredByAdmin?.referrerName ??
                "Tuval Mor",
              referralType:
                renter?.referralInfo?.registrationType ??
                renter?.registrationType ??
                "admin_referral",
            }}
          />
          <section className="w-full bg-white rounded-xl shadow-sm p-6 sm:p-8 md:p-10">
            <div className="mb-8 flex flex-col gap-1">
              <div className="flex flex-col items-left justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {request.requestName ?? "-"}
                </h1>
                <span className="text-md font-semibold text-gray-700 py-1.5 rounded-lg">
                  Renter: {renterFirstName}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                Review renter’s pre-market request information
              </p>
            </div>
            <RenterPreferenceForm data={formattedRequestData} />
          </section>
        </>
      ) : null}
    </div>
  );
}
