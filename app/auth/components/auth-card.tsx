import type { ReactNode } from "react"

interface AuthCardProps {
  title: string
  children: ReactNode
}

export default function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md border-2 border-black rounded-3xl p-8 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8 pb-1 border-b-2 border-black inline-block mx-auto w-full text-center">
        {title}
      </h1>
      {children}
    </div>
  )
}

