"use client";

import { Lock } from "lucide-react";
import { useMemo, useState } from "react";

import {
  selectAdminRequests,
  toggleAdminRequestScope,
  type AdminRequestScope,
} from "@/store/adminRequestsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type AdminScopeToggleProps = {
  requestId: string;
  /** Current scope (from the admin list row). */
  currentScope: AdminRequestScope | undefined;
  /** Lock flag from the backend — true when the renter cannot move this
   * request back from "All Market" to "Upcoming". Admins inherit the same
   * rule; when locked the toggle is disabled. */
  locked?: boolean;
  lockReason?: string | null;
  /** Compact style for table rows; full style for the detail page. */
  variant?: "compact" | "full";
  /** Optional callback after a successful scope toggle. */
  onChanged?: (nextScope: AdminRequestScope) => void;
};

const SCOPE_OPTIONS: Array<AdminRequestScope> = ["Upcoming", "All Market"];

export function AdminScopeToggle({
  requestId,
  currentScope,
  locked = false,
  lockReason,
  variant = "compact",
  onChanged,
}: AdminScopeToggleProps) {
  const dispatch = useAppDispatch();
  const { scopeLoadingById, scopeErrorById } = useAppSelector(selectAdminRequests);
  const isLoading = Boolean(scopeLoadingById[requestId]);
  const serverError = scopeErrorById[requestId] ?? null;
  const [localError, setLocalError] = useState<string | null>(null);
  const error = localError ?? serverError;

  const activeScope: AdminRequestScope = currentScope ?? "Upcoming";
  const otherScope: AdminRequestScope = useMemo(
    () => (activeScope === "Upcoming" ? "All Market" : "Upcoming"),
    [activeScope],
  );

  const handleClick = async () => {
    if (locked) {
      setLocalError(
        lockReason
          ?? "A rental specialist is already assigned to this request.",
      );
      return;
    }
    if (isLoading) {
      return;
    }
    setLocalError(null);
    const result = await dispatch(
      toggleAdminRequestScope({ id: requestId, scope: otherScope }),
    );
    if (
      toggleAdminRequestScope.fulfilled.match(result)
      && onChanged
    ) {
      onChanged(otherScope);
    }
    else if (toggleAdminRequestScope.rejected.match(result)) {
      const message
        = (result.payload as { message?: string } | undefined)?.message
          ?? "Failed to update the request scope.";
      setLocalError(message);
    }
  };

  const isFull = variant === "full";

  return (
    <div
      className={
        isFull
          ? "flex flex-col gap-2"
          : "flex flex-col gap-1"
      }
      data-testid={`admin-scope-toggle-${requestId}`}
    >
      <div
        className={
          isFull
            ? "inline-flex items-center gap-2"
            : "inline-flex items-center gap-1.5"
        }
      >
        <div
          className={
            isFull
              ? "inline-flex rounded-full border border-gray-200 bg-gray-50 p-1"
              : "inline-flex rounded-full border border-gray-200 bg-gray-50 p-0.5"
          }
          role="group"
          aria-label="Request scope"
        >
          {SCOPE_OPTIONS.map((option) => {
            const isActive = option === activeScope;
            return (
              <span
                key={option}
                className={
                  isFull
                    ? `px-3 py-1 text-sm font-medium rounded-full transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500"
                    }`
                    : `px-2.5 py-1 text-xs font-medium rounded-full transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500"
                    }`
                }
              >
                {option}
              </span>
            );
          })}
        </div>

        {locked ? (
          <span
            className="inline-flex items-center text-amber-600"
            title={lockReason ?? "Scope switch is locked"}
            aria-label={
              lockReason ?? "Scope switch is locked for this request"
            }
          >
            <Lock size={14} />
          </span>
        ) : null}

        <button
          type="button"
          onClick={handleClick}
          disabled={locked || isLoading}
          className={
            isFull
              ? `px-3 py-1.5 text-sm rounded-md border transition ${
                locked
                  ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                  : isLoading
                    ? "border-blue-200 text-blue-400 cursor-wait bg-white"
                    : "border-blue-500 text-blue-600 hover:bg-blue-50 bg-white"
              }`
              : `text-xs font-medium px-2 py-1 rounded-md border transition ${
                locked
                  ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                  : isLoading
                    ? "border-blue-200 text-blue-400 cursor-wait bg-white"
                    : "border-blue-500 text-blue-600 hover:bg-blue-50 bg-white"
              }`
          }
        >
          {isLoading
            ? "Updating…"
            : locked
              ? "Locked"
              : `Switch to ${otherScope}`}
        </button>
      </div>

      {error ? (
        <p
          className={
            isFull
              ? "text-xs text-red-600"
              : "text-[11px] text-red-600 max-w-[180px]"
          }
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {locked && lockReason && isFull ? (
        <p className="text-xs text-amber-700 max-w-sm">{lockReason}</p>
      ) : null}
    </div>
  );
}
