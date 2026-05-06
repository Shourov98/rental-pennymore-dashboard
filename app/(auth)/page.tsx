"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { selectAuth } from "@/store/auth/authSlice";
import { useAppSelector } from "@/store/hooks";

export default function Home() {
  const router = useRouter();
  const { status, user, accessToken } = useAppSelector(selectAuth);

  useEffect(() => {
    if (status === "succeeded" && (user || accessToken)) {
      router.replace("/dashboard");
    }
  }, [accessToken, router, status, user]);

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="w-full flex mb-5 justify-center">
        <Link href="/">
          <Image
            className="w-[120px] md:w-[150px] lg:w-[180px] h-auto"
            src="/Logo_1.svg"
            alt="Logo"
            width={180}
            height={150}
          />
        </Link>
      </div>

      {/* Headings */}
      <h2 className="text-2xl sm:text-3xl font-semibold text-center text-black mb-5">
        Welcome
      </h2>

      {/* Form */}
      <div className="space-y-5 sm:space-y-6">
        {/* Login Button */}
        <Link
          href="/signin"
          className="
                w-full block text-center bg-action bg-blue-500 hover:bg-blue-700 text-text-inverted
                py-3 sm:py-3.5 rounded-xl
                transition
              "
        >
          Login
        </Link>
      </div>
    </div>
  );
}
