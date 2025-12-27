"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { useAppSelector } from "@/store/hooks";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  views: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function FaqManagementPage() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "succeeded" | "failed"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editOrder, setEditOrder] = useState<number | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchFaqs = useCallback(async () => {
    try {
      setStatus("loading");
      setError(null);
      const tokenFromStorage =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const token = accessToken || tokenFromStorage;

      const response = await apiClient.get<{
        success: boolean;
        statusCode: number;
        message: string;
        data: FAQ[];
      }>("/faq/admin/all", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      setFaqs(response.data.data);
      setStatus("idle");
    } catch (err) {
      setStatus("failed");
      setError(err instanceof Error ? err.message : "Unable to load FAQs.");
    }
  }, [accessToken]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchFaqs();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchFaqs]);

  const handleClear = () => {
    setNewQuestion("");
    setNewAnswer("");
    setEditOrder(null);
    setEditId(null);
    setSaveStatus("idle");
    setError(null);
  };

  const handleSave = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    try {
      setSaveStatus("saving");
      setError(null);
      const tokenFromStorage =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const token = accessToken || tokenFromStorage;

      const payload = {
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
        category: "Account",
        order:
          editId && editOrder !== null
            ? editOrder
            : Math.max(0, ...faqs.map((faq) => faq.order)) + 1,
        isActive: true,
      };

      if (editId) {
        await apiClient.put(`/faq/admin/${editId}`, payload, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
      } else {
        await apiClient.post("/faq/admin", payload, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
      }

      await fetchFaqs();
      setSaveStatus("succeeded");
      handleClear();
    } catch (err) {
      setSaveStatus("failed");
      setError(err instanceof Error ? err.message : "Unable to save FAQ.");
    }
  };

  const startEditing = (faq: FAQ) => {
    setEditId(faq._id);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
    setEditOrder(faq.order);
    setSaveStatus("idle");
    setError(null);
  };

  const deleteFAQ = async (id: string) => {
    try {
      setSaveStatus("saving");
      setError(null);
      const tokenFromStorage =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const token = accessToken || tokenFromStorage;

      await apiClient.delete(`/faq/admin/${id}/hard-delete`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      await fetchFaqs();
      setSaveStatus("succeeded");
    } catch (err) {
      setSaveStatus("failed");
      setError(err instanceof Error ? err.message : "Unable to delete FAQ.");
    }
  };

  const isBusy = status === "loading" || saveStatus === "saving";

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center px-6 py-4 mb-8">
        <h1 className="text-2xl font-semibold text-[#0A093D]">
          FAQ Management
        </h1>

        <div className="flex gap-3 mt-3 md:mt-0">
          <button
            onClick={handleClear}
            disabled={(!newQuestion.trim() && !newAnswer.trim()) || isBusy}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              (newQuestion.trim() || newAnswer.trim()) && !isBusy
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!newQuestion.trim() || !newAnswer.trim() || isBusy}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              newQuestion.trim() && newAnswer.trim() && !isBusy
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {saveStatus === "saving"
              ? "Saving..."
              : editId
              ? "Update FAQ"
              : "Add FAQ"}
          </button>
        </div>
      </div>

      {/* FAQ Entry Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-base font-semibold text-gray-800 mb-3">
          {editId ? "Edit FAQ" : "Add New FAQ"}
        </h2>

        <div className="space-y-4">
          {/* Question */}
          <input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter question"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isBusy}
          />

          {/* Answer */}
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Enter answer"
            rows={3}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={isBusy}
          />
        </div>

        {status === "loading" ? (
          <p className="text-sm text-gray-500 mt-4">Loading FAQs...</p>
        ) : null}

        {error ? <p className="text-sm text-red-600 mt-4">{error}</p> : null}

        {saveStatus === "succeeded" ? (
          <p className="text-sm text-green-600 mt-4">
            FAQ updated successfully.
          </p>
        ) : null}

        {/* Live Preview */}
        <div className="mt-6 border-t border-gray-300 pt-4">
          <p className="text-sm text-gray-500 mb-1">Preview</p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700">
              {newQuestion.trim()
                ? newQuestion
                : "Sample: What is BeforeListed?"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {newAnswer.trim()
                ? newAnswer
                : "This is a sample preview of your FAQ answer."}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#0A093D] mb-4">All FAQs</h2>

        {faqs.length === 0 && status !== "loading" ? (
          <p className="text-gray-500 text-sm">No FAQs added yet.</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq._id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {faq.question}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => startEditing(faq)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                    disabled={isBusy}
                  >
                    <Edit size={16} className="text-blue-600" />
                  </button>

                  <button
                    onClick={() => deleteFAQ(faq._id)}
                    className="p-2 bg-gray-100 hover:bg-red-100 rounded-full"
                    disabled={isBusy}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
