"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { bootstrapAdminSession, selectAuth } from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const PUBLIC_PATHS = [
  "/",
  "/signin",
  "/forget-password",
  "/forgot-otp",
  "/reset-password",
  "/otp-verify",
  "/pass-changed",
];

const isPublicPath = (pathname: string) =>
  PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));

export default function AdminSessionBootstrap() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { accessToken, status, user } = useAppSelector(selectAuth);
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (hasBootstrapped.current) return;
    if (accessToken || user || status === "loading") return;

    hasBootstrapped.current = true;
    void dispatch(bootstrapAdminSession())
      .unwrap()
      .catch(() => {
        if (!isPublicPath(pathname)) {
          router.replace("/signin");
        }
      });
  }, [accessToken, dispatch, pathname, router, status, user]);

  return null;
}
