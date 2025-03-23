import { type SelectHTMLAttributes, forwardRef } from "react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className = "", children, ...props }, ref) => {
    const baseClasses =
      "flex w-full appearance-none border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    return (
      <select className={`${baseClasses} ${className}`} ref={ref} {...props}>
        {children}
      </select>
    );
  },
);

FormSelect.displayName = "FormSelect";
