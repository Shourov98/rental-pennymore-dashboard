"use client";

import { useState } from "react";

export default function NoticePage() {
  const [text, setText] = useState("");

  const handleCancel = () => {
    setText("");
  };

  const handleSave = () => {
    alert("Notice saved:\n\n" + text);
  };

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center px-6 py-4 mb-8">
        <h1 className="text-2xl font-semibold text-[#0A093D]">Notice</h1>

        <div className="flex gap-3 mt-3 md:mt-0">
          <button
            onClick={handleCancel}
            disabled={!text.trim()}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              text.trim()
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              text.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-3">
          Newyork City Vacancy Rate
        </h2>

        {/* Input Field */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter Text"
          rows={2}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
