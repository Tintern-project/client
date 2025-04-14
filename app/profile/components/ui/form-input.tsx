import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FormInputProps = {
    label?: string;
    className?: string;
    textarea?: boolean;
    rows?: number;
} & (
        | ({ textarea?: false } & InputHTMLAttributes<HTMLInputElement>)
        | ({ textarea: true } & TextareaHTMLAttributes<HTMLTextAreaElement>)
    );

export function FormInput({
    className = "",
    label,
    textarea = false,
    ...props
}: FormInputProps) {
    const baseClasses =
        "flex w-full border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            {textarea ? (
                <textarea
                    {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    rows={(props as TextareaHTMLAttributes<HTMLTextAreaElement>).rows}
                    className={`${baseClasses} ${className}`}
                />
            ) : (
                <input
                    {...(props as InputHTMLAttributes<HTMLInputElement>)}
                    className={`${baseClasses} ${className}`}
                />
            )}
        </div>
    );
}