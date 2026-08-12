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
   * When true the toggle is read-only. The knob stays in the position of the
   * current scope but turns gray instead of blue, both labels turn gray, and
   * a small lock icon shows above the pill.
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

  // Sizing. The pill itself only holds the track + knob; labels live outside
  // it on the left/right as siblings. Pill width is intentionally small so
  // the labels can breathe — no clipping of "Upcoming" by the knob.
  const pillWidth = isFull ? 56 : 46;
  const pillHeight = isFull ? 26 : 22;
  const labelText = isFull ? "text-xs" : "text-[11px]";
  const knobSize = isFull ? 18 : 16;
  const knobLeftEdge = 3;
  const knobRightEdge = pillWidth - knobSize - knobLeftEdge;
  const spinnerSize = isFull ? 10 : 8;
  const lockIconSize = isFull ? 12 : 11;

  // Knob position: hugs the active side (right for Upcoming, left for
  // All Market). When locked the knob sits in the centre so neither side is
  // visually implied.
  const knobLeftPosition = locked
    ? (pillWidth - knobSize) / 2
    : isAllMarketActive ? knobLeftEdge : knobRightEdge;
  const lockTitle
    = lockedReason
      ?? "Scope is locked because this request has matched agents.";
  const isSwitchDisabled = locked || isLoading;

  // Both labels gray when locked, otherwise the active one is blue.
  const leftLabelClass = locked
    ? "text-gray-400"
    : isAllMarketActive
      ? "text-blue-600"
      : "text-gray-500";
  const rightLabelClass = locked
    ? "text-gray-400"
    : isAllMarketActive
      ? "text-gray-500"
      : "text-blue-600";

  return (
    <div
      className={
        isFull
          ? "flex flex-col items-end gap-1.5"
          : "flex flex-col items-center gap-1"
      }
      data-testid={`admin-scope-toggle-${requestId}`}
    >
      {locked ? (
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
      ) : null}

      <div className="flex items-center gap-2">
        <span
          className={[
            "font-medium whitespace-nowrap",
            labelText,
            leftLabelClass,
          ].join(" ")}
        >
          All Market
        </span>

        <button
          type="button"
          onClick={handleToggle}
          disabled={isSwitchDisabled}
          aria-disabled={isSwitchDisabled}
          aria-checked={isAllMarketActive}
          role="switch"
          aria-label={
            locked
              ? `Scope locked. Currently ${activeScope}.`
              : `Toggle scope. Currently ${activeScope}.`
          }
          title={locked ? lockTitle : undefined}
          className={[
            "relative inline-flex items-center rounded-full select-none transition bg-gray-200",
            locked ? "cursor-not-allowed" : "cursor-pointer",
            isLoading && !locked ? "opacity-80" : "",
          ].join(" ")}
          style={{
            width: `${pillWidth}px`,
            height: `${pillHeight}px`,
          }}
        >
          <span
            className={[
              "absolute top-1/2 -translate-y-1/2 rounded-full shadow transition-all duration-200 ease-out",
              locked ? "bg-gray-400" : "bg-blue-600",
              isLoading && !locked ? "opacity-70" : "",
            ].join(" ")}
            style={{
              width: `${knobSize}px`,
              height: `${knobSize}px`,
              left: `${knobLeftPosition}px`,
            }}
          >
            {isLoading && !locked ? (
              <span
                className="absolute inset-0 m-auto rounded-full border-2 border-white border-t-transparent animate-spin"
                style={{
                  width: `${spinnerSize}px`,
                  height: `${spinnerSize}px`,
                }}
                aria-hidden="true"
              />
            ) : null}
          </span>
        </button>

        <span
          className={[
            "font-medium whitespace-nowrap",
            labelText,
            rightLabelClass,
          ].join(" ")}
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