"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { login, selectAuth } from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function SigninPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error, user } = useAppSelector(selectAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && status === "succeeded") {
      router.push("/dashboard");
    }
  }, [router, status, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const resultAction = await dispatch(login({ email, password }));

    if (login.fulfilled.match(resultAction)) {
      router.push("/dashboard");
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

      {/* Headings */}
      <h2 className="text-2xl sm:text-3xl font-semibold text-center text-black mb-2">
        Welcome!
      </h2>
      <p className="text-text-tertiary text-center mb-6 text-sm text-black">
        To login, enter your email address
      </p>

      {/* Form */}
      <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="flex-1 text-black bg-transparent focus:outline-none text-text-secondary text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-action"
            >
              <Image
                src={
                  showPassword ? "/icons/view-closed.svg" : "/icons/view.svg"
                }
                alt={showPassword ? "Hide password" : "Show password"}
                width={20}
                height={20}
                className="w-5 h-5 text-action mr-2"
              />
            </button>
          </div>

          <div className="text-right mt-2">
            <Link
              href="/forget-password"
              className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
            >
              Forgot Password?
            </Link>
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
          disabled={status === "loading"}
        >
          {status === "loading" ? "Logging in..." : "Login"}
        </button>

        {error ? (
          <p className="text-red-600 text-sm text-center">{error}</p>
        ) : null}
      </form>
    </div>
  );
}
