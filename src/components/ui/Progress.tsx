/**
 * Progress Component
 * Progress bar with percentage and animations
 */
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "warning" | "danger";
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      showLabel = false,
      size = "md",
      color = "primary",
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizes = {
      sm: "h-2",
      md: "h-3",
      lg: "h-4",
    };

    const colors = {
      primary: "bg-brand-teal",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      danger: "bg-red-500",
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {showLabel && (
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        <div
          className={cn(
            "w-full overflow-hidden rounded-full bg-gray-200",
            sizes[size]
          )}
        >
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out rounded-full",
              colors[color]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";

export default Progress;
