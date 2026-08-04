"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Save } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface DisclaimerEditorProps {
  onSaved?: (disclaimer: string) => void;
}

const ALLOWED_TAGS = new Set(["b", "strong", "br", "p", "div"]);

const sanitizeHtml = (raw: string): string => {
  if (!raw) return "";
  if (typeof window === "undefined") return raw;

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
    // Fall through to plain-text normalization below.
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

      [...element.attributes].forEach((attr) => element.removeAttribute(attr.name));
    }
    [...node.childNodes].forEach(sanitizeNode);
  };

  sanitizeNode(body);

  const html = (body as HTMLElement).innerHTML ?? "";
  return html.replace(/<p>\s*<\/p>/gi, "").replace(/<div>\s*<\/div>/gi, "");
};

const toEditorHtml = (raw: string): string => {
  if (!raw) return "";
  if (/<[a-z][^>]*>/i.test(raw)) return raw;
  return raw.replace(/\n/g, "<br>");
};

export default function DisclaimerEditor({ onSaved }: DisclaimerEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorId = useId();

  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

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
          setLoaded(true);
        }
      } catch (err) {
        if (controller.cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load disclaimer.";
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

  // ───────── sync editor content when value loads ─────────

  useEffect(() => {
    if (editorRef.current && loaded) {
      const html = toEditorHtml(value);
      if (editorRef.current.innerHTML !== html) {
        editorRef.current.innerHTML = html;
      }
      setIsEmpty(!editorRef.current.textContent?.trim());
    }
    // Only do this on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // ───────── editor commands ─────────

  const handleInput = () => {
    const html = editorRef.current?.innerHTML ?? "";
    setValue(html);
    setIsEmpty(!editorRef.current?.textContent?.trim());
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!editorRef.current) return;

    const sanitized = sanitizeHtml(editorRef.current.innerHTML);

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      await apiClient.patch("/moving-discounts/settings/admin", {
        disclaimer: sanitized,
      });

      setValue(sanitized);
      setIsEmpty(!sanitized.replace(/<[^>]+>/g, "").trim());
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
    const html = toEditorHtml(value);
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
      setIsEmpty(!editorRef.current.textContent?.trim());
    }
    setHasChanges(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Disclaimer</h2>
          <p className="text-[11px] text-gray-500">
            Shown at the bottom of the renter Moving Discounts page.
          </p>
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

      <div className="relative border border-gray-300 rounded-md">
        {isLoading ? (
          <div className="min-h-[60px] px-2.5 py-1.5 text-xs text-gray-400">
            Loading disclaimer...
          </div>
        ) : (
          <>
            {isEmpty ? (
              <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 pointer-events-none">
                Write the disclaimer renters will see at the bottom of the
                page...
              </span>
            ) : null}
            <div
              id={editorId}
              ref={editorRef}
              contentEditable={!isLoading && !isSaving}
              onInput={handleInput}
              onBlur={handleInput}
              role="textbox"
              aria-multiline="true"
              aria-label="Disclaimer text"
              spellCheck
              className="min-h-[60px] w-full cursor-text px-2.5 py-1.5 text-xs text-gray-800 leading-relaxed focus:outline-none [&_strong]:font-bold"
            />
          </>
        )}
      </div>

      <div className="text-[11px] mt-1">
        {error ? <span className="text-red-600">{error}</span> : null}
        {success ? <span className="text-green-600">{success}</span> : null}
      </div>
    </div>
  );
}
