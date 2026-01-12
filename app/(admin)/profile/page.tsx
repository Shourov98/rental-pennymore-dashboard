"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Lock, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useAppSelector } from "@/store/hooks";

type ProfileData = {
  fullName?: string;
  email?: string;
  phone?: string;
  referralLink?: string;
  referralCode?: string;
  profileImageUrl?: string | null;
};

type ProfileResponse = {
  success: boolean;
  message: string;
  data: ProfileData;
  timestamp: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const referralCodeValue = referralCode ?? "";

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setStatus("loading");
        setError(null);
        const tokenFromStorage =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
        const token = accessToken || tokenFromStorage;

        const response = await apiClient.get<ProfileResponse>("/user/profile", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!isMounted) return;
        setProfile(response.data.data);
        setReferralLink(response.data.data.referralLink ?? null);
        setReferralCode(response.data.data.referralCode ?? null);
        if (typeof window !== "undefined") {
          const snapshot = {
            fullName: response.data.data.fullName ?? "",
            phone: response.data.data.phone ?? "",
            profileImageUrl: response.data.data.profileImageUrl ?? null,
            referralLink: response.data.data.referralLink ?? null,
            referralCode: response.data.data.referralCode ?? null,
          };
          localStorage.setItem("profileSnapshot", JSON.stringify(snapshot));
        }
        setStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setStatus("failed");
        setError(
          err instanceof Error ? err.message : "Unable to load profile."
        );
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const handleCopyReferral = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1500);
    } catch (err) {
      setError("Unable to copy referral link.");
    }
  };

  return (
    <section
      className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6"
      data-referral-code={referralCodeValue || undefined}
    >
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm flex justify-between items-center px-6 py-4 mb-8">
        <h1 className="text-2xl font-semibold text-[#0A093D]">Profile</h1>
        <button
          onClick={() => router.push("/profile/edit")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Pencil size={16} /> Edit
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row items-start gap-8">
        {/* Profile Image */}
        <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {profile?.profileImageUrl ? (
            <Image
              src={profile.profileImageUrl}
              alt="Profile"
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-4xl font-semibold text-gray-500">
              {(profile?.fullName ?? "").trim().charAt(0).toUpperCase() || "?"}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h2>

          {status === "loading" ? (
            <p className="text-sm text-gray-500">Loading profile...</p>
          ) : profile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-sm text-gray-800">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="border-b border-gray-300 pb-1">
                  {profile.fullName ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Phone no</p>
                <p className="border-b border-gray-300 pb-1">
                  {profile.phone ?? "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <p className="border-b border-gray-300 pb-1">
                  {profile.email ?? "N/A"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-gray-500">Referral Link</p>
                <div className="flex items-center gap-3 border-b border-gray-300 pb-1">
                  <p className="break-all text-gray-800">
                    {referralLink ?? "N/A"}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyReferral}
                    disabled={!referralLink}
                    className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:underline disabled:opacity-60"
                  >
                    <Copy size={14} />
                    {isCopied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              {error ?? "No profile data available."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
