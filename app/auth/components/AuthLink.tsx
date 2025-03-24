import type React from "react"
import Link from "next/link"

interface AuthLinkProps {
  href: string
  children: React.ReactNode
}

export default function AuthLink({ href, children }: AuthLinkProps) {
  return (
    <Link href={href} className="text-[#ff6868] hover:underline">
      {children}
    </Link>
  )
}

