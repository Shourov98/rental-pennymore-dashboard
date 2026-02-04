"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

type NoticeResponse = {
  success: boolean;
  message: string;
  data: {
    _id: string;
    content: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  timestamp: string;
};

export default function NoticePage() {
  const [text, setText] = useState("");
  const [initialText, setInitialText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "succeeded" | "failed"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchNotice = async () => {
      try {
        setStatus("loading");
        setError(null);

        const response = await apiClient.get<NoticeResponse>("/notice/admin");

        if (!isMounted) return;
        setText(response.data.data.content ?? "");
        setInitialText(response.data.data.content ?? "");
        setStatus("idle");
      } catch (err) {
        if (!isMounted) return;
        setStatus("failed");
        setError(err instanceof Error ? err.message : "Unable to load notice.");
      }
    };

    fetchNotice();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCancel = () => {
    setText(initialText);
    setSaveStatus("idle");
    setError(null);
  };

  const handleSave = async () => {
    try {
      setSaveStatus("saving");
      setError(null);

      const response = await apiClient.put<NoticeResponse>(
        "/notice/admin",
        { content: text.trim() });

      setText(response.data.data.content ?? text.trim());
      setInitialText(response.data.data.content ?? text.trim());
      setSaveStatus("succeeded");
    } catch (err) {
      setSaveStatus("failed");
      setError(err instanceof Error ? err.message : "Unable to save notice.");
    }
  };

  const isBusy = status === "loading" || saveStatus === "saving";
  const isDirty = text.trim() !== initialText.trim();

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center px-6 py-4 mb-8">
        <h1 className="text-2xl font-semibold text-[#0A093D]">Notice</h1>

        <div className="flex gap-3 mt-3 md:mt-0">
          <button
            onClick={handleCancel}
            disabled={!isDirty || isBusy}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              isDirty && !isBusy
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!text.trim() || !isDirty || isBusy}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              text.trim() && isDirty && !isBusy
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {saveStatus === "saving" ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-3">
          Headline text:
        </h2>

        {status === "loading" ? (
          <p className="text-sm text-gray-500 mb-3">Loading notice...</p>
        ) : null}

        {error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}

        {saveStatus === "succeeded" ? (
          <p className="text-sm text-green-600 mb-3">
            Notice updated successfully.
          </p>
        ) : null}

        {/* Input Field */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter Text"
          rows={2}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          disabled={status === "loading"}
        />

        {/* View Section */}
        <div className="mt-5 border-t border-gray-300 pt-4">
          <p className="text-sm text-gray-500 mb-1">View of above field</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {text.trim()
              ? text
              : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim."}
          </p>
        </div>
      </div>
    </section>
  );
}
