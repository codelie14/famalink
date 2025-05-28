import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary";
}

export function Loader({
  className,
  size = "medium",
  variant = "primary",
}: LoaderProps) {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-3",
    large: "h-12 w-12 border-4",
  };

  const variantClasses = {
    primary: "border-famalink-blue-700 border-t-transparent",
    secondary: "border-white border-t-transparent",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );
} 