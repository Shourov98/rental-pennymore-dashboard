"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="w-full">
      {/* Logo */}
      <h1 className="text-3xl sm:text-4xl font-semibold text-center text-black mb-2">
        LOGO
      </h1>

      {/* Headings */}
      <h2 className="text-2xl sm:text-3xl font-semibold text-center text-black mb-5">
        Welcome
      </h2>

      {/* Form */}
      <form className="space-y-5 sm:space-y-6">
        {/* Login Button */}
        <button
          type="submit"
          onClick={() => router.push("/dashboard")}
          className="
                w-full bg-action bg-blue-500 hover:bg-blue-700 text-text-inverted
                py-3 sm:py-3.5 rounded-xl
                transition
              "
        >
          Login
        </button>
      </form>
    </div>
  );
}
