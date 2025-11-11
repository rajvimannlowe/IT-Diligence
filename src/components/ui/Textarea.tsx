import * as React from "react";
import { cn } from "@/utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const textareaId = id ?? React.useId();

    return (
      <div className="space-y-1.5">
        {label ? (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        ) : null}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60",
            className
          )}
          {...props}
        />
        {description ? (
          <p className="text-xs text-gray-500">{description}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
