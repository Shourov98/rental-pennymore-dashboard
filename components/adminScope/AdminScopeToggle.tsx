"use client";

import { useState } from "react";

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
};

const SCOPE_LABELS: Array<{ scope: AdminRequestScope; side: "left" | "right" }> = [
  { scope: "All Market", side: "left" },
  { scope: "Upcoming", side: "right" },
];

export function AdminScopeToggle({
  requestId,
  currentScope,
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
  const otherScope: AdminRequestScope =
    activeScope === "Upcoming" ? "All Market" : "Upcoming";
  const isAllMarketActive = activeScope === "All Market";

  const handleToggle = async () => {
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
  const isSwitchDisabled = isLoading;

  // Sizing & offsets. The knob sits flush with the track edge on each side.
  const containerWidth = isFull ? 200 : 170;
  const containerHeight = isFull ? 32 : 28;
  const labelText = isFull ? "text-xs" : "text-[11px]";
  const knobSize = isFull ? 24 : 20;
  const knobLeftEdge = 4;
  const knobTrailingLeft = containerWidth - knobSize - knobLeftEdge;
  const labelGap = 6;
  // Active label sits flush against the knob's inner edge so it stays
  // visible regardless of which side the knob is on. Inactive label sits
  // on the opposite edge.
  const knobRightEdge = knobLeftEdge + knobSize;
  const spinnerSize = isFull ? 12 : 10;

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
          "relative inline-flex items-center rounded-full select-none transition cursor-pointer",
          isAllMarketActive ? "bg-blue-600" : "bg-gray-200",
          isSwitchDisabled ? "opacity-80" : "",
        ].join(" ")}
        style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
      >
        {SCOPE_LABELS.map(({ scope, side }) => {
          const isActive
            = (side === "left" && isAllMarketActive)
              || (side === "right" && !isAllMarketActive);
          // Active label sits next to the knob on its inside edge; inactive
          // label sits flush with the opposite edge of the track.
          let style: React.CSSProperties;
          let justify: string;
          if (isActive && side === "left") {
            style = { left: `${knobRightEdge + labelGap}px` };
            justify = "justify-start";
          }
          else if (isActive && side === "right") {
            style = {
              left: 0,
              right: `${containerWidth - knobTrailingLeft + labelGap}px`,
            };
            justify = "justify-end";
          }
          else if (side === "left") {
            style = { left: `${knobLeftEdge}px` };
            justify = "justify-start";
          }
          else {
            style = { left: 0, right: `${knobLeftEdge}px` };
            justify = "justify-end";
          }
          return (
            <span
              key={scope}
              className={[
                "absolute inset-y-0 flex items-center font-medium whitespace-nowrap",
                labelText,
                justify,
                isActive ? "text-white" : "text-gray-500",
              ].join(" ")}
              style={style}
            >
              {scope}
            </span>
          );
        })}

        <span
          className={[
            "absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow",
            "transition-all duration-200 ease-out",
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
              className="absolute inset-0 m-auto rounded-full border-2 border-blue-600 border-t-transparent animate-spin"
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
