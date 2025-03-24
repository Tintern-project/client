"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SigninForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Login failed")
      }

      const data = await res.json()
      console.log("Login success:", data)      
      router.push("/profile") // to be changed in the future to el dasahbord aw ay 7aga
    } catch (error: any) {
      setError(error.message)
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-[#F5F5F5] text-center">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded bg-[#1E1E1E] border border-[#4B4B4B] text-[#F5F5F5] focus:outline-none focus:border-[#C00F0C]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-[#F5F5F5] text-center">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded bg-[#1E1E1E] border border-[#4B4B4B] text-[#F5F5F5] focus:outline-none focus:border-[#C00F0C]"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-red-500 text-center">
          {error}
        </p>
      )}

      <div className="mt-8">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FF6868] hover:bg-[#FF6868]/90 text-white font-medium py-3 px-4 rounded transition-all duration-300"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  )
}
