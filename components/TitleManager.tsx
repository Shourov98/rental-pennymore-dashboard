"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const BASE_TITLE = "BeforeListed";

const exactTitles: Record<string, string> = {
  "/": "Welcome",
  "/signin": "Sign In",
  "/forget-password": "Forgot Password",
  "/otp-verify": "Verify OTP",
  "/reset-password": "Reset Password",
  "/pass-changed": "Password Changed",
  "/dashboard": "Dashboard",
  "/analytics": "Analytics",
  "/renters": "Renters",
  "/payments": "Payments",
  "/monthly-reports": "Monthly Reports",
  "/monthly-reports/add": "Add Monthly Report",
  "/renter-connections": "Renter Connections",
  "/agent-management": "Agent Management",
  "/faq-management": "FAQ Management",
  "/notifications": "Notifications",
  "/reports": "Reports",
  "/notice": "Notice",
  "/profile": "Profile",
  "/profile/edit": "Edit Profile",
};

const dynamicTitles: Array<{ pattern: RegExp; title: string }> = [
  { pattern: /^\/renters\/[^/]+$/, title: "Renter Details" },
  {
    pattern: /^\/renters\/[^/]+\/requests\/[^/]+$/,
    title: "Renter Request",
  },
  { pattern: /^\/payments\/[^/]+$/, title: "Payment Details" },
  {
    pattern: /^\/monthly-reports\/view\/[^/]+$/,
    title: "Monthly Report",
  },
  {
    pattern: /^\/monthly-reports\/edit\/[^/]+$/,
    title: "Edit Monthly Report",
  },
  { pattern: /^\/renter-connections\/[^/]+$/, title: "Renter Connection" },
  {
    pattern: /^\/renter-connections\/[^/]+\/connections\/[^/]+$/,
    title: "Agent Connection",
  },
  { pattern: /^\/agent-management\/[^/]+$/, title: "Agent Details" },
];

const resolveTitle = (pathname: string) => {
  if (exactTitles[pathname]) {
    return exactTitles[pathname];
  }

  for (const { pattern, title } of dynamicTitles) {
    if (pattern.test(pathname)) {
      return title;
    }
  }

  return "";
};

export default function TitleManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const pageTitle = resolveTitle(pathname);
    const nextTitle = pageTitle ? `${pageTitle} | ${BASE_TITLE}` : BASE_TITLE;

    document.title = nextTitle;
  }, [pathname]);

  return null;
}
