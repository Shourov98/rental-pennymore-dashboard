"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { selectAuth } from "@/store/auth/authSlice";
import { useAppSelector } from "@/store/hooks";

export default function AdminDashboard() {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const { user } = useAppSelector(selectAuth);

  const referralLink = user?.referralLink ?? "";

  const handleCopy = async () => {
    if (!referralLink) return;
    setCopyError(null);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(referralLink);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = referralLink;
        textArea.style.position = "fixed";
        textArea.style.top = "-1000px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (!copied) {
          throw new Error("Copy failed");
        }
      }
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    } catch {
      setCopyError("Unable to copy link.");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Title */}
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B0B2C]">
          Dashboard
        </h1>
      </div>

      {/* Special Link Section */}
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <p className="font-semibold text-[#0B0B2C] text-sm">Special Link</p>
            <p className="text-gray-500 text-sm">
              This link is for special customers
            </p>
          </div>

          <button
            onClick={handleCopy}
            disabled={!referralLink}
            className="flex items-center justify-center sm:justify-start gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 text-sm font-medium rounded-2xl transition w-full sm:w-auto"
          >
            <Copy className="w-4 h-4" />
            {copySuccess ? "Copied!" : "Copy Link"}
          </button>
        </div>

        <input
          type="text"
          readOnly
          value={referralLink}
          className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none"
        />
        {copyError ? <p className="text-sm text-red-600">{copyError}</p> : null}
      </div>

      {/* <MonthlyBreakdown /> */}
    </div>
  );
}
