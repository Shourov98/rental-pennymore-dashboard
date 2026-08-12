"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

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
  /** Compact style for table rows; full style for the detail page. */
  variant?: "compact" | "full";
  /** Optional callback after a successful scope toggle. */
  onChanged?: (nextScope: AdminRequestScope) => void;
  /**
   * When true the toggle is read-only. Used for "Upcoming (M)" requests where
   * the listing already has matched grants — the scope is locked and cannot be
   * flipped without consequences. Renders a gray static pill with a lock icon.
   */
  locked?: boolean;
  /** Optional tooltip / aria-label for the locked state. */
  lockedReason?: string | null;
};

export function AdminScopeToggle({
  requestId,
  currentScope,
  variant = "compact",
  onChanged,
  locked = false,
  lockedReason = null,
}: AdminScopeToggleProps) {
  const dispatch = useAppDispatch();
  const { scopeLoadingById, scopeErrorById } = useAppSelector(selectAdminRequests);
  const isLoading = Boolean(scopeLoadingById[requestId]);
  const serverError = scopeErrorById[requestId] ?? null;
  const [localError, setLocalError] = useState<string | null>(null);
  const error = localError ?? serverError;

  const activeScope: AdminRequestScope = currentScope ?? "Upcoming";
  const otherScope: AdminRequestScope =
    activeScope === "Upcoming" ? "All Market" : "Upcoming";
  const isAllMarketActive = activeScope === "All Market";

  const handleToggle = async () => {
    if (isLoading || locked) {
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

  // Sizing. Labels sit fixed at the left/right edges with a small knob
  // floating between them. Track background stays neutral; the active label
  // is blue and the inactive label is gray so the user reads the state from
  // the labels themselves, not the track color.
  const containerWidth = isFull ? 180 : 150;
  const containerHeight = isFull ? 30 : 26;
  const labelText = isFull ? "text-xs" : "text-[11px]";
  const knobSize = isFull ? 14 : 12;
  const knobLeftEdge = 6;
  const knobTrailingLeft = containerWidth - knobSize - knobLeftEdge;
  const labelInsetX = 10;
  const spinnerSize = isFull ? 10 : 8;
  const lockIconSize = isFull ? 14 : 12;

  // Locked state: gray static pill with a lock icon above. Both labels gray,
  // no blue knob — matches the "Upcoming (M)" visual from the design.
  if (locked) {
    const lockTitle
      = lockedReason
        ?? "Scope is locked because this request has matched agents.";

    return (
      <div
        className={
          isFull
            ? "flex flex-col items-end gap-1.5"
            : "flex flex-col items-center gap-1"
        }
        data-testid={`admin-scope-toggle-${requestId}`}
      >
        <span
          title={lockTitle}
          aria-label={lockTitle}
          className="inline-flex"
        >
          <Lock
            size={lockIconSize}
            className="text-gray-500"
            aria-hidden="true"
          />
        </span>
        <div
          role="img"
          aria-label={`Scope locked. ${lockTitle}`}
          title={lockTitle}
          className="relative inline-flex items-center rounded-full bg-gray-200 select-none"
          style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
        >
          <span
            className={[
              "absolute inset-y-0 left-0 flex items-center font-medium whitespace-nowrap text-gray-500",
              labelText,
            ].join(" ")}
            style={{ paddingLeft: `${labelInsetX}px` }}
          >
            All Market
          </span>
          <span
            className={[
              "absolute inset-y-0 right-0 flex items-center font-medium whitespace-nowrap text-gray-500",
              labelText,
            ].join(" ")}
            style={{ paddingRight: `${labelInsetX}px` }}
          >
            Upcoming
          </span>
        </div>

        {error ? (
          <p
            className={
              isFull
                ? "text-xs text-red-600"
                : "text-[11px] text-red-600 max-w-[200px] text-center"
            }
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  const isSwitchDisabled = isLoading;

  return (
    <div
      className={
        isFull
          ? "flex flex-col items-end gap-1.5"
          : "flex flex-col items-center gap-1"
      }
      data-testid={`admin-scope-toggle-${requestId}`}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={isSwitchDisabled}
        aria-disabled={isSwitchDisabled}
        aria-checked={isAllMarketActive}
        role="switch"
        aria-label={`Toggle scope. Currently ${activeScope}.`}
        className={[
          "relative inline-flex items-center rounded-full select-none transition cursor-pointer bg-gray-200",
          isSwitchDisabled ? "opacity-80" : "",
        ].join(" ")}
        style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
      >
        <span
          className={[
            "absolute inset-y-0 left-0 flex items-center font-medium whitespace-nowrap",
            labelText,
            isAllMarketActive ? "text-blue-600" : "text-gray-500",
          ].join(" ")}
          style={{ paddingLeft: `${labelInsetX}px` }}
        >
          All Market
        </span>

        <span
          className={[
            "absolute inset-y-0 right-0 flex items-center font-medium whitespace-nowrap",
            labelText,
            isAllMarketActive ? "text-gray-500" : "text-blue-600",
          ].join(" ")}
          style={{ paddingRight: `${labelInsetX}px` }}
        >
          Upcoming
        </span>

        <span
          className={[
            "absolute top-1/2 -translate-y-1/2 rounded-full bg-blue-600 shadow transition-all duration-200 ease-out",
            isLoading ? "opacity-70" : "",
          ].join(" ")}
          style={{
            width: `${knobSize}px`,
            height: `${knobSize}px`,
            left: `${isAllMarketActive ? knobLeftEdge : knobTrailingLeft}px`,
          }}
        >
          {isLoading ? (
            <span
              className="absolute inset-0 m-auto rounded-full border-2 border-white border-t-transparent animate-spin"
              style={{ width: `${spinnerSize}px`, height: `${spinnerSize}px` }}
              aria-hidden="true"
            />
          ) : null}
        </span>
      </button>

      {error ? (
        <p
          className={
            isFull
              ? "text-xs text-red-600"
              : "text-[11px] text-red-600 max-w-[200px] text-center"
          }
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
