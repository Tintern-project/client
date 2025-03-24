"use client"

import { useState, type FormEvent } from "react"
import AuthInput from "./AuthInput"
import AuthButton from "./AuthButton"
import ClientRoleDropdown from "./ClientRoleDropdown"

export default function ClientSignupForm() {
  const [role, setRole] = useState("Recruiter / Applicant")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted with role:", role)
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block text-[#d9d9d9] mb-2">
          Name
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            id="firstName"
            placeholder="First Name"
            className="w-full p-3 rounded bg-[#1e1e1e] text-white border border-[#49454f] focus:outline-none focus:border-[#ff6868]"
          />
          <input
            type="text"
            id="lastName"
            placeholder="Last Name"
            className="w-full p-3 rounded bg-[#1e1e1e] text-white border border-[#49454f] focus:outline-none focus:border-[#ff6868]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AuthInput label="Email" id="email" type="email" placeholder="Email" />

        <ClientRoleDropdown selectedRole={role} onRoleChange={setRole} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AuthInput label="Password" id="password" type="password" placeholder="********" />

        <AuthInput label="Confirm Password" id="confirmPassword" type="password" placeholder="********" />
      </div>

      <AuthButton type="submit">Register</AuthButton>
    </form>
  )
}

