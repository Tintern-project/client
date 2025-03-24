"use client"

import type { FormEvent } from "react"
import AuthInput from "./AuthInput"
import AuthButton from "./AuthButton"
import AuthLink from "./AuthLink"

export default function ClientLoginForm() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log("Login form submitted")
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <AuthInput label="Email" id="email" type="email" placeholder="Email" />

      <AuthInput label="Password" id="password" type="password" placeholder="********" />

      <div className="flex justify-end">
        <AuthLink href="#">
          <span className="text-sm">Forgot password?</span>
        </AuthLink>
      </div>

      <AuthButton type="submit">Sign In</AuthButton>
    </form>
  )
}

