"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Edit,
  Eraser,
  Link2,
  List,
  ListOrdered,
  Trash2,
} from "lucide-react";
import { apiClient } from "@/lib/apiClient";

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

const isProbablyHtml = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeHtml = (value: string) => {
  if (!value) return "";
  if (typeof window === "undefined") return value;

  const allowedTags = new Set([
    "a",
    "b",
    "body",
    "br",
    "div",
    "em",
    "h1",
    "h2",
    "h3",
    "i",
    "li",
    "ol",
    "p",
    "strong",
    "u",
    "ul",
    "span",
  ]);
  const allowedAttributes: Record<string, Set<string>> = {
    a: new Set(["href", "rel", "target"]),
  };

  const parser = new DOMParser();
  const doc = parser.parseFromString(value, "text/html");
  if (!doc.body) return "";

  const sanitizeNode = (node: Node) => {
    if (node.nodeType === Node.COMMENT_NODE) {
      node.parentNode?.removeChild(node);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      if (!allowedTags.has(tagName)) {
        const parent = element.parentNode;
        if (parent) {
          while (element.firstChild) {
            parent.insertBefore(element.firstChild, element);
          }
          parent.removeChild(element);
        } else {
          element.remove();
        }
        return;
      }

      [...element.attributes].forEach((attr) => {
        const attrName = attr.name.toLowerCase();
        const allowedForTag = allowedAttributes[tagName];
        if (!allowedForTag?.has(attrName)) {
          element.removeAttribute(attr.name);
          return;
        }
        if (tagName === "a" && attrName === "href") {
          const href = attr.value.trim();
          if (!/^(https?:|mailto:|tel:)/i.test(href)) {
            element.removeAttribute(attr.name);
          }
        }
      });

      if (tagName === "a") {
        element.setAttribute("rel", "noopener noreferrer");
        element.setAttribute("target", "_blank");
      }
    }

    [...node.childNodes].forEach(sanitizeNode);
  };

  sanitizeNode(doc.body);
  return doc.body.innerHTML ?? "";
};

const toEditorHtml = (value: string) => {
  if (!value) return "";
  if (isProbablyHtml(value)) return value;
  return escapeHtml(value).replace(/\n/g, "<br>");
};

const toDisplayHtml = (value: string) => sanitizeHtml(toEditorHtml(value));

const getPlainText = (value: string) =>
  value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

const RichTextEditor = ({
  value,
  onChange,
  disabled,
  placeholder,
  autoFocus = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  placeholder: string;
  autoFocus?: boolean;
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorId = useId();

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  useEffect(() => {
    if (!disabled && autoFocus) {
      editorRef.current?.focus();
    }
  }, [autoFocus, disabled]);

  const applyCommand = (command: string, value?: string) => {
    if (disabled) return;
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML ?? "");
  };

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML ?? "");
  };

  const handleCreateLink = () => {
    if (disabled) return;
    const url = window.prompt("Enter link URL");
    if (!url) return;
    applyCommand("createLink", url);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    const clipboard = event.clipboardData;
    const html = clipboard.getData("text/html");
    const text = clipboard.getData("text/plain");
    const content = html
      ? sanitizeHtml(html)
      : escapeHtml(text).replace(/\n/g, "<br>");

    document.execCommand("insertHTML", false, content);
    onChange(editorRef.current?.innerHTML ?? "");
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white">
      <div
        className="flex flex-wrap items-center gap-1 border-b border-gray-200 px-2 py-1.5"
        role="toolbar"
        aria-controls={editorId}
        aria-label="FAQ editor toolbar"
      >
        <button
          type="button"
          onClick={() => applyCommand("bold")}
          onMouseDown={(event) => event.preventDefault()}
          disabled={disabled}
          aria-label="Bold"
          className="h-8 min-w-8 rounded px-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => applyCommand("italic")}
          onMouseDown={(event) => event.preventDefault()}
          disabled={disabled}
          aria-label="Italic"
          className="h-8 min-w-8 rounded px-2 text-sm font-semibold italic text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => applyCommand("underline")}
          onMouseDown={(event) => event.preventDefault()}
          disabled={disabled}
          aria-label="Underline"
          className="h-8 min-w-8 rounded px-2 text-sm font-semibold underline text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          U
        </button>
        <div className="h-6 w-px bg-gray-200" />
        <button
          type="button"
          onClick={() => applyCommand("formatBlock", "h1")}
          onMouseDown={(event) => event.preventDefault()}
          disabled={disabled}
          aria-label="Heading 1"
          className="h-8 min-w-8 rounded px-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => applyCommand("formatBlock", "h2")}
          onMouseDown={(event) => event.preventDefault()}
          disabled={disabled}
          aria-label="Heading 2"
          className="h-8 min-w-8 rounded px-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => applyCommand("formatBlock", "h3")}
          onMouseDown={(event) => event.preventDefault()}
          disabled={disabled}
          aria-label="Heading 3"
          className="h-8 min-w-8 rounded px-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => applyCommand("formatBlock", "p")}
          onMouseDown={(event) => event.preventDefault()}
          disabled={disabled}
          aria-label="Paragraph"
          className="h-8 min-w-8 rounded px-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          P
        </button>
        <div className="h-6 w-px bg-gray-200" />
        <button
          type="button"
          onClick={() => applyCommand("insertUnorderedList")}
          onMouseDown={(event) => event.preventDefault()}
          disabled={disabled}
          aria-label="Bulleted list"
          className="h-8 w-8 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <List size={16} className="mx-auto" />
        </button>
        <button
          type="button"
          onClick={() => applyCommand("insertOrderedList")}
          onMouseDown={(event) => event.preventDefault()}
          disabled={disabled}
          aria-label="Numbered list"
          className="h-8 w-8 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <ListOrdered size={16} className="mx-auto" />
        </button>
        <button
          type="button"
          onClick={handleCreateLink}
          onMouseDown={(event) => event.preventDefault()}
          disabled={disabled}
          aria-label="Insert link"
          className="h-8 w-8 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <Link2 size={16} className="mx-auto" />
        </button>
        <button
          type="button"
          onClick={() => applyCommand("removeFormat")}
          onMouseDown={(event) => event.preventDefault()}
          disabled={disabled}
          aria-label="Clear formatting"
          className="h-8 w-8 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <Eraser size={16} className="mx-auto" />
        </button>
      </div>
      <div className="relative">
        {getPlainText(value) === "" ? (
          <span className="absolute left-3 top-2 text-sm text-gray-400 pointer-events-none">
            {placeholder}
          </span>
        ) : null}
        <div
          id={editorId}
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onPaste={handlePaste}
          role="textbox"
          aria-multiline="true"
          aria-label={placeholder}
          aria-disabled={disabled}
          aria-placeholder={placeholder}
          spellCheck
          className="min-h-[120px] w-full cursor-text rounded-b-lg bg-gray-50 px-3 py-2 text-sm text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_li]:my-1 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold"
        />
      </div>
    </div>
  );
};

export default function FaqManagementPage() {
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

  const answerText = getPlainText(newAnswer);

  const fetchFaqs = useCallback(async () => {
    try {
      setStatus("loading");
      setError(null);

      const response = await apiClient.get<{
        success: boolean;
        statusCode: number;
        message: string;
        data: FAQ[];
      }>("/faq/admin/all");

      const nextFaqs = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setFaqs(nextFaqs);
      setStatus("idle");
    } catch (err) {
      setStatus("failed");
      setError(err instanceof Error ? err.message : "Unable to load FAQs.");
    }
  }, []);

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
    if (!newQuestion.trim() || !answerText) return;

    try {
      setSaveStatus("saving");
      setError(null);

      const payload = {
        question: newQuestion.trim(),
        answer: sanitizeHtml(newAnswer.trim()),
        category: "Account",
        order:
          editId && editOrder !== null
            ? editOrder
            : Math.max(0, ...faqs.map((faq) => faq.order)) + 1,
        isActive: true,
      };

      if (editId) {
        await apiClient.put(`/faq/admin/${editId}`, payload);
      } else {
        await apiClient.post("/faq/admin", payload);
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
    setNewAnswer(toEditorHtml(sanitizeHtml(faq.answer)));
    setEditOrder(faq.order);
    setSaveStatus("idle");
    setError(null);
  };

  const deleteFAQ = async (id: string) => {
    try {
      setSaveStatus("saving");
      setError(null);

      await apiClient.delete(`/faq/admin/${id}/hard-delete`);

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
            disabled={!newQuestion.trim() || !answerText || isBusy}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              newQuestion.trim() && answerText && !isBusy
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
          <RichTextEditor
            value={newAnswer}
            onChange={setNewAnswer}
            placeholder="Enter answer"
            disabled={isBusy}
            autoFocus={!editId}
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
            <div
              className="text-sm text-gray-600 mt-1 [&_p]:mt-1 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:pl-5"
              dangerouslySetInnerHTML={{
                __html: answerText
                  ? toDisplayHtml(newAnswer)
                  : "This is a sample preview of your FAQ answer.",
              }}
            />
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
                  <div
                    className="text-sm text-gray-600 mt-1 [&_p]:mt-1 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:pl-5"
                    dangerouslySetInnerHTML={{
                      __html: toDisplayHtml(faq.answer),
                    }}
                  />
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
