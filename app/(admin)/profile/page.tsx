"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Lock } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
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
        <div className="w-40 h-40 rounded-full overflow-hidden">
          <Image
            src="https://i.pravatar.cc/150?img=3"
            alt="Profile"
            width={160}
            height={160}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-sm text-gray-800">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="border-b border-gray-300 pb-1">John Doe</p>
            </div>
            <div>
              <p className="text-gray-500">Phone no</p>
              <p className="border-b border-gray-300 pb-1">+1 9592626</p>
            </div>

            <div>
              <p className="text-gray-500">License No.</p>
              <p className="border-b border-gray-300 pb-1">561616</p>
            </div>
            <div>
              <p className="text-gray-500">Brokerage name</p>
              <p className="border-b border-gray-300 pb-1">Alice</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-gray-500">Email</p>
              <p className="border-b border-gray-300 pb-1">john@gmail.com</p>
            </div>
          </div>

          {/* Change Password */}
          <button className="mt-6 flex items-center gap-2 text-blue-600 font-medium text-sm hover:underline">
            <Lock size={16} /> Change Password →
          </button>
        </div>
      </div>
    </section>
  );
}
