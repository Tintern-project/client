import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "default", size = "default", ...props },
    ref,
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    let variantClasses = "";
    if (variant === "default") {
      variantClasses = "bg-gray-900 text-gray-50 hover:bg-gray-900/90";
    } else if (variant === "secondary") {
      variantClasses = "bg-gray-100 text-gray-900 hover:bg-gray-100/80";
    } else if (variant === "outline") {
      variantClasses =
        "border border-gray-200 hover:bg-gray-100 hover:text-gray-900";
    }

    let sizeClasses = "";
    if (size === "default") {
      sizeClasses = "h-10 px-4 py-2 text-sm";
    } else if (size === "sm") {
      sizeClasses = "h-9 px-3 rounded-md text-xs";
    } else if (size === "lg") {
      sizeClasses = "h-11 px-8 rounded-md text-base";
    }

    return (
      <button
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
