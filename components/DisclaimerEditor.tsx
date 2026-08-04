"use client";

import { useEffect, useRef, useState } from "react";
import { Save } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface DisclaimerEditorProps {
  onSaved?: (disclaimer: string) => void;
}

const ALLOWED_TAGS = new Set(["b", "strong", "br", "p", "div"]);

const sanitizeHtml = (raw: string): string => {
  if (!raw) return "";
  if (typeof window === "undefined") return raw;

  // Plain text (no HTML tags) — pass through as-is
  if (!/<[a-z][^>]*>/i.test(raw)) {
    return raw;
  }

  let body: HTMLElement | null = null;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, "text/html");
    body = (doc.body as HTMLElement) ?? null;

    if (!body || !body.firstChild) {
      const text = (body?.textContent ?? "").trim();
      if (!text) return raw.replace(/<[^>]+>/g, "");
      return body.textContent ?? "";
    }
  } catch {
    return raw;
  }
  if (!body) return raw;

  const sanitizeNode = (node: Node) => {
    if (node.nodeType === Node.COMMENT_NODE) {
      node.parentNode?.removeChild(node);
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      // Skip the root body element — sanitize its children only
      if (tagName === "body") {
        [...element.childNodes].forEach(sanitizeNode);
        return;
      }

      if (!ALLOWED_TAGS.has(tagName)) {
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

      [...element.attributes].forEach((attr) =>
        element.removeAttribute(attr.name),
      );
    }
    [...node.childNodes].forEach(sanitizeNode);
  };

  sanitizeNode(body);

  const html = (body as HTMLElement).innerHTML ?? "";
  return html.replace(/<p>\s*<\/p>/gi, "").replace(/<div>\s*<\/div>/gi, "");
};

export default function DisclaimerEditor({ onSaved }: DisclaimerEditorProps) {
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const initialValueRef = useRef<string>("");

  // ───────── load existing disclaimer ─────────

  useEffect(() => {
    const controller = { cancelled: false };

    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get<{
          success: boolean;
          data: { disclaimer?: string };
        }>("/moving-discounts/settings/admin");

        if (!controller.cancelled) {
          const text = response.data?.data?.disclaimer ?? "";
          setValue(text);
          initialValueRef.current = text;
          setLoaded(true);
        }
      } catch (err) {
        if (controller.cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load disclaimer.";
        setError(message);
        setLoaded(true);
      } finally {
        if (!controller.cancelled) setIsLoading(false);
      }
    };

    loadSettings();
    return () => {
      controller.cancelled = true;
    };
  }, []);

  // ───────── editor handlers ─────────

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setValue(next);
    setHasChanges(next !== initialValueRef.current);
  };

  const handleSave = async () => {
    const sanitized = sanitizeHtml(value);

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      await apiClient.patch("/moving-discounts/settings/admin", {
        disclaimer: sanitized,
      });

      initialValueRef.current = sanitized;
      setValue(sanitized);
      setHasChanges(false);
      setSuccess("Disclaimer saved.");
      onSaved?.(sanitized);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save disclaimer.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (typeof window === "undefined") return;
    if (!window.confirm("Discard unsaved changes?")) return;
    setValue(initialValueRef.current);
    setHasChanges(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Disclaimer</h2>
          {/* <p className="text-[11px] text-gray-500">
            Shown at the bottom of the renter Moving Discounts page. Use{" "}
            <code className="bg-gray-100 px-1 rounded">&lt;strong&gt;...&lt;/strong&gt;</code>{" "}
            or <code className="bg-gray-100 px-1 rounded">&lt;b&gt;...&lt;/b&gt;</code>{" "}
            for bold.
          </p> */}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={!hasChanges || isSaving}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              hasChanges && !isSaving
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              hasChanges && !isSaving
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Save size={14} />
            {isSaving ? "Saving..." : "Save disclaimer"}
          </button>
        </div>
      </div>

      <div className="border border-gray-300 rounded-md">
        {isLoading ? (
          <div className="min-h-[60px] px-2.5 py-1.5 text-xs text-gray-400">
            Loading disclaimer...
          </div>
        ) : (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder="Write the disclaimer renters will see at the bottom of the page..."
            disabled={isSaving}
            rows={3}
            maxLength={5000}
            className="block w-full min-h-[60px] resize-y bg-transparent px-2.5 py-1.5 text-xs text-gray-800 leading-relaxed placeholder:text-gray-400 focus:outline-none"
          />
        )}
      </div>

      <div className="text-[11px] mt-1 flex items-center gap-3">
        <span className="text-gray-400">{value.length}/5000 characters</span>
        {error ? <span className="text-red-600">{error}</span> : null}
        {success ? <span className="text-green-600">{success}</span> : null}
      </div>
    </div>
  );
}
