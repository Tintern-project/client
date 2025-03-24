"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface ClientRoleDropdownProps {
  selectedRole: string
  onRoleChange: (role: string) => void
}

export default function ClientRoleDropdown({ selectedRole, onRoleChange }: ClientRoleDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const selectRole = (role: string) => {
    onRoleChange(role)
    setDropdownOpen(false)
  }

  const roles = ["Recruiter", "Applicant", "Recruiter / Applicant"]

  return (
    <div>
      <label htmlFor="role" className="block text-[#d9d9d9] mb-2">
        Role
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={toggleDropdown}
          className="w-full p-3 rounded bg-[#1e1e1e] text-white border border-[#49454f] focus:outline-none focus:border-[#ff6868] flex justify-between items-center"
        >
          <span>{selectedRole}</span>
          <ChevronDown className="h-4 w-4 text-[#d9d9d9]" />
        </button>

        {dropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-[#1e1e1e] border border-[#49454f] rounded shadow-lg">
            <ul>
              {roles.map((role) => (
                <li
                  key={role}
                  className="p-2 hover:bg-[#49454f] cursor-pointer text-white"
                  onClick={() => selectRole(role)}
                >
                  {role}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

