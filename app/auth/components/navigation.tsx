import Link from "next/link"
import { Tag, User } from "lucide-react"

export default function Navigation() {
  return (
    <nav className="p-4 flex items-center">
      <button className="mr-4">
        <div className="flex flex-col space-y-1">
          <div className="w-6 h-0.5 bg-black"></div>
          <div className="w-6 h-0.5 bg-black"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </div>
      </button>

      <div className="flex space-x-4">
        <Link href="/" className="border border-black rounded-full px-4 py-1 text-sm font-medium">
          Home
        </Link>
        <Link
          href="/offers"
          className="border border-black rounded-full px-4 py-1 text-sm font-medium flex items-center gap-1"
        >
          <Tag size={16} /> Offers
        </Link>
        <Link
          href="/login"
          className="border border-black rounded-full px-4 py-1 text-sm font-medium flex items-center gap-1"
        >
          <User size={16} /> Sign-In
        </Link>
      </div>
    </nav>
  )
}

