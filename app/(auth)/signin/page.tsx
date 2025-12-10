"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();

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
      <h2 className="text-2xl sm:text-3xl font-semibold text-center text-black mb-2">
        Welcome Back!
      </h2>
      <p className="text-text-tertiary text-center mb-6 text-sm text-black">
        To login, enter your email address
      </p>

      {/* Form */}
      <form className="space-y-5 sm:space-y-6">
        {/* Email */}
        <div>
          <label className="block text-gray-600 text-sm font-semibold text-text-tertiary mb-2">
            Email
          </label>
          <div className="flex items-center bg-surface-secondary border border-border-secondary rounded-xl px-4 py-3 sm:py-3.5">
            <Image
              src="/icons/mail-01.svg"
              alt="Mail icon"
              width={20}
              height={20}
              className="w-5 h-5 text-action mr-2"
            />
            <input
              type="email"
              placeholder="Enter email"
              required
              className="flex-1 text-black bg-transparent focus:outline-none text-text-secondary text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-600 text-sm font-semibold text-text-tertiary mb-2">
            Password
          </label>
          <div className="flex items-center bg-surface-secondary border border-border-secondary rounded-xl px-4 py-3 sm:py-3.5">
            <Image
              src="/icons/square-lock-01.svg"
              alt="Lock icon"
              width={20}
              height={20}
              className="w-5 h-5 text-action mr-2"
            />
            <input
              type="password"
              placeholder="Enter password"
              required
              className="flex-1 text-black bg-transparent focus:outline-none text-text-secondary text-sm sm:text-base"
            />
            <Image
              src="/icons/view.svg"
              alt="Lock icon"
              width={20}
              height={20}
              className="w-5 h-5 text-action mr-2"
            />
          </div>

          <div className="text-right mt-2">
            <a
              href="/forgot-password"
              className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
            >
              Forgot Password?
            </a>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="
            w-full bg-action bg-blue-500 hover:bg-blue-700 text-text-inverted
            py-3 sm:py-3.5 rounded-xl
            transition
          "
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-text-tertiary text-center text-sm text-black">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:text-blue-800">
            Create an account
          </a>
        </p>
      </form>
    </div>
  );
}
