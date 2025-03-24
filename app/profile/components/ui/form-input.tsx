import type { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function FormInput({ className = "", ...props }: FormInputProps) {
  const baseClasses =
    "flex w-full border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return <input className={`${baseClasses} ${className}`} {...props} />;
}
