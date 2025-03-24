import type { InputHTMLAttributes } from "react"

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export default function AuthInput({ label, id, ...props }: AuthInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-[#d9d9d9] mb-2">
        {label}
      </label>
      <input
        id={id}
        className="w-full p-3 rounded bg-[#1e1e1e] text-white border border-[#49454f] focus:outline-none focus:border-[#ff6868]"
        {...props}
      />
    </div>
  )
}

