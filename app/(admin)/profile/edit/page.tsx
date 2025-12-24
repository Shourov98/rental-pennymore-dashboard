"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, User, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useAppSelector } from "@/store/hooks";

type ProfileData = {
  fullName?: string;
  phone?: string;
  profileImage?: string | null;
};

type ProfileResponse = {
  success: boolean;
  message: string;
  data: ProfileData;
  timestamp: string;
};

type UploadResponse = {
  success?: boolean;
  message?: string;
  data?: {
    profileImage?: string;
    url?: string;
  };
};

export default function EditProfilePage() {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (typeof window !== "undefined") {
      const cachedProfile = localStorage.getItem("profileSnapshot");
      if (cachedProfile) {
        try {
          const parsed = JSON.parse(cachedProfile) as {
            fullName?: string;
            phone?: string;
            profileImage?: string | null;
          };
          setFullName(parsed.fullName ?? "");
          setPhoneNumber(parsed.phone ?? "");
          if (parsed.profileImage) {
            setImage(parsed.profileImage);
          }
        } catch {
          localStorage.removeItem("profileSnapshot");
        }
      }
    }

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
        setFullName(response.data.data.fullName ?? "");
        setPhoneNumber(response.data.data.phone ?? "");
        if (response.data.data.profileImage) {
          setImage(response.data.data.profileImage);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setImageFile(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const tokenFromStorage =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const token = accessToken || tokenFromStorage;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadResponse = await apiClient.post<UploadResponse>(
          "/file/upload-profile-image",
          formData,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const uploadedUrl =
          uploadResponse.data?.data?.profileImage ??
          uploadResponse.data?.data?.url;
        if (uploadedUrl) {
          setImage(uploadedUrl);
        }
      }

      await apiClient.put(
        "/user/profile",
        {
          fullName,
          phoneNumber,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      router.push("/profile");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm flex justify-between items-center px-6 py-4 mb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft
            size={18}
            className="cursor-pointer"
            onClick={() => router.push("/profile")}
          />
          <span>Profile</span>
          <span className="text-gray-400">›</span>
          <span className="text-blue-600 font-medium">Edit Profile</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/profile")}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || status === "loading"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row items-start gap-10">
        {/* Profile Image */}
        <div className="relative mx-auto md:mx-0">
          <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {image ? (
              <Image
                src={image}
                alt="Profile"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-4xl font-semibold text-gray-500">
                {(fullName ?? "").trim().charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </div>

          {/* Upload Icon */}
          <label
            htmlFor="upload"
            className="absolute bottom-2 right-3 bg-white border border-gray-300 shadow-sm p-2 rounded-full cursor-pointer hover:bg-gray-50 transition"
          >
            <Camera size={16} className="text-gray-700" />
            <input
              id="upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Input Fields */}
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-1 gap-x-10 gap-y-5">
          {/* Full Name */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Full Name</p>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <User size={18} className="text-blue-500 mr-2" />
              <input
                type="text"
                placeholder="Name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="bg-transparent outline-none text-sm text-gray-800 w-full"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Phone no.</p>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <Phone size={18} className="text-blue-500 mr-2" />
              <input
                type="text"
                placeholder="Phone no"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className="bg-transparent outline-none text-sm text-gray-800 w-full"
              />
            </div>
          </div>
          {status === "loading" ? (
            <p className="text-sm text-gray-500">Loading profile...</p>
          ) : null}
          {error ? (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
