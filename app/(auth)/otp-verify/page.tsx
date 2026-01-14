"use client";

import { Suspense, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  selectAuth,
  verifyPasswordOtp,
  resendPasswordOtp,
} from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function OtpVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const {
    resetEmail,
    verifyStatus,
    verifyError,
    resendStatus,
  } = useAppSelector(selectAuth);
  const emailFromQuery = searchParams.get("email");
  const email = emailFromQuery || resetEmail || "";
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // only single digit numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input automatically
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 4 || !email) {
      return;
    }

    const result = await dispatch(verifyPasswordOtp({ email, otp: code }));
    if (verifyPasswordOtp.fulfilled.match(result)) {
      router.push(
        `/reset-password?email=${encodeURIComponent(email)}&otp=${code}`,
      );
    }
  };

  const handleResend = async () => {
    if (!email) return;
    await dispatch(resendPasswordOtp({ email }));
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
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-1">
        Verify Code
      </h2>
      <p className="text-center text-gray-800 mb-6 text-sm sm:text-base">
        We sent an OTP code to your email <br />
        <span className="text-blue-700 font-medium">
          {email || "your email"}
        </span>
        Enter the code below to verify within 1 min.
      </p>

      {/* OTP Input Fields */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6"
      >
        <div className="flex justify-center gap-3 sm:gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="
                w-12 sm:w-14 h-12 sm:h-14 text-center text-lg sm:text-xl font-semibold
                border border-border-secondary rounded-xl
                bg-surface-secondary focus:outline-none focus:border-blue-500
                text-gray-800
              "
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="
            w-full bg-blue-500 hover:bg-blue-700
            text-text-inverted font-semibold
            py-3 sm:py-3.5 rounded-lg transition
          "
          disabled={verifyStatus === "loading" || !email}
        >
          {verifyStatus === "loading" ? "Verifying..." : "Next"}
        </button>

        {verifyError ? (
          <p className="text-red-600 text-sm text-center">{verifyError}</p>
        ) : null}

        {/* Resend and Back */}
        <div className="flex flex-col items-center gap-3 text-sm sm:text-base mt-1">
          <p className="text-gray-700">
            Don’t receive OTP?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-blue-500 hover:text-blue-700 font-semibold disabled:opacity-60"
              disabled={resendStatus === "loading" || !email}
            >
              {resendStatus === "loading"
                ? "Resending..."
                : "Resend again"}
            </button>
          </p>

          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition"
          >
            <Image
              src="/icons/arrow-left-01.svg"
              alt="Back icon"
              width={20}
              height={20}
              className="w-4 h-4"
            />
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default function OtpVerifyPage() {
  return (
    <Suspense fallback={<div className="w-full" />}>
      <OtpVerifyContent />
    </Suspense>
  );
}
