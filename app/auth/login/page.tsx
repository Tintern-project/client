"use client"
import Link from "next/link"
import SigninForm from "../components/signin-form"

export default function SigninPage() {
  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-[#FF6868] mb-10 text-center">Welcome Back!</h1>

        <SigninForm />

        <div className="mt-6 text-center">
          <p className="text-[#F5F5F5]">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-[#FF6868] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

