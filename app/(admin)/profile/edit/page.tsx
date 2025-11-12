"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, User, Phone, BadgeCheck } from "lucide-react";
import { useState } from "react";

export default function EditProfilePage() {
  const router = useRouter();
  const [image, setImage] = useState("https://i.pravatar.cc/150?img=3");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
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
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
            Save
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row items-start gap-10">
        {/* Profile Image */}
        <div className="relative mx-auto md:mx-0">
          <div className="w-40 h-40 rounded-full overflow-hidden">
            <Image
              src={image}
              alt="Profile"
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
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
                className="bg-transparent outline-none text-sm text-gray-800 w-full"
              />
            </div>
          </div>

          {/* License No. */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              License No.
            </p>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <BadgeCheck size={18} className="text-blue-500 mr-2" />
              <input
                type="text"
                placeholder="Enter number"
                className="bg-transparent outline-none text-sm text-gray-800 w-full"
              />
            </div>
          </div>

          {/* Brokerage Name */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Brokerage Name
            </p>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <User size={18} className="text-blue-500 mr-2" />
              <input
                type="text"
                placeholder="Name"
                className="bg-transparent outline-none text-sm text-gray-800 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
