"use client"
import Link from "next/link"
import SignupForm from "../components/signup-form"

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-[#FF6868] mb-10 text-center">Welcome to Tintern!</h1>

        <SignupForm />

        <div className="mt-6 text-center">
          <p className="text-[#F5F5F5]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#FF6868] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

