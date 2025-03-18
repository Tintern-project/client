import Link from "next/link"
import PageLayout from "../components/layout"
import AuthCard from "../components/auth-card"

export default function LoginPage() {
  return (
    <PageLayout>
      <AuthCard title="Account Login">
        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border border-[#d9d9d9] rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              className="w-full px-3 py-2 border border-[#d9d9d9] rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm">Don't have an account?</p>
          <Link href="/auth/signup" className="text-sm font-medium underline">
           Sign Up
          </Link>
        </div>
      </AuthCard>
    </PageLayout>
  )
}

