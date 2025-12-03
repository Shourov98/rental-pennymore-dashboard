"use client";

import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function FaqManagementPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: 1,
      question: "What is BeforeListed?",
      answer:
        "BeforeListed is a pre-market rental platform that connects renters with agents before listings hit the market.",
    },
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const handleClear = () => {
    setNewQuestion("");
    setNewAnswer("");
    setEditId(null);
  };

  const handleSave = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    if (editId !== null) {
      // Update existing
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === editId
            ? { ...f, question: newQuestion, answer: newAnswer }
            : f
        )
      );
    } else {
      // Create new
      setFaqs((prev) => [
        ...prev,
        {
          id: Date.now(),
          question: newQuestion,
          answer: newAnswer,
        },
      ]);
    }

    handleClear();
  };

  const startEditing = (faq: FAQ) => {
    setEditId(faq.id);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
  };

  const deleteFAQ = (id: number) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

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
            disabled={!newQuestion.trim() && !newAnswer.trim()}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              newQuestion.trim() || newAnswer.trim()
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!newQuestion.trim() || !newAnswer.trim()}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              newQuestion.trim() && newAnswer.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {editId ? "Update FAQ" : "Add FAQ"}
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
          />

          {/* Answer */}
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Enter answer"
            rows={3}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

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

        {faqs.length === 0 ? (
          <p className="text-gray-500 text-sm">No FAQs added yet.</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
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
                  >
                    <Edit size={16} className="text-blue-600" />
                  </button>

                  <button
                    onClick={() => deleteFAQ(faq.id)}
                    className="p-2 bg-gray-100 hover:bg-red-100 rounded-full"
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
