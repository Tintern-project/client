import Link from "next/link"
import PageLayout from "../components/layout"
import AuthCard from "../components/auth-card"

export default function SignupPage() {
  return (
    <PageLayout>
      <AuthCard title="Account Sign-Up">
        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                id="first-name"
                name="firstName"
                type="text"
                placeholder="First Name"
                className="w-full px-3 py-2 border border-[#d9d9d9] rounded-md"
              />
              <input
                id="last-name"
                name="lastName"
                type="text"
                placeholder="Last Name"
                className="w-full px-3 py-2 border border-[#d9d9d9] rounded-md"
              />
            </div>
          </div>

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
            <label htmlFor="role" className="block text-sm font-medium">
              Role
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                className="w-full px-3 py-2 border border-[#d9d9d9] rounded-md appearance-none"
              >
                <option>Recruiter / Applier</option>
                <option>Recruiter</option>
                <option>Applier</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="********"
                className="w-full px-3 py-2 border border-[#d9d9d9] rounded-md"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm">Already have an account?</p>
          <Link href="/auth/login" className="text-sm font-medium underline">
            Login
          </Link>
        </div>
      </AuthCard>
    </PageLayout>
  )
}

