"use client";

import { ImSpinner2 } from "react-icons/im";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export const Loading = ({
  size = "md",
  className,
  text,
  fullScreen = false,
}: LoadingProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const spinner = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        fullScreen && "min-h-screen",
        className
      )}
    >
      <ImSpinner2
        className={cn("animate-spin text-indigo-600", sizeClasses[size])}
      />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );

  return spinner;
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  className?: string;
}

export const LoadingOverlay = ({
  isLoading,
  children,
  text = "Loading...",
  className,
}: LoadingOverlayProps) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={cn("relative", className)}>
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
        <Loading text={text} />
      </div>
    </div>
  );
};

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  loadingText?: string;
}

export const LoadingButton = ({
  isLoading,
  children,
  disabled,
  className,
  loadingText,
}: LoadingButtonProps) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "flex items-center justify-center gap-2",
        (disabled || isLoading) && "opacity-70 cursor-not-allowed",
        className
      )}
    >
      {isLoading && <ImSpinner2 className="animate-spin h-4 w-4" />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
};

interface LoadingTableProps {
  isLoading: boolean;
  children: React.ReactNode;
  rows?: number;
  columns?: number;
}

export const LoadingTable = ({
  isLoading,
  children,
  rows = 5,
  columns = 4,
}: LoadingTableProps) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="w-full">
      <div className="animate-pulse space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: columns }).map((_, j) => (
              <div
                key={j}
                className="h-4 bg-gray-200 rounded flex-1"
                style={{ width: `${100 / columns}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;

