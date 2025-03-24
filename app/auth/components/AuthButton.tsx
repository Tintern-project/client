import type React from "react"
import type { ButtonHTMLAttributes } from "react"

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function AuthButton({ children, ...props }: AuthButtonProps) {
  return (
    <button
      className="w-full bg-[#ff6868] text-white py-3 px-4 rounded hover:bg-opacity-90 transition-colors"
      {...props}
    >
      {children}
    </button>
  )
}

