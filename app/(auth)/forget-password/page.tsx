"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { forgotPassword, selectAuth } from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { forgotStatus, forgotError } = useAppSelector(selectAuth);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(forgotPassword({ email }));

    if (forgotPassword.fulfilled.match(result)) {
      router.push(`/otp-verify?email=${encodeURIComponent(email)}`);
    }
  };

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

      {/* Title */}
      <h2 className="text-2xl font-semibold text-center text-black mb-1">
        Forgot Password
      </h2>
      <p className="text-center text-gray-700 mb-6 text-sm sm:text-base">
        Enter your email to reset password
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-gray-600 text-sm font-semibold text-text-tertiary mb-2">
            Email
          </label>
          <div className="flex items-center bg-surface-secondary border border-border-secondary rounded-xl px-4 py-3 sm:py-3.5">
            <Image
              src="/icons/mail-01.svg"
              alt="Email icon"
              width={20}
              height={20}
              className="w-5 h-5 text-action mr-2"
            />
            <input
              type="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-gray-700 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="
            w-full bg-blue-500 hover:bg-blue-700
            text-text-inverted font-semibold
            py-3 sm:py-3.5 rounded-lg transition
          "
          disabled={forgotStatus === "loading"}
        >
          {forgotStatus === "loading" ? "Sending..." : "Next"}
        </button>

        {forgotError ? (
          <p className="text-red-600 text-sm text-center">{forgotError}</p>
        ) : null}

        {/* Back to Login */}
        <div className="flex items-center justify-center gap-2 text-sm sm:text-base mt-2">
          <Image
            src="/icons/arrow-left-01.svg"
            alt="Back icon"
            width={16}
            height={16}
            className="w-4 h-4"
          />
          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="text-black hover:text-blue-700 font-medium transition"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}
