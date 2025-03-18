import type { ReactNode } from "react"
import Navigation from "./navigation"
import DecorativeElements from "./decorative-elements"

interface PageLayoutProps {
  children: ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navigation />
      <DecorativeElements />

      <div className="flex justify-center items-center px-4 py-12 relative z-10">{children}</div>
    </div>
  )
}

